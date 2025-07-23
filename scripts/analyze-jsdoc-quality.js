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
   * 모든 TypeScript 파일 분석
   */
  async analyzeAll() {
    console.log('📚 TypeScript JSDoc 품질 분석 시작');

    // 핵심 모듈 분석
    await this.analyzeDirectory('libs/typescript/core', 'core');

    // 클래스 분석
    await this.analyzeDirectory('libs/typescript/classes', 'classes');

    // 타입 정의 분석
    await this.analyzeDirectory('libs/typescript/types', 'types');

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

    const tsFiles = glob.sync(`${dirPath}/**/*.ts`);

    for (const filePath of tsFiles) {
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

      const analysis = {
        file: fileName,
        path: filePath,
        category: category,
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

      // 클래스 분석
      await this.analyzeClasses(content, analysis);

      // 인터페이스 분석
      await this.analyzeInterfaces(content, analysis);

      // 파일별 품질 점수 계산
      analysis.qualityScore = this.calculateFileQuality(analysis);

      this.results.detailedAnalysis.push(analysis);

      // 진행 상황 출력
      const status = analysis.hasJSDoc ? '✅' : '❌';
      const score = analysis.qualityScore.toFixed(1);
      console.log(`  ${status} ${fileName} (품질: ${score}/10, JSDoc: ${analysis.jsDocBlocks}개)`);

    } catch (error) {
      console.error(`❌ 파일 분석 실패: ${filePath}`, error.message);
    }
  }

  /**
   * 함수 분석
   */
  async analyzeFunctions(content, analysis) {
    // 함수 정의 패턴들
    const functionPatterns = [
      /export\s+(?:async\s+)?function\s+(\w+)\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*{/g,
      /(?:public|private|protected|static)?\s*(?:async\s+)?(\w+)\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*{/g,
      /const\s+(\w+)\s*[:=]\s*(?:async\s*)?\([^)]*\)\s*(?::\s*[^=]+)?\s*=>\s*/g
    ];

    functionPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const functionName = match[1];

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
   * 클래스 분석
   */
  async analyzeClasses(content, analysis) {
    const classPattern = /export\s+(?:abstract\s+)?class\s+(\w+)/g;
    let match;

    while ((match = classPattern.exec(content)) !== null) {
      const className = match[1];

      // 클래스 앞의 JSDoc 찾기
      const beforeClass = content.substring(0, match.index);
      const hasJSDoc = /\/\*\*[\s\S]*?\*\/\s*$/.test(beforeClass);

      analysis.classes.push({
        name: className,
        hasJSDoc: hasJSDoc
      });
    }
  }

  /**
   * 인터페이스 분석
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
  generateReport() {
    console.log('\n📊 JSDoc 품질 분석 결과');
    console.log('═'.repeat(60));

    console.log(`📁 총 파일 수: ${this.results.totalFiles}개`);
    console.log(`📚 JSDoc 포함 파일: ${this.results.filesWithJSDoc}개 (${(this.results.filesWithJSDoc / this.results.totalFiles * 100).toFixed(1)}%)`);
    console.log(`🔧 총 함수 수: ${this.results.totalFunctions}개`);
    console.log(`📝 문서화된 함수: ${this.results.functionsWithJSDoc}개 (${(this.results.functionsWithJSDoc / this.results.totalFunctions * 100).toFixed(1)}%)`);
    console.log(`⭐ 전체 품질 점수: ${this.results.qualityScore.toFixed(1)}/10`);

    // 카테고리별 분석
    console.log('\n📋 카테고리별 상세 분석:');
    const categories = ['core', 'classes', 'types'];

    categories.forEach(category => {
      const categoryFiles = this.results.detailedAnalysis.filter(f => f.category === category);
      if (categoryFiles.length === 0) return;

      const avgScore = categoryFiles.reduce((sum, f) => sum + f.qualityScore, 0) / categoryFiles.length;
      const docFiles = categoryFiles.filter(f => f.hasJSDoc).length;

      console.log(`  📂 ${category}: ${categoryFiles.length}개 파일, 품질 ${avgScore.toFixed(1)}/10, 문서화 ${docFiles}/${categoryFiles.length}`);
    });

    // 우수/개선 필요 파일 목록
    console.log('\n🏆 우수한 문서화 (8점 이상):');
    this.results.detailedAnalysis
      .filter(f => f.qualityScore >= 8)
      .sort((a, b) => b.qualityScore - a.qualityScore)
      .slice(0, 5)
      .forEach(f => {
        console.log(`  ✨ ${f.file} (${f.qualityScore.toFixed(1)}/10)`);
      });

    console.log('\n⚠️  개선 필요 (5점 미만):');
    this.results.detailedAnalysis
      .filter(f => f.qualityScore < 5)
      .sort((a, b) => a.qualityScore - b.qualityScore)
      .slice(0, 5)
      .forEach(f => {
        console.log(`  🔧 ${f.file} (${f.qualityScore.toFixed(1)}/10)`);
      });

    // 결과 파일 저장
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

    console.log(`✅ 우선 벡터화: ${highQualityFiles.length}개 파일 (고품질 문서)`);
    console.log(`🔧 문서 개선 후 벡터화: ${lowQualityFiles.length}개 파일`);
    console.log(`📊 전체 함수 중 ${this.results.functionsWithJSDoc}개 함수가 RAG에 활용 가능`);

    return {
      highPriorityFiles: highQualityFiles.map(f => f.path),
      improvementNeededFiles: lowQualityFiles.map(f => f.path),
      readyForRAG: this.results.functionsWithJSDoc >= this.results.totalFunctions * 0.6
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
    } else {
      console.log('⚠️  일부 문서 개선 후 RAG 구축 권장');
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