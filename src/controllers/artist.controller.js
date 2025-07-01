const Artist = require('../models/artist.model');
const { StatusCodes } = require('http-status-codes');

class ArtistController {
  // @desc    Create a new artist
  // @route   POST /api/artists
  // @access  Private (Admin)
  async createArtist(req, res, next) {
    try {
      const artist = await Artist.create(req.body);
      res.status(StatusCodes.CREATED).json({
        success: true,
        data: artist,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get all artists
  // @route   GET /api/artists
  // @access  Public
  async getArtists(req, res, next) {
    res.status(StatusCodes.OK).json(res.advancedResults);
  }

  // @desc    Get a single artist by ID
  // @route   GET /api/artists/:id
  // @access  Public
  async getArtistById(req, res, next) {
    try {
      const artist = await Artist.findById(req.params.id);
      if (!artist) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Artist not found' });
      }
      res.status(StatusCodes.OK).json({
        success: true,
        data: artist,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update an artist
  // @route   PUT /api/artists/:id
  // @access  Private (Admin)
  async updateArtist(req, res, next) {
    try {
      const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!artist) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Artist not found' });
      }
      res.status(StatusCodes.OK).json({
        success: true,
        data: artist,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Delete an artist
  // @route   DELETE /api/artists/:id
  // @access  Private (Admin)
  async deleteArtist(req, res, next) {
    try {
      const artist = await Artist.findByIdAndDelete(req.params.id);
      if (!artist) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Artist not found' });
      }
      res.status(StatusCodes.OK).json({
        success: true,
        data: {},
        message: 'Artist deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Follow/Unfollow an artist
  // @route   POST /api/artists/:id/follow
  // @access  Private
  async followArtist(req, res, next) {
    try {
      const artist = await Artist.findById(req.params.id);

      if (!artist) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Artist not found' });
      }

      await artist.toggleFollow(req.user._id);

      res.status(StatusCodes.OK).json({
        success: true,
        data: {
          followers: artist.followers.length,
          isFollowing: artist.followers.includes(req.user._id)
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ArtistController(); 