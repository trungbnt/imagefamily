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
  ? 'https://imagefamily.vercel.app/api'
  : 'http://localhost:5000/api';

axios.interceptors.request.use((config) => {
  // Thêm headers nếu cần
  return config;
});

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
