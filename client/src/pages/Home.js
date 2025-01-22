import React from 'react';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Quản lý Hình ảnh Gia đình
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Lưu trữ và chia sẻ những khoảnh khắc đáng nhớ của gia đình bạn
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
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
            Xem album
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home; 