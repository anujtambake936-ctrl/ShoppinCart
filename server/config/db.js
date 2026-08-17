const mongoose = require('mongoose')

const connectDb = async() => {
    try {
        const options = {
            // Connection pooling settings
            maxPoolSize: 10, // Maximum number of connections in the pool
            minPoolSize: 2,  // Minimum number of connections in the pool
            
            // Timeout settings
            serverSelectionTimeoutMS: 5000, // Time to wait for server selection
            socketTimeoutMS: 45000, // Time to wait for socket operations
            
            // Automatic reconnection
            retryWrites: true,
            
            // Use new connection management
            family: 4 // Use IPv4, skip trying IPv6
        }

        await mongoose.connect(process.env.MONGO_URI, options)
        console.log("Database connected successfully.")

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err)
        })

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected. Attempting to reconnect...')
        })

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected successfully.')
        })

    } catch(error) {
        console.error('Failed to connect to database:', error.message)
        // Exit process with failure in production
        process.exit(1)
    }
}

module.exports = connectDb