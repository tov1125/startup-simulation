import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import BMYCanvas from './pages/BMYCanvas';
import BMCCanvas from './pages/BMCCanvas';
import SimulationPage from './pages/SimulationPage';
import ResultsPage from './pages/ResultsPage';
import LoginPage from './pages/LoginPage';

// 한국어 UI를 위한 커스텀 테마
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#f50057',
      dark: '#c51162',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
  },
  typography: {
    fontFamily: '"Noto Sans KR", "Roboto", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontSize: '1rem',
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage setAuth={setIsAuthenticated} />} />
            
            {/* 인증된 사용자만 접근 가능한 라우트 */}
            <Route path="/" element={
              isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
            }>
              <Route index element={<Dashboard />} />
              <Route path="bmy" element={<BMYCanvas />} />
              <Route path="bmc" element={<BMCCanvas />} />
              <Route path="simulation" element={<SimulationPage />} />
              <Route path="results" element={<ResultsPage />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
