// This file will contain all authentication-related logic (register, login, logout, etc.)
// We will move the logic from user.controller.js here.

const userService = require('../services/user.service')
const { StatusCodes } = require('http-status-codes')
const { validationResult } = require('express-validator')

class AuthController {
  // Register new user
  async register(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          errors: errors.array()
        })
      }

      const user = await userService.register(req.body)
      res.status(StatusCodes.CREATED).json({
        success: true,
        data: user
      })
    } catch (error) {
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      })
    }
  }

  // Login user
  async login(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          errors: errors.array()
        })
      }

      const { email, password } = req.body
      const result = await userService.login(email, password)

      // Set token in cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })

      res.status(StatusCodes.OK).json({
        success: true,
        data: result.user
      })
    } catch (error) {
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      })
    }
  }

  // Logout user
  async logout(req, res) {
    res.clearCookie('token')
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Logged out successfully'
    })
  }

  // Verify email
  async verifyEmail(req, res) {
    try {
      const { token } = req.params
      const user = await userService.verifyEmail(token)
      res.status(StatusCodes.OK).json({
        success: true,
        data: user
      })
    } catch (error) {
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      })
    }
  }

  // Request password reset
  async requestPasswordReset(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          errors: errors.array()
        })
      }

      const { email } = req.body
      const result = await userService.requestPasswordReset(email)
      res.status(StatusCodes.OK).json({
        success: true,
        message: result.message
      })
    } catch (error) {
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      })
    }
  }

  // Reset password
  async resetPassword(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          errors: errors.array()
        })
      }

      const { token } = req.params
      const { newPassword } = req.body
      const result = await userService.resetPassword(token, newPassword)
      res.status(StatusCodes.OK).json({
        success: true,
        message: result.message
      })
    } catch (error) {
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      })
    }
  }
}

module.exports = new AuthController() 