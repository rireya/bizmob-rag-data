// scripts/extract-and-chunk.js
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

class DocumentExtractor {
  constructor() {
    this.extractedDocs = [];
    this.chunks = [];
    this.config = {
      chunkSize: 800,        // 청크 크기 (토큰 기준)
      chunkOverlap: 200,     // 청크 간 중복 (토큰 기준)
      minChunkSize: 100      // 최소 청크 크기
    };
  }

  /**
   * 전체 문서 추출 및 청킹 실행
   */
  async extractAll() {
    console.log('📚 문서 추출 및 청킹 시작');

    // 1. TypeScript 파일에서 문서 추출
    await this.extractFromTypeScript();

    // 2. JavaScript 파일에서 문서 추출
    await this.extractFromJavaScript();

    // 3. Mock 데이터에서 API 사용 예제 추출
    await this.extractFromMockData();

    // 4. 문서 청킹
    await this.chunkDocuments();

    // 5. 결과 저장
    await this.saveResults();

    console.log('✅ 문서 추출 및 청킹 완료!');
    return {
      totalDocs: this.extractedDocs.length,
      totalChunks: this.chunks.length
    };
  }

  /**
   * TypeScript 파일에서 문서 추출
   */
  async extractFromTypeScript() {
    console.log('\n🔍 TypeScript 파일 문서 추출 중...');

    const coreFiles = glob.sync('libs/typescript/core/**/*.ts');
    const classFiles = glob.sync('libs/typescript/classes/**/*.ts');
    const typeFiles = glob.sync('libs/typescript/types/**/*.ts');

    for (const filePath of [...coreFiles, ...classFiles, ...typeFiles]) {
      await this.extractFromTSFile(filePath);
    }

    console.log(`   📄 ${coreFiles.length + classFiles.length + typeFiles.length}개 TS 파일 처리 완료`);
  }

  /**
   * JavaScript 파일에서 문서 추출
   */
  async extractFromJavaScript() {
    console.log('\n🔍 JavaScript 파일 문서 추출 중...');

    const bundleFiles = glob.sync('libs/javascript/bundles/**/*.js');
    const externalFiles = glob.sync('libs/javascript/externals/**/*.js');

    for (const filePath of [...bundleFiles, ...externalFiles]) {
      await this.extractFromJSFile(filePath);
    }

    console.log(`   📄 ${bundleFiles.length + externalFiles.length}개 JS 파일 처리 완료`);
  }

  /**
   * 개별 TypeScript 파일 처리
   */
  async extractFromTSFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const fileName = path.basename(filePath, '.ts');
      let category = 'typescript';

      if (filePath.includes('/core/')) category = 'typescript-core';
      else if (filePath.includes('/classes/')) category = 'typescript-classes';
      else if (filePath.includes('/types/')) category = 'typescript-types';

      // JSDoc 블록 추출
      const jsDocBlocks = this.extractJSDocBlocks(content);

      // 함수별 문서 생성
      const functions = this.extractFunctions(content, 'typescript');

      functions.forEach(func => {
        const relatedJSDoc = jsDocBlocks.find(doc =>
          doc.line < func.line && func.line - doc.line < 10
        );

        if (relatedJSDoc || func.hasSignature) {
          const doc = {
            id: `${fileName}_${func.name}`,
            title: `${fileName}.${func.name}`,
            type: 'function',
            category: category,
            language: 'typescript',
            module: fileName,
            functionName: func.name,
            signature: func.signature,
            description: relatedJSDoc?.description || '',
            parameters: relatedJSDoc?.parameters || [],
            returns: relatedJSDoc?.returns || '',
            examples: relatedJSDoc?.examples || [],
            content: this.buildFunctionDoc(fileName, func, relatedJSDoc, 'typescript'),
            source: filePath,
            line: func.line
          };

          this.extractedDocs.push(doc);
        }
      });

