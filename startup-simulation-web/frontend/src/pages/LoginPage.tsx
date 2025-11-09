import React from 'react';
import { Box, Container, Paper, Button, Typography } from '@mui/material';

interface LoginPageProps {
  setAuth: (value: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setAuth }) => {
  const handleTestLogin = () => {
    // 임시 로그인 처리
    setAuth(true);
    window.location.href = '/';
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            창업 시뮬레이션
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" paragraph>
            프로토타입 버전
          </Typography>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleTestLogin}
          >
            테스트 로그인 (클릭하세요)
          </Button>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            © 2024 Startup Simulation
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
