// scripts/mcp-server.js
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema
} = require('@modelcontextprotocol/sdk/types.js');
const fs = require('fs-extra');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class BizMOBMCPServer {
  constructor() {
    this.server = new Server({
      name: 'bizmob-rag-server',
      version: '1.0.0'
    }, {
      capabilities: {
        tools: {}
      }
    });

    this.embeddings = [];
    this.genAI = null;
    this.isInitialized = false;
  }

  /**
   * 서버 초기화
   */
  async initialize() {
    console.error('🚀 bizMOB MCP 서버 초기화 중...');
    console.error(`📍 현재 작업 디렉토리: ${process.cwd()}`);
    console.error(`📍 스크립트 디렉토리: ${__dirname}`);

    try {
      // Google AI 초기화
      const apiKey = process.env.GOOGLE_AI_API_KEY;
      console.error(`🔑 API 키 확인: ${apiKey ? '✅ 설정됨' : '❌ 없음'}`);

      if (!apiKey) {
        throw new Error('GOOGLE_AI_API_KEY 환경변수가 필요합니다.');
      }
      this.genAI = new GoogleGenerativeAI(apiKey);
      console.error('✅ Google AI 초기화 완료');

      // 임베딩 데이터 로드
      await this.loadEmbeddings();

      this.isInitialized = true;
      console.error('✅ bizMOB MCP 서버 초기화 완료');

    } catch (error) {
      console.error('❌ 서버 초기화 실패:', error.message);
      console.error('📋 전체 스택 트레이스:', error.stack);
      throw error;
    }
  }

  /**
   * 임베딩 데이터 로드
   */
  async loadEmbeddings() {
    try {
      const path = require('path');

      // 현재 스크립트 파일 기준으로 절대 경로 계산
      const scriptDir = __dirname;
      const projectRoot = path.resolve(scriptDir, '..');
      const embeddingsPath = path.join(projectRoot, 'output', 'embeddings.json');

      console.error(`📂 임베딩 파일 경로: ${embeddingsPath}`);

      // 파일 존재 확인
      if (!await fs.pathExists(embeddingsPath)) {
        throw new Error(`임베딩 파일이 존재하지 않습니다: ${embeddingsPath}`);
      }

      this.embeddings = await fs.readJson(embeddingsPath);
      console.error(`📚 ${this.embeddings.length}개 임베딩 로드 완료`);
    } catch (error) {
      if (error.message.includes('임베딩 파일이 존재하지 않습니다')) {
        throw error;
      }
      throw new Error('임베딩 데이터를 찾을 수 없습니다. generate-embeddings.js를 먼저 실행하세요.');
    }
  }

  /**
   * 도구 목록 반환
   */
  setupTools() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_bizmob_docs',
            description: 'bizMOB 라이브러리 문서와 API 사용 예제를 검색합니다',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: '검색할 질문이나 키워드 (예: "파일 업로드 방법", "Network 함수 사용법")'
                },
                limit: {
                  type: 'number',
                  description: '반환할 결과 수 (기본값: 5)',
                  default: 5
                }
              },
              required: ['query']
            }
          },
          {
            name: 'get_bizmob_function_info',
            description: '특정 bizMOB 함수의 상세 정보를 가져옵니다',
            inputSchema: {
              type: 'object',
              properties: {
                functionName: {
                  type: 'string',
                  description: '함수명 (예: "upload", "request", "openDatabase")'
                },
                module: {
                  type: 'string',
                  description: '모듈명 (예: "File", "Network", "Database")',
                  default: ''
                }
              },
              required: ['functionName']
            }
          },
          {
            name: 'get_bizmob_examples',
            description: 'bizMOB API 사용 예제와 Mock 데이터를 가져옵니다',
            inputSchema: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  description: 'API 카테고리 (file, database, push, system, window, app, contacts)',
                  enum: ['file', 'database', 'push', 'system', 'window', 'app', 'contacts']
                },
                apiName: {
                  type: 'string',
                  description: 'API 이름 (예: "upload", "download", "executeSql")',
                  default: ''
                }
              },
              required: ['category']
            }
          }
        ]
      };
    });
  }

  /**
   * 도구 실행 핸들러 - 향상된 로깅 포함
   */
  setupToolHandlers() {
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      console.error(`\n🔧 도구 호출: ${name}`);
      console.error(`📝 파라미터:`, JSON.stringify(args, null, 2));
      console.error(`⏰ 시작 시간: ${new Date().toISOString()}`);

      try {
        let result;
        const startTime = Date.now();

        switch (name) {
          case 'search_bizmob_docs':
            console.error(`🔍 문서 검색 시작: "${args.query}"`);
            result = await this.searchDocs(args.query, args.limit || 5);
            break;

          case 'get_bizmob_function_info':
            console.error(`🔧 함수 정보 조회 시작: ${args.functionName}`);
            result = await this.getFunctionInfo(args.functionName, args.module);
            break;

          case 'get_bizmob_examples':
            console.error(`📋 예제 조회 시작: ${args.category}`);
            result = await this.getExamples(args.category, args.apiName);
            break;

          default:
            throw new Error(`알 수 없는 도구: ${name}`);
        }

        const duration = Date.now() - startTime;
        console.error(`✅ 도구 실행 완료 (${duration}ms)`);
        console.error(`📊 결과 크기: ${JSON.stringify(result).length} characters`);

        return result;

      } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`❌ 도구 실행 실패 (${duration}ms):`, error.message);
        console.error(`📋 스택 트레이스:`, error.stack);

        return {
          content: [{
            type: 'text',
            text: `오류 발생: ${error.message}\n\n스택 트레이스:\n${error.stack}`
          }],
          isError: true
        };
      }
    });
  }

  /**
   * 문서 검색 - 향상된 로깅 포함
   */
  async searchDocs(query, limit = 5) {
    console.error(`\n🔍 === 문서 검색 시작 ===`);
    console.error(`   쿼리: "${query}"`);
    console.error(`   제한: ${limit}`);
    console.error(`   임베딩 데이터 수: ${this.embeddings.length}`);

    try {
      // Google AI 모델 확인
      if (!this.genAI) {
        throw new Error('Google AI가 초기화되지 않았습니다');
      }

      console.error(`   📡 Google AI 임베딩 생성 중...`);
      const model = this.genAI.getGenerativeModel({ model: 'text-embedding-004' });
      const result = await model.embedContent(query);
      const queryEmbedding = result.embedding.values;

      console.error(`   ✅ 쿼리 임베딩 생성 완료 (차원: ${queryEmbedding.length})`);

      // 유사도 계산
      console.error(`   🔢 유사도 계산 중...`);
      const similarities = this.embeddings.map((item, index) => {
        const similarity = this.cosineSimilarity(queryEmbedding, item.embedding);
        if (index < 3) { // 처음 3개만 로그
          console.error(`   [${index}] 유사도: ${similarity.toFixed(4)}`);
        }
        return {
          ...item,
          similarity
        };
      });

      // 정렬 및 선택
      const topResults = similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      console.error(`   🎯 상위 ${topResults.length}개 결과 선택:`);
      topResults.forEach((item, index) => {
        console.error(`   [${index + 1}] ${item.metadata.title || 'Unknown'} - ${(item.similarity * 100).toFixed(1)}%`);
      });

      // 결과 포맷팅
      const formattedResults = topResults.map((item, index) => {
        const category = item.metadata.category || 'unknown';
        const title = item.metadata.title || 'Untitled';
        const similarity = (item.similarity * 100).toFixed(1);

        return `## ${index + 1}. ${title} (${category}) - 유사도: ${similarity}%\n\n${item.text.substring(0, 500)}...\n\n`;
      }).join('');

      console.error(`   ✅ 검색 완료`);

      return {
        content: [{
          type: 'text',
          text: `# bizMOB 검색 결과: "${query}"\n\n${formattedResults}`
        }]
      };

    } catch (error) {
      console.error(`   ❌ 검색 실패:`, error.message);
      console.error(`   📋 상세 오류:`, error.stack);
      throw error;
    }
  }

  /**
   * 특정 함수 정보 조회
   */
  async getFunctionInfo(functionName, module = '') {
    console.error(`🔧 함수 정보 조회: ${functionName} (모듈: ${module || 'all'})`);

    const matchingFunctions = this.embeddings.filter(item => {
      const itemFunction = item.metadata.functionName || '';
      const itemModule = item.metadata.module || '';

      const functionMatch = itemFunction.toLowerCase().includes(functionName.toLowerCase());
      const moduleMatch = !module || itemModule.toLowerCase().includes(module.toLowerCase());

      return functionMatch && moduleMatch && item.metadata.type === 'function';
    });

    if (matchingFunctions.length === 0) {
      return {
        content: [{
          type: 'text',
          text: `"${functionName}" 함수를 찾을 수 없습니다. 다른 함수명을 시도해보세요.`
        }]
      };
    }

    const functionInfo = matchingFunctions
      .sort((a, b) => b.similarity || 0)
      .slice(0, 3)
      .map((item, index) => {
        const module = item.metadata.module || 'Unknown';
        const title = item.metadata.title || 'Unknown Function';

        return `## ${index + 1}. ${title}\n\n**모듈:** ${module}\n\n${item.text}\n\n---\n\n`;
      })
      .join('');

    console.error(`   ✅ ${matchingFunctions.length}개 함수 정보 반환`);

    return {
      content: [{
        type: 'text',
        text: `# ${functionName} 함수 정보\n\n${functionInfo}`
      }]
    };
  }

  /**
   * API 사용 예제 조회
   */
  async getExamples(category, apiName = '') {
    console.error(`📋 예제 조회: ${category} ${apiName ? `- ${apiName}` : ''}`);

    const categoryFilter = `samples_${category}`;
    const matchingExamples = this.embeddings.filter(item => {
      const categoryMatch = item.metadata.category === categoryFilter;
      const apiMatch = !apiName || (item.metadata.apiName || '').toLowerCase().includes(apiName.toLowerCase());

      return categoryMatch && apiMatch && item.metadata.type === 'api_example';
    });

    if (matchingExamples.length === 0) {
      return {
        content: [{
          type: 'text',
          text: `"${category}" 카테고리에서 ${apiName ? `"${apiName}" ` : ''}예제를 찾을 수 없습니다.`
        }]
      };
    }

    const exampleInfo = matchingExamples
      .slice(0, 5)
      .map((item, index) => {
        const apiName = item.metadata.apiName || 'Unknown API';
        const title = item.metadata.title || 'Unknown Example';

        return `## ${index + 1}. ${title}\n\n**API:** ${apiName}\n\n${item.text}\n\n---\n\n`;
      })
      .join('');

    console.error(`   ✅ ${matchingExamples.length}개 예제 반환`);

    return {
      content: [{
        type: 'text',
        text: `# ${category.toUpperCase()} API 사용 예제\n\n${exampleInfo}`
      }]
    };
  }

  /**
   * 코사인 유사도 계산
   */
  cosineSimilarity(vectorA, vectorB) {
    if (vectorA.length !== vectorB.length) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * 서버 시작
   */
  async start() {
    await this.initialize();

    this.setupTools();
    this.setupToolHandlers();

    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    console.error('🎉 bizMOB MCP 서버가 시작되었습니다!');
    console.error('💡 AI Chat에서 bizMOB 관련 질문을 해보세요.');
  }
}

// 서버 시작 함수
async function main() {
  const server = new BizMOBMCPServer();

  // 프로세스 종료 시 정리
  process.on('SIGINT', () => {
    console.error('🛑 서버 종료 중...');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.error('🛑 서버 종료 중...');
    process.exit(0);
  });

  // 처리되지 않은 Promise 거부 처리
  process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 처리되지 않은 Promise 거부:', reason);
    console.error('Promise:', promise);
  });

  // 처리되지 않은 예외 처리
  process.on('uncaughtException', (error) => {
    console.error('🚨 처리되지 않은 예외:', error);
    process.exit(1);
  });

  try {
    console.error('🎬 MCP 서버 시작 중...');
    await server.start();
    console.error('🎉 MCP 서버가 성공적으로 시작되었습니다!');
  } catch (error) {
    console.error('💥 서버 시작 실패:', error.message);
    console.error('📋 스택 트레이스:', error.stack);
    process.exit(1);
  }
}

// 스크립트 직접 실행 시
if (require.main === module) {
  main().catch(error => {
    console.error('💥 메인 함수 실행 실패:', error);
    process.exit(1);
  });
}

module.exports = BizMOBMCPServer;