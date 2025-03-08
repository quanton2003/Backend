const Product = require('../models/ProductModel');
const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const {
            name,
            image,
            type,
            price,
            countInStock,
            rating,
            description
        } = newProduct;

        try {
            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct !== null) {
                resolve({
                    status: "OK",
                    message: ['The name of product is already']
                })
            }
            const newProduct = await Product.create({
                name,
                image,
                type,
                price,
                countInStock,
                rating,
                description
            })
            if (newProduct) {
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

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: "OK",
                    message: 'The Prodcut is not defind'
                })
            }
            const updateProduct = await Product.findByIdAndUpdate(id, data, {
                new: true
            })
            console.log('updateProduct:', updateProduct)
            resolve({
                status: 'OK',
                message: 'Success',
                data: updateProduct
            })


        } catch (e) {
            reject(e);
        }
    });
};;

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
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

const getAllProduct = (limit, page, sort,filter) => {
    console.log('sort', sort);

    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.countDocuments()
            if (filter && Array.isArray(filter) && filter.length === 2) {
                const field = filter[0];  // Lấy tên trường cần filter
                const value = filter[1];  // Lấy giá trị cần filter
            
                const objectFilter = {};
                objectFilter[field] = { '$regex': value, '$options': 'i' }
            
                console.log("objectFilter:", objectFilter);
            
                const allObjectFilter = await Product.find(objectFilter).limit(limit).skip(page * limit);;
            
                return resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allObjectFilter,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                });
            }
            
            if (sort) {
                console.log("okoke");
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                console.log("objectSort",objectSort)
                const allProductSort = await Product.find().limit(limit).skip(page * limit).sort(objectSort)
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allProductSort,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            const allProduct = await Product.find().limit(limit).skip(page * limit)
            resolve({
                status: 'OK',
                message: 'Success',
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit)
            })

        } catch (e) {
            reject(e);
        }
    });
};

const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: id
            })
            if (product === null) {
                resolve({
                    status: "OK",
                    message: 'Thee product is not defind'
                })
            }
            resolve({
                status: 'OK',
                message: 'Sucess',
                data: product
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