# 창업 시뮬레이션 웹 애플리케이션 아키텍처

## 1. 프로젝트 개요
"창업 마인드셋을 위한 사전 솔루션" - 실제 창업 전 필요한 준비와 검증을 돕는 웹 기반 시뮬레이션 플랫폼

## 2. 기술 스택

### Frontend
- **Framework**: React 18 + TypeScript
- **상태관리**: Redux Toolkit + RTK Query
- **UI Library**: Material-UI (MUI) + Custom Components
- **캔버스 인터랙션**: React DnD + Konva.js
- **차트/시각화**: Recharts + D3.js

### Backend
- **Framework**: Node.js + Express + TypeScript
- **Database**: PostgreSQL (메인) + Redis (세션/캐시)
- **ORM**: Prisma
- **인증**: JWT + Passport.js
- **실시간 통신**: Socket.io

### 시뮬레이션 엔진
- **언어**: Python 3.10+
- **Framework**: FastAPI
- **ML/AI**: scikit-learn, pandas, numpy
- **Task Queue**: Celery + Redis

## 3. 핵심 모듈 구조

### 3.1 BMY 모듈 (개인 비즈니스 모델)
- 개인 자원 분석 도구
- 역량 평가 시스템
- 가치관 매핑
- BMC 연동 인터페이스

### 3.2 BMC 모듈 (비즈니스 모델 캔버스)
- 9블록 인터랙티브 캔버스
- 드래그 앤 드롭 편집기
- 블록 간 연결 시각화
- 가설 설정 도구

### 3.3 시뮬레이션 엔진
- 가상 고객 페르소나 생성
- 시장 반응 예측 모델
- 가설 검증 시스템
- 재무 시뮬레이션

### 3.4 학습 시스템
- 결과 분석 대시보드
- 피벗 추천 시스템
- 학습 경로 추적
- 진도 관리

## 4. 데이터베이스 스키마 (주요 테이블)

### Users
- id, email, name, created_at, updated_at

### BMY_Canvas
- id, user_id, data (JSON), version, created_at, updated_at

### BMC_Canvas
- id, user_id, bmy_id, data (JSON), version, created_at, updated_at

### Simulations
- id, bmc_id, scenario_id, results (JSON), created_at

### Hypotheses
- id, bmc_id, description, status (validated/invalidated/pending)

### Learning_Paths
- id, user_id, progress, achievements, created_at, updated_at

## 5. API 설계 원칙
- RESTful API 설계
- GraphQL for complex queries
- WebSocket for real-time collaboration
- Rate limiting & caching

## 6. 보안 고려사항
- HTTPS 필수
- OWASP Top 10 준수
- 데이터 암호화 (at rest & in transit)
- RBAC (Role-Based Access Control)

## 7. 배포 전략
- Docker 컨테이너화
- Kubernetes orchestration
- CI/CD with GitHub Actions
- AWS/GCP 클라우드 배포

## 8. 성능 목표
- 페이지 로드: < 2초
- API 응답: < 200ms
- 시뮬레이션 실행: < 5초
- 동시 접속자: 1,000+

## 9. 확장성 계획
- Microservices 아키텍처 준비
- 수평적 확장 가능한 설계
- 캐싱 전략 구현
- CDN 활용
