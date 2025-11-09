import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Chip,
  Tooltip,
  Card,
  CardContent,
  Fab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Help as HelpIcon,
  Psychology as PsychologyIcon,
  EmojiObjects as IdeaIcon,
  School as SkillIcon,
  Favorite as ValueIcon,
  Group as NetworkIcon,
  Work as ActivityIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// BMY 블록 타입 정의
interface BMYBlock {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  items: BMYItem[];
  color: string;
  guideQuestions: string[];
}

interface BMYItem {
  id: string;
  content: string;
  category?: string;
}

// BMY 캔버스 블록 구조
const initialBMYBlocks: BMYBlock[] = [
  {
    id: 'core-values',
    title: '핵심 가치관',
    icon: <ValueIcon />,
    description: '당신이 중요하게 생각하는 가치는 무엇인가요?',
    items: [],
    color: '#e3f2fd',
    guideQuestions: [
      '무엇이 당신을 행복하게 만드나요?',
      '어떤 일을 할 때 가장 의미를 느끼나요?',
      '양보할 수 없는 원칙은 무엇인가요?'
    ]
  },
  {
    id: 'skills',
    title: '핵심 역량',
    icon: <SkillIcon />,
    description: '당신의 강점과 전문성은 무엇인가요?',
    items: [],
    color: '#fce4ec',
    guideQuestions: [
      '어떤 기술을 가지고 있나요?',
      '무엇을 잘한다고 자주 듣나요?',
      '어떤 분야에서 전문성이 있나요?'
    ]
  },
  {
    id: 'interests',
    title: '관심사',
    icon: <IdeaIcon />,
    description: '무엇에 열정을 느끼나요?',
    items: [],
    color: '#fff3e0',
    guideQuestions: [
      '시간 가는 줄 모르고 하는 일은?',
      '어떤 주제로 대화하는 것을 좋아하나요?',
      '취미나 관심 분야는 무엇인가요?'
    ]
  },
  {
    id: 'network',
    title: '인적 네트워크',
    icon: <NetworkIcon />,
    description: '누구와 함께 일하고 싶나요?',
    items: [],
    color: '#f3e5f5',
    guideQuestions: [
      '도움을 받을 수 있는 사람들은 누구인가요?',
      '어떤 커뮤니티에 속해 있나요?',
      '협력할 수 있는 파트너는 누구인가요?'
    ]
  },
  {
    id: 'activities',
    title: '핵심 활동',
    icon: <ActivityIcon />,
    description: '무엇을 하면서 시간을 보내고 싶나요?',
    items: [],
    color: '#e8f5e9',
    guideQuestions: [
      '하루 일과를 어떻게 보내고 싶나요?',
      '어떤 종류의 일을 하고 싶나요?',
      '반복적인 일 vs 창의적인 일?'
    ]
  },
  {
    id: 'personality',
    title: '성격 특성',
    icon: <PsychologyIcon />,
    description: '당신은 어떤 사람인가요?',
    items: [],
    color: '#fff8e1',
    guideQuestions: [
      '내향적인가요, 외향적인가요?',
      '리스크를 감수하는 편인가요?',
      '계획적인가요, 즉흥적인가요?'
    ]
  }
];

