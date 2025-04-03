const OrderService = require('../services/OrderSevice.js'); // Đảm bảo tên file đúng (OrderService.js)

const createOrder = async (req, res) => {
    try {
        // Lấy các trường cần thiết từ req.body
        const { user, orderItems, paymentMethod, itemPrice, shippingPrice, totalPrice, shippingAddress } = req.body;
        console.log('req.body', req.body);

        // Kiểm tra các trường bắt buộc
        if (!user || !orderItems || orderItems.length === 0) {
            return res.status(400).json({
                status: 'ERR',
                message: 'User and orderItems are required'
            });
        }
        if (!paymentMethod || !itemPrice || !shippingPrice || !totalPrice) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Payment method, itemPrice, shippingPrice and totalPrice are required'
            });
        }
        if (!shippingAddress || 
            !shippingAddress.fullName || 
            !shippingAddress.address || 
            !shippingAddress.city || 
            !shippingAddress.phone) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Shipping address (fullName, address, city, phone) is required'
            });
        }

        // Gọi service tạo đơn hàng với payload đầy đủ
        const response = await OrderService.createOrder(req.body);
        console.log('response:', response);
        
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        });
    }
};
const getAllOrders = async (req, res) => {
    try {
      const orders = await OrderService.getAllOrders();
      return res.status(200).json({ status: "OK", orders });
    } catch (error) {
      return res.status(500).json({ status: "ERR", message: error.message });
    }
  };
  

  const getOrdersByUserId = async (req, res) => {
    try {
      const { userId } = req.params; // Lấy userId từ URL params
      if (!userId) {
        return res.status(400).json({ status: "ERR", message: "User ID is required" });
      }
  
      const orders = await OrderService.getOrdersByUserId(userId);
      return res.status(200).json({ status: "OK", orders });
    } catch (error) {
      return res.status(500).json({ status: "ERR", message: error.message });
    }
  };

  // Xóa đơn hàng theo ID
  const deleteOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const order = await OrderService.deleteOrder(orderId);
      return res.status(200).json({ status: "OK", message: "Xóa đơn hàng thành công", order });
    } catch (error) {
      return res.status(500).json({ status: "ERR", message: error.message });
    }
  };

  const getOrderById = async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await OrderService.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ status: 'ERR', message: 'Không tìm thấy đơn hàng' });
      }
      return res.status(200).json({ status: 'OK', order });
    } catch (error) {
      return res.status(500).json({ status: 'ERR', message: error.message || 'Internal server error' });
    }
  };
  
  
  module.exports = { createOrder, getAllOrders, deleteOrder,getOrdersByUserId,getOrderById };