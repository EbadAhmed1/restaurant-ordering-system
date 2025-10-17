const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validation');

// @route POST /api/auth/register
// @desc Register a new user
// Public access, but requires input validation
router.post('/register', validateRegister, authController.register);

// @route POST /api/auth/login
// @desc Login a user
// Public access, but requires input validation
router.post('/login', validateLogin, authController.login);

module.exports = router;