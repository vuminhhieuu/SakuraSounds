const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const { auth } = require('../middlewares/auth.middleware')
const { body } = require('express-validator')

// Validation middleware
const updateProfileValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters'),
  body('socialLinks.facebook')
    .optional()
    .isURL()
    .withMessage('Invalid Facebook URL'),
  body('socialLinks.twitter')
    .optional()
    .isURL()
    .withMessage('Invalid Twitter URL'),
  body('socialLinks.instagram')
    .optional()
    .isURL()
    .withMessage('Invalid Instagram URL'),
]

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
]

// Protected routes (Profile routes)
router.get('/profile', auth, userController.getProfile)
router.patch('/profile', auth, updateProfileValidation, userController.updateProfile)
router.post('/change-password', auth, changePasswordValidation, userController.changePassword)
router.delete('/account', auth, userController.deleteAccount)

module.exports = router
