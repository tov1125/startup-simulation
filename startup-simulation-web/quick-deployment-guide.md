# 🚀 5분 만에 웹사이트 배포하기 (초보자용)

## 가장 쉽고 빠른 방법: Vercel + Supabase

이 방법은 **완전 무료**이며, **코딩 경험이 없어도** 따라할 수 있습니다.

---

## 📋 준비물 (5분)

### 1. 계정 만들기 (모두 무료)
- [ ] **GitHub**: https://github.com/signup
- [ ] **Vercel**: https://vercel.com/signup (GitHub으로 로그인)
- [ ] **Supabase**: https://supabase.com (GitHub으로 로그인)

---

## 🎯 Step 1: GitHub에 코드 올리기 (10분)

### 1-1. GitHub Desktop 설치
- 다운로드: https://desktop.github.com
- 설치 후 GitHub 계정으로 로그인

### 1-2. 새 저장소 만들기
1. GitHub Desktop 열기
2. `File` → `New Repository` 클릭
3. 이름: `startup-simulation`
4. `Create Repository` 클릭

### 1-3. 파일 추가하기
1. `Show in Explorer/Finder` 클릭
2. 앞서 만든 모든 파일을 이 폴더에 복사
3. GitHub Desktop으로 돌아오기
4. 하단에 "Initial commit" 입력
5. `Commit to main` 클릭
6. `Publish repository` 클릭

---

## 🎯 Step 2: 데이터베이스 만들기 (5분)

### 2-1. Supabase 프로젝트 생성
1. https://app.supabase.com 접속
2. `New project` 클릭
3. 설정:
   - Name: `startup-sim`
   - Database Password: (강력한 비밀번호 생성)
   - Region: `Northeast Asia (Seoul)`
4. `Create new project` 클릭

### 2-2. 데이터베이스 테이블 생성
1. 왼쪽 메뉴 `SQL Editor` 클릭
2. `New query` 클릭
3. 아래 SQL 복사/붙여넣기:

```sql
-- 사용자 테이블
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- BMY 캔버스 테이블
CREATE TABLE bmy_canvas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- BMC 캔버스 테이블
CREATE TABLE bmc_canvas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    bmy_id UUID REFERENCES bmy_canvas(id),
    data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 시뮬레이션 테이블
CREATE TABLE simulations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bmc_id UUID REFERENCES bmc_canvas(id),
    results JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

4. `RUN` 클릭

### 2-3. API 키 가져오기
1. 왼쪽 메뉴 `Settings` → `API`
2. `anon public` 키 복사 (나중에 사용)
3. `service_role` 키 복사 (나중에 사용)
4. `URL` 복사 (나중에 사용)

---

## 🎯 Step 3: Backend 수정 (5분)

### 3-1. Supabase 연결 코드 추가
`backend/src/database.ts` 파일 생성:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### 3-2. package.json 수정
`backend/package.json`에 추가:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.38.0"
  }
}
```

---

## 🎯 Step 4: Frontend 배포 (5분)

### 4-1. Vercel 배포
1. https://vercel.com 접속
2. `Add New...` → `Project` 클릭
3. GitHub 저장소 `startup-simulation` 선택
4. 설정:
   - Framework Preset: `Create React App`
   - Root Directory: `frontend` 입력
   - Build Command: 기본값 유지
   - Environment Variables 추가:
     ```
     REACT_APP_SUPABASE_URL = (Supabase URL)
     REACT_APP_SUPABASE_ANON_KEY = (anon public 키)
     ```
5. `Deploy` 클릭
6. 3분 기다리기...
7. ✅ 완료! URL이 생성됨 (예: https://startup-simulation.vercel.app)

---

## 🎯 Step 5: Backend 배포 (10분)

### 5-1. Vercel Functions 사용
1. 프로젝트 루트에 `vercel.json` 생성:

```json
{
  "functions": {
    "api/index.js": {
      "maxDuration": 10
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api"
    }
  ]
}
```

### 5-2. API 폴더 구조 변경
```
api/
  ├── index.js       (메인 서버)
  ├── auth.js        (인증 API)
  ├── bmy.js         (BMY API)
  ├── bmc.js         (BMC API)
  └── simulation.js  (시뮬레이션 API)
```

### 5-3. 간단한 API 예제
`api/index.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const { method, url } = req;
  
  // CORS 헤더
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  
  if (url.includes('/api/bmy')) {
    // BMY 관련 처리
    if (method === 'GET') {
      const { data, error } = await supabase
        .from('bmy_canvas')
        .select('*');
      
      if (error) return res.status(400).json({ error });
      return res.status(200).json(data);
    }
    
    if (method === 'POST') {
      const { data, error } = await supabase
        .from('bmy_canvas')
        .insert(req.body);
      
      if (error) return res.status(400).json({ error });
      return res.status(201).json(data);
    }
  }
  
  return res.status(404).json({ error: 'Not found' });
}
```

### 5-4. 재배포
1. GitHub Desktop에서 변경사항 커밋
2. `Push origin` 클릭
3. Vercel이 자동으로 재배포 (3분)

---

## ✅ 완료! 테스트하기

### 웹사이트 접속
1. Vercel 대시보드에서 URL 클릭
2. 예: https://startup-simulation.vercel.app

### 기능 테스트
- [ ] 홈페이지 로딩 확인
- [ ] BMY 페이지 접속
- [ ] BMC 페이지 접속
- [ ] 데이터 저장 테스트

---

## 🆘 문제 해결

### "빌드 실패" 에러
```json
// package.json에 추가
"engines": {
  "node": ">=16.0.0"
}
```

### "CORS" 에러
```javascript
// API에 헤더 추가
res.setHeader('Access-Control-Allow-Origin', '*');
```

### "404 Not Found" 에러
```json
// vercel.json 확인
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## 💡 다음 단계

### 1. 커스텀 도메인 연결 (선택)
1. 도메인 구매 (hosting.kr, gabia.com 등)
2. Vercel Settings → Domains
3. 도메인 추가
4. DNS 설정

### 2. 구글 애널리틱스 추가
```html
<!-- public/index.html에 추가 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

### 3. 시뮬레이션 엔진 추가
- Python 백엔드는 **Replit** 무료 사용
- https://replit.com에서 Python 프로젝트 생성
- 코드 붙여넣기 → Run

---

## 📱 모바일 대응

### viewport 설정
```html
<!-- public/index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1">
```

### 반응형 CSS
```css
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
}
```

---

## 🎉 축하합니다!

이제 여러분의 창업 시뮬레이션이 온라인에 있습니다!

**공유 링크**: https://your-app.vercel.app

### 친구들과 공유하기
- 카카오톡으로 링크 공유
- 인스타그램 스토리에 올리기
- 링크드인 프로필에 추가

---

## 📚 추가 학습 자료

### YouTube 튜토리얼
- "Vercel 배포 초보자 가이드"
- "Supabase로 5분만에 DB 만들기"
- "React 웹앱 배포하기"

### 유용한 도구
- **Canva**: 로고 디자인
- **Figma**: UI 디자인
- **ChatGPT**: 코드 도움

### 커뮤니티
- 페이스북: "한국 리액트 개발자 모임"
- 디스코드: "한국 개발자 커뮤니티"
- 오픈카톡: "웹개발 초보 모임"

---

**막히는 부분이 있나요?**
언제든지 물어보세요! 😊
