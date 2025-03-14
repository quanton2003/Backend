const UserService = require('../services/UserServices');
const jwtServices = require('../services/jwtServices');

const createUser = async (req, res) => {
    try {
        console.log("Received request body:", req.body);
        const { name, email, password, confirmPassword, phone } = req.body;

        // Định nghĩa regex kiểm tra email hợp lệ
        const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isCheckEmail = reg.test(email);

        // Kiểm tra các input đầu vào
        if (!email || !password ) {
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
        const { email, password } = req.body;

        const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isCheckEmail = reg.test(email);

        if (!email || !password) {
            return res.status(400).json({  // 🔥 Đổi từ 200 → 400 (Lỗi hợp lý)
                status: 'ERR',
                message: 'All fields are required'
            });
        } else if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Invalid email format'
            });
        }

        const response = await UserService.loginUser(req.body);
        const { refresh_token, ...newResponse } = response;

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,   // ✅ Để `false` trên localhost, lên server thì `true`
            sameSite: 'lax', // ✅ Giúp cookie hoạt động đúng giữa frontend/backend
            path: '/'
        });

        return res.status(200).json(newResponse);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if(!userId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is raaa'
            });
        }
        
        const response = await UserService.updateUser(userId,data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        const token = req.headers
        console.log('token',token)
        if(!userId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is raaa'
            });
        }
        const response = await UserService.deleteUser(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        });
    }
};

const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        });
    }
};
const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        if(!userId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is raaa'
            });
        }
        const response = await UserService.getDetailsUser(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        });
    }
};

const refreshToken = async (req, res) => {
    console.log('🔍 Tất cả cookies nhận được:', req.cookies); // Kiểm tra cookies

    try {
        const token = req.cookies.refresh_token;
        if (!token) {
            return res.status(401).json({  // 🔥 Đổi từ 400 → 401 (Unauthorized)
                status: 'ERR',
                message: 'The token is required'
            });
        }

        const response = await jwtServices.refreshTokenJwtService(token);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        });
    }
};
const logOutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: false, // Nếu dùng HTTPS, đổi thành true
            sameSite: 'strict',
            path: '/', // Đảm bảo xóa trên toàn bộ domain
        });

        return res.status(200).json({
            status: 'OK',
            message: 'Logout successfully'
        });
    } catch (e) {
        console.error("Logout Error:", e);
        return res.status(500).json({
            status: 'ERR',
            message: e.message || "Internal Server Error"
        });
    }
};




module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logOutUser
};
