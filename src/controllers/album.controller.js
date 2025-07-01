const Album = require('../models/album.model');
const { StatusCodes } = require('http-status-codes');

class AlbumController {
  // @desc    Create a new album
  // @route   POST /api/albums
  // @access  Private (Admin/Artist)
  async createAlbum(req, res, next) {
    try {
      if (req.file) {
        req.body.coverImage = req.file.path;
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Cover image is required.' });
      }

      // The artist ID should be added to req.body before calling this
      // Or we can get it from the authenticated user if the user is an artist
      const album = await Album.create(req.body);
      res.status(StatusCodes.CREATED).json({
        success: true,
        data: album,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get all albums
  // @route   GET /api/albums
  // @access  Public
  async getAlbums(req, res, next) {
    res.status(StatusCodes.OK).json(res.advancedResults);
  }

  // @desc    Get a single album by ID
  // @route   GET /api/albums/:id
  // @access  Public
  async getAlbumById(req, res, next) {
    try {
      const album = await Album.findById(req.params.id)
        .populate('artist', 'name avatar')
        .populate('songs', 'title duration coverImage');
        
      if (!album) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Album not found' });
      }
      res.status(StatusCodes.OK).json({
        success: true,
        data: album,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update an album
  // @route   PUT /api/albums/:id
  // @access  Private (Admin/Artist)
  async updateAlbum(req, res, next) {
    try {
      let album = await Album.findById(req.params.id);

      if (!album) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Album not found' });
      }
      
      if (req.file) {
        req.body.coverImage = req.file.path;
      }

      // A simple authorization check. We'd need a way to link a user to an artist profile.
      // This assumes req.user.artistId exists if the user is an artist.
      const isOwner = req.user.artistId && album.artist.toString() === req.user.artistId.toString();
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
         return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'Not authorized to update this album' });
      }

      album = await Album.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      res.status(StatusCodes.OK).json({
        success: true,
        data: album,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Delete an album
  // @route   DELETE /api/albums/:id
  // @access  Private (Admin/Artist)
  async deleteAlbum(req, res, next) {
    try {
      const album = await Album.findById(req.params.id);

      if (!album) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Album not found' });
      }
      
      const isOwner = req.user.artistId && album.artist.toString() === req.user.artistId.toString();
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
         return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'Not authorized to delete this album' });
      }

      await album.deleteOne();

      res.status(StatusCodes.OK).json({
        success: true,
        data: {},
        message: 'Album deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Like/Unlike an album
  // @route   POST /api/albums/:id/like
  // @access  Private
  async likeAlbum(req, res, next) {
    try {
      const album = await Album.findById(req.params.id);

      if (!album) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Album not found' });
      }

      await album.toggleLike(req.user._id);

      res.status(StatusCodes.OK).json({
        success: true,
        data: {
          likes: album.likes.length,
          isLiked: album.likes.includes(req.user._id)
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AlbumController();
