// scripts/migrate-from-original.js
const fs = require('fs-extra');
const path = require('path');

class BizMOBMigrator {
  constructor() {
    this.sourceDir = 'temp/bizmob-lib-original';
    this.targetDir = 'libs';
    this.migrationPlan = null;
    this.stats = {
      processed: 0,
      succeeded: 0,
      failed: 0,
      skipped: 0
    };
  }

  /**
   * 마이그레이션 실행
   */
  async migrate() {
    console.log('🚀 bizMOB 라이브러리 마이그레이션 시작');

    try {
      // 1. 마이그레이션 계획 로드
      await this.loadMigrationPlan();

      // 2. 타겟 디렉토리 준비
      await this.prepareTargetDirectories();

      // 3. 파일 마이그레이션 실행
      await this.executeFileMigration();

      // 4. 결과 리포트
      this.generateReport();

      console.log('✅ 마이그레이션 완료!');

    } catch (error) {
      console.error('❌ 마이그레이션 실패:', error.message);
      process.exit(1);
    }
  }

  /**
   * 마이그레이션 계획 로드
   */
  async loadMigrationPlan() {
    const planPath = 'migration-plan.json';

    if (!fs.existsSync(planPath)) {
      throw new Error(`마이그레이션 계획 파일을 찾을 수 없습니다: ${planPath}`);
    }

    this.migrationPlan = await fs.readJson(planPath);
    console.log(`📋 마이그레이션 계획 로드 완료`);
    console.log(`   - JS 파일: ${this.migrationPlan.jsFiles?.length || 0}개`);
    console.log(`   - TS 파일: ${this.migrationPlan.tsFiles?.length || 0}개`);
    console.log(`   - JSON 파일: ${this.migrationPlan.jsonFiles?.length || 0}개`);
  }

  /**
   * 타겟 디렉토리 준비
   */
  async prepareTargetDirectories() {
    console.log('📁 타겟 디렉토리 준비 중...');

    // 모든 카테고리의 디렉토리 생성
    const categories = new Set();

    [...(this.migrationPlan.jsFiles || []),
    ...(this.migrationPlan.tsFiles || []),
    ...(this.migrationPlan.jsonFiles || [])]
      .forEach(file => {
        const targetDir = path.dirname(file.to);
        categories.add(targetDir);
      });

    for (const category of categories) {
      await fs.ensureDir(category);
    }

    console.log(`   ✅ ${categories.size}개 디렉토리 생성 완료`);
  }

  /**
   * 파일 마이그레이션 실행
   */
  async executeFileMigration() {
    console.log('📂 파일 마이그레이션 실행 중...');

    // JavaScript 파일 마이그레이션
    if (this.migrationPlan.jsFiles) {
      await this.migrateFiles(this.migrationPlan.jsFiles, 'JavaScript');
    }

    // TypeScript 파일 마이그레이션
    if (this.migrationPlan.tsFiles) {
      await this.migrateFiles(this.migrationPlan.tsFiles, 'TypeScript');
    }

    // JSON 파일 마이그레이션
    if (this.migrationPlan.jsonFiles) {
      await this.migrateFiles(this.migrationPlan.jsonFiles, 'JSON');
    }
  }

  /**
   * 특정 타입 파일들 마이그레이션
   */
  async migrateFiles(files, fileType) {
    console.log(`\n🔄 ${fileType} 파일 마이그레이션 중...`);

    for (const file of files) {
      this.stats.processed++;

      try {
        const sourcePath = path.join(this.sourceDir, file.from.replace(/\\/g, '/'));
        const targetPath = file.to;

        // 소스 파일 존재 확인
        if (!await fs.pathExists(sourcePath)) {
          console.log(`   ⚠️  소스 파일 없음: ${file.from}`);
          this.stats.skipped++;
          continue;
        }

        // 이미 존재하는 경우 건너뛰기 (선택사항)
        if (await fs.pathExists(targetPath)) {
          console.log(`   📄 이미 존재함: ${path.basename(targetPath)}`);
          this.stats.skipped++;
          continue;
        }

        // 파일 복사
        await fs.copy(sourcePath, targetPath);
        console.log(`   ✅ ${path.basename(sourcePath)} → ${file.category}`);
        this.stats.succeeded++;

      } catch (error) {
        console.error(`   ❌ 실패: ${file.from} - ${error.message}`);
        this.stats.failed++;
      }
    }
  }

  /**
   * 마이그레이션 결과 리포트 생성
   */
  generateReport() {
    console.log('\n📊 마이그레이션 결과 리포트');
    console.log('─'.repeat(50));
    console.log(`📈 총 처리된 파일: ${this.stats.processed}개`);
    console.log(`✅ 성공: ${this.stats.succeeded}개`);
    console.log(`❌ 실패: ${this.stats.failed}개`);
    console.log(`⚠️  건너뜀: ${this.stats.skipped}개`);

    const successRate = ((this.stats.succeeded / this.stats.processed) * 100).toFixed(1);
    console.log(`🎯 성공률: ${successRate}%`);

    // 결과를 파일로 저장
    const report = {
      timestamp: new Date().toISOString(),
      stats: this.stats,
      successRate: parseFloat(successRate)
    };

    fs.writeJsonSync('output/migration-report.json', report, { spaces: 2 });
    console.log('\n📄 상세 리포트가 output/migration-report.json에 저장되었습니다.');
  }

  /**
   * 마이그레이션 전 검증
   */
  async validateBeforeMigration() {
    console.log('🔍 마이그레이션 전 검증 중...');

    // 원본 디렉토리 존재 확인
    if (!await fs.pathExists(this.sourceDir)) {
      throw new Error(`원본 디렉토리를 찾을 수 없습니다: ${this.sourceDir}`);
    }

    // 중요 파일들 존재 확인
    const criticalFiles = [
      'src/bizMOB/Xross/Network.ts',
      'src/bizMOB/Xross/File.ts',
      'public/mock/bizMOB/File/upload.json'
    ];

    for (const file of criticalFiles) {
      const filePath = path.join(this.sourceDir, file);
      if (!await fs.pathExists(filePath)) {
        console.warn(`⚠️  중요 파일 누락: ${file}`);
      }
    }

    console.log('✅ 검증 완료');
  }
}

// 스크립트 직접 실행
async function main() {
  const migrator = new BizMOBMigrator();

  try {
    await migrator.validateBeforeMigration();
    await migrator.migrate();
  } catch (error) {
    console.error('💥 마이그레이션 중 오류 발생:', error);
    process.exit(1);
  }
}

// 직접 실행 시
if (require.main === module) {
  main();
}

module.exports = BizMOBMigrator;