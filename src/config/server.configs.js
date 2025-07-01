const path = require('path')
const morgan = require('morgan')
const methodOverride = require('method-override')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const express = require('express')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const EnvVars = require('../constants/envVars')
const NodeEnvs = require('../constants/misc')
const { StatusCodes } = require('http-status-codes')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./swagger.configs')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Giới hạn mỗi IP chỉ được gửi 100 request trong 15 phút
})

// Cors
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: StatusCodes.OK,
  methods: 'GET, POST, PUT, DELETE, OPTIONS',
  allowedHeaders:
    'Content-Type, Authorization, Origin, X-Requested-With, Accept',
  credentials: true,
}

const configServer = app => {
  // View engine
  app.set('views', path.join('./src', 'views'))
  app.set('view engine', 'ejs')

  // Serve static files
  app.use(express.static(path.join('./src', 'public')))

  // override with POST having ?_method=DELETE
  app.use(methodOverride('_method'))

  // request body
  app.use(express.urlencoded({ extended: true })) //form data
  app.use(express.json())

  app.use(cookieParser(EnvVars.CookieProps.Secret)) //cookie parser for cookies that will be sent to the server

  //http logger: Show routes called in console during development
  if (EnvVars.NodeEnv === NodeEnvs.Dev) {
    app.use(morgan('dev'))
  }

  // Security
  if (EnvVars.NodeEnv === NodeEnvs.Prod) {
    app.use(helmet())
  }

  app.use(cors(corsOptions))

  // rate limit middleware
  app.use(limiter)

  // API documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

module.exports = configServer
