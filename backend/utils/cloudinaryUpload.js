import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

/**
 * Upload file to Cloudinary
 * @param {string} filePath - Path to the file
 * @returns {Promise} - Cloudinary upload result
 */
const uploadToCloudinary = async (filePath) => {
  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'blogging-platform',
      use_filename: true,
    });

    // Remove file from server after upload
    fs.unlinkSync(filePath);
    
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    // Remove file from server if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error(`Error uploading image: ${error.message}`);
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Public ID of the file
 * @returns {Promise} - Cloudinary delete result
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Error deleting image: ${error.message}`);
  }
};

export {
  uploadToCloudinary,
  deleteFromCloudinary
};