const swaggerJSDoc = require('swagger-jsdoc')

const swaggerDefinition = {
  openapi: '3.0.0', // Phiên bản OpenAPI
  info: {
    title: 'SakuraSounds API', // Tên dự án
    version: '1.0.0', // Phiên bản của API
    description: 'API documentation for the SakuraSounds music streaming service.', // Mô tả ngắn gọn
    contact: {
      name: 'Your Name',
      email: 'your.email@example.com',
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
}

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/routes/*.js'], // Đường dẫn tới các file chứa chú thích API
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = swaggerSpec
