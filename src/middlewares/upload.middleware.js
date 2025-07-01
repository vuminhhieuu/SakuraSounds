const multer = require('multer');
const cloudinary = require('../config/cloudinary.configs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder;
    let resource_type = 'auto';

    if (file.fieldname === 'audio') {
      folder = 'songs';
      resource_type = 'video'; // Cloudinary treats audio as video and stores it correctly
    } else if (file.fieldname === 'coverImage') {
      folder = 'covers';
      resource_type = 'image';
    } else {
      folder = 'misc';
    }

    return {
      folder: folder,
      resource_type: resource_type,
      // public_id: `user_${req.user._id}_${Date.now()}`, // Example of a unique public_id
    };
  },
});

// File filter to allow specific mimetypes
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'audio') {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload only audio files.'), false);
    }
  } else if (file.fieldname === 'coverImage') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload only image files.'), false);
    }
  } else {
    cb(new Error('Invalid field name for file upload.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit for files
  },
});

module.exports = upload;
