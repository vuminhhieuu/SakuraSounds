const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0', // Phiên bản OpenAPI
    info: {
      title: 'Music Management API', // Tên dự án
      version: '1.0.0', // Phiên bản của API
      description: 'API for sakura sounds website ', // Mô tả ngắn gọn
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
  },
  servers: [
    {
      url: 'http://localhost:8080/api-docs',
      description: 'Local server',
    },
  ],
  apis: ['./src/routes/*.js'], // Đường dẫn tới các file chứa chú thích API
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = swaggerSpec
