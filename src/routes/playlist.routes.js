const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlist.controller');
const { auth } = require('../middlewares/auth.middleware');

// Import the middleware
const advancedResults = require('../middlewares/advancedResults.middleware');
const Playlist = require('../models/playlist.model');

/**
 * @swagger
 * tags:
 *   name: Playlists
 *   description: User playlist management
 */

/**
 * @swagger
 * /playlists:
 *   get:
 *     summary: Get all playlists for the current user
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of the user's playlists
 *   post:
 *     summary: Create a new playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       '201':
 *         description: Playlist created successfully
 */
router.route('/')
  .get(auth, playlistController.getMyPlaylists)
  .post(auth, playlistController.createPlaylist);

/**
 * @swagger
 * /playlists/public:
 *   get:
 *     summary: Get all public playlists
 *     tags: [Playlists]
 *     parameters:
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: A list of public playlists
 */
router.get('/public', advancedResults(Playlist, { path: 'owner', select: 'username' }), playlistController.getPublicPlaylists);

/**
 * @swagger
 * /playlists/{id}:
 *   get:
 *     summary: Get a specific playlist by ID
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A playlist object
 *       '403':
 *         description: Forbidden (if playlist is private and user is not owner)
 *       '404':
 *         description: Playlist not found
 *   put:
 *     summary: Update a playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       '200':
 *         description: Playlist updated
 *       '403':
 *         description: Forbidden (not owner)
 *   delete:
 *     summary: Delete a playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Playlist deleted
 *       '403':
 *         description: Forbidden (not owner)
 */
router.route('/:id')
  .get(playlistController.getPlaylistById)
  .put(auth, playlistController.updatePlaylist)
  .delete(auth, playlistController.deletePlaylist);

/**
 * @swagger
 * /playlists/{id}/follow:
 *   post:
 *     summary: Follow or unfollow a playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Follow status toggled
 *       '404':
 *         description: Playlist not found
 */
router.post('/:id/follow', auth, playlistController.followPlaylist);

/**
 * @swagger
 * /playlists/{id}/songs:
 *   post:
 *     summary: Add a song to a playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [songId]
 *             properties:
 *               songId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Song added to playlist
 *       '403':
 *         description: Forbidden (not owner)
 *
 * /playlists/{id}/songs/{songId}:
 *   delete:
 *     summary: Remove a song from a playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Song removed from playlist
 *       '403':
 *         description: Forbidden (not owner)
 */
router.post('/:id/songs', auth, playlistController.addSongToPlaylist);
router.delete('/:id/songs/:songId', auth, playlistController.removeSongFromPlaylist);

module.exports = router; 