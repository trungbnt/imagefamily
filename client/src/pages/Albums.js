import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography,
  Box,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem as MenuItemMUI,
  Button,
  Modal
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ImageViewer from '../components/ImageViewer';
import axios from 'axios';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CategoryManager from '../components/CategoryManager';
import SettingsIcon from '@mui/icons-material/Settings';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useAuth } from '../contexts/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';

const Albums = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchImages();
    fetchCategories();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get('/api/albums');
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setSelectedImage(images[index]);
    setViewerOpen(true);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setSelectedImage(images[currentImageIndex]);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setSelectedImage(images[currentImageIndex]);
  };

  // Lọc ảnh theo tìm kiếm và danh mục
  const filteredImages = images.filter(image => {
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Menu handlers
  const handleMenuOpen = (event, image) => {
    event.stopPropagation();
    setSelectedImage(image);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    event?.stopPropagation();
    setAnchorEl(null);
  };

  // Edit handlers
  const handleEditClick = (event) => {
    event.stopPropagation();
    setEditTitle(selectedImage.title);
    setEditCategory(selectedImage.category);
    setEditDialogOpen(true);
    handleMenuClose(event);
  };

  const handleEditSave = async () => {
    try {
      await axios.put(`/api/albums/${selectedImage._id}`, {
        title: editTitle,
        category: editCategory
      });
      
      // Refresh images
      fetchImages();
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Lỗi khi cập nhật ảnh');
    }
  };

  // Delete handler
  const handleDelete = async (event) => {
    event.stopPropagation();
    if (window.confirm('Bạn có chắc muốn xóa ảnh này?')) {
      try {
        await axios.delete(`/api/albums/${selectedImage._id}`);
        handleMenuClose(event);
        fetchImages();
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Lỗi khi xóa ảnh');
      }
    }
  };

  const handleAddCategory = async (newCategory) => {
    try {
      await axios.post('/api/categories', newCategory);
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Lỗi khi thêm danh mục');
    }
  };

  const handleEditCategory = async (id, updatedCategory) => {
    try {
      await axios.put(`/api/categories/${id}`, updatedCategory);
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Lỗi khi cập nhật danh mục');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      try {
        await axios.delete(`/api/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Lỗi khi xóa danh mục');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Add user info header */}
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Album Ảnh Gia Đình
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => setCategoryManagerOpen(true)}
            sx={{ mr: 2 }}
          >
            Quản lý danh mục
          </Button>
          <Button
            variant="contained"
            startIcon={<AddPhotoAlternateIcon />}
            onClick={() => navigate('/upload')}
          >
            Tải ảnh mới
          </Button>
        </Box>
      </Box>

      {/* Thanh tìm kiếm và lọc */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm ảnh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Danh mục"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      {filteredImages.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
          Không tìm thấy ảnh nào
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredImages.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} key={image._id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s'
                  }
                }}
                onClick={() => handleImageClick(index)}
              >
                <IconButton
                  sx={{ position: 'absolute', right: 8, top: 8, bgcolor: 'rgba(255,255,255,0.8)' }}
                  onClick={(e) => handleMenuOpen(e, image)}
                >
                  <MoreVertIcon />
                </IconButton>
                <CardMedia
                  component="img"
                  sx={{
                    height: 200,
                    objectFit: 'cover',
                  }}
                  image={image.url}
                  alt={image.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {image.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Danh mục: {image.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(image.createdAt).toLocaleDateString('vi-VN')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Menu for edit/delete */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItemMUI onClick={handleEditClick}>
          <EditIcon sx={{ mr: 1 }} /> Sửa
        </MenuItemMUI>
        <MenuItemMUI onClick={handleDelete}>
          <DeleteIcon sx={{ mr: 1 }} /> Xóa
        </MenuItemMUI>
      </Menu>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Sửa thông tin ảnh</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tiêu đề"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              label="Danh mục"
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleEditSave} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ 
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 1,
          p: 1
        }}>
          <img
            src={selectedImage?.url}
            alt={selectedImage?.title}
            style={{ 
              maxWidth: '100%',
              maxHeight: '85vh',
              objectFit: 'contain'
            }}
          />
          
          {/* Navigation Buttons */}
          <IconButton
            onClick={handlePrevImage}
            sx={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              color: 'white'
            }}
          >
            <NavigateBeforeIcon />
          </IconButton>

          <IconButton
            onClick={handleNextImage}
            sx={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              color: 'white'
            }}
          >
            <NavigateNextIcon />
          </IconButton>

          {/* Image Counter */}
          <Typography
            sx={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              px: 1,
              borderRadius: 1
            }}
          >
            {currentImageIndex + 1} / {images.length}
          </Typography>
        </Box>
      </Modal>

      <CategoryManager
        open={categoryManagerOpen}
        onClose={() => setCategoryManagerOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </Container>
  );
};

export default Albums;