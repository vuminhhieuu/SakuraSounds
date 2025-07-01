const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artist.controller');
const { auth, checkRole } = require('../middlewares/auth.middleware');
const ROLES = require('../constants/roles');

// Import the middleware
const advancedResults = require('../middlewares/advancedResults.middleware');
const Artist = require('../models/artist.model');

/**
 * @swagger
 * tags:
 *   name: Artists
 *   description: Artist management and retrieval
 */

/**
 * @swagger
 * /artists:
 *   get:
 *     summary: Retrieve a list of artists
 *     tags: [Artists]
 *     parameters:
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *         description: 'Fields to select (e.g., "name,bio")'
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: 'Sort by field (e.g., "name" or "-monthlyListeners")'
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
 *         description: A list of artists
 */
router.get('/', advancedResults(Artist), artistController.getArtists);

/**
 * @swagger
 * /artists/{id}:
 *   get:
 *     summary: Get a single artist by ID
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The artist ID
 *     responses:
 *       '200':
 *         description: An artist object
 *       '404':
 *         description: Artist not found
 */
router.get('/:id', artistController.getArtistById);

/**
 * @swagger
 * /artists:
 *   post:
 *     summary: Create a new artist
 *     tags: [Artists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '201':
 *         description: Artist created successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden (User is not an Admin)
 */
router.post('/', auth, checkRole([ROLES.ADMIN]), artistController.createArtist);

/**
 * @swagger
 * /artists/{id}:
 *   put:
 *     summary: Update an artist
 *     tags: [Artists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The artist ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       '200':
 *         description: Artist updated successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden (User is not an Admin)
 *       '404':
 *         description: Artist not found
 */
router.put('/:id', auth, checkRole([ROLES.ADMIN]), artistController.updateArtist);

/**
 * @swagger
 * /artists/{id}:
 *   delete:
 *     summary: Delete an artist
 *     tags: [Artists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The artist ID
 *     responses:
 *       '200':
 *         description: Artist deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden (User is not an Admin)
 *       '404':
 *         description: Artist not found
 */
router.delete('/:id', auth, checkRole([ROLES.ADMIN]), artistController.deleteArtist);

/**
 * @swagger
 * /artists/{id}/follow:
 *   post:
 *     summary: Follow or unfollow an artist
 *     tags: [Artists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The artist ID
 *     responses:
 *       '200':
 *         description: Follow status toggled
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Artist not found
 */
router.post('/:id/follow', auth, artistController.followArtist);

module.exports = router; 