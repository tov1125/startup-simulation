import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Chip,
  Card,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  PlayArrow as SimulateIcon,
  Help as HelpIcon,
  Link as LinkIcon,
  Lightbulb as HypothesisIcon,
} from '@mui/icons-material';
import { Stage, Layer, Rect, Text, Arrow, Group } from 'react-konva';

// BMC 블록 타입 정의
interface BMCBlock {
  id: string;
  title: string;
  description: string;
  items: BMCItem[];
  position: { row: number; col: number; width: number; height: number };
  color: string;
  guideQuestions: string[];
}

interface BMCItem {
  id: string;
  content: string;
  type: 'resource' | 'activity' | 'value' | 'hypothesis' | 'default';
  fromBMY?: boolean;
}

interface Hypothesis {
  id: string;
  statement: string;
  relatedBlocks: string[];
  status: 'pending' | 'validated' | 'invalidated';
}

// BMC 9개 블록 레이아웃
const initialBMCBlocks: BMCBlock[] = [
  {
    id: 'key-partners',
    title: '핵심 파트너',
    description: '누구와 협력할 것인가?',
    items: [],
    position: { row: 0, col: 0, width: 2, height: 2 },
    color: '#e8eaf6',
    guideQuestions: [
      '핵심 공급자는 누구인가?',
      '핵심 파트너로부터 어떤 자원을 얻는가?',
      '파트너가 수행하는 핵심 활동은?'
    ]
  },
  {
    id: 'key-activities',
    title: '핵심 활동',
    description: '무엇을 해야 하는가?',
    items: [],
    position: { row: 0, col: 2, width: 2, height: 1 },
    color: '#fce4ec',
    guideQuestions: [
      '가치 제안을 위해 필요한 핵심 활동은?',
      '유통 채널이 요구하는 활동은?',
      '고객 관계 유지를 위한 활동은?'
    ]
  },
  {
    id: 'value-propositions',
    title: '가치 제안',
    description: '어떤 가치를 제공하는가?',
    items: [],
    position: { row: 0, col: 4, width: 2, height: 2 },
    color: '#fff3e0',
    guideQuestions: [
      '고객의 어떤 문제를 해결하는가?',
      '어떤 고객 니즈를 만족시키는가?',
      '고객에게 어떤 가치를 제공하는가?'
    ]
  },
  {
    id: 'customer-relationships',
    title: '고객 관계',
    description: '어떻게 관계를 맺을 것인가?',
    items: [],
    position: { row: 0, col: 6, width: 2, height: 1 },
    color: '#e0f2f1',
    guideQuestions: [
      '고객이 기대하는 관계 유형은?',
      '어떤 관계를 구축했는가?',
      '비용은 얼마나 드는가?'
    ]
  },
  {
    id: 'customer-segments',
    title: '고객 세그먼트',
    description: '누구를 위한 것인가?',
    items: [],
    position: { row: 0, col: 8, width: 2, height: 2 },
    color: '#f3e5f5',
    guideQuestions: [
      '누구를 위해 가치를 창출하는가?',
      '가장 중요한 고객은 누구인가?',
      '목표 고객의 특성은?'
    ]
  },
  {
    id: 'key-resources',
    title: '핵심 자원',
    description: '무엇이 필요한가?',
    items: [],
    position: { row: 1, col: 2, width: 2, height: 1 },
    color: '#fff8e1',
    guideQuestions: [
      '가치 제안에 필요한 핵심 자원은?',
      '물리적, 지적, 인적, 재무적 자원은?',
      '어떤 자원을 파트너로부터 획득하는가?'
    ]
  },
  {
    id: 'channels',
    title: '채널',
    description: '어떻게 전달할 것인가?',
    items: [],
    position: { row: 1, col: 6, width: 2, height: 1 },
    color: '#e8f5e9',
    guideQuestions: [
      '고객이 어떻게 우리를 발견하는가?',
      '어떻게 가치를 전달하는가?',
      '어떤 채널이 효과적인가?'
    ]
  },
  {
    id: 'cost-structure',
    title: '비용 구조',
    description: '비용은 얼마나 드는가?',
    items: [],
    position: { row: 2, col: 0, width: 5, height: 1 },
    color: '#ffebee',
    guideQuestions: [
      '가장 중요한 비용은?',
      '가장 비싼 핵심 자원은?',
      '가장 비싼 핵심 활동은?'
    ]
  },
  {
    id: 'revenue-streams',
    title: '수익원',
    description: '어떻게 돈을 벌 것인가?',
    items: [],
    position: { row: 2, col: 5, width: 5, height: 1 },
    color: '#e8f5e9',
    guideQuestions: [
      '고객이 지불할 의사가 있는 가치는?',
      '현재 무엇에 대해 지불하고 있는가?',
      '어떻게 지불하고 싶어하는가?'
    ]
  }
];

