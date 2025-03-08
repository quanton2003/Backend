const Product = require('../models/ProductModel');
const createProduct = (newProduct) => {  
    return new Promise( async(resolve, reject) => {
        const { name, image, type, price, countInStock,rating,description } = newProduct;

        try {
            const checkProduct =  await Product.findOne({
                name: name
            })
        if(checkProduct !== null){
            resolve({
                status: "OK",
                message: ['The name of product is already']
            })
        }
            const newProduct = await Product.create({
                name, image, type, price, countInStock,rating,description
            })
            if(newProduct){
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: newProduct
                })
      
            }
        
        } catch (e) {
            reject(e);
        }
    });
};

const updateProduct = (id,data) => {  
    return new Promise( async(resolve, reject) => {
        try {
            const checkProduct =  await Product.findOne({
                _id:id
            })
        if(checkProduct === null){
            resolve({
                status: "OK",
                message: 'The Prodcut is not defind'
            })
        }
            const  updateProduct = await Product.findByIdAndUpdate(id,data,{new:true})
            console.log('updateProduct:',updateProduct)
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data:updateProduct
                })
      
        
        } catch (e) {
            reject(e);
        }
    });
};;

const deleteProduct = (id) => {  
    return new Promise( async(resolve, reject) => {
        try {
            const checkProduct =  await Product.findOne({
                _id:id
            })
        if(checkProduct === null){
            resolve({
                status: "OK",
                message: 'Thee Product is not defind'
            })
        }
            await Product.findByIdAndDelete(id)
                resolve({
                    status: 'OK',
                    message: 'Delete Product Success',
                })
        
        } catch (e) {
            reject(e);
        }
    });
};

const getAllProduct = () => {  
    return new Promise( async(resolve, reject) => {
        try {
          const allProduct =   await Product.find()
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allProduct
                })
        
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailsProduct = (id) => {  
    return new Promise( async(resolve, reject) => {
        try {
            const product =  await Product.findOne({
                _id:id
            })
        if(product === null){
            resolve({
                status: "OK",
                message: 'Thee product is not defind'
            })
        }
                resolve({
                    status: 'OK',
                    message: 'Sucess',
                    data:product
                })
        
        } catch (e) {
            reject(e);
        }
    });
}


module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct
};
