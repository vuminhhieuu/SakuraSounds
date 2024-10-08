const path = require('path')
const morgan = require('morgan')
const methodOverride = require('method-override')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const express = require('express')

const configServer = (app) => {
    // Serve static files
    app.use(express.static(path.join('./src', 'public')))

    // override with POST having ?_method=DELETE
    app.use(methodOverride('_method'))

    // http logger
    app.use(morgan('combined'))

    // request body
    app.use(express.urlencoded({ extended: true })) //form data
    app.use(express.json())

    // cors middleware
    app.use(cors())

    // session middleware
    app.use(cookieParser())
}

module.exports = configServer
