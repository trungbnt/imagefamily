const express = require('express');
const router = express.Router();
const Image = require('../models/Image');
const cloudinary = require('../config/cloudinary');

// Lấy tất cả hình ảnh
router.get('/', async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách ảnh', error: error.message });
  }
});

// Cập nhật thông tin ảnh
router.put('/:id', async (req, res) => {
  try {
    const { title, category } = req.body;
    const updatedImage = await Image.findByIdAndUpdate(
      req.params.id,
      { title, category },
      { new: true }
    );
    res.json(updatedImage);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật ảnh', error: error.message });
  }
});

// Xóa ảnh
router.delete('/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Không tìm thấy ảnh' });
    }

    // Xóa ảnh từ Cloudinary
    await cloudinary.uploader.destroy(image.publicId);
    
    // Xóa thông tin từ database
    await Image.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Xóa ảnh thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa ảnh', error: error.message });
  }
});

module.exports = router; 