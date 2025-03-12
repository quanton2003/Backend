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
        if (user?.isAdmin) {
            next()
        }else{
            return res.status(404).json({
                message: 'The authemtication1',
                status: 'ERROR'
                
            });
        }

    });
};

const authUserMiddleWare = (req, res, next) => {
    console.log('req',req.headers)
    const authHeader = req.headers.authorization || req.headers.token;
    if (!authHeader) {
        return res.status(401).json({ message: 'Token is missing', status: 'ERROR' });
    }

    const token = authHeader.split(' ')[1]; // Lấy token đúng vị trí
    if (!token) {
        return res.status(401).json({ message: 'Invalid token format', status: 'ERROR' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token', status: 'ERROR' });
        }

     
        if (user?.isAdmin || user?.id === req.params.id) {
            next();
        } else {
            return res.status(403).json({ message: 'Authentication failed', status: 'ERROR' });
        }
    });
};



module.exports ={
    authMiddleWare,
    authUserMiddleWare
};
