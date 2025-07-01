const userService = require('../services/user.service')
const { StatusCodes } = require('http-status-codes')
const { validationResult } = require('express-validator')

class UserController {
  // Get user profile
  async getProfile(req, res) {
    try {
      const user = await userService.getProfile(req.user._id)
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

  // Update user profile
  async updateProfile(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          errors: errors.array()
        })
      }

      const user = await userService.updateProfile(req.user._id, req.body)
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

  // Change password
  async changePassword(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          errors: errors.array()
        })
      }

      const { currentPassword, newPassword } = req.body
      const result = await userService.changePassword(
        req.user._id,
        currentPassword,
        newPassword
      )
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

  // Delete account
  async deleteAccount(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          errors: errors.array()
        })
      }

      const { password } = req.body
      const result = await userService.deleteAccount(req.user._id, password)
      
      // Clear cookie after account deletion
      res.clearCookie('token')
      
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

module.exports = new UserController() 