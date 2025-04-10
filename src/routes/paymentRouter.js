const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authUserMiddleWare } = require("../middleware/authMiddleware");


// Route để tạo URL thanh toán VNPAY
router.post('/create-payment-url', paymentController.createPaymentUrl); 

// Route để xử lý callback từ VNPAY
router.get('/payment-return', paymentController.paymentReturn);

module.exports = router;
