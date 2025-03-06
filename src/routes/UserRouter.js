const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.post('/sign-up', userController.createUser);  // Đăng ký tài khoản
router.post('/sign-in', userController.loginUser);  // Đăng nhập

module.exports = router;
