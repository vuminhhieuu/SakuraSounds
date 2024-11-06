const Messages = require('../constants/messages')
const { StatusCodes } = require('http-status-codes')
const errorHandler = (err, req, res) => {
  console.error(err) // Log lỗi cho server
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR // Mặc định 500 nếu không có statusCode
  const message = err.message || Messages.SERVERS_MESSAGES.INTERNAL_SERVER_ERROR
  res.status(statusCode).json({ message })
}

module.exports = errorHandler
