const express = require('express');
const router = express.Router();
const { authMiddleWare,authUserMiddleWare } = require("../middleware/authMiddleware")
const ProductController = require('../controllers/ProductController')
router.post('/create', ProductController.createProduct);
router.put('/update-product/:id', authUserMiddleWare, ProductController.updateProduct);  
router.get('/details-product/:id', ProductController.getDetailsProduct); 
router.delete('/delete-product/:id', ProductController.deleteProduct);  
router.get('/get-all', ProductController.getAllProduct);  

module.exports = router;
