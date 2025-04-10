// src/controllers/paymentController.js
const qs = require('qs');
const crypto = require('crypto');
const Order = require('../models/OrderProduct');
const moment = require('moment');

const VNP_URL        = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const VNP_RETURN_URL = 'http://localhost:3000/api/paymen/payment-return';
const VNP_TMNCODE    = process.env.VNP_TMNCODE;
const VNP_HASHSECRET = process.env.VNP_HASHSECRET;

const createPaymentUrl = async (req, res) => {
  try {
    const {
      totalPrice,
      user,
      shippingAddress,
      orderItems,
      paymentMethod,
      itemPrice,
      shippingPrice
    } = req.body;

    // 1. Chuẩn hóa IP (IPv4)
    let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1';
    if (ipAddr.includes('::ffff:')) ipAddr = ipAddr.split('::ffff:')[1];

    // 2. Tạo txnRef và tính amount
    const txnRef    = moment().format('YYYYMMDDHHmmss');
    const amountInt = Math.round(Number(totalPrice) * 100);

    // 3. Build tham số VNPay (có vnp_OrderType)
    const vnpParams = {
      vnp_Version:    '2.1.0',
      vnp_Command:    'pay',
      vnp_TmnCode:    VNP_TMNCODE,
      vnp_Amount:     amountInt.toString(),
      vnp_CurrCode:   'VND',
      vnp_TxnRef:     txnRef,
      vnp_OrderInfo:  'Thanh toán đơn hàng',
      vnp_OrderType:  'other', // ← Bắt buộc
      vnp_Locale:     'vn',
      vnp_ReturnUrl:  VNP_RETURN_URL,
      vnp_IpAddr:     ipAddr,
      vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
    };

    // 4. Sắp xếp tham số và tạo signData
    const sortedParams = Object.fromEntries(
      Object.entries(vnpParams).sort(([a], [b]) => a.localeCompare(b))
    );
    const signData = qs.stringify(sortedParams, { encode: false });
    console.log('signData:', signData);

    // 5. Tạo chữ ký HMAC‑SHA512
    const hmac = crypto.createHmac('sha512', VNP_HASHSECRET);
    const vnpSecureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // 6. Xây URL thanh toán
    const paymentUrl = `${VNP_URL}?${signData}&vnp_SecureHash=${vnpSecureHash}`;
    console.log('VNPay URL:', paymentUrl);

    // 7. Lưu đơn hàng
    const newOrder = new Order({
      txnRef,
      user,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemPrice,
      shippingPrice,
      totalPrice,
      status: 'Pending'
    });
    await newOrder.save();

    // 8. Trả về URL
    return res.json({ url: paymentUrl });
  } catch (error) {
    console.error("Error saving order:", error);
    return res.status(500).json({ message: 'Error saving order' });
  }
};

const paymentReturn = (req, res) => {
  // 1. Lấy tham số trả về, loại bỏ secure hash
  const vnpData = { ...req.query };
  const receivedSecureHash = vnpData.vnp_SecureHash;
  delete vnpData.vnp_SecureHash;
  delete vnpData.vnp_SecureHashType;

  // 2. Sắp xếp các tham số còn lại (bao gồm vnp_OrderType)
  const sortedParams = Object.fromEntries(
    Object.entries(vnpData).sort(([a], [b]) => a.localeCompare(b))
  );
  const signData = qs.stringify(sortedParams, { encode: false });
  console.log('return signData:', signData);

  // 3. Tạo lại chữ ký HMAC-SHA512
  const hmac = crypto.createHmac('sha512', VNP_HASHSECRET);
  const computedSecureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  // 4. So sánh và redirect
  if (computedSecureHash === receivedSecureHash) {
    if (vnpData.vnp_ResponseCode === '00') {
      return res.redirect(`/success?orderRef=${vnpData.vnp_TxnRef}`);
    }
    return res.redirect(`/failure?orderRef=${vnpData.vnp_TxnRef}`);
  } else {
    return res.status(400).send('Invalid Secure Hash');
  }
};

module.exports = { createPaymentUrl, paymentReturn };
