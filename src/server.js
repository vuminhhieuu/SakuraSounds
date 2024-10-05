require('dotenv').config()
const configServer = require('./config/serverConfig')
const database = require('./config/dbConfig')
const configViewEngine = require('./config/viewEngineConfig')
const router = require('./routes/indexRoute')

const express = require('express')
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