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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [defaultCategory, setDefaultCategory] = useState('Khác');
  const [previewFiles, setPreviewFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddCategory = async (newCategory) => {
    try {
      await axios.post('http://localhost:5000/api/categories', newCategory);
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Lỗi khi thêm danh mục');
    }
  };

  const handleEditCategory = async (id, updatedCategory) => {
    try {
      await axios.put(`http://localhost:5000/api/categories/${id}`, updatedCategory);
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Lỗi khi cập nhật danh mục');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      try {
        await axios.delete(`http://localhost:5000/api/categories/${id}`);
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
    
    // Tạo preview cho các file với category được chọn hiện tại
    const previews = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      category: defaultCategory
    }));
    setPreviewFiles(previews);
  };

  const handleCategoryChange = (fileIndex, newCategory) => {
    setPreviewFiles(prev => prev.map((item, index) => 
      index === fileIndex ? { ...item, category: newCategory } : item
    ));
    // Cập nhật category mặc định cho các file tiếp theo
    setDefaultCategory(newCategory);
  };

  const handleUpload = async () => {
    setUploading(true);
    setProgress(0);
    
    try {
      const totalFiles = previewFiles.length;
      let completed = 0;

      const uploadFile = async (fileInfo) => {
        const formData = new FormData();
        formData.append('image', fileInfo.file);
        formData.append('title', fileInfo.file.name);
        console.log('Uploading file with category:', fileInfo.category);
        formData.append('category', fileInfo.category || defaultCategory);

        await axios.post('http://localhost:5000/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress((completed * 100 + percentCompleted) / totalFiles);
          }
        });
        completed++;
      };

      for (const fileInfo of previewFiles) {
        await uploadFile(fileInfo);
      }

      setProgress(100);
      alert('Upload thành công!');
      
      // Xóa các preview URLs
      previewFiles.forEach(file => URL.revokeObjectURL(file.preview));
      setPreviewFiles([]);
      
      // Chuyển hướng đến trang albums sau 1 giây
      setTimeout(() => {
        navigate('/albums');
      }, 1000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload thất bại: ' + error.message);
    } finally {
      setUploading(false);
      setSelectedFiles([]);
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
        
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <input
            accept="image/jpeg,image/png"
            style={{ display: 'none' }}
            id="upload-file"
            multiple
            type="file"
            onChange={handleFileSelect}
          />
          <label htmlFor="upload-file">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Chọn hình ảnh
            </Button>
          </label>
        </Box>

        {previewFiles.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Xem trước và chọn danh mục
            </Typography>
            <Grid container spacing={2}>
              {previewFiles.map((fileInfo, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={fileInfo.preview}
                      alt={fileInfo.file.name}
                    />
                    <CardContent>
                      <Typography noWrap>{fileInfo.file.name}</Typography>
                      <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                        <InputLabel>Danh mục</InputLabel>
                        <Select
                          value={fileInfo.category}
                          onChange={(e) => handleCategoryChange(index, e.target.value)}
                          label="Danh mục"
                        >
                          {categories.map((category) => (
                            <MenuItem key={category._id} value={category.name}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                onClick={handleUpload}
                disabled={uploading}
                fullWidth
              >
                Tải lên {previewFiles.length} ảnh
              </Button>
            </Box>
          </>
        )}

        {uploading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}
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