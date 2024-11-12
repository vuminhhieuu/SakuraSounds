const jwt = require('jsonwebtoken')
const EnvVars = require('../constants/envVars')
const JWT_SECRET = EnvVars.Jwt.Secret

const generateToken = (email, userId) => {
  return jwt.sign({ email, userId }, JWT_SECRET, { expiresIn: '1h' })
}

const verifyToken = token => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error(`Failed to verify token: ${error}`)
  }
}

module.exports = {
  generateToken,
  verifyToken,
}
