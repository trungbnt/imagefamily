const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const Image = require('../models/Image');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Upload multiple images
router.post('/', upload.array('images'), async (req, res) => {
  try {
    console.log('Upload request received:', {
      files: req.files?.length,
      categoryId: req.body.categoryId
    });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    if (!req.body.categoryId) {
      return res.status(400).json({ message: 'Category ID is required' });
    }

    const uploadPromises = req.files.map(async (file) => {
      // Convert buffer to base64
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'imagefamily',
          resource_type: 'auto'
        });

        // Create image document
        const image = new Image({
          title: file.originalname,
          url: result.secure_url,
          publicId: result.public_id,
          categoryId: req.body.categoryId
        });

        await image.save();
        return image;

      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
      }
    });

    const uploadedImages = await Promise.all(uploadPromises);
    console.log('Images uploaded successfully:', uploadedImages.length);

    res.status(201).json({
      message: 'Upload successful',
      images: uploadedImages
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      message: 'Error uploading images',
      error: error.message
    });
  }
});

module.exports = router; 