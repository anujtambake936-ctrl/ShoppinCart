const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    cart: [
        {
            id: String,
            title: String,
            description: String,
            image: String,
            price: Number,
            category: String,
            quantity: { type: Number, default: 1 }
        }
    ]
})

// Indexes for better query performance
userSchema.index({ email: 1 })

const User = mongoose.model('user',userSchema)

module.exports = User