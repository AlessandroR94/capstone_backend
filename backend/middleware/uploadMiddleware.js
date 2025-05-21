const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configura Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage su Cloudinary, solo jpg e png
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profile_images',
    allowed_formats: ['jpg', 'png']
  }
});

const upload = multer({ storage });

module.exports = upload;
