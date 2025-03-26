import React from 'react';
import { Container, Typography, Box, Button, Grid, Link, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SecurityIcon from '@mui/icons-material/Security';
import CloudIcon from '@mui/icons-material/Cloud';
import ShareIcon from '@mui/icons-material/Share';
import DevicesIcon from '@mui/icons-material/Devices';
import GroupsIcon from '@mui/icons-material/Groups';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../contexts/AuthContext';

import '../App.css';

const Home = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Navbar */}
      <Box className="navbar">
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" className="logo">
              FamilyAlbum
            </Link>
            <Box>
              <Link href="/albums" className="nav-link">Home</Link>
              <Link href="/albums" className="nav-link">Albums</Link>
              <Link href="/photos" className="nav-link">Photos</Link>
              <Link href="/about" className="nav-link">About</Link>
              
              {auth && user ? (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
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
                    className="cta-button outlined"
                  >
                    Đăng xuất
                  </Button>
                </Box>
              ) : (
                <>
                  <Button 
                    variant="outlined" 
                    className="cta-button outlined" 
                    sx={{ ml: 2 }} 
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="contained" 
                    className="cta-button" 
                    sx={{ ml: 2 }} 
                    onClick={() => navigate('/login')}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" className="hero-section">
        <Typography variant="overline" color="primary">
          Family Memories Made Beautiful
        </Typography>
        <Typography variant="h1" className="hero-title">
          Preserve your family memories
        </Typography>
        <Typography variant="h2" className="hero-subtitle">
          with elegance
        </Typography>
        <Typography variant="body1" className="hero-description">
          A beautiful, minimalist gallery to showcase your most precious family
          moments with the visual quality they deserve.
        </Typography>
        <Box>
          <Button variant="contained" className="cta-button">
            Create Your Gallery
          </Button>
          <Button variant="outlined" className="cta-button outlined">
            Explore Features
          </Button>
        </Box>
      </Container>

      {/* Features Section */}
      <Box className="features-section">
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ mb: 6, textAlign: 'center' }}>
            Designed for families
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box className="feature-card">
                <PhotoLibraryIcon className="feature-icon" />
                <Typography className="feature-title">Beautiful Albums</Typography>
                <Typography className="feature-description">
                  Create stunning visual narratives with our elegant album layouts.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box className="feature-card">
                <CloudIcon className="feature-icon" />
                <Typography className="feature-title">Cloud Storage</Typography>
                <Typography className="feature-description">
                  Your memories are safely stored and accessible from anywhere.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box className="feature-card">
                <ShareIcon className="feature-icon" />
                <Typography className="feature-title">Easy Sharing</Typography>
                <Typography className="feature-description">
                  Share your cherished memories with family members and friends.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box className="feature-card">
                <SecurityIcon className="feature-icon" />
                <Typography className="feature-title">Privacy Controls</Typography>
                <Typography className="feature-description">
                  You decide who can see your photos with granular privacy settings.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box className="feature-card">
                <DevicesIcon className="feature-icon" />
                <Typography className="feature-title">Mobile Friendly</Typography>
                <Typography className="feature-description">
                  Access your gallery on any device with our responsive design.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box className="feature-card">
                <GroupsIcon className="feature-icon" />
                <Typography className="feature-title">Family Collaboration</Typography>
                <Typography className="feature-description">
                  Let family members contribute to shared albums and collections.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box className="footer">
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" className="logo">FamilyAlbum</Typography>
              <Typography variant="body2" color="text.secondary">
                A beautiful, minimalist gallery to showcase your most precious family
                moments with the visual quality they deserve.
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                <Grid item xs={6} md={4}>
                  <Typography variant="h6">Navigation</Typography>
                  <Link href="/" className="nav-link">Home</Link><br />
                  <Link href="/albums" className="nav-link">Albums</Link><br />
                  <Link href="/photos" className="nav-link">Photos</Link><br />
                  <Link href="/about" className="nav-link">About</Link>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Typography variant="h6">Legal</Typography>
                  <Link href="/privacy" className="nav-link">Privacy Policy</Link><br />
                  <Link href="/terms" className="nav-link">Terms of Service</Link><br />
                  <Link href="/cookies" className="nav-link">Cookie Policy</Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Home; 