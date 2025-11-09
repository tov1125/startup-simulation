import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';
import passport from 'passport';

// 라우터 임포트
import authRouter from './routes/auth';
import bmyRouter from './routes/bmy';
import bmcRouter from './routes/bmc';
import simulationRouter from './routes/simulation';
import analyticsRouter from './routes/analytics';

// 환경 변수 로드
dotenv.config();

// Express 앱 초기화
const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// 포트 설정
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(helmet()); // 보안 헤더
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev')); // 로깅

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100 요청
  message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
});
app.use('/api', limiter);

// Passport 초기화
app.use(passport.initialize());

// API 라우트
app.use('/api/auth', authRouter);
app.use('/api/bmy', bmyRouter);
app.use('/api/bmc', bmcRouter);
app.use('/api/simulation', simulationRouter);
app.use('/api/analytics', analyticsRouter);

// 헬스 체크 엔드포인트
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Socket.io 연결 처리 (실시간 협업)
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // BMY 캔버스 실시간 동기화
  socket.on('bmy:update', (data) => {
    socket.broadcast.emit('bmy:changed', data);
  });

  // BMC 캔버스 실시간 동기화
  socket.on('bmc:update', (data) => {
    socket.broadcast.emit('bmc:changed', data);
  });

  // 시뮬레이션 진행 상태 브로드캐스트
  socket.on('simulation:progress', (data) => {
    socket.broadcast.emit('simulation:status', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// 404 핸들러
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: '요청하신 리소스를 찾을 수 없습니다.',
  });
});

// 에러 핸들러
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  const status = err.status || 500;
  const message = err.message || '서버 오류가 발생했습니다.';

  res.status(status).json({
    error: true,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 서버 시작
httpServer.listen(PORT, () => {
  console.log(`
🚀 창업 시뮬레이션 서버가 시작되었습니다!
📍 서버 주소: http://localhost:${PORT}
🌍 환경: ${process.env.NODE_ENV || 'development'}
📅 시작 시간: ${new Date().toLocaleString('ko-KR')}
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
