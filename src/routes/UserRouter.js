const express = require('express');
const router = express.Router(); // ✅ Đặt tên là `router`
const userController = require('../controllers/UserController');

router.post('/', userController.createUser); // ✅ Dùng `router`

module.exports = router; // ✅ Xuất `router`
