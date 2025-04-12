const qs = require('qs');
const crypto = require('crypto');
const Order = require('../models/OrderProduct');
const moment = require('moment');

const VNP_URL = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'; // Sandbox
const VNP_RETURN_URL = 'http://localhost:3000';
const VNP_TMNCODE = process.env.VNP_TMNCODE;
const VNP_HASHSECRET = process.env.VNP_HASHSECRET;
console.log('VNP_HASHSECRET:', VNP_HASHSECRET);


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

    // console.log('Request Body:', req.body);

    // 1. Chuẩn hóa IP (IPv4)
    let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1';
    if (ipAddr.includes('::ffff:')) ipAddr = ipAddr.split('::ffff:')[1];
    console.log('IP Address:', ipAddr);

    // 2. Tạo txnRef và tính amount
    const txnRef = moment().format('YYYYMMDDHHmmss');
    const amountInt = Math.round(Number(totalPrice) * 100);
    console.log('Transaction Ref:', txnRef);
    console.log('Amount (VND):', amountInt);

    // 3. Build tham số VNPay
    const vnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: VNP_TMNCODE,
      vnp_Amount: amountInt.toString(),
      vnp_CurrCode: 'VND',
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: 'Thanh toán đơn hàng',
      vnp_OrderType: 'other',
      vnp_Locale: 'vn',
      vnp_ReturnUrl: VNP_RETURN_URL,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
    };
    console.log('VNPay Params:', vnpParams);
   
    // 4. Sắp xếp tham số và tạo signData
    const sortedParams = Object.fromEntries(
      Object.entries(vnpParams).sort(([a], [b]) => a.localeCompare(b))
    );
    console.log('Sorted Params:', sortedParams);
    const signData = qs.stringify(sortedParams, { encode: false });
    console.log('Sign Data:', signData);

    // 5. Tạo chữ ký HMAC‑SHA512
    const hmac = crypto.createHmac('sha512', VNP_HASHSECRET);
    const vnpSecureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    console.log('Generated Secure Hash:', vnpSecureHash);

    // 6. Xây URL thanh toán
    const paymentUrl = `${VNP_URL}?${signData}&vnp_SecureHash=${vnpSecureHash}`;
    console.log('Payment URL:', paymentUrl);

    // 7. Trả về URL
    return res.json({ url: paymentUrl });
  } catch (error) {
    console.error("Error generating payment URL:", error.message);
    return res.status(500).json({ message: 'Error generating payment URL' });
  }
;
};

const paymentReturn = async (req, res) => {
  try {
    // 1. Lấy tham số trả về, loại bỏ secure hash
    const vnpData = { ...req.query };
    const receivedSecureHash = vnpData.vnp_SecureHash;
    delete vnpData.vnp_SecureHash;
    delete vnpData.vnp_SecureHashType;

    // 2. Sắp xếp các tham số còn lại
    const sortedParams = Object.fromEntries(
      Object.entries(vnpData).sort(([a], [b]) => a.localeCompare(b))
    );
    const signData = qs.stringify(sortedParams, { encode: false });
    console.log('Return Sign Data:', signData);

    // 3. Tạo lại chữ ký HMAC-SHA512
    const hmac = crypto.createHmac('sha512', VNP_HASHSECRET);
    const computedSecureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    console.log('Computed Secure Hash:', computedSecureHash);
    console.log('Received Secure Hash:', receivedSecureHash);

    // 4. So sánh và xử lý kết quả
    if (computedSecureHash === receivedSecureHash) {
      if (vnpData.vnp_ResponseCode === '00') {
        // Thanh toán thành công, lưu đơn hàng
        const newOrder = new Order({
          txnRef: vnpData.vnp_TxnRef,
          user: req.body.user, // Lấy thông tin user từ request hoặc lưu trước đó
          orderItems: req.body.orderItems,
          shippingAddress: req.body.shippingAddress,
          paymentMethod: req.body.paymentMethod,
          itemPrice: req.body.itemPrice,
          shippingPrice: req.body.shippingPrice,
          totalPrice: req.body.totalPrice,
          status: 'Paid', // Đánh dấu trạng thái đã thanh toán
        });
        await newOrder.save();

        return res.redirect(`/success?orderRef=${vnpData.vnp_TxnRef}`);
      }
      return res.redirect(`/failure?orderRef=${vnpData.vnp_TxnRef}`);
    } else {
      console.error('Invalid Secure Hash');
      return res.status(400).send('Invalid Secure Hash');
    }
  } catch (error) {
    console.error("Error in payment return:", error.message);
    return res.status(500).send('Internal Server Error');
  }
};
module.exports = { createPaymentUrl, paymentReturn };