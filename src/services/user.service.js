const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { StatusCodes } = require('http-status-codes')
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email.utils')

class UserService {
  // Register new user
  async register(userData) {
    const { email, username, password } = userData

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw {
        status: StatusCodes.CONFLICT,
        message: 'Email already registered'
      }
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')

    // Create new user
    const user = new User({
      email,
      username,
      password,
      verificationToken
    })

    await user.save()

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken)

    return user.getPublicProfile()
  }

  // Login user
  async login(email, password) {
    const user = await User.findOne({ email })
    if (!user) {
      throw {
        status: StatusCodes.UNAUTHORIZED,
        message: 'Invalid credentials'
      }
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      throw {
        status: StatusCodes.UNAUTHORIZED,
        message: 'Invalid credentials'
      }
    }

    if (user.status !== 'active') {
      throw {
        status: StatusCodes.FORBIDDEN,
        message: 'Account is not active'
      }
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return {
      user: user.getPublicProfile(),
      token
    }
  }

  // Verify email
  async verifyEmail(token) {
    const user = await User.findOne({ verificationToken: token })
    if (!user) {
      throw {
        status: StatusCodes.BAD_REQUEST,
        message: 'Invalid verification token'
      }
    }

    user.isVerified = true
    user.verificationToken = undefined
    await user.save()

    return user.getPublicProfile()
  }

  // Request password reset
  async requestPasswordReset(email) {
    const user = await User.findOne({ email })
    if (!user) {
      throw {
        status: StatusCodes.NOT_FOUND,
        message: 'User not found'
      }
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
    await user.save()

    await sendPasswordResetEmail(user.email, resetToken)

    return { message: 'Password reset email sent' }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
      throw {
        status: StatusCodes.BAD_REQUEST,
        message: 'Invalid or expired reset token'
      }
    }

    user.password = newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    return { message: 'Password reset successful' }
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    const allowedUpdates = ['username', 'bio', 'socialLinks', 'avatar']
    const updates = Object.keys(updateData)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key]
        return obj
      }, {})

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    )

    if (!user) {
      throw {
        status: StatusCodes.NOT_FOUND,
        message: 'User not found'
      }
    }

    return user.getPublicProfile()
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId)
    if (!user) {
      throw {
        status: StatusCodes.NOT_FOUND,
        message: 'User not found'
      }
    }

    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      throw {
        status: StatusCodes.UNAUTHORIZED,
        message: 'Current password is incorrect'
      }
    }

    user.password = newPassword
    await user.save()

    return { message: 'Password changed successfully' }
  }

  // Get user profile
  async getProfile(userId) {
    const user = await User.findById(userId)
      .populate('playlists', 'name coverImage')
      .populate('favorites', 'title artist')

    if (!user) {
      throw {
        status: StatusCodes.NOT_FOUND,
        message: 'User not found'
      }
    }

    return user.getPublicProfile()
  }

  // Delete account
  async deleteAccount(userId, password) {
    const user = await User.findById(userId)
    if (!user) {
      throw {
        status: StatusCodes.NOT_FOUND,
        message: 'User not found'
      }
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      throw {
        status: StatusCodes.UNAUTHORIZED,
        message: 'Password is incorrect'
      }
    }

    user.status = 'deleted'
    await user.save()

    return { message: 'Account deleted successfully' }
  }
}

module.exports = new UserService() 