# MEMO

- 구글 API 키 임시 환경변수 설정: $ set GOOGLE_AI_API_KEY=your-api-key
- 구글 API 키 영구 환경변수 설정: $ setx GOOGLE_AI_API_KEY "your-api-key"
- 키 형태: AIzaSy...

```bash
# 간단한 테스트 (curl 사용)
curl "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent" -H "Content-Type: application/json" -H "X-goog-api-key: YOUR_API_KEY" -X POST -d "{\"model\": \"models/text-embedding-004\", \"content\": {\"parts\": [{\"text\": \"bizMOB 파일 업로드 테스트\"}]}}"
```

- Claude Desktop 설정: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "bizmob-rag": {
      "command": "node",
      "args": ["C:\\Work\\Repositories\\bizmob-rag-data\\scripts\\mcp-server.js"], // 실제 경로
      "cwd": "C:\\Work\\Repositories\\bizmob-rag-data", // 실제 bizmob-rag-data 프로젝트 경로
      "env": {
        "GOOGLE_AI_API_KEY": "your-actual-google-ai-api-key" // 구글 API 키
      }
    }
  }
}

```markdown
# 방법 1: Windows 시스템 환경변수 설정

# 1. Windows 키 + R → "sysdm.cpl" 입력

# 2. "고급" 탭 → "환경 변수" 버튼

# 3. "시스템 변수"에서 "새로 만들기"

# 변수 이름: GOOGLE_AI_API_KEY

# 변수 값: your-google-ai-api-key

# 방법 2: PowerShell (관리자 권한)에서 영구 설정

[Environment]::SetEnvironmentVariable("GOOGLE_AI_API_KEY", "your-google-ai-api-key", "Machine")

# 방법 3: Claude 앱 시작 전에 환경변수 설정 후 앱 실행

$env:GOOGLE_AI_API_KEY = "your-google-ai-api-key"
& "C:\Users\rirey\AppData\Local\AnthropicClaude\Claude.exe"
```