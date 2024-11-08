const userServices = require('../services/user.services')
const EnvVars = require('../constants/envVars')
const { StatusCodes } = require('http-status-codes')
const Messages = require('../constants/messages')
const Cookie = EnvVars.CookieProps
const { PathUI } = require('../constants/paths')

class UserControllers {
  // [GET] /user/signin
  async renderSignin(req, res, next) {
    try {
      res.status(StatusCodes.OK).render(PathUI.SigninPage)
    } catch (error) {
      next(error)
    }
  }

  // [POST] /user/signin
  async signin(req, res, next) {
    try {
      const { email, password } = req.body
      const response = await userServices.signin(email, password)

      if (!response.success) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .render(PathUI.SigninPage, { error: response.message })
      }

      res.cookie('access_token', response.access_token, Cookie.Options)
      res.status(StatusCodes.OK).render(PathUI.HomePage, { user: true }) // chuyển đến trang chính sau khi đăng nhập thành công
    } catch (error) {
      next(error)
    }
  }

  // [GET] /user/signup
  async renderSignup(req, res, next) {
    try {
      res.render(PathUI.SignupPage)
    } catch (error) {
      next(error)
    }
  }

  // [POST] /user/signup
  async signup(req, res, next) {
    try {
      const response = await userServices.signup(req.body)
      if (!response.success)
        return res
          .status(StatusCodes.BAD_REQUEST)
          .render(PathUI.SignupPage, { error: response.message })
      res
        .status(StatusCodes.CREATED)
        .render(PathUI.SigninPage, {
          message: Messages.USERS_MESSAGES.SIGNUP.SUCCESS,
        })
    } catch (error) {
      next(error)
    }
  }

  // [POST] /user/signout
  async signout(req, res, next) {
    try {
      res.clearCookie('access_token', Cookie.Options)
      res
        .status(StatusCodes.OK)
        .render(PathUI.HomePage, {
          user: false,
          message: Messages.USERS_MESSAGES.SIGNOUT.SUCCESS,
        })
    } catch (error) {
      next(error)
    }
  }

  // [GET] /user/reset-password
  async renderForgotPassword(req, res, next) {
    try {
      res.status(StatusCodes.OK).render(PathUI.ForgotPasswordPage)
    } catch (error) {
      next(error)
    }
  }
  // [POST] /user/forgot-password
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body
      const response = await userServices.forgotPassword(email)
      if (!response.success)
        return res
          .status(StatusCodes.BAD_REQUEST)
          .render(PathUI.ForgotPasswordPage, { error: response.message })
      res
        .status(StatusCodes.OK)
        .render(PathUI.ForgotPasswordPage, { email, otp: response.otp })
    } catch (error) {
      next(error)
    }
  }

  // [POST] /user/reset-password
  async resetPassword(req, res, next) {
    try {
      const { email, otp, newPassword } = req.body
      const response = await userServices.resetPassword(email, otp, newPassword)
      if (!response.success)
        return res
          .status(StatusCodes.BAD_REQUEST)
          .render(PathUI.ForgotPasswordPage, { error: response.message })
      res
        .status(StatusCodes.OK)
        .render(PathUI.SigninPage, { message: response.message })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new UserControllers()
