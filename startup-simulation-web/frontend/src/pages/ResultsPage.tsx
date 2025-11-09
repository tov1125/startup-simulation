import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Cancel as FailIcon,
  Warning as WarningIcon,
  TrendingUp as TrendIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ResultsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 임시 데이터
  const results = {
    hypotheses: [
      { id: 1, text: '20대 고객의 70%가 유료 사용', status: 'validated', confidence: 75 },
      { id: 2, text: '월 9,900원 가격 적정성', status: 'invalidated', confidence: 25 },
      { id: 3, text: '소셜 미디어 마케팅 효과', status: 'partial', confidence: 60 },
    ],
    marketSize: 850000000000,
    growthRate: 15.2,
    breakEvenMonth: 18,
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        시뮬레이션 결과 분석
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        최근 시뮬레이션 결과를 확인하고 개선점을 찾아보세요.
      </Typography>

      {/* 요약 카드 */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                검증된 가설
              </Typography>
              <Typography variant="h4">
                1/3
              </Typography>
              <LinearProgress variant="determinate" value={33} color="success" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                시장 규모
              </Typography>
              <Typography variant="h4">
                850억
              </Typography>
              <Typography variant="body2" color="success.main">
                연 성장률 15.2%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                손익분기점
              </Typography>
              <Typography variant="h4">
                18개월
              </Typography>
              <Typography variant="body2" color="text.secondary">
                예상 도달 시점
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                종합 점수
              </Typography>
              <Typography variant="h4" color="warning.main">
                65점
              </Typography>
              <Chip label="개선 필요" color="warning" size="small" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 상세 결과 탭 */}
      <Paper sx={{ mt: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="가설 검증" />
          <Tab label="시장 분석" />
          <Tab label="재무 예측" />
          <Tab label="권장사항" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <List>
            {results.hypotheses.map((hyp) => (
              <ListItem key={hyp.id}>
                <ListItemText
                  primary={hyp.text}
                  secondary={`신뢰도: ${hyp.confidence}%`}
                />
                {hyp.status === 'validated' && <SuccessIcon color="success" />}
                {hyp.status === 'invalidated' && <FailIcon color="error" />}
                {hyp.status === 'partial' && <WarningIcon color="warning" />}
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6">시장 환경 분석</Typography>
          <Typography paragraph>
            목표 시장 규모는 약 850억원으로 추정되며, 연간 15.2%의 성장률을 보이고 있습니다.
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6">재무 전망</Typography>
          <Typography paragraph>
            현재 비즈니스 모델 기준으로 18개월 후 손익분기점 도달이 예상됩니다.
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6">개선 권장사항</Typography>
          <List>
            <ListItem>
              <ListItemText primary="가격 정책을 7,900원으로 조정 검토" />
            </ListItem>
            <ListItem>
              <ListItemText primary="20대 타겟 마케팅 전략 강화" />
            </ListItem>
            <ListItem>
              <ListItemText primary="무료 체험 기간을 30일로 연장" />
            </ListItem>
          </List>
        </TabPanel>
      </Paper>

      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary">
          BMC 수정하기
        </Button>
        <Button variant="outlined">
          재시뮬레이션
        </Button>
        <Button variant="outlined">
          리포트 다운로드
        </Button>
      </Box>
    </Container>
  );
};

export default ResultsPage;
