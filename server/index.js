require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const compression = require('compression')
const connectDb = require('./config/db')
const authRouter = require('./routes/authRoutes')
const cartRouter = require('./routes/cartRoutes')
const orderRouter = require('./routes/orderRoutes')
const productRouter = require('./routes/productRoutes')

const app = express()
const port = process.env.PORT || 5000

connectDb()

// Compression middleware - should be early in the middleware chain
app.use(compression({
    level: 6, // Compression level (0-9, 6 is default, good balance)
    threshold: 1024, // Only compress responses larger than 1KB
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false
        }
        return compression.filter(req, res)
    }
}))

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

const allowedOrigins = [
    'https://shopping-cart-mern-yo9j.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.ORIGIN
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Stricter rate limiter for auth routes (login, register)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
})

// Moderate rate limiter for checkout
const checkoutLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 checkout requests per windowMs
    message: {
        success: false,
        message: 'Too many checkout attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
})

// Apply rate limiters
app.use('/api/auth', authLimiter, authRouter)
app.use('/api/cart/checkout', checkoutLimiter)
app.use('/api/cart', apiLimiter, cartRouter)
app.use('/api/orders', apiLimiter, orderRouter)
app.use('/api/products', apiLimiter, productRouter)

app.get('/', (req, res) => {
    res.json({ message: 'Shopping Cart API is running.' })
})

// Global error handler
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`)
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error.'
    })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
