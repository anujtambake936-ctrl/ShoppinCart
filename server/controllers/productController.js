const Product = require('../models/product')

const getAllProducts = async (req, res) => {
    try {
        const { category, page = 1, limit = 20 } = req.query
        
        // Validate pagination parameters
        const pageNum = Math.max(1, parseInt(page))
        const limitNum = Math.min(100, Math.max(1, parseInt(limit))) // Max 100 items per page
        const skip = (pageNum - 1) * limitNum
        
        // Build query
        const query = category && category !== 'All' ? { category } : {}
        
        // Execute query with pagination and optimization
        const [products, totalCount] = await Promise.all([
            Product.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .select('title price category thumbnail stock rating brand')
                .lean(),
            Product.countDocuments(query)
        ])
        
        res.status(200).json({ 
            success: true, 
            products,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalCount / limitNum),
                totalItems: totalCount,
                itemsPerPage: limitNum,
                hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
                hasPrevPage: pageNum > 1
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean()
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' })
        }
        res.status(200).json({ success: true, product })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const createProduct = async (req, res) => {
    try {
        const { title, description, price, category, thumbnail, images, stock, rating, brand } = req.body

        if (!title || !description || !price || !category || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: 'Title, description, price, category, and thumbnail are required.'
            })
        }

        const product = new Product({
            title,
            description,
            price,
            category,
            thumbnail,
            images: images || [],
            stock: stock || 0,
            rating: rating || 0,
            brand: brand || ''
        })

        await product.save()
        res.status(201).json({ success: true, message: 'Product created successfully.', product })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' })
        }
        res.status(200).json({ success: true, message: 'Product updated successfully.', product })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' })
        }
        res.status(200).json({ success: true, message: 'Product deleted successfully.' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category')
        res.status(200).json({ success: true, categories })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories
}
