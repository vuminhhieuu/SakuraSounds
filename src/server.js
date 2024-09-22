require('dotenv').config()
const express = require('express')
const configServer = require('./config/server')
const configViewEngine = require('./config/viewEngine')
const router = require('./routes/index')
const database = require('./config/database')
const app = express()

// Define PORT for server to listen on
const PORT = process.env.PORT || 3000

// Connect to MongoDB database and configure the server and view engine
database.connect()

// Inittial routes and configure the server and view engine
configServer(app)
configViewEngine(app)
router(app)


// Start the server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))