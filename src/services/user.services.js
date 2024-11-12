const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const { generateToken } = require('../utils/jwt')
const sendMail = require('../utils/sendMail')
const OTP = require('../utils/otp')
const Messages = require('../constants/messages')
const EnvVars = require('../constants/envVars')
const SALT_ROUNDS = parseInt(EnvVars.Bcrypt.SaltRounds)
const MAX_ATTEMPTS = parseInt(EnvVars.Otp.MaxAttempts)
let otpAttempsCache = new Map()

class userServices {
  // Signin Service
  async signin(email, password) {
    try {
      //Find user
      const user = await User.findOne({ email })
      if (!user) {
        return {
          success: false,
          message: Messages.USERS_MESSAGES.SIGNIN.ACCOUNT_NOT_FOUND,
        }
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return {
          success: false,
          message: Messages.USERS_MESSAGES.SIGNIN.UNAUTHORIZED,
        }
      }

      const token = generateToken(email, user.id)
      return {
        success: true,
        message: Messages.USERS_MESSAGES.SIGNIN.SUCCESS,
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
        },
      }
    } catch (error) {
      throw new Error(`signin service error: ${error}`)
    }
  }

  // Signup Service
  async signup(userData) {
    try {
      const { email, password, ...userInfo } = userData
      const isUserExist = await User.findOne({ email })
      if (isUserExist) {
        return {
          success: false,
          message: Messages.USERS_MESSAGES.SIGNUP.EMAIL_EXISTS,
        }
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
      const user = await User.create({
        email,
        password: hashedPassword,
        ...userInfo,
      })
      return {
        success: true,
        message: Messages.USERS_MESSAGES.SIGNUP.SUCCESS,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      }
    } catch (error) {
      throw new Error(`Create user service error: ${error}`)
    }
  }

  // Forgot Password Service
  async forgotPassword(email) {
    try {
      const user = await User.findOne({ email })
      if (!user) {
        return {
          success: false,
          message: Messages.USERS_MESSAGES.FORGOT_PASSWORD.EMAIL_NOT_FOUND,
        }
      }

      // Generate OTP
      const secret = email
      const customStep = 60 // 1 phút
      const otp = OTP.generateOTP(secret, customStep)

      // Send OTP to mail
      await sendMail({
        to: user.email,
        subject: 'RESET PASSWORD',
        title: 'Reset password',
        message: 'Đây là mail reset mật khẩu',
        otp,
        step: customStep,
      })

      return {
        success: true,
        message: `${Messages.USERS_MESSAGES.FORGOT_PASSWORD.SUCCESS} ${user.email}`,
      }
    } catch (error) {
      throw new Error(`Forgot password service error: ${error}`)
    }
  }

  // Resets password service
  async resetPassword(email, otp, newPassword) {
    try {
      // Kiểm tra OTP
      const { isValid, isOtpExpired } = await OTP.verifyOTP(email, otp)
      // Lấy số lần nhập sai hiện tại từ cache
      const attempts = otpAttempsCache.get(email) || 0

      if (!isValid) {
        if (isOtpExpired) {
          otpAttempsCache.set(email, 0)
          return {
            success: false,
            message: Messages.USERS_MESSAGES.OTP.EXPIRED,
          }
        }

        // Kiểm tra số lần nhập sai hiện tại
        if (attempts >= MAX_ATTEMPTS) {
          otpAttempsCache.set(email, 0) // Reset số lần nhập sai
          return {
            success: false,
            message: Messages.USERS_MESSAGES.OTP.TOO_MANY_ATTEMPTS,
          }
        }

        otpAttempsCache.set(email, attempts + 1) // Tăng số lần nhập sai
        const attemptsLeft = MAX_ATTEMPTS - otpAttempsCache.get(email)
        return {
          success: false,
          message: `OTP không đúng. Bạn còn ${attemptsLeft} lần thử.`,
        }
      }

      // Cập nhật password
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)
      await User.updateOne({ email }, { password: hashedPassword })

      return {
        success: true,
        message: Messages.USERS_MESSAGES.RESET_PASSWORD.SUCCESS,
      }
    } catch (error) {
      throw new Error(`Reset password service error: ${error}`)
    }
  }
}

module.exports = new userServices()
