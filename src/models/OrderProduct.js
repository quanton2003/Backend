const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Order must belong to a user"],
  },
  shippingAddress: {
    fullName: { type: String, required: [true, "Full name is required"] },
    address: { type: String, required: [true, "Address is required"] },
    city: { type: String, required: [true, "City is required"] },
    phone: { type: String, required: [true, "Phone number is required"] },
  },
  paymentMethod: { type: String, required: [true, "Payment method is required"] },
  itemPrice: { type: Number, required: [true, "Item price is required"] },
  shippingPrice: { type: Number, required: [true, "Shipping price is required"] },
  totalPrice: { type: Number, required: [true, "Total price is required"] },
  orderItems: [
    {
      name: { type: String, required: [true, "Product name is required"] },
      amount: { type: Number, required: [true, "Amount is required"] },
      image: { type: String, required: [true, "Product image is required"] },
      price: { type: Number, required: [true, "Product price is required"] },
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", 
        required: [true, "Product reference is required"] 
      },
    }
  ],
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
  },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