      console.log(`   ✅ ${fileName}: ${functions.length}개 함수 추출`);

    } catch (error) {
      console.error(`   ❌ ${filePath} 처리 실패:`, error.message);
    }
  }

  /**
   * 개별 JavaScript 파일 처리
   */
  async extractFromJSFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const fileName = path.basename(filePath, '.js');
      let category = 'javascript';

      if (filePath.includes('/bundles/')) category = 'javascript-bundles';
      else if (filePath.includes('/externals/')) category = 'javascript-externals';

      // JSDoc 블록 추출
      const jsDocBlocks = this.extractJSDocBlocks(content);

      // 함수별 문서 생성
      const functions = this.extractFunctions(content, 'javascript');

      functions.forEach(func => {
        const relatedJSDoc = jsDocBlocks.find(doc =>
          doc.line < func.line && func.line - doc.line < 10
        );

        // JavaScript는 JSDoc이 있는 함수만 추출
        if (relatedJSDoc) {
          const doc = {
            id: `${fileName}_${func.name}`,
            title: `${fileName}.${func.name}`,
            type: 'function',
            category: category,
            language: 'javascript',
            module: fileName,
            functionName: func.name,
            signature: func.signature,
            description: relatedJSDoc.description || '',
            parameters: relatedJSDoc.parameters || [],
            returns: relatedJSDoc.returns || '',
            examples: relatedJSDoc.examples || [],
            content: this.buildFunctionDoc(fileName, func, relatedJSDoc, 'javascript'),
            source: filePath,
            line: func.line
          };

          this.extractedDocs.push(doc);
        }
      });

      console.log(`   ✅ ${fileName}: ${functions.length}개 함수 추출 (JSDoc 있는 함수만)`);

    } catch (error) {
      console.error(`   ❌ ${filePath} 처리 실패:`, error.message);
    }
  }

  /**
   * JSDoc 블록 추출
   */
  extractJSDocBlocks(content) {
    const jsDocPattern = /\/\*\*([\s\S]*?)\*\//g;
    const blocks = [];
    let match;

    while ((match = jsDocPattern.exec(content)) !== null) {
      const blockContent = match[1];
      const line = content.substring(0, match.index).split('\n').length;

      blocks.push({
        line: line,
        raw: match[0],
        description: this.parseDescription(blockContent),
        parameters: this.parseParameters(blockContent),
        returns: this.parseReturns(blockContent),
        examples: this.parseExamples(blockContent)
      });
    }

    return blocks;
  }

  /**
   * 함수 추출 (TypeScript와 JavaScript 모두 지원)
   */
  extractFunctions(content, language) {
    const functions = [];

    let patterns = [];

    if (language === 'typescript') {
      patterns = [
        // TypeScript 패턴
        /export\s+(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)\s*(?::\s*([^{]+))?\s*{/g,
        /(?:public|private|protected|static)?\s*(?:async\s+)?(\w+)\s*\(([^)]*)\)\s*(?::\s*([^{]+))?\s*{/g,
        /(?:export\s+)?const\s+(\w+)\s*[:=]\s*(?:async\s*)?\(([^)]*)\)\s*(?::\s*([^=]+))?\s*=>/g
      ];
    } else {
      patterns = [
        // JavaScript 패턴
        /function\s+(\w+)\s*\(([^)]*)\)\s*{/g,
        /(\w+)\s*:\s*function\s*\(([^)]*)\)\s*{/g,
        /(\w+)\s*=\s*function\s*\(([^)]*)\)\s*{/g,
        /var\s+(\w+)\s*=\s*function\s*\(([^)]*)\)\s*{/g,
        /let\s+(\w+)\s*=\s*function\s*\(([^)]*)\)\s*{/g,
        /const\s+(\w+)\s*=\s*function\s*\(([^)]*)\)\s*{/g,
        // bizMOB 특화 패턴
        /bizMOB(?:Core|WebCore)?\.(\w+)\.(\w+)\s*=\s*function\s*\(([^)]*)\)\s*{/g,
        /(\w+)\.prototype\.(\w+)\s*=\s*function\s*\(([^)]*)\)\s*{/g
      ];
    }

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const line = content.substring(0, match.index).split('\n').length;

        let functionName, parameters, returnType;

        // bizMOB 특화 패턴 처리
        if (match[0].includes('bizMOB')) {
          functionName = match[2] || match[1];
          parameters = match[3] || match[2] || '';
          returnType = '';
        } else {
          functionName = match[1];
          parameters = match[2] || '';
          returnType = match[3] || '';
        }

        if (functionName && functionName.length > 1) {
          functions.push({
            name: functionName,
            parameters: parameters,
            returnType: returnType,
            signature: this.buildSignature(functionName, parameters, returnType),
            line: line,
            hasSignature: true
          });
        }
      }
    });

    return functions;
  }

  /**
   * JSDoc 파싱 메서드들
   */
  parseDescription(content) {
    const lines = content.split('\n');
    const descLines = [];

    for (const line of lines) {
      const cleaned = line.replace(/^\s*\*\s?/, '').trim();
      if (cleaned && !cleaned.startsWith('@')) {
        descLines.push(cleaned);
      } else if (cleaned.startsWith('@')) {
        break;
      }
    }

    return descLines.join(' ').trim();
  }

  parseParameters(content) {
    const paramPattern = /@param\s+(?:{([^}]+)}\s+)?(\w+)\s+(.+)/g;
    const parameters = [];
    let match;

    while ((match = paramPattern.exec(content)) !== null) {
      parameters.push({
        name: match[2],
        type: match[1] || '',
        description: match[3].trim()
      });
    }

    return parameters;
  }

  parseReturns(content) {
    const returnMatch = content.match(/@returns?\s+(?:{([^}]+)}\s+)?(.+)/);
    return returnMatch ? {
      type: returnMatch[1] || '',
      description: returnMatch[2].trim()
    } : null;
  }

  parseExamples(content) {
    const examplePattern = /@example\s*\n([\s\S]*?)(?=@|\*\/|$)/g;
    const examples = [];
    let match;

    while ((match = examplePattern.exec(content)) !== null) {
      const example = match[1]
        .split('\n')
        .map(line => line.replace(/^\s*\*\s?/, ''))
        .join('\n')
        .trim();

      if (example) {
        examples.push(example);
      }
    }

    return examples;
  }

  /**
   * 함수 시그니처 생성
   */
  buildSignature(name, params, returnType) {
    const cleanParams = params.replace(/\s+/g, ' ').trim();
    const cleanReturn = returnType ? `: ${returnType.trim()}` : '';
    return `${name}(${cleanParams})${cleanReturn}`;
  }

  /**
   * 함수 문서 생성
   */
  buildFunctionDoc(module, func, jsDoc, language) {
    let content = `# ${module}.${func.name}\n\n`;

    // 언어 정보 추가
    const langIcon = language === 'typescript' ? '🟦' : '🟨';
    content += `${langIcon} **언어**: ${language.toUpperCase()}\n\n`;

    // 함수 시그니처
    const codeLanguage = language === 'typescript' ? 'typescript' : 'javascript';
    content += `## 함수 시그니처\n\`\`\`${codeLanguage}\n${func.signature}\n\`\`\`\n\n`;

    // 설명
    if (jsDoc?.description) {
      content += `## 설명\n${jsDoc.description}\n\n`;
    }

    // 매개변수
    if (jsDoc?.parameters && jsDoc.parameters.length > 0) {
      content += `## 매개변수\n`;
      jsDoc.parameters.forEach(param => {
        content += `- **${param.name}** ${param.type ? `(${param.type})` : ''}: ${param.description}\n`;
      });
      content += '\n';
    }

    // 반환값
    if (jsDoc?.returns) {
      content += `## 반환값\n`;
      content += `${jsDoc.returns.type ? `**${jsDoc.returns.type}**: ` : ''}${jsDoc.returns.description}\n\n`;
    }

    // 사용 예제
    if (jsDoc?.examples && jsDoc.examples.length > 0) {
      content += `## 사용 예제\n`;
      jsDoc.examples.forEach((example, index) => {
        content += `### 예제 ${index + 1}\n\`\`\`${codeLanguage}\n${example}\n\`\`\`\n\n`;
      });
    }

    return content;
  }

  /**
   * Mock 데이터에서 API 사용 예제 추출
   */
  async extractFromMockData() {
    console.log('\n🔍 Mock 데이터 API 예제 추출 중...');

    const mockDirs = [
      'libs/samples/app',
      'libs/samples/database',
      'libs/samples/file',
      'libs/samples/push',
      'libs/samples/system',
      'libs/samples/window',
      'libs/samples/contacts'
    ];

    let totalSamples = 0;

    for (const dir of mockDirs) {
      if (await fs.pathExists(dir)) {
        const files = glob.sync(`${dir}/**/*.json`);

        for (const filePath of files) {
          await this.extractFromMockFile(filePath);
          totalSamples++;
        }
      }
    }

    console.log(`   📄 ${totalSamples}개 Mock 파일 처리 완료`);
  }

  /**
   * 개별 Mock 파일 처리
   */
  async extractFromMockFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const mockData = JSON.parse(content);
      const fileName = path.basename(filePath, '.json');
      const category = path.dirname(filePath).split('/').pop();

      const doc = {
        id: `mock_${category}_${fileName}`,
        title: `${fileName} API 사용 예제`,
        type: 'api_example',
        category: `samples_${category}`,
        language: 'json',
        apiName: fileName,
        content: this.buildMockDoc(fileName, category, mockData),
        mockData: mockData,
        source: filePath
      };

      this.extractedDocs.push(doc);

    } catch (error) {
      console.error(`   ❌ ${filePath} 처리 실패:`, error.message);
    }
  }

  /**
   * Mock 데이터 문서 생성
   */
  buildMockDoc(apiName, category, mockData) {
    let content = `# ${apiName} API 사용 예제\n\n`;
    content += `**카테고리**: ${category}\n\n`;

    // 요청 정보
    if (mockData.request) {
      content += `## 요청 예제\n\`\`\`json\n${JSON.stringify(mockData.request, null, 2)}\n\`\`\`\n\n`;
    }

    // 응답 정보
    if (mockData.response) {
      content += `## 응답 예제\n\`\`\`json\n${JSON.stringify(mockData.response, null, 2)}\n\`\`\`\n\n`;
    }

    // 기타 정보
    if (mockData.description) {
      content += `## 설명\n${mockData.description}\n\n`;
    }

    if (mockData.method) {
      content += `**HTTP 메서드**: ${mockData.method}\n\n`;
    }

    if (mockData.url || mockData.endpoint) {
      content += `**엔드포인트**: ${mockData.url || mockData.endpoint}\n\n`;
    }

    return content;
  }

  /**
   * 문서 청킹
   */
  async chunkDocuments() {
    console.log('\n🔄 문서 청킹 중...');

    for (const doc of this.extractedDocs) {
      const chunks = this.splitIntoChunks(doc.content, doc);
      this.chunks.push(...chunks);
    }

    console.log(`   📝 ${this.chunks.length}개 청크 생성 완료`);
  }

  /**
   * 텍스트를 청크로 분할
   */
  splitIntoChunks(text, doc) {
    const chunks = [];
    const sentences = text.split(/[.!?]\s+/);  // 문장 단위로 분할

    let currentChunk = '';
    let chunkIndex = 0;

    for (const sentence of sentences) {
      const testChunk = currentChunk + (currentChunk ? '. ' : '') + sentence;

      // 청크 크기 초과 시 새 청크 시작
      if (testChunk.length > this.config.chunkSize && currentChunk.length > this.config.minChunkSize) {
        chunks.push(this.createChunk(currentChunk, doc, chunkIndex));
        chunkIndex++;

        // 중복 처리
        const overlapWords = currentChunk.split(' ').slice(-this.config.chunkOverlap / 10);
        currentChunk = overlapWords.join(' ') + '. ' + sentence;
      } else {
        currentChunk = testChunk;
      }
    }

    // 마지막 청크 추가
    if (currentChunk.length >= this.config.minChunkSize) {
      chunks.push(this.createChunk(currentChunk, doc, chunkIndex));
    }

    return chunks;
  }

  /**
   * 청크 객체 생성
   */
  createChunk(text, doc, index) {
    return {
      id: `${doc.id}_chunk_${index}`,
      parentId: doc.id,
      chunkIndex: index,
      title: doc.title,
      type: doc.type,
      category: doc.category,
      language: doc.language,
      content: text.trim(),
      metadata: {
        module: doc.module,
        functionName: doc.functionName,
        apiName: doc.apiName,
        language: doc.language,
        source: doc.source,
        line: doc.line
      }
    };
  }

  /**
   * 결과 저장
   */
  async saveResults() {
    console.log('\n💾 결과 저장 중...');

    // 추출된 문서 저장
    await fs.writeJson('output/extracted-docs.json', this.extractedDocs, { spaces: 2 });

    // 청크 저장
    await fs.writeJson('output/document-chunks.json', this.chunks, { spaces: 2 });

    // 통계 저장
    const stats = {
      timestamp: new Date().toISOString(),
      totalDocuments: this.extractedDocs.length,
      totalChunks: this.chunks.length,
      documentTypes: this.getDocumentStats(),
      languageStats: this.getLanguageStats(),
      chunkSizeStats: this.getChunkStats()
    };

    await fs.writeJson('output/extraction-stats.json', stats, { spaces: 2 });

    console.log('   📁 output/extracted-docs.json (문서)');
    console.log('   📁 output/document-chunks.json (청크)');
    console.log('   📊 output/extraction-stats.json (통계)');
  }

  /**
   * 문서 통계 생성
   */
  getDocumentStats() {
    const stats = {};
    this.extractedDocs.forEach(doc => {
      stats[doc.type] = (stats[doc.type] || 0) + 1;
    });
    return stats;
  }

  /**
   * 언어별 통계 생성
   */
  getLanguageStats() {
    const stats = {};
    this.extractedDocs.forEach(doc => {
      stats[doc.language] = (stats[doc.language] || 0) + 1;
    });
    return stats;
  }

  /**
   * 청크 통계 생성
   */
  getChunkStats() {
    const sizes = this.chunks.map(chunk => chunk.content.length);
    return {
      count: sizes.length,
      avgSize: Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length),
      minSize: Math.min(...sizes),
      maxSize: Math.max(...sizes)
    };
  }

  /**
   * 진행 상황 리포트
   */
  generateReport() {
    console.log('\n📊 문서 추출 결과');
    console.log('═'.repeat(50));
    console.log(`📚 총 문서 수: ${this.extractedDocs.length}개`);
    console.log(`📝 총 청크 수: ${this.chunks.length}개`);

    const docStats = this.getDocumentStats();
    console.log('\n📋 문서 유형별 분류:');
    Object.entries(docStats).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}개`);
    });

    const langStats = this.getLanguageStats();
    console.log('\n🔤 언어별 분류:');
    Object.entries(langStats).forEach(([language, count]) => {
      const icon = language === 'typescript' ? '🟦' : language === 'javascript' ? '🟨' : '📄';
      console.log(`  ${icon} ${language}: ${count}개`);
    });

    const chunkStats = this.getChunkStats();
    console.log('\n📏 청크 크기 통계:');
    console.log(`  평균: ${chunkStats.avgSize}자`);
    console.log(`  최소: ${chunkStats.minSize}자`);
    console.log(`  최대: ${chunkStats.maxSize}자`);

    console.log('\n🎯 RAG 시스템 준비도: ✅ 준비 완료!');
  }
}

// 스크립트 실행
async function main() {
  const extractor = new DocumentExtractor();

  try {
    const results = await extractor.extractAll();
    extractor.generateReport();

    console.log('\n🚀 다음 단계: 임베딩 생성 및 ChromaDB 설정');

  } catch (error) {
    console.error('❌ 문서 추출 중 오류:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = DocumentExtractor;