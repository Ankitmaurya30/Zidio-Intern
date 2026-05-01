import express from 'express';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';
import fs from 'fs';

const router = express.Router();

// @desc    Upload file to Cloudinary
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a file'
      });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.path);

    res.status(200).json({
      success: true,
      url: result.url,
      public_id: result.public_id
    });
  } catch (err) {
    // Clean up file if upload fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(err);
  }
});

export default router;