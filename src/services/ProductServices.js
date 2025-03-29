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
                    status: "ERR",
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
                    status: "ERR",
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

const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Product.deleteMany({_id: ids})
            resolve({
                status: 'OK',
                message: 'Delete Product Success',
            })

        } catch (e) {
            reject(e);
        }
    });
};

const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.countDocuments();

            const skip = Math.max(0, (page - 1) * limit); // Đảm bảo skip không bị âm

            if (filter && Array.isArray(filter) && filter.length === 2) {
                const objectFilter = { [filter[0]]: { '$regex': filter[1], '$options': 'i' } };
                const allObjectFilter = await Product.find(objectFilter)
                    .limit(limit)
                    .skip(skip);
                return resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allObjectFilter,
                    total: totalProduct,
                    pageCurrent: Number(page),
                    totalPage: Math.ceil(totalProduct / limit)
                });
            }

            if (filter && typeof filter === 'string' && filter.trim().length > 0) {
                const objectFilter = { name: { '$regex': filter, '$options': 'i' } };
                const allObjectFilter = await Product.find(objectFilter)
                    .limit(limit)
                    .skip(skip);
                return resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allObjectFilter,
                    total: totalProduct,
                    pageCurrent: Number(page),
                    totalPage: Math.ceil(totalProduct / limit)
                });
            }

            if (sort) {
                const objectSort = { [sort[1]]: sort[0] };
                const allProductSort = await Product.find()
                    .limit(limit)
                    .skip(skip)
                    .sort(objectSort);
                return resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allProductSort,
                    total: totalProduct,
                    pageCurrent: Number(page),
                    totalPage: Math.ceil(totalProduct / limit)
                });
            }

            const allProduct = await Product.find()
                .limit(limit)
                .skip(skip);
            resolve({
                status: 'OK',
                message: 'Success',
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page),
                totalPage: Math.ceil(totalProduct / limit)
            });
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

const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.countDocuments();
            const allType = await Product.distinct('type')
            resolve({
                status: 'OK',
                message: 'Success',
                data: allType,
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllType
};