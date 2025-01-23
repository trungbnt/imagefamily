const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const Image = require('../models/Image');

// Cấu hình multer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Route upload ảnh
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('File:', req.file);
    console.log('Category:', req.body.category);

    if (!req.file) {
      return res.status(400).json({ message: 'Không có file được upload' });
    }

    if (!req.body.category) {
      return res.status(400).json({ message: 'Thiếu thông tin danh mục' });
    }

    // Convert buffer thành base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    
    // Upload lên Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'imagefamily',
      resource_type: 'auto'
    });

    console.log('Cloudinary result:', result);

    // Lưu thông tin vào database
    const image = new Image({
      title: req.file.originalname,
      url: result.secure_url,
      publicId: result.public_id,
      category: req.body.category
    });

    await image.save();
    console.log('Saved image:', image);

    res.status(201).json({
      message: 'Upload thành công',
      image
    });

  } catch (error) {
    console.error('Upload error details:', error);
    res.status(500).json({
      message: 'Lỗi khi upload ảnh',
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router; 