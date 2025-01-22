const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const Image = require('../models/Image');

// Cấu hình multer để xử lý file upload
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
    console.log('Received upload request');
    console.log('Category:', req.body.category); // Thêm log để debug
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'Không có file được upload' });
    }

    // Kiểm tra kích thước file
    console.log('File size:', req.file.size / 1024 / 1024, 'MB');
    console.log('File received:', req.file.originalname);

    // Convert buffer thành base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    console.log('Uploading to Cloudinary...');
    
    // Upload lên Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'family-photos',
      resource_type: 'auto'
    });

    console.log('Cloudinary upload successful:', result.public_id);

    // Lưu thông tin vào database với category
    const image = new Image({
      title: req.body.title || req.file.originalname,
      url: result.secure_url,
      publicId: result.public_id,
      category: req.body.category || 'Khác', // Đảm bảo lưu category
    });

    await image.save();
    console.log('Saved to database with category:', image.category);

    res.status(201).json({
      message: 'Upload thành công',
      image
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Lỗi khi upload ảnh',
      error: error.message 
    });
  }
});

module.exports = router; 