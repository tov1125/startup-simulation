# 🌐 창업 시뮬레이션 웹 배포 가이드

## 배포 옵션 비교

| 옵션 | 난이도 | 비용 | 장점 | 단점 |
|------|--------|------|------|------|
| **Vercel + Railway** | ⭐ 쉬움 | 무료~$20/월 | 간단한 설정, 자동 배포 | 제한된 리소스 |
| **Heroku** | ⭐⭐ 보통 | $7~50/월 | 통합 관리 | 유료 전환 필수 |
| **AWS** | ⭐⭐⭐ 어려움 | $10~100+/월 | 완전한 제어 | 복잡한 설정 |

## 🚀 옵션 1: Vercel + Railway (추천 - 가장 쉬움)

### 준비 사항
1. GitHub 계정
2. Vercel 계정 (https://vercel.com)
3. Railway 계정 (https://railway.app)

### Step 1: GitHub에 코드 업로드

```bash
# 1. GitHub에서 새 저장소 생성 (startup-simulation-web)

# 2. 로컬에서 Git 초기화
cd /home/claude
git init
git add .
git commit -m "Initial commit"

# 3. GitHub 저장소 연결
git remote add origin https://github.com/YOUR_USERNAME/startup-simulation-web.git
git branch -M main
git push -u origin main
```

### Step 2: 데이터베이스 설정 (Railway)

1. **Railway 접속** (https://railway.app)
2. **New Project** 클릭
3. **Deploy PostgreSQL** 선택
4. 생성 완료 후 **Variables** 탭에서 `DATABASE_URL` 복사

```bash
# 예시 DATABASE_URL:
postgresql://postgres:xxxxx@containers-us-west-123.railway.app:5432/railway
```

### Step 3: Backend 배포 (Railway)

1. Railway 대시보드에서 **New** → **GitHub Repo** 클릭
2. `startup-simulation-web` 저장소 선택
3. **Settings** 탭에서 설정:

```yaml
Build Command: cd backend && npm install && npm run build
Start Command: cd backend && npm start
Root Directory: /
```

4. **Variables** 탭에서 환경변수 추가:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=(위에서 복사한 URL)
JWT_SECRET=your-secret-key-here-change-this
FRONTEND_URL=https://your-app.vercel.app
```

5. **Generate Domain** 클릭하여 백엔드 URL 생성
   - 예: `https://startup-sim-backend.up.railway.app`

### Step 4: Frontend 배포 (Vercel)

1. **Vercel 접속** (https://vercel.com)
2. **Import Project** → GitHub 저장소 선택
3. **Configure Project**:

```yaml
Framework Preset: Create React App
Root Directory: frontend
Build Command: npm run build
Output Directory: build
```

4. **Environment Variables** 추가:

```env
REACT_APP_API_URL=https://startup-sim-backend.up.railway.app
REACT_APP_SOCKET_URL=https://startup-sim-backend.up.railway.app
```

5. **Deploy** 클릭

### Step 5: Python 시뮬레이션 엔진 배포 (Railway)

1. Railway에서 **New Service** 추가
2. **Empty Service** 선택
3. GitHub 저장소 연결
4. **Settings**:

```yaml
Build Command: cd simulation-engine && pip install -r requirements.txt
Start Command: cd simulation-engine && uvicorn main:app --host 0.0.0.0 --port $PORT
```

5. 환경변수 추가:

```env
BACKEND_URL=https://startup-sim-backend.up.railway.app
```

---

## 🎯 옵션 2: 한 번에 배포하기 (Heroku)

### 준비 파일 생성

1. **프로젝트 루트에 Procfile 생성**:

```procfile
web: cd backend && npm start
worker: cd simulation-engine && uvicorn main:app --host 0.0.0.0 --port $PORT
```

2. **package.json (루트 디렉토리)**:

```json
{
  "name": "startup-simulation",
  "version": "1.0.0",
  "scripts": {
    "postinstall": "cd frontend && npm install && npm run build && cd ../backend && npm install && npm run build",
    "start": "cd backend && npm start"
  }
}
```

### Heroku 배포

```bash
# 1. Heroku CLI 설치
# macOS: brew tap heroku/brew && brew install heroku
# Windows: https://devcenter.heroku.com/articles/heroku-cli

# 2. Heroku 로그인
heroku login

# 3. Heroku 앱 생성
heroku create startup-simulation-app

# 4. PostgreSQL 애드온 추가
heroku addons:create heroku-postgresql:mini

# 5. 빌드팩 설정
heroku buildpacks:set heroku/nodejs
heroku buildpacks:add heroku/python

# 6. 환경변수 설정
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key-here

# 7. 배포
git push heroku main

# 8. 데이터베이스 마이그레이션
heroku run cd backend && npx prisma migrate deploy
```

---

## 💰 옵션 3: 무료로 시작하기 (개발/테스트용)

### A. Frontend - Netlify (무료)

1. **Netlify** 접속 (https://netlify.com)
2. GitHub 저장소 연결
3. Build 설정:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
4. 환경변수 설정

### B. Backend - Render.com (무료)

1. **Render** 접속 (https://render.com)
2. **New Web Service** 생성
3. GitHub 저장소 연결
4. 설정:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
5. 무료 PostgreSQL 데이터베이스 생성

### C. 시뮬레이션 엔진 - Replit (무료)

1. **Replit** 접속 (https://replit.com)
2. Python 프로젝트 생성
3. 코드 업로드
4. Run 버튼 클릭

---

## 📝 배포 전 체크리스트

### 1. 환경변수 확인
```javascript
// frontend/.env.production
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_SOCKET_URL=wss://your-backend-url.com

// backend/.env.production
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=strong-secret-key-here
FRONTEND_URL=https://your-frontend-url.com
```

### 2. 보안 설정
```javascript
// backend/src/server.ts
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://your-frontend.com"]
    }
  }
}));

// CORS 설정
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### 3. 데이터베이스 마이그레이션
```bash
# Prisma 스키마 생성
cd backend
npx prisma generate
npx prisma migrate deploy
```

### 4. 빌드 테스트
```bash
# Frontend 빌드
cd frontend
npm run build

# Backend 빌드
cd backend
npm run build
```

---

## 🔧 배포 후 설정

### 1. 도메인 연결 (선택사항)

#### Vercel (Frontend)
1. Settings → Domains
2. Add Domain
3. DNS 설정 (A 레코드: 76.76.21.21)

#### Railway (Backend)
1. Settings → Domain
2. Add Custom Domain
3. CNAME 레코드 설정

### 2. HTTPS 설정
- Vercel, Railway: 자동으로 SSL 인증서 제공
- Heroku: ACM (Automated Certificate Management) 사용

### 3. 모니터링 설정

#### 무료 모니터링 도구
- **UptimeRobot**: 서버 상태 모니터링
- **Sentry**: 에러 트래킹
- **Google Analytics**: 사용자 분석

```javascript
// Sentry 설정 예시 (frontend)
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});
```

### 4. 백업 설정

```bash
# PostgreSQL 백업 (매일 자동)
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Railway/Heroku는 자동 백업 제공
```

---

## 📊 성능 최적화

### Frontend 최적화
```javascript
// 코드 스플리팅
const BMYCanvas = React.lazy(() => import('./pages/BMYCanvas'));
const BMCCanvas = React.lazy(() => import('./pages/BMCCanvas'));

// 이미지 최적화
import { webpSupport } from './utils/imageOptimization';
```

### Backend 최적화
```javascript
// Redis 캐싱
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

// API 응답 캐싱
app.get('/api/simulations/:id', async (req, res) => {
  const cached = await redis.get(`sim:${req.params.id}`);
  if (cached) return res.json(JSON.parse(cached));
  // ... fetch from database
});
```

---

## 🚨 트러블슈팅

### 문제: Build 실패
```bash
# Node 버전 지정
echo "16.x" > .nvmrc

# package.json에 engines 추가
"engines": {
  "node": "16.x",
  "npm": "8.x"
}
```

### 문제: CORS 에러
```javascript
// backend에서 CORS 설정 확인
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

### 문제: WebSocket 연결 실패
```javascript
// Socket.io 설정
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});
```

---

## 📞 지원 및 도움말

### 배포 플랫폼 문서
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
- Heroku: https://devcenter.heroku.com
- Render: https://render.com/docs

### 유용한 명령어
```bash
# 로그 확인
heroku logs --tail
railway logs

# 상태 확인
heroku ps
railway status

# 재시작
heroku restart
railway restart
```

---

## ✅ 최종 체크포인트

1. ✅ 모든 환경변수가 설정되었는가?
2. ✅ 데이터베이스가 연결되었는가?
3. ✅ Frontend와 Backend가 통신하는가?
4. ✅ 시뮬레이션 엔진이 작동하는가?
5. ✅ HTTPS가 활성화되었는가?
6. ✅ 에러 로깅이 설정되었는가?
7. ✅ 백업 계획이 있는가?

모든 항목이 체크되었다면, 축하합니다! 🎉
창업 시뮬레이션 웹 애플리케이션이 성공적으로 배포되었습니다.

---

**도움이 필요하신가요?**
- GitHub Issues에 문의하세요
- 각 플랫폼의 커뮤니티 포럼을 활용하세요
- Stack Overflow에서 검색해보세요
