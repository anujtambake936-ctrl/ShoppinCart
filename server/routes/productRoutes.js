const express = require('express')
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories
} = require('../controllers/productController')
const verifyAdmin = require('../middlewares/verifyAdmin')

const productRouter = express.Router()

// Public routes
productRouter.get('/', getAllProducts)
productRouter.get('/categories', getCategories)
productRouter.get('/:id', getProductById)

// Admin-only routes
productRouter.post('/', verifyAdmin, createProduct)
productRouter.put('/:id', verifyAdmin, updateProduct)
productRouter.delete('/:id', verifyAdmin, deleteProduct)

module.exports = productRouter
