const Router = require('express').Router()
const { PathAPI } = require('../constants/paths')
const userControllers = require('../controllers/user.controllers')

const {
  validateSignin,
  validateSignup,
  validateForgotPassword,
  validateResetPassword,
  validateRequest,
} = require('../middlewares/validate.middlewares')

//Swagger documentation

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API cho xác thực người dùng
 */

/**
 * @swagger
 * /user/signin:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *               password:
 *                 type: string
 *                 description: Mật khẩu của người dùng
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       400:
 *         description: Đầu vào không hợp lệ
 *       401:
 *         description: Không được phép
 */

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Tạo người dùng
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 exemple: employee
 *     responses:
 *       201:
 *         description: Người dùng đã được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 12345
 *                 username:
 *                   type: string
 *                   example: johndoe
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *       400:
 *         description: Đầu vào không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email đã tồn tại. Vui lòng sử dụng email khác
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đã xảy ra lỗi khi tạo người dùng
 */

/**
 * @swagger
 * /user/signout:
 *   post:
 *     summary: Đăng xuất người dùng
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *       400:
 *         description: Đầu vào không hợp lệ
 *       401:
 *         description: Không được phép hoặc mã OTP không hợp lệ
 */

/**
 * @swagger
 * /user/forgot-password:
 *   post:
 *     summary: Yêu cầu đặt lại mật khẩu
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *     responses:
 *       200:
 *         description: Email đặt lại mật khẩu đã được gửi
 *       400:
 *         description: Đầu vào không hợp lệ
 */

/**
 * @swagger
 * /user/reset-password:
 *   post:
 *     summary: Đặt lại mật khẩu
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *               otp:
 *                 type: string
 *                 description: Mã OTP đặt lại mật khẩu
 *               newPassword:
 *                 type: string
 *                 description: Mật khẩu mới
 *     responses:
 *       200:
 *         description: Đặt lại mật khẩu thành công
 *       400:
 *         description: Đầu vào không hợp lệ
 *       401:
 *         description: Không được phép hoặc mã OTP không hợp lệ
 */

Router.get(PathAPI.User.Signin, userControllers.renderSignin)
Router.post(
  PathAPI.User.Signin,
  validateSignin,
  validateRequest,
  userControllers.signin,
)

Router.get(PathAPI.User.Signup, userControllers.renderSignup)
Router.post(
  PathAPI.User.Signup,
  validateSignup,
  validateRequest,
  userControllers.signup,
)

Router.post(PathAPI.User.Signout, userControllers.signout)

Router.get(PathAPI.User.ForgotPassword, userControllers.renderForgotPassword)
Router.post(
  PathAPI.User.ForgotPassword,
  validateForgotPassword,
  validateRequest,
  userControllers.forgotPassword,
)

Router.post(
  PathAPI.User.ResetPassword,
  validateResetPassword,
  validateRequest,
  userControllers.resetPassword,
)

module.exports = Router
