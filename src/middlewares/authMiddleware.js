require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

// Middleware kiểm tra xem người dùng có được xác thực (authentication)
const authentication = async (req, res, next) => {
    let token
    if (req.cookies.token) {
        token = req.cookies.token
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' })
    }
    try {
        // Giải mã token và tìm người dùng
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id).select('-password')
        next()
    } catch (error) {
        res.status(401).json({ message: 'Token is invalid' })
    }
}

// Middleware kiểm tra quyền (authorization)
const authorization = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' })
    }
}

module.exports = { 
  authentication, 
  authorization, 
}
