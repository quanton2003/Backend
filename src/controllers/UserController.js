const UserService = require('../services/UserServices');

const createUser = async (req, res) => {
    try {
        console.log("Received request body:", req.body);
        const { name, email, password, confirmPassword, phone } = req.body;

        // Định nghĩa regex kiểm tra email hợp lệ
        const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isCheckEmail = reg.test(email);

        // Kiểm tra các input đầu vào
        if (!name || !email || !password || !confirmPassword || !phone) {
            return res.status(200).json({
                status: 'ERR',
                message: 'All fields are required'
            });
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Invalid email format'
            });
        } else if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Passwords do not match'
            });
        }

        console.log("Email validation passed:", isCheckEmail);

        // Kiểm tra nếu UserService.createUser() có lỗi
        console.log("Calling UserService.createUser...");
        const response = await UserService.createUser(req.body);
        console.log("UserService.createUser response:", response);

        return res.status(200).json(response);
    } catch (e) {
        console.error("Error in createUser:", e);  // In lỗi ra console để debug
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body;

        // Định nghĩa regex kiểm tra email hợp lệ
        const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isCheckEmail = reg.test(email);

        // Kiểm tra các input đầu vào
        if (!name || !email || !password || !confirmPassword || !phone) {
            return res.status(200).json({
                status: 'ERR',
                message: 'All fields are required'
            });
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Invalid email format'
            });
        } else if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Passwords do not match'
            });
        }

        const response = await UserService.loginUser(req.body);
   
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        });
    }
};

module.exports = {
    createUser,
    loginUser
};
