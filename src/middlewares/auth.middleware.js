const jwt = require('jsonwebtoken')
const { EnvVars } = require('../constants/envVars')
const User = require('../models/user.model')
const { StatusCodes } = require('http-status-codes')

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' })
    }

    // Verify token
    const decoded = jwt.verify(token, EnvVars.Jwt.Secret)

    // Find user
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    // Add user to request
    req.user = user
    req.token = token
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' })
  }
}

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Access denied'
      })
    }
    next()
  }
}

module.exports = {
  auth,
  checkRole
} 