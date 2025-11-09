import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  Alert,
  AlertTitle,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Person as PersonIcon,
  CheckCircle as ValidatedIcon,
  Cancel as InvalidatedIcon,
  Refresh as RestartIcon,
  Assessment as ReportIcon,
  ExpandMore as ExpandMoreIcon,
  Psychology as InterviewIcon,
  TrendingUp as MarketIcon,
  AttachMoney as FinanceIcon,
} from '@mui/icons-material';

// 타입 정의
interface CustomerPersona {
  id: string;
  name: string;
  age: number;
  occupation: string;
  income: string;
  painPoints: string[];
  needs: string[];
  avatar: string;
  segment: string;
  responses: InterviewResponse[];
}

interface InterviewResponse {
  question: string;
  answer: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  relatedHypothesis?: string;
}

interface SimulationResult {
  hypothesis: string;
  status: 'validated' | 'invalidated' | 'partial';
  confidence: number;
  feedback: string[];
  recommendations: string[];
}

interface MarketData {
  marketSize: number;
  growthRate: number;
  competition: 'low' | 'medium' | 'high';
  entryBarriers: string[];
}

// 시뮬레이션 단계
const steps = ['고객 페르소나 생성', '가상 인터뷰 진행', '시장 분석', '재무 예측', '결과 분석'];

const SimulationPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [personas, setPersonas] = useState<CustomerPersona[]>([]);
  const [currentPersona, setCurrentPersona] = useState<CustomerPersona | null>(null);
  const [interviewDialogOpen, setInterviewDialogOpen] = useState(false);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [expandedResults, setExpandedResults] = useState<{ [key: string]: boolean }>({});

  // 가설 데이터 (실제로는 BMC에서 가져옴)
  const hypotheses = [
    "20대 고객의 70%가 우리 앱을 유료로 사용할 것이다",
    "월 구독료 9,900원은 적정 가격이다",
    "소셜 미디어를 통한 마케팅이 가장 효과적일 것이다",
    "3개월 내에 1,000명의 유료 사용자를 확보할 수 있다",
  ];

  // 시뮬레이션 시작
  const startSimulation = () => {
    setIsRunning(true);
    setActiveStep(0);
    generatePersonas();
  };

  // 고객 페르소나 생성
  const generatePersonas = () => {
    const generatedPersonas: CustomerPersona[] = [
      {
        id: 'p1',
        name: '김민지',
        age: 25,
        occupation: '스타트업 마케터',
        income: '3000-4000만원',
        painPoints: ['업무 효율성 부족', '협업 도구 산재'],
        needs: ['통합 관리 솔루션', '합리적 가격'],
        avatar: '👩‍💼',
        segment: '얼리어답터',
        responses: [],
      },
      {
        id: 'p2',
        name: '이준호',
        age: 32,
        occupation: '프리랜서 개발자',
        income: '5000-7000만원',
        painPoints: ['프로젝트 관리 어려움', '클라이언트 소통'],
        needs: ['프로젝트 트래킹', '실시간 협업'],
        avatar: '👨‍💻',
        segment: '실용주의자',
        responses: [],
      },
      {
        id: 'p3',
        name: '박서연',
        age: 28,
        occupation: '중소기업 팀장',
        income: '4000-5000만원',
        painPoints: ['팀 관리 복잡성', '보고서 작성 시간'],
        needs: ['자동화 기능', '팀 협업 도구'],
        avatar: '👩‍💼',
        segment: '보수주의자',
        responses: [],
      },
    ];

    setPersonas(generatedPersonas);
    setTimeout(() => {
      setActiveStep(1);
      conductInterviews(generatedPersonas);
    }, 2000);
  };

  // 가상 인터뷰 진행
  const conductInterviews = (personas: CustomerPersona[]) => {
    const interviewQuestions = [
      "현재 어떤 도구를 사용하고 계신가요?",
      "월 9,900원의 구독료를 지불할 의향이 있으신가요?",
      "어떤 기능이 가장 중요하다고 생각하시나요?",
      "경쟁 제품과 비교했을 때 우리 제품의 장점은 무엇일까요?",
      "어떤 채널을 통해 제품을 알게 되셨나요?",
    ];

    const updatedPersonas = personas.map(persona => {
      const responses: InterviewResponse[] = interviewQuestions.map((question, index) => {
        // 페르소나 특성에 따른 응답 생성
        let answer = '';
        let sentiment: InterviewResponse['sentiment'] = 'neutral';

        if (index === 1) { // 가격 관련 질문
          if (persona.segment === '얼리어답터') {
            answer = "혁신적인 기능이 있다면 기꺼이 지불하겠습니다.";
            sentiment = 'positive';
          } else if (persona.segment === '실용주의자') {
            answer = "가격 대비 가치가 명확하다면 고려해볼 수 있습니다.";
            sentiment = 'neutral';
          } else {
            answer = "무료 체험 기간이 충분하다면 생각해보겠습니다.";
            sentiment = 'negative';
          }
        } else if (index === 4) { // 마케팅 채널
          answer = persona.age < 30 
            ? "인스타그램 광고를 통해 알게 되었습니다."
            : "동료의 추천으로 알게 되었습니다.";
          sentiment = 'positive';
        } else {
          // 다른 질문들에 대한 응답
          answer = `${persona.needs[0]}에 대한 해결책을 찾고 있습니다.`;
          sentiment = 'neutral';
        }

        return {
          question,
          answer,
          sentiment,
          relatedHypothesis: hypotheses[index % hypotheses.length],
        };
      });

      return { ...persona, responses };
    });

    setPersonas(updatedPersonas);
    setProgress(40);

    setTimeout(() => {
      setActiveStep(2);
      analyzeMarket();
    }, 3000);
  };

  // 시장 분석
  const analyzeMarket = () => {
    const market: MarketData = {
      marketSize: 850000000000, // 850억원
      growthRate: 15.2,
      competition: 'medium',
      entryBarriers: [
        '기존 경쟁자의 브랜드 인지도',
        '고객 전환 비용',
        '네트워크 효과',
      ],
    };

    setMarketData(market);
    setProgress(60);

    setTimeout(() => {
      setActiveStep(3);
      projectFinancials();
    }, 2000);
  };

  // 재무 예측
  const projectFinancials = () => {
    setProgress(80);

    setTimeout(() => {
      setActiveStep(4);
      analyzeResults();
    }, 2000);
  };

  // 결과 분석
  const analyzeResults = () => {
    const simulationResults: SimulationResult[] = hypotheses.map((hypothesis, index) => {
      let status: SimulationResult['status'] = 'partial';
      let confidence = 50 + Math.random() * 40;
      let feedback: string[] = [];
      let recommendations: string[] = [];

      if (index === 0) { // 20대 유료 사용
        status = 'partial';
        confidence = 45;
        feedback = [
          '20대 중 얼리어답터 그룹(30%)은 긍정적 반응',
          '나머지 70%는 무료 버전 선호',
          '가격 민감도가 예상보다 높음',
        ];
        recommendations = [
          '프리미엄 모델 대신 프리미엄 기능 세분화',
          '학생 할인 정책 도입 고려',
          '무료 체험 기간 연장 (14일 → 30일)',
        ];
      } else if (index === 1) { // 가격 적정성
        status = 'invalidated';
        confidence = 25;
        feedback = [
          '목표 고객의 60%가 가격 부담 표현',
          '경쟁사 대비 20% 높은 가격',
          '가치 제안이 가격을 정당화하지 못함',
        ];
        recommendations = [
          '가격을 7,900원으로 조정',
          '연간 결제 시 할인 제공',
          '기능별 티어 가격 정책 도입',
        ];
      } else if (index === 2) { // 소셜 미디어 마케팅
        status = 'validated';
        confidence = 75;
        feedback = [
          '타겟 고객의 65%가 소셜 미디어를 통해 제품 발견',
          '인스타그램과 유튜브가 가장 효과적',
          '인플루언서 마케팅 ROI 긍정적',
        ];
        recommendations = [
          '소셜 미디어 예산 30% 증액',
          '마이크로 인플루언서 협업 확대',
          '사용자 생성 콘텐츠 캠페인 기획',
        ];
      } else {
        status = 'partial';
        confidence = 55;
        feedback = [
          '시장 진입 초기 성장 속도 예측 어려움',
          '경쟁 환경이 빠르게 변화 중',
          '제품-시장 적합성 추가 검증 필요',
        ];
        recommendations = [
          'MVP 출시 후 빠른 피드백 수집',
          '주간 단위 지표 모니터링 체계 구축',
          '피벗 시나리오 3개 준비',
        ];
      }

      return {
        hypothesis,
        status,
        confidence,
        feedback,
        recommendations,
      };
    });

    setResults(simulationResults);
    setProgress(100);
    setIsRunning(false);
  };

  // 인터뷰 상세 보기
  const showInterviewDetails = (persona: CustomerPersona) => {
    setCurrentPersona(persona);
    setInterviewDialogOpen(true);
  };

  // 결과 확장/축소 토글
  const toggleResultExpansion = (hypothesis: string) => {
    setExpandedResults(prev => ({
      ...prev,
      [hypothesis]: !prev[hypothesis],
    }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 헤더 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          창업 시뮬레이션
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          가상의 고객과 시장을 대상으로 비즈니스 모델을 테스트합니다.
        </Typography>
      </Box>

      {/* 진행 상태 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {isRunning && (
          <Box sx={{ mt: 3 }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
              진행중... {progress}%
            </Typography>
          </Box>
        )}
      </Paper>

      {/* 시작 버튼 */}
      {!isRunning && results.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<StartIcon />}
            onClick={startSimulation}
            sx={{ px: 4, py: 2 }}
          >
            시뮬레이션 시작
          </Button>
        </Box>
      )}

      {/* 고객 페르소나 */}
      {personas.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            고객 페르소나
          </Typography>
          <Grid container spacing={2}>
            {personas.map((persona) => (
              <Grid item xs={12} md={4} key={persona.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ width: 56, height: 56, fontSize: 28, mr: 2 }}>
                        {persona.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">{persona.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {persona.age}세, {persona.occupation}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Chip label={persona.segment} size="small" color="primary" />
                      <Chip label={persona.income} size="small" sx={{ ml: 1 }} />
                    </Box>
                    {persona.responses.length > 0 && (
                      <Button
                        size="small"
                        startIcon={<InterviewIcon />}
                        onClick={() => showInterviewDetails(persona)}
                        sx={{ mt: 1 }}
                      >
                        인터뷰 보기
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* 시장 데이터 */}
      {marketData && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            <MarketIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            시장 분석
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">시장 규모</Typography>
              <Typography variant="h6">
                {(marketData.marketSize / 100000000).toFixed(0)}억원
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">연간 성장률</Typography>
              <Typography variant="h6">{marketData.growthRate}%</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">경쟁 강도</Typography>
              <Typography variant="h6">
                {marketData.competition === 'high' ? '높음' :
                 marketData.competition === 'medium' ? '보통' : '낮음'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">진입 장벽</Typography>
              <Typography variant="h6">{marketData.entryBarriers.length}개</Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* 시뮬레이션 결과 */}
      {results.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            <ReportIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            가설 검증 결과
          </Typography>
          {results.map((result) => (
            <Paper key={result.hypothesis} sx={{ mb: 2 }}>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                      {result.status === 'validated' ? (
                        <ValidatedIcon color="success" sx={{ mr: 1 }} />
                      ) : result.status === 'invalidated' ? (
                        <InvalidatedIcon color="error" sx={{ mr: 1 }} />
                      ) : (
                        <Box sx={{ 
                          width: 24, 
                          height: 24, 
                          borderRadius: '50%', 
                          backgroundColor: 'warning.main',
                          mr: 1 
                        }} />
                      )}
                      {result.hypothesis}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Chip
                        label={
                          result.status === 'validated' ? '검증됨' :
                          result.status === 'invalidated' ? '무효화됨' : '부분 검증'
                        }
                        color={
                          result.status === 'validated' ? 'success' :
                          result.status === 'invalidated' ? 'error' : 'warning'
                        }
                        size="small"
                      />
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        신뢰도: {result.confidence.toFixed(0)}%
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={() => toggleResultExpansion(result.hypothesis)}
                    sx={{
                      transform: expandedResults[result.hypothesis] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s',
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>

                <Collapse in={expandedResults[result.hypothesis]}>
                  <Box sx={{ mt: 2, pl: 4 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      피드백:
                    </Typography>
                    <List dense>
                      {result.feedback.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={`• ${item}`} />
                        </ListItem>
                      ))}
                    </List>

                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                      권장 사항:
                    </Typography>
                    <List dense>
                      {result.recommendations.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText 
                            primary={`• ${item}`}
                            primaryTypographyProps={{ color: 'primary' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Collapse>
              </Box>
            </Paper>
          ))}

          {/* 재시작 버튼 */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<RestartIcon />}
              onClick={() => {
                setResults([]);
                setPersonas([]);
                setMarketData(null);
                setProgress(0);
                setActiveStep(0);
              }}
            >
              새로운 시뮬레이션
            </Button>
          </Box>
        </Box>
      )}

      {/* 인터뷰 상세 다이얼로그 */}
      <Dialog 
        open={interviewDialogOpen} 
        onClose={() => setInterviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentPersona?.name}님과의 인터뷰
        </DialogTitle>
        <DialogContent>
          <List>
            {currentPersona?.responses.map((response, index) => (
              <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Q: {response.question}
                </Typography>
                <Typography variant="body2" paragraph>
                  A: {response.answer}
                </Typography>
                <Chip
                  size="small"
                  label={
                    response.sentiment === 'positive' ? '긍정적' :
                    response.sentiment === 'negative' ? '부정적' : '중립적'
                  }
                  color={
                    response.sentiment === 'positive' ? 'success' :
                    response.sentiment === 'negative' ? 'error' : 'default'
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default SimulationPage;
