import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import axios from 'axios';
import Upload from './pages/Upload';
import Home from './pages/Home';
import Albums from './pages/Albums';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Cấu hình axios
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// Thêm interceptor để xử lý lỗi
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Thêm token vào mọi request
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
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
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            
            {/* Protected routes */}
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/albums" element={<AdminRoute><Albums /></AdminRoute>} />
            <Route path="/upload" element={<AdminRoute><Upload /></AdminRoute>} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
