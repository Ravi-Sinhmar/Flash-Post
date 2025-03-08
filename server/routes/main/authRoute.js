const express = require('express');
const authController = require('./../../controllers/main/authController');
const {authenticate} = require('./../../middleware/main/authMiddleware');

const router = express.Router();

router.post('/register',authenticate, authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.get('/login',authenticate, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;