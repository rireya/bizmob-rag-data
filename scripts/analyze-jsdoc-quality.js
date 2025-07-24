// scripts/analyze-jsdoc-quality.js
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

class JSDocAnalyzer {
  constructor() {
    this.results = {
      totalFiles: 0,
      filesWithJSDoc: 0,
      totalFunctions: 0,
      functionsWithJSDoc: 0,
      detailedAnalysis: [],
      qualityScore: 0
    };
  }

  /**
   * 모든 TypeScript 및 JavaScript 파일 분석
   */
  async analyzeAll() {
    console.log('📚 TypeScript & JavaScript JSDoc 품질 분석 시작');

    // TypeScript 파일 분석
    await this.analyzeDirectory('libs/typescript/core', 'typescript-core');
    await this.analyzeDirectory('libs/typescript/classes', 'typescript-classes');
    await this.analyzeDirectory('libs/typescript/types', 'typescript-types');

    // JavaScript 파일 분석
    await this.analyzeDirectory('libs/javascript/bundles', 'javascript-bundles');
    await this.analyzeDirectory('libs/javascript/externals', 'javascript-externals');

    // 결과 계산 및 출력
    this.calculateQualityScore();
    this.generateReport();

    return this.results;
  }

  /**
   * 특정 디렉토리 분석
   */
  async analyzeDirectory(dirPath, category) {
    console.log(`\n🔍 ${category} 모듈 분석 중...`);

    // TypeScript와 JavaScript 파일 모두 포함
    const files = [
      ...glob.sync(`${dirPath}/**/*.ts`),
      ...glob.sync(`${dirPath}/**/*.js`)
    ];

    if (files.length === 0) {
      console.log(`  ⚠️  ${dirPath}에서 분석할 파일이 없습니다.`);
      return;
    }

    for (const filePath of files) {
      await this.analyzeFile(filePath, category);
    }
  }

