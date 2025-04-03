const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authUserMiddleWare } = require("../middleware/authMiddleware")

router.post('/create', authUserMiddleWare, OrderController.createOrder);
router.get('/my-orders', OrderController.getAllOrders);
router.delete('/:orderId',OrderController.deleteOrder); 
// router.get('/my-orders/:userId', OrderController.getOrdersByUserId);
router.get('/:orderId', OrderController.getOrderById);
module.exports = router;
