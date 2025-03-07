const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleWare = (req, res, next) => {

    const token = req.headers.token?.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(404).json({
                message: 'Invalid or expired token',
                status: 'ERROR'
            });
        }
        const {payload} = user
        if (payload?.isAdmin) {
            next()
        }else{
            return res.status(404).json({
                message: 'The authemtication1',
                status: 'ERROR'
                
            });
        }

    });
};

module.exports ={
    authMiddleWare
};