const BMYCanvas: React.FC = () => {
  const [blocks, setBlocks] = useState<BMYBlock[]>(initialBMYBlocks);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentBlock, setCurrentBlock] = useState<string | null>(null);
  const [newItemContent, setNewItemContent] = useState('');
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [currentHelpBlock, setCurrentHelpBlock] = useState<BMYBlock | null>(null);

  // 아이템 추가
  const handleAddItem = () => {
    if (!currentBlock || !newItemContent.trim()) return;

    const newItem: BMYItem = {
      id: `item-${Date.now()}`,
      content: newItemContent.trim(),
    };

    setBlocks(prev =>
      prev.map(block =>
        block.id === currentBlock
          ? { ...block, items: [...block.items, newItem] }
          : block
      )
    );

    setNewItemContent('');
    setDialogOpen(false);
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

  // 드래그 앤 드롭 처리
  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      // 같은 블록 내에서 순서 변경
      const blockIndex = blocks.findIndex(b => b.id === source.droppableId);
      const newItems = Array.from(blocks[blockIndex].items);
      const [reorderedItem] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, reorderedItem);

      const newBlocks = [...blocks];
      newBlocks[blockIndex] = { ...blocks[blockIndex], items: newItems };
      setBlocks(newBlocks);
    } else {
      // 다른 블록으로 이동
      const sourceBlockIndex = blocks.findIndex(b => b.id === source.droppableId);
      const destBlockIndex = blocks.findIndex(b => b.id === destination.droppableId);
      
      const sourceItems = Array.from(blocks[sourceBlockIndex].items);
      const destItems = Array.from(blocks[destBlockIndex].items);
      
      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);

      const newBlocks = [...blocks];
      newBlocks[sourceBlockIndex] = { ...blocks[sourceBlockIndex], items: sourceItems };
      newBlocks[destBlockIndex] = { ...blocks[destBlockIndex], items: destItems };
      setBlocks(newBlocks);
    }
  };

  // BMY 저장
  const handleSave = () => {
    const bmyData = {
      blocks: blocks.map(block => ({
        id: block.id,
        title: block.title,
        items: block.items
      })),
      timestamp: new Date().toISOString()
    };
    
    console.log('BMY 저장:', bmyData);
    // TODO: API 호출로 서버에 저장
    alert('BMY가 저장되었습니다!');
  };

  // BMC로 내보내기
  const handleExportToBMC = () => {
    const exportData = {
      skills: blocks.find(b => b.id === 'skills')?.items || [],
      values: blocks.find(b => b.id === 'core-values')?.items || [],
      network: blocks.find(b => b.id === 'network')?.items || [],
      activities: blocks.find(b => b.id === 'activities')?.items || [],
    };
    
    console.log('BMC로 내보내기:', exportData);
    // TODO: Redux store나 context에 저장하여 BMC 페이지로 전달
    alert('BMY 데이터가 BMC로 내보내졌습니다. BMC 페이지로 이동하세요.');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 헤더 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          개인 비즈니스 모델 (BMY)
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          창업을 시작하기 전, 먼저 자신을 이해하세요. 당신의 강점, 가치관, 네트워크를 분석합니다.
        </Typography>
      </Box>

      {/* 액션 버튼 */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          저장하기
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleExportToBMC}
        >
          BMC로 내보내기
        </Button>
      </Box>

      {/* BMY 캔버스 그리드 */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={3}>
          {blocks.map((block) => (
            <Grid item xs={12} md={6} lg={4} key={block.id}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  backgroundColor: block.color,
                  minHeight: 300,
                  position: 'relative',
                }}
              >
                {/* 블록 헤더 */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    {block.icon}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {block.title}
                    </Typography>
                  </Box>
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

                {/* 드롭 영역 */}
                <Droppable droppableId={block.id}>
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        minHeight: 150,
                        backgroundColor: snapshot.isDraggingOver ? 'rgba(0,0,0,0.05)' : 'transparent',
                        borderRadius: 1,
                        p: 1,
                        transition: 'background-color 0.2s',
                      }}
                    >
                      {block.items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                mb: 1,
                                opacity: snapshot.isDragging ? 0.5 : 1,
                              }}
                            >
                              <Chip
                                label={item.content}
                                onDelete={() => handleDeleteItem(block.id, item.id)}
                                sx={{
                                  backgroundColor: 'white',
                                  maxWidth: '100%',
                                  height: 'auto',
                                  '& .MuiChip-label': {
                                    whiteSpace: 'normal',
                                    padding: '8px',
                                  },
                                }}
                              />
                            </Box>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>

                {/* 추가 버튼 */}
                <Button
                  startIcon={<AddIcon />}
                  size="small"
                  onClick={() => {
                    setCurrentBlock(block.id);
                    setDialogOpen(true);
                  }}
                  sx={{ mt: 1 }}
                >
                  추가
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>

      {/* 아이템 추가 다이얼로그 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>항목 추가</DialogTitle>
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
            sx={{ mt: 2 }}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setDialogOpen(false)}>취소</Button>
            <Button variant="contained" onClick={handleAddItem}>
              추가
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
            다음 질문들을 참고하세요:
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

export default BMYCanvas;
