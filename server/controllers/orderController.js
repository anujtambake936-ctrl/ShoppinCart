const Order = require("../models/order")

const getOrders = async (req, res) => {
    try {
        const userId = req.id
        const { page = 1, limit = 10, status } = req.query

        // Validate pagination parameters
        const pageNum = Math.max(1, parseInt(page))
        const limitNum = Math.min(50, Math.max(1, parseInt(limit))) // Max 50 orders per page
        const skip = (pageNum - 1) * limitNum

        // Build query
        const query = { userId }
        if (status && ['pending', 'completed', 'cancelled'].includes(status)) {
            query.status = status
        }

        // Execute query with pagination and optimization
        const [orders, totalCount] = await Promise.all([
            Order.find(query)
                .sort({ orderDate: -1 })
                .skip(skip)
                .limit(limitNum)
                .select("-__v")
                .lean(),
            Order.countDocuments(query)
        ])

        res.status(200).json({
            success: true,
            orders,
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
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getOrderById = async (req, res) => {
    try {
        const userId = req.id
        const orderId = req.params.id

        const order = await Order.findOne({ _id: orderId, userId }).lean()

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            })
        }

        res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const userId = req.id
        const orderId = req.params.id
        const { status } = req.body

        const order = await Order.findOne({ _id: orderId, userId })

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            })
        }

        order.status = status
        await order.save()

        res.status(200).json({
            success: true,
            message: "Order status updated.",
            order
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getOrders,
    getOrderById,
    updateOrderStatus
}

