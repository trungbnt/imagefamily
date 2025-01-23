import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import axios from 'axios';
import Upload from './pages/Upload';
import Home from './pages/Home';
import Albums from './pages/Albums';

// Cấu hình axios
axios.defaults.baseURL = process.env.NODE_ENV === 'production'
  ? 'https://imagefamily.onrender.com'  // URL đầy đủ của server
  : 'http://localhost:5000';

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/albums" element={<Albums />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
