const Song = require('../models/song.model');
const { StatusCodes } = require('http-status-codes');

// For now, we will assume files are uploaded to a cloud service
// and the URLs are provided in the request body.
// We will integrate actual file uploads later.

class SongController {
  // @desc    Create a new song
  // @route   POST /api/songs
  // @access  Private (Admin/Artist)
  async createSong(req, res, next) {
    try {
      // Add uploader from the authenticated user
      req.body.uploader = req.user._id;

      // Get file URLs from Cloudinary upload
      if (req.files) {
        if (req.files.audio) {
          req.body.audioUrl = req.files.audio[0].path;
          // You might want to get metadata from the uploaded file here
          // For example: req.body.duration = req.files.audio[0].duration;
        }
        if (req.files.coverImage) {
          req.body.coverURL = req.files.coverImage[0].path;
        }
      }

      // Check if required URLs are present
      if (!req.body.audioUrl) {
         return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Audio file is required.' });
      }

      const song = await Song.create(req.body);
      res.status(StatusCodes.CREATED).json({
        success: true,
        data: song,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get all songs
  // @route   GET /api/songs
  // @access  Public
  async getSongs(req, res, next) {
    res.status(StatusCodes.OK).json(res.advancedResults);
  }

  // @desc    Get a single song by ID
  // @route   GET /api/songs/:id
  // @access  Public
  async getSongById(req, res, next) {
    try {
      const song = await Song.findById(req.params.id)
        .populate('artist', 'name avatar')
        .populate('album', 'title coverImage');

      if (!song) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Song not found' });
      }

      // Increment play count (can be made more sophisticated later)
      await song.incrementPlayCount();

      res.status(StatusCodes.OK).json({
        success: true,
        data: song,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update a song
  // @route   PUT /api/songs/:id
  // @access  Private (Uploader/Admin)
  async updateSong(req, res, next) {
    try {
      let song = await Song.findById(req.params.id);

      if (!song) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Song not found' });
      }

      // Check if user is the uploader or an admin
      if (song.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'Not authorized to update this song' });
      }

      song = await Song.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      res.status(StatusCodes.OK).json({
        success: true,
        data: song,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Delete a song
  // @route   DELETE /api/songs/:id
  // @access  Private (Uploader/Admin)
  async deleteSong(req, res, next) {
    try {
      const song = await Song.findById(req.params.id);

       if (!song) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Song not found' });
      }

      // Check if user is the uploader or an admin
      if (song.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'Not authorized to delete this song' });
      }
      
      await song.deleteOne();

      res.status(StatusCodes.OK).json({
        success: true,
        data: {},
        message: 'Song deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Like/Unlike a song
  // @route   POST /api/songs/:id/like
  // @access  Private
  async likeSong(req, res, next) {
    try {
      const song = await Song.findById(req.params.id);

      if (!song) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Song not found' });
      }

      await song.toggleLike(req.user._id);

      res.status(StatusCodes.OK).json({
        success: true,
        data: {
          likes: song.likes.length,
          isLiked: song.likes.includes(req.user._id)
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SongController(); 