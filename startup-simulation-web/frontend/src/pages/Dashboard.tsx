import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  Person as PersonIcon,
  Business as BusinessIcon,
  PlayArrow as PlayIcon,
  Assessment as AssessmentIcon 
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" gutterBottom>
        창업 시뮬레이션 대시보드
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        창업을 준비하는 당신을 위한 종합 시뮬레이션 플랫폼입니다.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* BMY 카드 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <Typography variant="h5">개인 비즈니스 모델 (BMY)</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                창업을 시작하기 전, 먼저 자신을 이해하세요. 
                당신의 강점, 가치관, 네트워크를 분석합니다.
              </Typography>
              <Button 
                variant="contained" 
                fullWidth
                onClick={() => navigate('/bmy')}
              >
                BMY 작성하기
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* BMC 카드 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusinessIcon sx={{ fontSize: 40, mr: 2, color: 'secondary.main' }} />
                <Typography variant="h5">비즈니스 모델 캔버스 (BMC)</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                9개의 핵심 블록을 채워 비즈니스 모델을 설계하고,
                가설을 설정하여 검증하세요.
              </Typography>
              <Button 
                variant="contained" 
                color="secondary"
                fullWidth
                onClick={() => navigate('/bmc')}
              >
                BMC 설계하기
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* 시뮬레이션 카드 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PlayIcon sx={{ fontSize: 40, mr: 2, color: 'success.main' }} />
                <Typography variant="h5">시뮬레이션 실행</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                가상 고객과의 인터뷰, 시장 분석, 재무 예측을 통해
                비즈니스 모델을 검증합니다.
              </Typography>
              <Button 
                variant="contained" 
                color="success"
                fullWidth
                onClick={() => navigate('/simulation')}
              >
                시뮬레이션 시작
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* 결과 분석 카드 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon sx={{ fontSize: 40, mr: 2, color: 'warning.main' }} />
                <Typography variant="h5">결과 분석</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                시뮬레이션 결과를 분석하고, 개선점을 찾아
                비즈니스 모델을 개선합니다.
              </Typography>
              <Button 
                variant="contained" 
                color="warning"
                fullWidth
                onClick={() => navigate('/results')}
              >
                결과 보기
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 진행 상태 */}
      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          진행 상태
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Typography variant="body2" color="text.secondary">BMY 완성도</Typography>
            <Typography variant="h4">0%</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body2" color="text.secondary">BMC 완성도</Typography>
            <Typography variant="h4">0%</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body2" color="text.secondary">시뮬레이션 횟수</Typography>
            <Typography variant="h4">0회</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body2" color="text.secondary">검증된 가설</Typography>
            <Typography variant="h4">0개</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard;
