const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams allows us to get params from parent router (e.g., :songId)
const commentController = require('../controllers/comment.controller');
const { auth } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /songs/{songId}/comments:
 *   get:
 *     summary: Get all comments for a song
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the song
 *     responses:
 *       '200':
 *         description: A list of comments for the song
 *
 *   post:
 *     summary: Add a new comment to a song
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the song to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *               parentComment:
 *                 type: string
 *                 description: The ID of the parent comment if this is a reply
 *     responses:
 *       '201':
 *         description: Comment created successfully
 *       '401':
 *         description: Unauthorized
 */
router.route('/')
  .get(commentController.getCommentsForSong)
  .post(auth, commentController.addCommentToSong);

/**
 * @swagger
 * /comments/{commentId}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Comment updated successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden (Not the owner)
 *       '404':
 *         description: Comment not found
 *
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to delete
 *     responses:
 *       '200':
 *         description: Comment deleted successfully (soft delete)
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden (Not the owner or an admin)
 *       '404':
 *         description: Comment not found
 */
router.route('/:commentId')
  .put(auth, commentController.updateComment)
  .delete(auth, commentController.deleteComment);

/**
 * @swagger
 * /comments/{commentId}/like:
 *   post:
 *     summary: Like or unlike a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment
 *     responses:
 *       '200':
 *         description: Like status toggled
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Comment not found
 */
router.route('/:commentId/like')
  .post(auth, commentController.likeComment);

module.exports = router; 