const BMCCanvas: React.FC = () => {
  const [blocks, setBlocks] = useState<BMCBlock[]>(initialBMCBlocks);
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hypothesisDialogOpen, setHypothesisDialogOpen] = useState(false);
  const [currentBlock, setCurrentBlock] = useState<string | null>(null);
  const [newItemContent, setNewItemContent] = useState('');
  const [newItemType, setNewItemType] = useState<BMCItem['type']>('default');
  const [newHypothesis, setNewHypothesis] = useState('');
  const [relatedBlocks, setRelatedBlocks] = useState<string[]>([]);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [currentHelpBlock, setCurrentHelpBlock] = useState<BMCBlock | null>(null);

  // BMY 데이터 가져오기 (실제로는 Redux나 Context에서)
  useEffect(() => {
    // TODO: BMY에서 내보낸 데이터를 가져와서 자동으로 채우기
    const bmyData = localStorage.getItem('bmyExport');
    if (bmyData) {
      const parsed = JSON.parse(bmyData);
      // BMY 데이터를 BMC의 적절한 블록에 매핑
      console.log('BMY 데이터 연동:', parsed);
    }
  }, []);

  // 아이템 추가
  const handleAddItem = () => {
    if (!currentBlock || !newItemContent.trim()) return;

    const newItem: BMCItem = {
      id: `item-${Date.now()}`,
      content: newItemContent.trim(),
      type: newItemType,
      fromBMY: false,
    };

    setBlocks(prev =>
      prev.map(block =>
        block.id === currentBlock
          ? { ...block, items: [...block.items, newItem] }
          : block
      )
    );

    setNewItemContent('');
    setNewItemType('default');
    setDialogOpen(false);
  };

  // 가설 추가
  const handleAddHypothesis = () => {
    if (!newHypothesis.trim() || relatedBlocks.length === 0) return;

    const hypothesis: Hypothesis = {
      id: `hyp-${Date.now()}`,
      statement: newHypothesis.trim(),
      relatedBlocks: relatedBlocks,
      status: 'pending',
    };

    setHypotheses(prev => [...prev, hypothesis]);
    setNewHypothesis('');
    setRelatedBlocks([]);
    setHypothesisDialogOpen(false);
  };

  // 아이템 삭제
  const handleDeleteItem = (blockId: string, itemId: string) => {
    setBlocks(prev =>
      prev.map(block =>
        block.id === blockId
          ? { ...block, items: block.items.filter(item => item.id !== itemId) }
          : block
      )
    );
  };

  // BMC 저장
  const handleSave = () => {
    const bmcData = {
      blocks: blocks.map(block => ({
        id: block.id,
        title: block.title,
        items: block.items
      })),
      hypotheses: hypotheses,
      timestamp: new Date().toISOString()
    };
    
    console.log('BMC 저장:', bmcData);
    // TODO: API 호출로 서버에 저장
    alert('BMC가 저장되었습니다!');
  };

  // 시뮬레이션 시작
  const handleStartSimulation = () => {
    if (hypotheses.length === 0) {
      alert('시뮬레이션을 시작하려면 먼저 가설을 설정하세요.');
      return;
    }

    const simulationData = {
      bmc: blocks,
      hypotheses: hypotheses,
    };
    
    console.log('시뮬레이션 시작:', simulationData);
    // TODO: 시뮬레이션 페이지로 이동
    window.location.href = '/simulation';
  };

  // 블록 색상 가져오기
  const getItemColor = (type: BMCItem['type']) => {
    switch (type) {
      case 'resource': return '#4caf50';
      case 'activity': return '#2196f3';
      case 'value': return '#ff9800';
      case 'hypothesis': return '#9c27b0';
      default: return '#757575';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 헤더 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          비즈니스 모델 캔버스 (BMC)
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          9개의 핵심 블록을 채워 비즈니스 모델을 설계하고, 가설을 설정하여 검증하세요.
        </Typography>
      </Box>

      {/* 액션 버튼 */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          저장하기
        </Button>
        <Button
          variant="outlined"
          startIcon={<HypothesisIcon />}
          onClick={() => setHypothesisDialogOpen(true)}
        >
          가설 추가
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<SimulateIcon />}
          onClick={handleStartSimulation}
        >
          시뮬레이션 시작
        </Button>
      </Box>

      {/* 가설 리스트 */}
      {hypotheses.length > 0 && (
        <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>
            설정된 가설 ({hypotheses.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {hypotheses.map(hyp => (
              <Chip
                key={hyp.id}
                label={hyp.statement}
                color={
                  hyp.status === 'validated' ? 'success' :
                  hyp.status === 'invalidated' ? 'error' : 'default'
                }
                sx={{ maxWidth: 300 }}
              />
            ))}
          </Box>
        </Paper>
      )}

      {/* BMC 캔버스 그리드 */}
      <Grid container spacing={2}>
        {blocks.map((block) => (
          <Grid 
            item 
            xs={12} 
            md={block.position.width * 1.2} 
            key={block.id}
          >
            <Paper
              elevation={3}
              sx={{
                p: 2,
                backgroundColor: block.color,
                minHeight: block.position.height * 150,
                position: 'relative',
                border: '2px solid',
                borderColor: 'divider',
              }}
            >
              {/* 블록 헤더 */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ flex: 1 }}>
                  {block.title}
                </Typography>
                <Tooltip title="도움말">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setCurrentHelpBlock(block);
                      setHelpDialogOpen(true);
                    }}
                  >
                    <HelpIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                {block.description}
              </Typography>

              {/* 아이템 리스트 */}
              <Box sx={{ mb: 2 }}>
                {block.items.map((item) => (
                  <Chip
                    key={item.id}
                    label={item.content}
                    onDelete={() => handleDeleteItem(block.id, item.id)}
                    sx={{
                      m: 0.5,
                      backgroundColor: item.fromBMY ? '#ffffcc' : 'white',
                      borderLeft: `3px solid ${getItemColor(item.type)}`,
                    }}
                    size="small"
                  />
                ))}
              </Box>

              {/* 추가 버튼 */}
              <Button
                startIcon={<AddIcon />}
                size="small"
                variant="text"
                onClick={() => {
                  setCurrentBlock(block.id);
                  setDialogOpen(true);
                }}
              >
                추가
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* 범례 */}
      <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          범례:
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip size="small" label="자원" sx={{ borderLeft: `3px solid ${getItemColor('resource')}` }} />
          <Chip size="small" label="활동" sx={{ borderLeft: `3px solid ${getItemColor('activity')}` }} />
          <Chip size="small" label="가치" sx={{ borderLeft: `3px solid ${getItemColor('value')}` }} />
          <Chip size="small" label="가설" sx={{ borderLeft: `3px solid ${getItemColor('hypothesis')}` }} />
          <Chip size="small" label="BMY 연동" sx={{ backgroundColor: '#ffffcc' }} />
        </Box>
      </Box>

      {/* 아이템 추가 다이얼로그 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {blocks.find(b => b.id === currentBlock)?.title}에 항목 추가
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="추가할 내용을 입력하세요..."
            value={newItemContent}
            onChange={(e) => setNewItemContent(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>유형</InputLabel>
            <Select
              value={newItemType}
              onChange={(e) => setNewItemType(e.target.value as BMCItem['type'])}
              label="유형"
            >
              <MenuItem value="default">일반</MenuItem>
              <MenuItem value="resource">자원</MenuItem>
              <MenuItem value="activity">활동</MenuItem>
              <MenuItem value="value">가치</MenuItem>
              <MenuItem value="hypothesis">가설 관련</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setDialogOpen(false)}>취소</Button>
            <Button variant="contained" onClick={handleAddItem}>
              추가
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* 가설 추가 다이얼로그 */}
      <Dialog open={hypothesisDialogOpen} onClose={() => setHypothesisDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>가설 설정</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            검증하고 싶은 가설을 설정하세요. 시뮬레이션에서 이 가설들이 테스트됩니다.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            placeholder="예: 20대 고객의 70%가 우리 앱을 유료로 사용할 것이다"
            value={newHypothesis}
            onChange={(e) => setNewHypothesis(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>관련 블록 선택</InputLabel>
            <Select
              multiple
              value={relatedBlocks}
              onChange={(e) => setRelatedBlocks(e.target.value as string[])}
              label="관련 블록 선택"
            >
              {blocks.map(block => (
                <MenuItem key={block.id} value={block.id}>
                  {block.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setHypothesisDialogOpen(false)}>취소</Button>
            <Button 
              variant="contained" 
              onClick={handleAddHypothesis}
              disabled={!newHypothesis.trim() || relatedBlocks.length === 0}
            >
              가설 추가
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* 도움말 다이얼로그 */}
      <Dialog open={helpDialogOpen} onClose={() => setHelpDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentHelpBlock?.title} - 가이드
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            {currentHelpBlock?.description}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            다음 질문들을 고려해보세요:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {currentHelpBlock?.guideQuestions.map((question, index) => (
              <Typography component="li" variant="body2" key={index} sx={{ mb: 1 }}>
                {question}
              </Typography>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default BMCCanvas;
