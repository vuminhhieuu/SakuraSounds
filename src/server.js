const express = require('express')
const databaseConnect = require('./config/database.configs')
const serverConfig = require('./config/server.configs')
const routerConfig = require('./routes/index.routes')
const ErrorHandler = require('./middlewares/errorHandler.middlewares')

const app = express()

// Server configuration
serverConfig(app)

// Database connection
databaseConnect()

// Router configuration
routerConfig(app)

// Error handler
app.use(ErrorHandler)

module.exports = app
