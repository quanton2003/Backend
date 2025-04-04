const ProductService = require('../services/ProductServices')

const createProduct = async (req, res) => {
    try {
        const { name, image, type, price, countInStock,rating,description } = req.body;
        console.log('req.body',req.body);
        if (!name || !image || !type || !price || !countInStock || !rating  ) {
            return res.status(200).json({
                status: 'ERR',
                message: 'All fields are required'
            });
        }

        const response = await ProductService.createProduct(req.body);
        console.log('response:',response);
        
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        });
    }
};

const updateProduct  = async (req, res) => {
    try {
        const productId = req.params.id
        const data = req.body
        if(!productId){
            return res.status(401).json({
                status: 'ERR',
                message: 'The productId is raaa'
            });
        }
        const response = await ProductService.updateProduct(productId,data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        });
    }
};

const getDetailsProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if(!productId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The userIproductId is req'
            });
        }
        const response = await ProductService.getDetailsProduct(productId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        });
    }
};



const deleteManyProduct = async (req, res) => {
    try {
        const ids = req.body.id
        
        if(!ids){
            return res.status(401).json({
                status: 'ERR',
                message: 'The ids is req'
            });
        }
        const response = await ProductService.deleteManyProduct(ids);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if(!productId){
            return res.status(401).json({
                status: 'ERR',
                message: 'The productId is raaa'
            });
        }
        const response = await ProductService.deleteProduct(productId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        });
    }
};

const getAllProduct = async (req, res) => {
   
    try {
        const {limit ,page ,sort,filter } =req.query
        const response = await ProductService.getAllProduct(limit ||8 ,page || 0,sort,filter);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        });
    }
};

const getAllType = async (req, res) => {
   
    try {
        const response = await ProductService.getAllType();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        });
    }
};
module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllType
}
