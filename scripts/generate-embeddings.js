// scripts/generate-embeddings.js
const fs = require('fs-extra');
const { ChromaClient } = require('chromadb');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class EmbeddingGenerator {
  constructor() {
    this.genAI = null;
    this.chromaClient = null;
    this.collection = null;
    this.chunks = [];
    this.embeddings = [];
    this.batchSize = 10; // 배치 크기 (API 제한 고려)
    this.delay = 1000;   // 배치 간 지연 (ms)
  }

  /**
   * 초기화
   */
  async initialize() {
    console.log('🔧 시스템 초기화 중...');

    // Google AI API 초기화
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY 환경변수가 설정되지 않았습니다.\n설정 방법: set GOOGLE_AI_API_KEY=your-api-key');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    console.log('   ✅ Google AI API 연결 완료');

    // ChromaDB 초기화
    this.chromaClient = new ChromaClient({
      path: process.env.CHROMA_URL || 'http://localhost:8000'
    });

    try {
      await this.chromaClient.heartbeat();
      console.log('   ✅ ChromaDB 연결 완료');
    } catch (error) {
      console.log('   ⚠️  ChromaDB 서버가 실행되지 않음. 로컬 모드로 진행...');
      // 로컬 파일 기반으로 진행
    }

    // 청크 데이터 로드
    await this.loadChunks();
  }

  /**
   * 청크 데이터 로드
   */
  async loadChunks() {
    try {
      this.chunks = await fs.readJson('output/document-chunks.json');
      console.log(`   📚 ${this.chunks.length}개 청크 로드 완료`);
    } catch (error) {
      throw new Error('document-chunks.json 파일을 찾을 수 없습니다. extract-and-chunk.js를 먼저 실행하세요.');
    }
  }

  /**
   * 전체 임베딩 생성 프로세스
   */
  async generateAll() {
    console.log('🚀 임베딩 생성 시작');

    await this.initialize();

    // 1. 임베딩 생성
    await this.generateEmbeddings();

    // 2. ChromaDB 컬렉션 생성
    await this.setupChromaCollection();

    // 3. 벡터 데이터베이스에 저장
    await this.saveToVectorDB();

    // 4. 결과 저장
    await this.saveResults();

    // 5. 테스트 검색
    await this.testSearch();

    console.log('🎉 임베딩 생성 및 벡터 DB 구축 완료!');
  }

  /**
   * 임베딩 생성
   */
  async generateEmbeddings() {
    console.log('\n🔄 임베딩 생성 중...');

    const totalBatches = Math.ceil(this.chunks.length / this.batchSize);
    let processedChunks = 0;

    for (let i = 0; i < totalBatches; i++) {
      const batch = this.chunks.slice(i * this.batchSize, (i + 1) * this.batchSize);

      console.log(`   📦 배치 ${i + 1}/${totalBatches} 처리 중... (${batch.length}개 청크)`);

      try {
        // Google AI API 호출 (각 텍스트별로 개별 호출)
        for (const chunk of batch) {
          const text = this.prepareTextForEmbedding(chunk);

          try {
            const model = this.genAI.getGenerativeModel({ model: 'text-embedding-004' });
            const result = await model.embedContent(text);

            this.embeddings.push({
              id: chunk.id,
              text: text,
              embedding: result.embedding.values,
              metadata: {
                title: chunk.title,
                type: chunk.type,
                category: chunk.category,
                chunkIndex: chunk.chunkIndex,
                parentId: chunk.parentId,
                ...chunk.metadata
              }
            });

            processedChunks++;

            // 개별 요청 간 작은 지연
            await this.sleep(100);

          } catch (error) {
            console.error(`   ⚠️  청크 ${chunk.id} 임베딩 실패:`, error.message);
            // 실패한 청크는 건너뛰고 계속 진행
          }
        }

        console.log(`   ✅ ${processedChunks}/${this.chunks.length} 완료`);

        // API 제한 방지를 위한 배치 간 지연
        if (i < totalBatches - 1) {
          await this.sleep(this.delay);
        }

      } catch (error) {
        console.error(`   ❌ 배치 ${i + 1} 실패:`, error.message);

        // API 제한 오류 시 더 긴 지연
        if (error.message.includes('quota') || error.message.includes('rate')) {
          console.log('   ⏳ Rate limit 대기 중... (30초)');
          await this.sleep(30000);
          i--; // 재시도
        }
      }
    }

    console.log(`   🎯 총 ${this.embeddings.length}개 임베딩 생성 완료`);
  }

  /**
   * 임베딩용 텍스트 준비
   */
  prepareTextForEmbedding(chunk) {
    // 청크의 컨텍스트 정보를 포함한 텍스트 생성
    let text = `제목: ${chunk.title}\n`;
    text += `카테고리: ${chunk.category}\n`;

    if (chunk.metadata.module) {
      text += `모듈: ${chunk.metadata.module}\n`;
    }

    if (chunk.metadata.functionName) {
      text += `함수: ${chunk.metadata.functionName}\n`;
    }

    text += `내용: ${chunk.content}`;

    return text;
  }

  /**
   * ChromaDB 컬렉션 설정
   */
  async setupChromaCollection() {
    console.log('\n🗄️  ChromaDB 컬렉션 설정 중...');

    try {
      const collectionName = 'bizmob-docs';

      // 기존 컬렉션 삭제 (있다면)
      try {
        await this.chromaClient.deleteCollection({ name: collectionName });
        console.log('   🗑️  기존 컬렉션 삭제');
      } catch (error) {
        // 컬렉션이 없으면 무시
      }

      // 새 컬렉션 생성
      this.collection = await this.chromaClient.createCollection({
        name: collectionName,
        metadata: {
          description: 'bizMOB 라이브러리 문서 및 API 예제',
          created_at: new Date().toISOString()
        }
      });

      console.log(`   ✅ '${collectionName}' 컬렉션 생성 완료`);

    } catch (error) {
      console.log('   ⚠️  ChromaDB 설정 실패, 로컬 파일로 저장:', error.message);
      this.collection = null;
    }
  }

  /**
   * 벡터 데이터베이스에 저장
   */
  async saveToVectorDB() {
    if (!this.collection) {
      console.log('\n💾 로컬 파일로 벡터 데이터 저장...');
      return;
    }

    console.log('\n💾 ChromaDB에 벡터 데이터 저장 중...');

    const batchSize = 100; // ChromaDB 배치 크기
    const totalBatches = Math.ceil(this.embeddings.length / batchSize);

    for (let i = 0; i < totalBatches; i++) {
      const batch = this.embeddings.slice(i * batchSize, (i + 1) * batchSize);

      try {
        await this.collection.add({
          ids: batch.map(item => item.id),
          embeddings: batch.map(item => item.embedding),
          documents: batch.map(item => item.text),
          metadatas: batch.map(item => item.metadata)
        });

        console.log(`   📦 배치 ${i + 1}/${totalBatches} 저장 완료`);

      } catch (error) {
        console.error(`   ❌ 배치 ${i + 1} 저장 실패:`, error.message);
      }
    }

    console.log('   ✅ ChromaDB 저장 완료');
  }

  /**
   * 결과 파일 저장
   */
  async saveResults() {
    console.log('\n💾 결과 파일 저장 중...');

    // 임베딩 데이터 저장
    await fs.writeJson('output/embeddings.json', this.embeddings, { spaces: 2 });

    // 벡터 DB 설정 정보 저장
    const dbConfig = {
      timestamp: new Date().toISOString(),
      totalEmbeddings: this.embeddings.length,
      embeddingModel: 'text-embedding-004',
      vectorDimension: this.embeddings[0]?.embedding.length || 768,
      chromaCollection: this.collection ? 'bizmob-docs' : null,
      categories: this.getCategoryStats()
    };

    await fs.writeJson('output/vector-db-config.json', dbConfig, { spaces: 2 });

    console.log('   📁 output/embeddings.json (임베딩 데이터)');
    console.log('   📁 output/vector-db-config.json (벡터 DB 설정)');
  }

  /**
   * 카테고리 통계
   */
  getCategoryStats() {
    const stats = {};
    this.embeddings.forEach(item => {
      const category = item.metadata.category;
      stats[category] = (stats[category] || 0) + 1;
    });
    return stats;
  }

  /**
   * 테스트 검색
   */
  async testSearch() {
    console.log('\n🔍 검색 테스트 중...');

    const testQueries = [
      'bizMOB에서 파일 업로드하는 방법',
      'Network 관련 함수 사용법',
      'Database 트랜잭션 처리'
    ];

    for (const query of testQueries) {
      try {
        console.log(`\n❓ 질문: "${query}"`);

        if (this.collection) {
          // ChromaDB 검색
          const results = await this.searchInChroma(query);
          console.log(`   🎯 ChromaDB 검색 결과: ${results.length}개`);

          if (results.length > 0) {
            console.log(`   📄 상위 결과: ${results[0].title}`);
          }
        } else {
          // 로컬 벡터 검색 시뮬레이션
          const results = await this.searchInLocal(query);
          console.log(`   🎯 로컬 검색 결과: ${results.length}개`);
        }

      } catch (error) {
        console.log(`   ❌ 검색 실패: ${error.message}`);
      }
    }
  }

  /**
   * ChromaDB 검색
   */
  async searchInChroma(query) {
    if (!this.collection) return [];

    try {
      // 쿼리 임베딩 생성
      const model = this.genAI.getGenerativeModel({ model: 'text-embedding-004' });
      const result = await model.embedContent(query);

      // 벡터 검색
      const results = await this.collection.query({
        queryEmbeddings: [result.embedding.values],
        nResults: 3
      });

      return results.metadatas[0].map((metadata, index) => ({
        title: metadata.title,
        distance: results.distances[0][index],
        content: results.documents[0][index]
      }));

    } catch (error) {
      console.log(`   ⚠️  ChromaDB 검색 실패: ${error.message}`);
      return [];
    }
  }

  /**
   * 로컬 검색 시뮬레이션 (간단한 텍스트 매칭)
   */
  async searchInLocal(query) {
    const keywords = query.toLowerCase().split(' ');

    return this.embeddings
      .filter(item => {
        const text = (item.text + ' ' + item.metadata.title).toLowerCase();
        return keywords.some(keyword => text.includes(keyword));
      })
      .slice(0, 3)
      .map(item => ({
        title: item.metadata.title,
        content: item.text.substring(0, 200) + '...'
      }));
  }

  /**
   * 유틸리티: 지연
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 진행 상황 리포트
   */
  generateReport() {
    console.log('\n📊 임베딩 생성 결과');
    console.log('═'.repeat(50));
    console.log(`🔢 총 임베딩 수: ${this.embeddings.length}개`);
    console.log(`📏 벡터 차원: ${this.embeddings[0]?.embedding.length || 0}`);
    console.log(`🗄️  벡터 DB: ${this.collection ? 'ChromaDB' : '로컬 파일'}`);

    const categoryStats = this.getCategoryStats();
    console.log('\n📋 카테고리별 분포:');
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`  ${category}: ${count}개`);
    });

    console.log('\n🎯 RAG 시스템 상태: ✅ 벡터 검색 준비 완료!');
    console.log('\n🚀 다음 단계: MCP 서버 구축');
  }
}

// 스크립트 실행
async function main() {
  const generator = new EmbeddingGenerator();

  try {
    await generator.generateAll();
    generator.generateReport();

  } catch (error) {
    console.error('❌ 임베딩 생성 중 오류:', error.message);

    if (error.message.includes('GOOGLE_AI_API_KEY')) {
      console.log('\n💡 해결 방법:');
      console.log('1. Google AI API 키 발급: https://aistudio.google.com/app/apikey');
      console.log('2. 환경변수 설정: set GOOGLE_AI_API_KEY=your-api-key-here');
      console.log('3. Google AI for Developers 콘솔에서 Embedding API 활성화');
      console.log('4. 스크립트 다시 실행');
    }

    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = EmbeddingGenerator;