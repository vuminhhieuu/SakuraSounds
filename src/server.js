const express = require('express')
const databaseConnect = require('./config/database.configs')
const serverConfig = require('./config/server.configs')
const mainRouter = require('./routes/index.routes')
const ErrorHandler = require('./middlewares/errorHandler.middleware')

const app = express()

// Server configuration
serverConfig(app)

// Database connection
databaseConnect()

// Router configuration
app.use(mainRouter)

// Error handler
app.use(ErrorHandler)

module.exports = app
