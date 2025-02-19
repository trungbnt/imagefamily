const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Get all categories
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/categories - Request received');
    const categories = await Category.find().sort({ order: 1 });
    console.log('Categories found:', categories);
    res.json(categories);
  } catch (error) {
    console.error('Error in GET /categories:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// Create new category
router.post('/', async (req, res) => {
  const category = new Category({
    name: req.body.name
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cập nhật danh mục
router.put('/:id', async (req, res) => {
  try {
    const { name, parentId, order } = req.body;
    const categoryId = req.params.id;

    // Không cho phép di chuyển category "Khác"
    const category = await Category.findById(categoryId);
    if (category.name === 'Khác' && (parentId !== undefined || order !== undefined)) {
      return res.status(400).json({ message: 'Không thể di chuyển danh mục "Khác"' });
    }

    if (parentId !== undefined || order !== undefined) {
      const updates = {};
      
      if (parentId !== undefined) {
        if (parentId === categoryId) {
          return res.status(400).json({ message: 'Không thể đặt danh mục làm cha của chính nó' });
        }
        // Kiểm tra vòng lặp trong cây danh mục
        let currentParent = parentId;
        while (currentParent) {
          if (currentParent === categoryId) {
            return res.status(400).json({ message: 'Không thể tạo vòng lặp trong cây danh mục' });
          }
          const parent = await Category.findById(currentParent);
          currentParent = parent ? parent.parentId : null;
        }
        updates.parentId = parentId === 'root' ? null : parentId;
      }

      if (order !== undefined) {
        updates.order = order;
      }

      if (name) {
        updates.name = name;
      }

      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        updates,
        { new: true }
      );

      res.json(updatedCategory);
    } else {
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        { name },
        { new: true }
      );
      res.json(updatedCategory);
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật danh mục', error: error.message });
  }
});

// Xóa danh mục
router.delete('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    const hasChildren = await Category.exists({ parentId: categoryId });
    if (hasChildren) {
      return res.status(400).json({ 
        message: 'Không thể xóa danh mục này vì có chứa danh mục con' 
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }

    await Category.findByIdAndDelete(categoryId);

    await Category.updateMany(
      { 
        parentId: category.parentId,
        order: { $gt: category.order }
      },
      { $inc: { order: -1 } }
    );

    res.json({ message: 'Xóa danh mục thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa danh mục', error: error.message });
  }
});

module.exports = router; 