const express = require('express')
const router = express.Router()
const profileController = require('../controllers/profile.controller')
const { auth } = require('../middlewares/auth.middleware')
const { body } = require('express-validator')

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management
 */

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

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get the current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A user profile object
 *       '401':
 *         description: Unauthorized
 */
router.get('/profile', auth, profileController.getProfile)

/**
 * @swagger
 * /user/profile:
 *   patch:
 *     summary: Update the current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               bio:
 *                 type: string
 *               socialLinks:
 *                 type: object
 *                 properties:
 *                   facebook:
 *                     type: string
 *                     format: uri
 *                   twitter:
 *                     type: string
 *                     format: uri
 *                   instagram:
 *                     type: string
 *                     format: uri
 *     responses:
 *       '200':
 *         description: Profile updated successfully
 *       '401':
 *         description: Unauthorized
 */
router.patch('/profile', auth, updateProfileValidation, profileController.updateProfile)

/**
 * @swagger
 * /user/change-password:
 *   post:
 *     summary: Change the current user's password
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       '200':
 *         description: Password changed successfully
 *       '400':
 *         description: Current password is incorrect
 *       '401':
 *         description: Unauthorized
 */
router.post('/change-password', auth, changePasswordValidation, profileController.changePassword)

/**
 * @swagger
 * /user/account:
 *   delete:
 *     summary: Delete the current user's account
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       '200':
 *         description: Account deleted successfully
 *       '400':
 *         description: Password is incorrect
 *       '401':
 *         description: Unauthorized
 */
router.delete('/account', auth, profileController.deleteAccount)

module.exports = router
