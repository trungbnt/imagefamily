import React from 'react';
import { Container, Typography, Box, Button, Grid, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {user.picture && (
              <Avatar 
                src={user.picture} 
                alt={user.name}
                sx={{ mr: 2 }}
              />
            )}
            <Typography variant="body1" sx={{ mr: 2 }}>
              Xin chào, {user.name}
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Quản lý Hình ảnh Gia đình
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Xem và chia sẻ những khoảnh khắc đáng nhớ của gia đình bạn
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={12}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PhotoLibraryIcon />}
            fullWidth
            sx={{ py: 2 }}
            onClick={() => window.location.href = '/albums'}
          >
            Xem album gia đình
          </Button>
        </Grid>
        
        {user?.role === 'admin' && (
          <>
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                size="large"
                startIcon={<CloudUploadIcon />}
                onClick={() => navigate('/upload')}
                fullWidth
                sx={{ py: 2 }}
              >
                Tải lên hình ảnh
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                size="large"
                startIcon={<PhotoLibraryIcon />}
                onClick={() => navigate('/albums')}
                fullWidth
                sx={{ py: 2 }}
              >
                Quản lý album
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
};

export default Home; 