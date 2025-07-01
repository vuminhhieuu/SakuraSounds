const express = require('express');
const router = express.Router();
const songController = require('../controllers/song.controller');
const { auth, checkRole } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const ROLES = require('../constants/roles');

// Import other routers
const commentRoutes = require('./comment.routes');

// Import the middleware
const advancedResults = require('../middlewares/advancedResults.middleware');
const Song = require('../models/song.model');

/**
 * @swagger
 * tags:
 *   name: Songs
 *   description: Song management and retrieval
 */

/**
 * @swagger
 * /songs:
 *   get:
 *     summary: Retrieve a list of songs
 *     tags: [Songs]
 *     parameters:
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *         description: 'Fields to select (e.g., "title,artist")'
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: 'Sort by field (e.g., "releaseDate" or "-playCount")'
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 25
 *         description: Results per page
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre
 *       - in: query
 *         name: artist
 *         schema:
 *           type: string
 *         description: Filter by artist ID
 *     responses:
 *       '200':
 *         description: A list of songs
 */
router.get('/', advancedResults(Song, { path: 'artist', select: 'name' }), songController.getSongs);

/**
 * @swagger
 * /songs/{id}:
 *   get:
 *     summary: Get a single song by ID
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The song ID
 *     responses:
 *       '200':
 *         description: A song object
 *       '404':
 *         description: Song not found
 */
router.get('/:id', songController.getSongById);

/**
 * @swagger
 * /songs:
 *   post:
 *     summary: Create a new song with audio and cover image
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, artist, duration, genre, audio, coverImage]
 *             properties:
 *               title:
 *                 type: string
 *               artist:
 *                 type: string
 *                 description: The Artist ID
 *               album:
 *                 type: string
 *                 description: The Album ID
 *               duration:
 *                 type: number
 *               genre:
 *                 type: string
 *               audio:
 *                 type: string
 *                 format: binary
 *                 description: The audio file of the song.
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: The cover image for the song.
 *     responses:
 *       '201':
 *         description: Song created successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden (User is not Admin or Artist)
 */
router.post(
  '/',
  auth,
  checkRole([ROLES.ADMIN, ROLES.ARTIST]),
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  songController.createSong
);

router.put('/:id', auth, songController.updateSong); // Authorization is handled in the controller
router.delete('/:id', auth, songController.deleteSong); // Authorization is handled in the controller

/**
 * @swagger
 * /songs/{id}/like:
 *   post:
 *     summary: Like or unlike a song
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The song ID
 *     responses:
 *       '200':
 *         description: Like status toggled
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Song not found
 */
router.post('/:id/like', auth, songController.likeSong);

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management for songs
 */

// Re-route to other resource routers
router.use('/:songId/comments', commentRoutes);

module.exports = router; 