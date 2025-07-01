const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album.controller');
const { auth, checkRole } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const ROLES = require('../constants/roles');

// Import the middleware
const advancedResults = require('../middlewares/advancedResults.middleware');
const Album = require('../models/album.model');

/**
 * @swagger
 * tags:
 *   name: Albums
 *   description: Album management and retrieval
 */

/**
 * @swagger
 * /albums:
 *   get:
 *     summary: Retrieve a list of albums
 *     tags: [Albums]
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
 *         description: 'Sort by field (e.g., "releaseDate" or "-createdAt")'
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
 *     responses:
 *       '200':
 *         description: A list of albums
 */
router.get('/', advancedResults(Album, { path: 'artist', select: 'name' }), albumController.getAlbums);

/**
 * @swagger
 * /albums/{id}:
 *   get:
 *     summary: Get a single album by ID
 *     tags: [Albums]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The album ID
 *     responses:
 *       '200':
 *         description: An album object
 *       '404':
 *         description: Album not found
 */
router.get('/:id', albumController.getAlbumById);

/**
 * @swagger
 * /albums:
 *   post:
 *     summary: Create a new album
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, artist, releaseDate, coverImage]
 *             properties:
 *               title:
 *                 type: string
 *               artist:
 *                 type: string
 *                 description: The Artist ID
 *               releaseDate:
 *                 type: string
 *                 format: date
 *               genre:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: The cover image for the album.
 *     responses:
 *       '201':
 *         description: Album created successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden (User is not Admin or Artist)
 */
router.post(
  '/',
  auth,
  checkRole([ROLES.ADMIN, ROLES.ARTIST]),
  upload.single('coverImage'),
  albumController.createAlbum
);

/**
 * @swagger
 * /albums/{id}:
 *   put:
 *     summary: Update an album
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The album ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *                 format: date
 *               genre:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: A new cover image for the album.
 *     responses:
 *       '200':
 *         description: Album updated successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Album not found
 */
router.put(
  '/:id',
  auth,
  checkRole([ROLES.ADMIN, ROLES.ARTIST]),
  upload.single('coverImage'),
  albumController.updateAlbum
);

/**
 * @swagger
 * /albums/{id}:
 *   delete:
 *     summary: Delete an album
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The album ID
 *     responses:
 *       '200':
 *         description: Album deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Album not found
 */
router.delete('/:id', auth, checkRole([ROLES.ADMIN, ROLES.ARTIST]), albumController.deleteAlbum);

/**
 * @swagger
 * /albums/{id}/like:
 *   post:
 *     summary: Like or unlike an album
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The album ID
 *     responses:
 *       '200':
 *         description: Like status toggled
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Album not found
 */
router.post('/:id/like', auth, albumController.likeAlbum);

module.exports = router; 