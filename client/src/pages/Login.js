import React from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import axios from 'axios';

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/facebook`;
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Đăng nhập
          </Typography>
          
          <Button
            fullWidth
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{ mb: 2 }}
          >
            Đăng nhập với Google
          </Button>
          
          <Button
            fullWidth
            variant="contained"
            startIcon={<FacebookIcon />}
            onClick={handleFacebookLogin}
            sx={{ backgroundColor: '#3b5998', '&:hover': { backgroundColor: '#2d4373' } }}
          >
            Đăng nhập với Facebook
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 