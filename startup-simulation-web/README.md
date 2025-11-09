# 🚀 창업 시뮬레이션 웹 애플리케이션

## 프로젝트 소개
"창업 마인드셋을 위한 사전 솔루션" - 실제 창업 전 필요한 준비와 검증을 돕는 웹 기반 시뮬레이션 플랫폼입니다.

## 주요 기능

### 1. BMY (Business Model You) - 개인 비즈니스 모델
- 창업자 개인의 강점, 가치관, 네트워크 분석
- 드래그 앤 드롭으로 직관적인 캔버스 작성
- BMC와 자동 연동

### 2. BMC (Business Model Canvas) - 비즈니스 모델 캔버스
- 9개 핵심 블록으로 비즈니스 모델 설계
- 가설 설정 및 관리
- 실시간 협업 지원

### 3. 시뮬레이션 엔진
- AI 기반 가상 고객 페르소나 생성
- 가설 검증을 위한 가상 인터뷰
- 시장 분석 및 재무 예측
- 피벗 추천 시스템

### 4. 학습 및 개선
- 시뮬레이션 결과 분석 대시보드
- 검증된 데이터 기반 개선 제안
- 반복적인 테스트-학습 사이클 지원

## 기술 스택

### Frontend
- React 18 + TypeScript
- Material-UI (MUI)
- Redux Toolkit
- React DnD (드래그 앤 드롭)
- Socket.io Client (실시간 협업)

### Backend
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- Socket.io (WebSocket)
- JWT 인증

### 시뮬레이션 엔진
- Python 3.10+
- FastAPI
- NumPy, Pandas
- 머신러닝 기반 분석

## 설치 및 실행

### 사전 요구사항
- Node.js 16+
- Python 3.10+
- PostgreSQL 14+
- Redis (선택사항)

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/startup-simulation-web.git
cd startup-simulation-web
```

### 2. Frontend 설치 및 실행
```bash
cd frontend
npm install
npm start
# http://localhost:3000 에서 실행됩니다
```

### 3. Backend 설치 및 실행
```bash
cd backend
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 편집하여 데이터베이스 연결 정보 등을 설정하세요

# 데이터베이스 마이그레이션
npx prisma migrate dev

# 서버 시작
npm run dev
# http://localhost:5000 에서 실행됩니다
```

### 4. 시뮬레이션 엔진 설치 및 실행
```bash
cd simulation-engine

# 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# FastAPI 서버 시작
uvicorn main:app --reload --port 8000
# http://localhost:8000 에서 실행됩니다
```

## 사용 방법

### 1단계: BMY 작성
1. BMY 페이지로 이동
2. 각 블록에 자신의 정보를 추가
   - 핵심 가치관
   - 핵심 역량
   - 관심사
   - 인적 네트워크
   - 핵심 활동
   - 성격 특성
3. "BMC로 내보내기" 클릭

### 2단계: BMC 설계
1. BMC 페이지로 이동
2. BMY에서 가져온 데이터 확인
3. 9개 블록 완성
   - 핵심 파트너
   - 핵심 활동
   - 가치 제안
   - 고객 관계
   - 고객 세그먼트
   - 핵심 자원
   - 채널
   - 비용 구조
   - 수익원
4. 가설 설정

### 3단계: 시뮬레이션
1. "시뮬레이션 시작" 클릭
2. 가상 고객 인터뷰 진행 확인
3. 시장 분석 결과 검토
4. 가설 검증 결과 확인

### 4단계: 개선
1. 검증 결과 분석
2. 권장사항 검토
3. BMC 수정
4. 재시뮬레이션

## 프로젝트 구조
```
startup-simulation-web/
├── frontend/                # React 프론트엔드
│   ├── src/
│   │   ├── components/     # 재사용 가능한 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   │   ├── BMYCanvas.tsx
│   │   │   ├── BMCCanvas.tsx
│   │   │   └── SimulationPage.tsx
│   │   ├── store/         # Redux 스토어
│   │   └── utils/         # 유틸리티 함수
│   └── package.json
├── backend/                # Node.js 백엔드
│   ├── src/
│   │   ├── routes/        # API 라우트
│   │   ├── models/        # 데이터 모델
│   │   ├── services/      # 비즈니스 로직
│   │   └── server.ts      # 메인 서버
│   └── package.json
├── simulation-engine/      # Python 시뮬레이션 엔진
│   ├── simulation_engine.py
│   ├── main.py           # FastAPI 앱
│   └── requirements.txt
└── README.md
```

## API 문서

### 인증 API
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/profile` - 프로필 조회

### BMY API
- `GET /api/bmy` - BMY 조회
- `POST /api/bmy` - BMY 생성
- `PUT /api/bmy/:id` - BMY 수정

### BMC API
- `GET /api/bmc` - BMC 조회
- `POST /api/bmc` - BMC 생성
- `PUT /api/bmc/:id` - BMC 수정
- `POST /api/bmc/:id/hypotheses` - 가설 추가

### 시뮬레이션 API
- `POST /api/simulation/start` - 시뮬레이션 시작
- `GET /api/simulation/:id` - 시뮬레이션 결과 조회
- `GET /api/simulation/:id/report` - 상세 리포트

## 환경 변수 설정

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SIMULATION_URL=http://localhost:8000
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/startup_sim
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
REDIS_URL=redis://localhost:6379
```

### 시뮬레이션 엔진 (.env)
```
BACKEND_URL=http://localhost:5000
DATABASE_URL=postgresql://user:password@localhost:5432/startup_sim
```

## 데이터베이스 스키마

```sql
-- Users 테이블
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BMY Canvas 테이블
CREATE TABLE bmy_canvas (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    data JSONB NOT NULL,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BMC Canvas 테이블
CREATE TABLE bmc_canvas (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    bmy_id INTEGER REFERENCES bmy_canvas(id),
    data JSONB NOT NULL,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Simulations 테이블
CREATE TABLE simulations (
    id SERIAL PRIMARY KEY,
    bmc_id INTEGER REFERENCES bmc_canvas(id),
    results JSONB,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hypotheses 테이블
CREATE TABLE hypotheses (
    id SERIAL PRIMARY KEY,
    bmc_id INTEGER REFERENCES bmc_canvas(id),
    statement TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    validation_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 배포 가이드

### Docker를 사용한 배포

```dockerfile
# Frontend Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```dockerfile
# Backend Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

```dockerfile
# Simulation Engine Dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://backend:5000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/startup_sim
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  simulation-engine:
    build: ./simulation-engine
    ports:
      - "8000:8000"
    environment:
      - BACKEND_URL=http://backend:5000
    depends_on:
      - backend

  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=startup_sim
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

## 테스트

### Frontend 테스트
```bash
cd frontend
npm test
```

### Backend 테스트
```bash
cd backend
npm test
```

### 시뮬레이션 엔진 테스트
```bash
cd simulation-engine
pytest tests/
```

## 기여 가이드
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이센스
MIT License

## 문의
- Email: contact@startup-simulation.com
- Issue Tracker: https://github.com/your-username/startup-simulation-web/issues

## 크레딧
본 프로젝트는 Business Model Canvas (Alexander Osterwalder)와 Business Model You (Tim Clark) 방법론을 기반으로 합니다.

---
Made with ❤️ for Entrepreneurs
