const Order = require('../models/OrderProduct'); // Import model Order
const Product = require('../models/ProductModel'); // Import model Product

const createOrder = async (newOrder) => {
  try {
    console.log('Dữ liệu đơn hàng nhận được:', newOrder);

    // Giả sử payload từ frontend có cấu trúc:
    // {
    //   paymentMethod,
    //   itemPrice,
    //   shippingPrice,
    //   totalPrice,
    //   user,           // ID của người dùng
    //   shippingAddress: {
    //     fullName,
    //     address,
    //     city,
    //     phone,
    //   },
    //   orderItems,     // Mảng các sản phẩm, mỗi sản phẩm có field: product (ID), amount, ...
    // }

    const {
      paymentMethod,
      itemPrice,
      shippingPrice,
      totalPrice,
      user,
      shippingAddress,
      orderItems,
    } = newOrder;

    // Kiểm tra nếu thiếu dữ liệu quan trọng
    if (
      !paymentMethod ||
      !itemPrice ||
      !shippingPrice ||
      !totalPrice ||
      !user ||
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.phone ||
      !orderItems ||
      orderItems.length === 0
    ) {
      throw new Error("Thiếu thông tin đơn hàng");
    }

    // Tạo đơn hàng mới trong database
    const order = new Order({
      paymentMethod,
      itemPrice,
      shippingPrice,
      totalPrice,
      user,
      shippingAddress,
      orderItems,
      status: "Pending", // Mặc định trạng thái đơn hàng là "Pending"
      createdAt: new Date(),
    });

    // Lưu đơn hàng vào MongoDB
    const savedOrder = await order.save();
    console.log('Đơn hàng đã được lưu:', savedOrder);

    // Sau khi tạo đơn hàng thành công, trừ số lượng hàng tồn kho cho từng sản phẩm
    // Giả sử mỗi orderItem có trường "product" là ID của sản phẩm và "amount" là số lượng đặt mua
    await Promise.all(
      orderItems.map(async (item) => {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { countInStock: -item.amount }
        });
      })
    );

    return { status: "OK", message: "Tạo đơn hàng thành công", order: savedOrder };
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error.message);
    return { status: "ERR", message: error.message };
  }
};

const getAllOrders = async () => {
    try {
      const orders = await Order.find().populate("user", "name email"); // Populate để lấy thông tin người đặt hàng
      return orders;
    } catch (error) {
      throw error;
    }
  };
  const getOrdersByUserId = async (userId) => {
    try {
      const orders = await Order.find({ user: userId }).populate("user", "name email");
      return orders;
    } catch (error) {
      throw error;
    }
  };
  const deleteOrderService = async (orderId) => {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    return deletedOrder;
  };
  
  const getOrderById = async (orderId) => {
    try {
      const order = await Order.findById(orderId)
        .populate('user', 'name email')  // Lấy thông tin người đặt hàng
        .populate('orderItems.product', 'name price image countInStock'); // Lấy thông tin sản phẩm của từng item
      return order;
    } catch (error) {
      throw error;
    }
  };
module.exports = { createOrder,getAllOrders,getOrdersByUserId,getOrderById ,deleteOrderService};
