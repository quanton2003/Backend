const express = require('express');
const crypto = require('crypto');
const querystring = require('querystring');
const moment = require('moment');

const router = express.Router();

// Lấy thông tin VNPay từ biến môi trường
const vnp_TmnCode = process.env.VNP_TMN_CODE;       // Mã thương gia
const secretKey = process.env.VNP_SECRET_KEY;         // Khóa bí mật
const vnpReturnUrl = process.env.VNP_RETURN_URL;        // URL trả về sau giao dịch
const vnpPaymentUrl = process.env.VNP_PAYMENT_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

// Endpoint tạo yêu cầu thanh toán
router.get('/vnpay', (req, res) => {
    // Tạo mã giao dịch duy nhất (ví dụ: timestamp)
    let txnRef = moment().format('YYYYMMDDHHmmss');
    // Lấy địa chỉ IP của khách hàng
    let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Thiết lập các tham số thanh toán
    let vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: vnp_TmnCode,
        vnp_Amount: 1000000 * 100, // Số tiền 1.000.000 VND sẽ là 100000000
        // Ví dụ: 1,000,000 VND (nhân với 100)
        vnp_CurrCode: 'VND',
        vnp_TxnRef: txnRef,
        vnp_OrderInfo: 'Thanh toán đơn hàng',
        vnp_Locale: 'vn',
        vnp_ReturnUrl: vnpReturnUrl,
        vnp_IpAddr: ipAddr,
    };

    // Sắp xếp các tham số theo thứ tự tăng dần của key
    let sortedKeys = Object.keys(vnp_Params).sort();
    const sortedParams = {};
    sortedKeys.forEach((key) => {
        sortedParams[key] = vnp_Params[key];
    });

    // Tạo chuỗi query và chuỗi hash để tạo checksum
    let query = querystring.stringify(sortedParams);
    let hashData = sortedKeys.map(key => key + '=' + sortedParams[key]).join('&');

    // Tạo checksum với thuật toán SHA512 (HMAC)
    const hmac = crypto.createHmac('sha512', secretKey);
    let secureHash = hmac.update(Buffer.from(hashData, 'utf-8')).digest('hex');

    // Xây dựng URL chuyển hướng đến cổng VNPay
    let paymentUrl = `${vnpPaymentUrl}?${query}&vnp_SecureHash=${secureHash}`;

    res.redirect(paymentUrl);
});

// Endpoint xử lý phản hồi từ VNPay (Return URL)
router.get('/vnpay_return', (req, res) => {
    // Lấy toàn bộ tham số trả về từ VNPay
    let vnp_Params = { ...req.query };
    let vnp_SecureHash = vnp_Params.vnp_SecureHash;
    // Loại bỏ tham số checksum để tính lại
    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    // Sắp xếp lại các tham số
    let sortedKeys = Object.keys(vnp_Params).sort();
    let sortedParams = {};
    sortedKeys.forEach(key => {
        sortedParams[key] = vnp_Params[key];
    });

    // Tạo chuỗi hash từ các tham số đã sắp xếp
    let hashData = sortedKeys.map(key => key + '=' + sortedParams[key]).join('&');

    // Kiểm tra checksum và trạng thái giao dịch
    const hmac = crypto.createHmac('sha512', secretKey);
    let verifyHash = hmac.update(Buffer.from(hashData, 'utf-8')).digest('hex');

    if (verifyHash === vnp_SecureHash) {
        if (vnp_Params.vnp_ResponseCode === '00') {
            // Giao dịch thành công
            res.send('Giao dịch thành công!');
            // Tại đây bạn có thể cập nhật trạng thái đơn hàng vào CSDL
        } else {
            // Giao dịch thất bại hoặc bị hủy
            res.send('Giao dịch thất bại hoặc bị hủy!');
        }
    } else {
        // Chữ ký không hợp lệ
        res.send('Chữ ký không hợp lệ!');
    }
});

module.exports = router;