  /**
   * 개별 파일 분석
   */
  async analyzeFile(filePath, category) {
    this.results.totalFiles++;

    try {
      const content = await fs.readFile(filePath, 'utf8');
      const fileName = path.basename(filePath);
      const fileExt = path.extname(filePath);

      const analysis = {
        file: fileName,
        path: filePath,
        category: category,
        fileType: fileExt,
        hasJSDoc: false,
        functions: [],
        classes: [],
        interfaces: [],
        jsDocBlocks: 0,
        codeLines: content.split('\n').length,
        qualityScore: 0
      };

      // JSDoc 블록 찾기
      const jsDocMatches = content.match(/\/\*\*[\s\S]*?\*\//g) || [];
      analysis.jsDocBlocks = jsDocMatches.length;
      analysis.hasJSDoc = jsDocMatches.length > 0;

      if (analysis.hasJSDoc) {
        this.results.filesWithJSDoc++;
      }

      // 함수 분석
      await this.analyzeFunctions(content, analysis);

      // 클래스 분석 (JavaScript는 제한적)
      await this.analyzeClasses(content, analysis);

      // 인터페이스 분석 (TypeScript만)
      if (fileExt === '.ts') {
        await this.analyzeInterfaces(content, analysis);
      }

      // 파일별 품질 점수 계산
      analysis.qualityScore = this.calculateFileQuality(analysis);

      this.results.detailedAnalysis.push(analysis);

      // 진행 상황 출력
      const status = analysis.hasJSDoc ? '✅' : '❌';
      const score = analysis.qualityScore.toFixed(1);
      const typeIcon = fileExt === '.ts' ? '🟦' : '🟨';
      console.log(`  ${status} ${typeIcon} ${fileName} (품질: ${score}/10, JSDoc: ${analysis.jsDocBlocks}개)`);

    } catch (error) {
      console.error(`❌ 파일 분석 실패: ${filePath}`, error.message);
    }
  }

  /**
   * 함수 분석 (TypeScript와 JavaScript 모두 지원)
   */
  async analyzeFunctions(content, analysis) {
    // TypeScript와 JavaScript 함수 정의 패턴들
    const functionPatterns = [
      // TypeScript 함수 패턴
      /export\s+(?:async\s+)?function\s+(\w+)\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*{/g,
      /(?:public|private|protected|static)?\s*(?:async\s+)?(\w+)\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*{/g,
      /const\s+(\w+)\s*[:=]\s*(?:async\s*)?\([^)]*\)\s*(?::\s*[^=]+)?\s*=>\s*/g,

      // JavaScript 함수 패턴
      /function\s+(\w+)\s*\([^)]*\)\s*{/g,
      /(\w+)\s*:\s*function\s*\([^)]*\)\s*{/g,
      /(\w+)\s*=\s*function\s*\([^)]*\)\s*{/g,
      /var\s+(\w+)\s*=\s*function\s*\([^)]*\)\s*{/g,
      /let\s+(\w+)\s*=\s*function\s*\([^)]*\)\s*{/g,
      /const\s+(\w+)\s*=\s*function\s*\([^)]*\)\s*{/g,

      // bizMOB 특화 패턴
      /bizMOB(?:Core|WebCore)?\.(\w+)\.(\w+)\s*=\s*function/g,
      /(\w+)\.prototype\.(\w+)\s*=\s*function/g
    ];

    functionPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const functionName = match[1] || match[2]; // 패턴에 따라 그룹이 다를 수 있음

        if (!functionName || functionName.length < 2) continue; // 너무 짧은 이름 제외

        // 함수 앞의 JSDoc 찾기
        const beforeFunction = content.substring(0, match.index);
        const hasJSDoc = /\/\*\*[\s\S]*?\*\/\s*$/.test(beforeFunction);

        const functionInfo = {
          name: functionName,
          hasJSDoc: hasJSDoc,
          line: beforeFunction.split('\n').length
        };

        analysis.functions.push(functionInfo);
        this.results.totalFunctions++;

        if (hasJSDoc) {
          this.results.functionsWithJSDoc++;
        }
      }
    });
  }

  /**
   * 클래스 분석 (TypeScript와 JavaScript 모두 지원)
   */
  async analyzeClasses(content, analysis) {
    const classPatterns = [
      // TypeScript 클래스
      /export\s+(?:abstract\s+)?class\s+(\w+)/g,
      /class\s+(\w+)/g,

      // JavaScript 클래스 (ES6+)
      /class\s+(\w+)/g,

      // JavaScript 생성자 함수 패턴
      /function\s+([A-Z]\w+)\s*\([^)]*\)\s*{/g,
      /var\s+([A-Z]\w+)\s*=\s*function\s*\([^)]*\)\s*{/g
    ];

    classPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const className = match[1];

        // 클래스명이 대문자로 시작하는지 확인 (JavaScript의 경우)
        if (!/^[A-Z]/.test(className)) continue;

        // 클래스 앞의 JSDoc 찾기
        const beforeClass = content.substring(0, match.index);
        const hasJSDoc = /\/\*\*[\s\S]*?\*\/\s*$/.test(beforeClass);

        analysis.classes.push({
          name: className,
          hasJSDoc: hasJSDoc
        });
      }
    });
  }

  /**
   * 인터페이스 분석 (TypeScript만)
   */
  async analyzeInterfaces(content, analysis) {
    const interfacePattern = /export\s+interface\s+(\w+)/g;
    let match;

    while ((match = interfacePattern.exec(content)) !== null) {
      const interfaceName = match[1];

      // 인터페이스 앞의 JSDoc 찾기
      const beforeInterface = content.substring(0, match.index);
      const hasJSDoc = /\/\*\*[\s\S]*?\*\/\s*$/.test(beforeInterface);

      analysis.interfaces.push({
        name: interfaceName,
        hasJSDoc: hasJSDoc
      });
    }
  }

  /**
   * 파일별 품질 점수 계산 (10점 만점)
   */
  calculateFileQuality(analysis) {
    let score = 0;

    // JSDoc 존재 여부 (3점)
    if (analysis.hasJSDoc) score += 3;

    // 함수 문서화 비율 (4점)
    if (analysis.functions.length > 0) {
      const funcDocRatio = analysis.functions.filter(f => f.hasJSDoc).length / analysis.functions.length;
      score += funcDocRatio * 4;
    }

    // JSDoc 밀도 (3점) - 코드 줄 수 대비 JSDoc 블록 수
    const density = analysis.jsDocBlocks / (analysis.codeLines / 50); // 50줄당 1개 기준
    score += Math.min(density, 1) * 3;

    return Math.min(score, 10);
  }

  /**
   * 전체 품질 점수 계산
   */
  calculateQualityScore() {
    if (this.results.detailedAnalysis.length === 0) {
      this.results.qualityScore = 0;
      return;
    }

    const totalScore = this.results.detailedAnalysis.reduce((sum, analysis) =>
      sum + analysis.qualityScore, 0);

    this.results.qualityScore = totalScore / this.results.detailedAnalysis.length;
  }

  /**
   * 분석 결과 리포트 생성
   */
  async generateReport() {
    console.log('\n📊 JSDoc 품질 분석 결과');
    console.log('═'.repeat(60));

    console.log(`📁 총 파일 수: ${this.results.totalFiles}개`);
    console.log(`📚 JSDoc 포함 파일: ${this.results.filesWithJSDoc}개 (${(this.results.filesWithJSDoc / this.results.totalFiles * 100).toFixed(1)}%)`);
    console.log(`🔧 총 함수 수: ${this.results.totalFunctions}개`);
    console.log(`📝 문서화된 함수: ${this.results.functionsWithJSDoc}개 (${(this.results.functionsWithJSDoc / this.results.totalFunctions * 100).toFixed(1)}%)`);
    console.log(`⭐ 전체 품질 점수: ${this.results.qualityScore.toFixed(1)}/10`);

    // 파일 타입별 분석
    console.log('\n📋 파일 타입별 분석:');
    const tsFiles = this.results.detailedAnalysis.filter(f => f.fileType === '.ts');
    const jsFiles = this.results.detailedAnalysis.filter(f => f.fileType === '.js');

    if (tsFiles.length > 0) {
      const tsAvgScore = tsFiles.reduce((sum, f) => sum + f.qualityScore, 0) / tsFiles.length;
      const tsDocFiles = tsFiles.filter(f => f.hasJSDoc).length;
      console.log(`  🟦 TypeScript: ${tsFiles.length}개 파일, 품질 ${tsAvgScore.toFixed(1)}/10, 문서화 ${tsDocFiles}/${tsFiles.length}`);
    }

    if (jsFiles.length > 0) {
      const jsAvgScore = jsFiles.reduce((sum, f) => sum + f.qualityScore, 0) / jsFiles.length;
      const jsDocFiles = jsFiles.filter(f => f.hasJSDoc).length;
      console.log(`  🟨 JavaScript: ${jsFiles.length}개 파일, 품질 ${jsAvgScore.toFixed(1)}/10, 문서화 ${jsDocFiles}/${jsFiles.length}`);
    }

    // 카테고리별 분석
    console.log('\n📂 카테고리별 상세 분석:');
    const categories = [
      'typescript-core', 'typescript-classes', 'typescript-types',
      'javascript-bundles', 'javascript-externals'
    ];

    categories.forEach(category => {
      const categoryFiles = this.results.detailedAnalysis.filter(f => f.category === category);
      if (categoryFiles.length === 0) return;

      const avgScore = categoryFiles.reduce((sum, f) => sum + f.qualityScore, 0) / categoryFiles.length;
      const docFiles = categoryFiles.filter(f => f.hasJSDoc).length;

      console.log(`  📂 ${category}: ${categoryFiles.length}개 파일, 품질 ${avgScore.toFixed(1)}/10, 문서화 ${docFiles}/${categoryFiles.length}`);
    });

    // 우수/개선 필요 파일 목록
    console.log('\n🏆 우수한 문서화 (8점 이상):');
    const topFiles = this.results.detailedAnalysis
      .filter(f => f.qualityScore >= 8)
      .sort((a, b) => b.qualityScore - a.qualityScore)
      .slice(0, 5);

    if (topFiles.length > 0) {
      topFiles.forEach(f => {
        const typeIcon = f.fileType === '.ts' ? '🟦' : '🟨';
        console.log(`  ✨ ${typeIcon} ${f.file} (${f.qualityScore.toFixed(1)}/10)`);
      });
    } else {
      console.log('  📄 8점 이상인 파일이 없습니다.');
    }

    console.log('\n⚠️  개선 필요 (5점 미만):');
    const poorFiles = this.results.detailedAnalysis
      .filter(f => f.qualityScore < 5)
      .sort((a, b) => a.qualityScore - b.qualityScore)
      .slice(0, 10); // JavaScript 파일이 많을 수 있으므로 더 많이 표시

    if (poorFiles.length > 0) {
      poorFiles.forEach(f => {
        const typeIcon = f.fileType === '.ts' ? '🟦' : '🟨';
        console.log(`  🔧 ${typeIcon} ${f.file} (${f.qualityScore.toFixed(1)}/10)`);
      });
    } else {
      console.log('  🎉 모든 파일이 5점 이상입니다!');
    }

    // 결과 파일 저장
    await fs.ensureDir('output');
    fs.writeJsonSync('output/jsdoc-analysis.json', this.results, { spaces: 2 });
    console.log('\n📄 상세 분석 결과가 output/jsdoc-analysis.json에 저장되었습니다.');
  }

  /**
   * RAG 최적화 추천사항 생성
   */
  generateRAGRecommendations() {
    console.log('\n🎯 RAG 시스템 최적화 추천사항:');

    const highQualityFiles = this.results.detailedAnalysis.filter(f => f.qualityScore >= 7);
    const lowQualityFiles = this.results.detailedAnalysis.filter(f => f.qualityScore < 5);
    const tsFiles = this.results.detailedAnalysis.filter(f => f.fileType === '.ts');
    const jsFiles = this.results.detailedAnalysis.filter(f => f.fileType === '.js');

    console.log(`✅ 우선 벡터화: ${highQualityFiles.length}개 파일 (고품질 문서)`);
    console.log(`🔧 문서 개선 후 벡터화: ${lowQualityFiles.length}개 파일`);
    console.log(`🟦 TypeScript 파일: ${tsFiles.length}개 (구조화된 문서)`);
    console.log(`🟨 JavaScript 파일: ${jsFiles.length}개 (레거시 코드)`);
    console.log(`📊 전체 함수 중 ${this.results.functionsWithJSDoc}개 함수가 RAG에 활용 가능`);

    return {
      highPriorityFiles: highQualityFiles.map(f => f.path),
      improvementNeededFiles: lowQualityFiles.map(f => f.path),
      typeScriptFiles: tsFiles.map(f => f.path),
      javaScriptFiles: jsFiles.map(f => f.path),
      readyForRAG: this.results.functionsWithJSDoc >= this.results.totalFunctions * 0.4 // JavaScript 고려하여 기준 낮춤
    };
  }
}

// 스크립트 실행
async function main() {
  const analyzer = new JSDocAnalyzer();

  try {
    const results = await analyzer.analyzeAll();
    const recommendations = analyzer.generateRAGRecommendations();

    console.log('\n🚀 다음 단계 진행 가능 여부:');
    if (recommendations.readyForRAG) {
      console.log('✅ RAG 파이프라인 구축 진행 가능!');
      console.log('💡 TypeScript 파일을 우선적으로 벡터화하는 것을 권장합니다.');
    } else {
      console.log('⚠️  문서 개선 후 RAG 구축 권장');
      console.log('💡 특히 JavaScript 파일의 JSDoc 추가가 필요합니다.');
    }

  } catch (error) {
    console.error('❌ 분석 중 오류 발생:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = JSDocAnalyzer;