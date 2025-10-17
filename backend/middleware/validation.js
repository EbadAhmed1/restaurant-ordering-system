const { body, param, validationResult } = require('express-validator');

// --- Reusable Validation Handler ---

/**
 * Middleware function to check for validation errors and return a 400 response
 * if any are found. Stops execution if errors are present.
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Returns an array of error messages for the client
        return res.status(400).json({ 
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(e => e.msg) 
        });
    }
    next();
};

// --- Specific Validation Schemas ---

/**
 * Validation schema for new user registration.
 */
exports.validateRegister = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email')
        .isEmail().withMessage('Please include a valid email'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be 6 or more characters'),
    handleValidationErrors
];

/**
 * Validation schema for user login.
 */
exports.validateLogin = [
    body('email')
        .isEmail().withMessage('Please include a valid email'),
    body('password')
        .notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

/**
 * Validation schema for creating or updating a menu item (Admin).
 */
exports.validateMenuItem = [
    body('name')
        .notEmpty().withMessage('Menu item name is required'),
    body('price')
        .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('category')
        .notEmpty().withMessage('Category is required'),
    body('isAvailable')
        .optional().isBoolean().withMessage('isAvailable must be a boolean (true/false)'),
    handleValidationErrors
];

/**
 * Validation schema for placing a new order.
 */
exports.validateOrder = [
    body('items')
        .isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.menuId')
        .isInt({ gt: 0 }).withMessage('Each item must have a valid menuId'),
    body('items.*.quantity')
        .isInt({ gt: 0 }).withMessage('Quantity must be a positive whole number'),
    body('totalAmount')
        .isFloat({ gt: 0 }).withMessage('Total amount must be greater than zero'),
    handleValidationErrors
];

/**
 * Validation schema for updating order status by Admin.
 */
exports.validateOrderStatusUpdate = [
    body('status')
        .isIn(['Pending', 'Processing', 'Delivered', 'Cancelled'])
        .withMessage('Invalid order status provided'),
    handleValidationErrors
];