const express = require('express')
const userController = require('../controllers/userController')
const authMiddlware = require('../middlewares/authMiddleware')

const router = express.Router()



// Route cho đăng ký
router.post('/register', userController.register)

// Route cho đăng nhập
router.post('/login', userController.login)

// Route cho quên mật khẩu
router.post('/forgot-password', userController.forgotPassword)

// Route cho đặt lại mật khẩu
router.post('/reset-password/:token', userController.resetPassword)


module.exports = router
