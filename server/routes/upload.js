const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const Image = require('../models/Image');

// Cấu hình multer với giới hạn kích thước
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1
  }
});

// Route upload ảnh
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Log request
    console.log('Upload request received:', {
      file: req.file?.originalname,
      category: req.body.category,
      size: req.file?.size
    });

    // Validate input
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file được upload' });
    }

    if (!req.body.category) {
      return res.status(400).json({ message: 'Thiếu thông tin danh mục' });
    }

    // Validate file type
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'Chỉ chấp nhận file ảnh' });
    }

    try {
      // Convert buffer to base64
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      // Upload to Cloudinary with timeout and retry
      const uploadToCloudinary = async (retries = 3) => {
        try {
          const result = await Promise.race([
            cloudinary.uploader.upload(dataURI, {
              folder: 'imagefamily',
              resource_type: 'auto',
              timeout: 60000 // 60 seconds timeout
            }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Upload timeout')), 60000)
            )
          ]);
          return result;
        } catch (error) {
          if (retries > 0) {
            console.log(`Retrying upload... (${retries} attempts left)`);
            return uploadToCloudinary(retries - 1);
          }
          throw error;
        }
      };

      const result = await uploadToCloudinary();
      console.log('Cloudinary upload successful:', result.public_id);

      // Create and save image document
      const image = new Image({
        title: req.file.originalname,
        url: result.secure_url,
        publicId: result.public_id,
        category: req.body.category
      });

      await image.save();
      console.log('Image saved to database:', image._id);

      res.status(201).json({
        message: 'Upload thành công',
        image
      });

    } catch (cloudinaryError) {
      console.error('Cloudinary upload error:', cloudinaryError);
      res.status(500).json({
        message: 'Lỗi khi upload lên cloud',
        error: cloudinaryError.message
      });
    }

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
});

module.exports = router; 