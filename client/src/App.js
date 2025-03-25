import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import axios from 'axios';
import Upload from './pages/Upload';
import Home from './pages/Home';
import Albums from './pages/Albums';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import PrivateRoute from './components/PrivateRoute';

// Cấu hình axios
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Thêm interceptor để xử lý lỗi
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

function App() {
  // Tạm thời bỏ darkMode nếu chưa dùng
  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route path="/" element={<PrivateRoute><Albums /></PrivateRoute>} />
            <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
