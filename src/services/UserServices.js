const User = require('../models/UserModel');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { genneralAccessToken, genneralRefreshToken } = require('./jwtServices');
const createUser = (newUser) => {  
    return new Promise( async(resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser;
        try {
            const checkUser =  await User.findOne({
             email: email
            })
        if(checkUser !== null){
            resolve({
                status: "ERR",
                message: ['The email is already']
            })
        }
        const hast = bcrypt.hashSync(password, 10)
        console.log('hast',hast)
            const createUser = await User.create({
                name,
                 email, 
                 password: hast, 
                //  confirmPassword:hast,
                  phone  
            })
            if(createUser){
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: createUser
                })
      
            }
        
        } catch (e) {
            reject(e);
        }
    });
};


const loginUser = async (userLogin) => {
    try {
        const { email, password } = userLogin;

        // Kiểm tra user có tồn tại không
        const checkUser = await User.findOne({ email });

        if (!checkUser) {
            return {
                status: "ERR",
                message: "The user is not defined"
            };
        }

        // Kiểm tra mật khẩu
        const comparePassword = await bcrypt.compare(password, checkUser.password);

        if (!comparePassword) {
            return {
                status: "ERR",
                message: "The password or user is incorrect"
            };
        }

        // Tạo token nếu đăng nhập thành công
        const access_token = await genneralAccessToken({
            id: checkUser.id,
            isAdmin: checkUser.isAdmin
        });
        const refresh_token = await genneralRefreshToken({
            id: checkUser.id,
            isAdmin: checkUser.isAdmin
        });

        return {
            status: "OK",
            message: "Success",
            access_token,
            refresh_token
        };
    } catch (e) {
        console.error("Login error:", e);
        return {
            status: "ERR",
            message: "Internal server error",
            error: e.message
        };
    }
};



const updateUser = (id,data) => {  
    return new Promise( async(resolve, reject) => {
        try {
            const checkUser =  await User.findOne({
                _id:id
            })
        if(checkUser === null){
            resolve({
                status: "OK",
                message: 'Thee user is not defind'
            })
        }
            const  updateUser = await User.findByIdAndUpdate(id,data,{new:true})
            console.log('updateUser:',updateUser)
                resolve({
                    status: 'OK',
                    message: 'Success Update User',
                    data:updateUser
                })
      
        
        } catch (e) {
            reject(e);
        }
    });
};

const deleteUser = (id) => {  
    return new Promise( async(resolve, reject) => {
        try {
            const checkUser =  await User.findOne({
                _id:id
            })
        if(checkUser === null){
            resolve({
                status: "ERR",
                message: 'Thee user is not defind'
            })
        }
            await User.findByIdAndDelete(id)
                resolve({
                    status: 'OK',
                    message: 'Delete User Success',
                })
        
        } catch (e) {
            reject(e);
        }
    });
};
const deleteManyUser = (ids) => {  
    return new Promise( async(resolve, reject) => {
        try {
            await User.deleteMany({_id: ids})
                resolve({
                    status: 'OK',
                    message: 'Delete User Success',
                })
        
        } catch (e) {
            reject(e);
        }
    });
};

const getAllUser = () => {  
    return new Promise( async(resolve, reject) => {
        try {
          const allUser =   await User.find()
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allUser
                })
        
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailsUser = (id) => {  
    return new Promise( async(resolve, reject) => {
        try {
            const user =  await User.findOne({
                _id:id
            })
            console.log('use1r',user)
        if(user === null){
            resolve({
                status: "OK",
                message: 'Thee user is not defind'
            })
        }
                resolve({
                    status: 'OK',
                    message: 'Sucess',
                    data:user
                })
        
        } catch (e) {
            reject(e);
        }
    });
}


module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser
};
