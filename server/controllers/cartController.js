const User = require('../models/user')
const Order = require('../models/order')

let stripe
if (!process.env.STRIPE_KEY) {
    console.warn('[WARN] STRIPE_KEY is not set. Stripe checkout will not work.')
} else {
    stripe = require('stripe')(process.env.STRIPE_KEY)
}

const addToCart = async (req, res) => {
    const { id, title, description, image, price, category } = req.body
    const userId = req.id

    try {
        const user = await User.findById(userId).select('cart')
        if (!user) {
            return res.status(401).json({ success: false, message: 'You are not authorized.' })
        }

        const exists = user.cart.find(item => item.id == id)
        if (exists) {
            return res.status(200).json({ success: false, message: 'Already in cart.' })
        }

        user.cart.push({ id, title, description, image, price, category, quantity: 1 })
        await user.save()

        res.status(200).json({ success: true, message: 'Added to cart.' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const removeFromCart = async (req, res) => {
    try {
        const userId = req.id
        const itemId = req.params.id

        const user = await User.findById(userId).select('cart')
        if (!user) {
            return res.status(401).json({ success: false, message: 'You are not authorized.' })
        }

        const index = user.cart.findIndex(item => item.id == itemId)
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Item not found.' })
        }

        user.cart.splice(index, 1)
        await user.save()

        res.status(200).json({ success: true, message: 'Item removed from cart.' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const incrementQuantity = async (req, res) => {
    const userId = req.id
    const itemId = req.params.id

    try {
        const user = await User.findById(userId).select('cart')
        if (!user) {
            return res.status(401).json({ success: false, message: 'You are not authorized.' })
        }

        const index = user.cart.findIndex(item => item.id === itemId)
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Item not found.' })
        }

        user.cart[index].quantity += 1
        await user.save()

        res.status(200).json({ success: true, message: 'Quantity updated.' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const decrementQuantity = async (req, res) => {
    const userId = req.id
    const itemId = req.params.id

    try {
        const user = await User.findById(userId).select('cart')
        if (!user) {
            return res.status(401).json({ success: false, message: 'You are not authorized.' })
        }

        const index = user.cart.findIndex(item => item.id === itemId)
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Item not found.' })
        }

        if (user.cart[index].quantity <= 1) {
            return res.status(400).json({ success: false, message: 'Quantity cannot be less than 1.' })
        }

        user.cart[index].quantity -= 1
        await user.save()

        res.status(200).json({ success: true, message: 'Quantity updated.' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const checkOut = async (req, res) => {
    try {
        if (!process.env.STRIPE_KEY) {
            return res.status(500).json({
                success: false,
                message: 'Stripe API key is not configured. Please add STRIPE_KEY to your .env file.'
            })
        }

        const userId = req.id
        const { items } = req.body
        const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0)
        const origin = process.env.ORIGIN || 'http://localhost:5173'

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: items.map(item => ({
                price_data: {
                    currency: 'inr',
                    product_data: { name: item.title },
                    unit_amount: item.price * 100
                },
                quantity: item.quantity
            })),
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cancel`,
            metadata: { userId: userId.toString() }
        })

        const order = new Order({
            userId,
            items,
            totalAmount,
            stripeSessionId: session.id,
            status: 'pending'
        })
        await order.save()

        res.status(200).json({ success: true, url: session.url, orderId: order._id })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const clearCart = async (req, res) => {
    try {
        const user = await User.findById(req.id).select('cart')
        if (!user) {
            return res.status(401).json({ success: false, message: 'You are not authorized.' })
        }

        user.cart = []
        await user.save()

        res.status(200).json({ success: true, message: 'Cart cleared.' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = {
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    checkOut,
    clearCart
}
