import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
  Divider,
  Typography,
  Alert,
  Snackbar,
  Paper,
  Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CategoryManager = ({ open, onClose, categories, onAddCategory, onEditCategory, onDeleteCategory }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [expandedCategories, setExpandedCategories] = useState({});
  const [hierarchicalCategories, setHierarchicalCategories] = useState([]);

  useEffect(() => {
    // Chuyển đổi danh sách phẳng thành cấu trúc phân cấp
    const buildHierarchy = (items, parentId = null, level = 0) => {
      return items
        .filter(item => item.parentId === parentId)
        .sort((a, b) => a.order - b.order)
        .map(item => ({
          ...item,
          level,
          children: buildHierarchy(items, item._id, level + 1)
        }));
    };

    setHierarchicalCategories(buildHierarchy(categories));
  }, [categories]);

  const handleAdd = () => {
    if (!newCategoryName.trim()) {
      setError('Tên danh mục không được để trống');
      return;
    }

    const exists = categories.some(cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase());
    if (exists) {
      setError('Danh mục này đã tồn tại');
      return;
    }

    onAddCategory({ name: newCategoryName.trim() });
    setNewCategoryName('');
    setError('');
    setSnackbar({ open: true, message: 'Thêm danh mục thành công', severity: 'success' });
  };

  const handleEdit = (category) => {
    if (!editingCategory?.name.trim()) {
      setError('Tên danh mục không được để trống');
      return;
    }

    const exists = categories.some(
      cat => cat._id !== category._id && 
      cat.name.toLowerCase() === editingCategory.name.trim().toLowerCase()
    );
    if (exists) {
      setError('Danh mục này đã tồn tại');
      return;
    }

    onEditCategory(category._id, { name: editingCategory.name.trim() });
    setEditingCategory(null);
    setError('');
    setSnackbar({ open: true, message: 'Cập nhật danh mục thành công', severity: 'success' });
  };

  const handleDelete = async (categoryId, categoryName) => {
    // Kiểm tra xem có ảnh nào đang sử dụng danh mục này không
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa danh mục "${categoryName}"? \nCác ảnh thuộc danh mục này sẽ được chuyển về danh mục "Khác".`
    );
    if (confirmDelete) {
      await onDeleteCategory(categoryId);
      setSnackbar({ open: true, message: 'Xóa danh mục thành công', severity: 'success' });
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    // Nếu thả vào cùng vị trí, không làm gì
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    // Xác định parentId mới
    let newParentId = null;
    if (destination.droppableId !== 'root') {
      newParentId = destination.droppableId;
    }

    // Tìm các category cùng cấp tại vị trí đích
    const siblingCategories = categories.filter(cat => 
      cat.parentId === newParentId && cat._id !== draggableId
    );

    // Tính toán order mới
    let newOrder;
    if (siblingCategories.length === 0) {
      newOrder = 0;
    } else if (destination.index === 0) {
      newOrder = siblingCategories[0].order - 1;
    } else if (destination.index >= siblingCategories.length) {
      newOrder = siblingCategories[siblingCategories.length - 1].order + 1;
    } else {
      newOrder = (siblingCategories[destination.index - 1].order + 
                  siblingCategories[destination.index].order) / 2;
    }

    // Cập nhật parentId và order của category
    const updatedCategory = {
      parentId: newParentId,
      order: newOrder
    };

    onEditCategory(draggableId, updatedCategory);
  };

  const toggleExpand = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const renderCategoryItem = (category, index) => (
    <Draggable 
      key={category._id} 
      draggableId={category._id} 
      index={index}
      isDragDisabled={category.name === 'Khác'}
    >
      {(provided, snapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          elevation={1}
          sx={{ 
            my: 1,
            ml: category.level * 3,
            bgcolor: snapshot.isDragging ? 'action.hover' : 'background.default',
            opacity: category.name === 'Khác' ? 0.7 : 1
          }}
        >
          <ListItem>
            <Box {...provided.dragHandleProps} sx={{ mr: 1, cursor: 'move' }}>
              <DragIndicatorIcon />
            </Box>
            {category.children?.length > 0 && (
              <IconButton
                size="small"
                onClick={() => toggleExpand(category._id)}
              >
                {expandedCategories[category._id] ? <ExpandMoreIcon /> : <KeyboardArrowRightIcon />}
              </IconButton>
            )}
            {editingCategory?._id === category._id ? (
              <Box sx={{ display: 'flex', width: '100%', gap: 1 }}>
                <TextField
                  fullWidth
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  error={!!error}
                  helperText={error}
                  size="small"
                  autoFocus
                />
                <IconButton 
                  color="primary" 
                  onClick={() => handleEdit(category)}
                  disabled={!editingCategory.name.trim()}
                >
                  <SaveIcon />
                </IconButton>
                <IconButton 
                  color="error" 
                  onClick={() => {
                    setEditingCategory(null);
                    setError('');
                  }}
                >
                  <CancelIcon />
                </IconButton>
              </Box>
            ) : (
              <>
                <ListItemText 
                  primary={category.name}
                  sx={{ 
                    '& .MuiTypography-root': { 
                      fontSize: '1rem',
                      fontWeight: category.name === 'Khác' ? 'normal' : 'medium'
                    }
                  }}
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    onClick={() => {
                      setEditingCategory(category);
                      setError('');
                    }}
                    disabled={category.name === 'Khác'}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(category._id, category.name)}
                    disabled={category.name === 'Khác'}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </>
            )}
          </ListItem>
          {expandedCategories[category._id] && category.children?.length > 0 && (
            <Droppable droppableId={category._id}>
              {(provided) => (
                <List
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{ pl: 2 }}
                >
                  {category.children.map((child, index) => renderCategoryItem(child, index))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          )}
        </Paper>
      )}
    </Draggable>
  );

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" component="div">
            Quản lý Danh mục
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Thêm danh mục mới"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              error={!!error}
              helperText={error}
              InputProps={{
                endAdornment: (
                  <IconButton 
                    onClick={handleAdd}
                    color="primary"
                    disabled={!newCategoryName.trim()}
                  >
                    <AddIcon />
                  </IconButton>
                ),
              }}
              sx={{
                '& .MuiInputLabel-root': {
                  backgroundColor: 'white',
                  px: 1,
                }
              }}
            />
          </Box>
          <Divider />
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="root">
              {(provided) => (
                <Stack
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  spacing={1}
                  sx={{ mt: 2 }}
                >
                  {hierarchicalCategories.map((category, index) => 
                    renderCategoryItem(category, index)
                  )}
                  {provided.placeholder}
                </Stack>
              )}
            </Droppable>
          </DragDropContext>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CategoryManager; 