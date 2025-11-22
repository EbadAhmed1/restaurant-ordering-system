const multer = require('multer');
const path = require('path');

// Set Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Destination folder for uploaded images
        cb(null, 'public/uploads/menu_images/'); 
    },
    filename: (req, file, cb) => {
        // Create a unique filename: fieldname-timestamp.ext
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

// Initialize Upload middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB limit for image size
    fileFilter: (req, file, cb) => {
        // Check file type
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

// must ensure the 'public/uploads/menu_images/' directory exists 