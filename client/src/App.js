import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import axios from 'axios';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';

// Import pages
import Upload from './pages/Upload';
import Home from './pages/Home';
import Albums from './pages/Albums';
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
  const theme = createTheme({
    palette: {
      primary: {
        main: '#4A6FA5',
      },
      secondary: {
        main: '#6C757D',
      },
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
    },
  });

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<PrivateRoute><Albums /></PrivateRoute>} />
            <Route path="/albums" element={<AdminRoute><Albums /></AdminRoute>} />
            <Route path="/upload" element={<AdminRoute><Upload /></AdminRoute>} />
            
            {/* Static pages */}
            <Route path="/about" element={<Home />} />
            <Route path="/privacy" element={<Home />} />
            <Route path="/terms" element={<Home />} />
            <Route path="/cookies" element={<Home />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
