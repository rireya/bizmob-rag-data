# 📊 bizMOB RAG 데이터 저장소

bizMOB 라이브러리의 RAG(Retrieval-Augmented Generation) 파이프라인을 위한 정형화된 데이터 저장소입니다.

## 🎯 프로젝트 개요

이 레포지토리는 bizMOB 라이브러리의 문서, 코드, API 샘플을 RAG 시스템에 최적화된 구조로 정리합니다.

### 주요 특징

- ✅ **체계적인 분류**: TypeScript 소스코드와 Mock 데이터 기능별 분류
- ✅ **RAG 최적화**: 벡터 검색과 임베딩 생성에 최적화된 구조
- ✅ **자동화**: 원본 소스에서 정형화 구조로 자동 마이그레이션
- ✅ **품질 관리**: 데이터 품질 검증 및 일관성 유지

## 📁 디렉토리 구조

```
bizmob-rag-data/
├── libs/                           # 정형화된 라이브러리 파일
│   ├── javascript/
│   │   ├── bundles/               # bizMOB 컴파일된 번들 (5개)
│   │   └── externals/             # 외부 라이브러리 (2개)
│   ├── typescript/
│   │   ├── core/                  # 핵심 모듈 (16개)
│   │   ├── classes/               # 유틸리티 클래스 (3개)
│   │   ├── i18n/                  # 국제화 (1개)
│   │   └── types/                 # 타입 정의 (1개)
│   └── samples/                   # API 사용 샘플 (47개)
│       ├── app/                   # App 관련 (4개)
│       ├── database/              # Database 관련 (8개)
│       ├── file/                  # File 관련 (13개)
│       ├── push/                  # Push 관련 (11개)
│       ├── system/                # System 관련 (7개)
│       ├── window/                # Window 관련 (4개)
│       ├── contacts/              # Contacts 관련 (1개)
│       └── legacy/                # 레거시 (2개)
├── src/                           # 데이터 처리 도구
│   ├── migrators/                 # 마이그레이션 도구
│   ├── extractors/                # 문서 추출 도구
│   ├── processors/                # 데이터 처리 도구
│   └── validators/                # 품질 검증 도구
├── docs/                          # 생성된 문서
│   ├── api/                       # API 문서
│   ├── examples/                  # 사용 예제
│   └── guides/                    # 가이드 문서
├── scripts/                       # 실행 스크립트
├── output/                        # 처리 결과
│   ├── extracted/                 # 추출된 데이터
│   ├── processed/                 # 처리된 데이터
│   └── embeddings/                # 생성된 임베딩
└── temp/                          # 임시 작업 공간
```

## 🚀 빠른 시작

### 1. 설치

```bash
npm install
```

### 2. 원본 데이터 준비

```bash
# 원본 bizmob-lib 레포지토리를 temp/ 폴더에 클론
git clone https://github.com/rireya/bizmob-lib.git temp/bizmob-lib-original
```

### 3. 마이그레이션 실행

```bash
# 원본 → 정형화 구조로 마이그레이션
npm run migrate
```

### 4. 데이터 추출 및 처리

```bash
# 전체 빌드 파이프라인 실행
npm run build
```

## 📊 데이터 통계

- **총 파일 수**: 108개
- **JavaScript 파일**: 12개 (bundles: 10개, externals: 2개)
- **TypeScript 파일**: 41개 (core: 16개, classes: 3개, i18n: 1개, types: 1개)
- **JSON 파일**: 53개 (samples: 47개, config: 3개)
- **Markdown 파일**: 2개

## 🛠️ 스크립트 명령어

### 마이그레이션

```bash
npm run migrate          # 원본에서 정형화 구조로 마이그레이션
npm run validate         # 마이그레이션 결과 검증
```

### 데이터 처리

```bash
npm run analyze          # 데이터 구조 분석
npm run extract          # 문서 및 메타데이터 추출
npm run generate-embeddings  # 벡터 임베딩 생성
```

### 개발

```bash
npm run dev              # 개발 모드 (파일 변경 감지)
npm run test             # 테스트 실행
npm run lint             # 코드 린팅
npm run clean            # 임시 파일 정리
```

## 📚 핵심 모듈

### TypeScript 핵심 모듈 (16개)

- **App.ts**: 앱 라이프사이클 관리
- **Config.ts**: 설정 관리
- **Database.ts**: 로컬 데이터베이스 처리
- **Device.ts**: 디바이스 정보 및 기능
- **Event.ts**: 이벤트 처리
- **File.ts**: 파일 시스템 처리
- **Network.ts**: 네트워크 통신
- **Push.ts**: 푸시 알림
- **Storage.ts**: 로컬 저장소
- **System.ts**: 시스템 기능 (전화, SMS, GPS 등)
- **Window.ts**: UI 윈도우 처리
- **기타**: Contacts, Localization, Logger, Properties

### API 샘플 분류 (47개)

각 핵심 모듈에 대응하는 실제 사용 예제와 API 응답 샘플이 기능별로 분류되어 있습니다.

## 🔧 RAG 파이프라인 통합

이 데이터는 다음과 같은 RAG 시스템 구성 요소와 통합됩니다:

1. **bizmob-mcp-server**: MCP 서버 및 RAG 로직
2. **bizmob-rag-infrastructure**: 인프라 및 배포 설정

### 데이터 흐름

```
bizmob-rag-data → (임베딩) → ChromaDB → MCP Server → AI Chat
```

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

프로젝트 관련 문의: [your-email@domain.com]

프로젝트 링크: [https://github.com/your-username/bizmob-rag-data](https://github.com/your-username/bizmob-rag-data)
