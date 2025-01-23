import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Button, 
  Typography, 
  Box,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardMedia,
  CardContent
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SettingsIcon from '@mui/icons-material/Settings';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CategoryManager from '../components/CategoryManager';

const Upload = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [defaultCategory, setDefaultCategory] = useState('Khác');
  const [previewFiles, setPreviewFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      console.log('Categories response:', response);
      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error('Invalid categories data:', response.data);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleAddCategory = async (newCategory) => {
    try {
      const response = await axios.post('/api/categories', newCategory);
      console.log('Add category response:', response);
      await fetchCategories();
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

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} vượt quá 10MB. Vui lòng chọn file nhỏ hơn.`);
        return false;
      }
      if (!(file.type === 'image/jpeg' || file.type === 'image/png')) {
        alert(`File ${file.name} không phải là ảnh JPG hoặc PNG.`);
        return false;
      }
      return true;
    });

    setSelectedFiles(validFiles);

    // Create preview URLs
    const urls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleCategoryChange = (fileIndex, newCategory) => {
    setPreviewFiles(prev => prev.map((item, index) => 
      index === fileIndex ? { ...item, category: newCategory } : item
    ));
    // Cập nhật category mặc định cho các file tiếp theo
    setDefaultCategory(newCategory);
    setSelectedCategory(newCategory);
  };

  const handleUpload = async () => {
    if (!selectedFiles.length || !selectedCategory) {
      alert('Vui lòng chọn ảnh và danh mục');
      return;
    }

    try {
      // Upload từng ảnh một
      for (let file of selectedFiles) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('category', selectedCategory);

        console.log('Uploading file:', file.name);
        console.log('Category:', selectedCategory);

        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Upload response:', response);
      }

      alert('Upload thành công!');
      setSelectedFiles([]);
      setPreviewUrls([]);
      setSelectedCategory('');

    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload thất bại: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            Tải lên hình ảnh
          </Typography>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => setCategoryManagerOpen(true)}
          >
            Quản lý danh mục
          </Button>
        </Box>
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Danh mục</InputLabel>
          <Select
            value={selectedCategory}
            label="Danh mục"
            onChange={(e) => handleCategoryChange(null, e.target.value)}
          >
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Không có danh mục nào</MenuItem>
            )}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          component="label"
          sx={{ mb: 2 }}
        >
          Chọn hình ảnh
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={handleFileSelect}
          />
        </Button>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          {previewUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Preview ${index}`}
              style={{ width: 200, height: 200, objectFit: 'cover' }}
            />
          ))}
        </Box>

        <Button 
          variant="contained" 
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || !selectedCategory}
          fullWidth
        >
          Tải lên {selectedFiles.length} ảnh
        </Button>
      </Paper>

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

export default Upload; 