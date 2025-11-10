const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { protect, adminOnly } = require('../middleware/auth'); 
const { validateMenuItem } = require('../middleware/validation');

const { uploadSingleImage } = require('../middleware/upload.middleware'); 


// @route GET /api/menu
// @desc Get all active menu items (Public)
router.get('/', menuController.getMenu);

// @route GET /api/menu/:id
// @desc Get single menu item by ID (Public)
router.get('/:id', menuController.getMenuItemById);

// --- Admin Protected Routes ---

// @route POST /api/menu (Admin Only)
// @desc Add a new menu item
router.post(
    '/', 
    protect, 
    adminOnly, 
    uploadSingleImage('imageUrl'), 
    validateMenuItem, 
    menuController.addMenuItem
);

// @route PUT /api/menu/:id (Admin Only)
// @desc Update an existing menu item
router.put(
    '/:id', 
    protect, 
    adminOnly, 
    uploadSingleImage('imageUrl'), 
    validateMenuItem, 
    menuController.updateMenuItem
);

// @route DELETE /api/menu/:id (Admin Only)
// @desc Delete a menu item
router.delete('/:id', protect, adminOnly, menuController.deleteMenuItem);


module.exports = router;