const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authUserMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', authUserMiddleWare, OrderController.createOrder);
router.get('/orderAdmin', OrderController.getAllOrders);
router.get('/my-order/:userId', OrderController.getOrdersByUserId);
router.delete('/delete/:orderId', OrderController.deleteOrder);

// ⚠️ Đưa route này xuống cuối cùng để tránh conflict
router.get('/:orderId', OrderController.getOrderById);

module.exports = router;
