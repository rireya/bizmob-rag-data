# MEMO

- 구글 API 키 임시 환경변수 설정: $ set GOOGLE_AI_API_KEY=your-api-key
- 구글 API 키 영구 환경변수 설정: $ setx GOOGLE_AI_API_KEY "your-api-key"
- 키 형태: AIzaSy...

```bash
# 간단한 테스트 (curl 사용)
curl "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent" -H "Content-Type: application/json" -H "X-goog-api-key: YOUR_API_KEY" -X POST -d "{\"model\": \"models/text-embedding-004\", \"content\": {\"parts\": [{\"text\": \"bizMOB 파일 업로드 테스트\"}]}}"
```

```bash
# 구글키 저장
setx GOOGLE_AI_API_KEY "your-api-key"
```

```json
// Claude Desktop 설정: `C:\Users\{사용자명}\AppData\Claude\claude_desktop_config.json`
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

```bash
# 콘솔 한글 깨짐 해결
chcp 65001
npm run quality
```
