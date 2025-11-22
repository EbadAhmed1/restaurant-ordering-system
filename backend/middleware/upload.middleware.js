const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import File System module

// Ensure the upload directory exists
const uploadDir = 'public/uploads/menu_images/';

if (!fs.existsSync(uploadDir)){
    // recursive: true creates parent folders (public, then uploads, then menu_images)
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created directory: ${uploadDir}`);
}

// Set Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Destination folder for uploaded images
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        // Create a unique filename: fieldname-timestamp.ext
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

// Initialize Upload middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (jpeg, jpg, png, gif) are allowed'));
        }
    },
});

exports.uploadSingleImage = (fieldName) => upload.single(fieldName);