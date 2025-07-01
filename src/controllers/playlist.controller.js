const Playlist = require('../models/playlist.model');
const { StatusCodes } = require('http-status-codes');

class PlaylistController {
  // @desc    Get all public playlists
  // @route   GET /api/playlists/public
  // @access  Public
  async getPublicPlaylists(req, res, next) {
    try {
      // The advancedResults middleware already filters for public playlists
      res.status(StatusCodes.OK).json(res.advancedResults);
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get all playlists for the logged-in user
  // @route   GET /api/playlists/my-playlists
  // @access  Private
  async getMyPlaylists(req, res, next) {
    try {
      const playlists = await Playlist.find({ owner: req.user._id });
      res.status(StatusCodes.OK).json({
        success: true,
        count: playlists.length,
        data: playlists,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Create a new playlist
  // @route   POST /api/playlists
  // @access  Private
  async createPlaylist(req, res, next) {
    try {
      req.body.owner = req.user._id;
      const playlist = await Playlist.create(req.body);
      res.status(StatusCodes.CREATED).json({
        success: true,
        data: playlist,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get a single playlist by ID
  // @route   GET /api/playlists/:id
  // @access  Private (Owner or if public)
  async getPlaylistById(req, res, next) {
    try {
      const playlist = await Playlist.findById(req.params.id).populate('songs', 'title artist duration coverImage');
      if (!playlist) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Playlist not found' });
      }
      // Check if the playlist is public or if the user is the owner
      if (!playlist.isPublic && playlist.owner.toString() !== req.user._id.toString()) {
        return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'Not authorized to view this playlist' });
      }
      res.status(StatusCodes.OK).json({
        success: true,
        data: playlist,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update a playlist's details (name, description, etc.)
  // @route   PUT /api/playlists/:id
  // @access  Private (Owner only)
  async updatePlaylist(req, res, next) {
    try {
      let playlist = await Playlist.findById(req.params.id);
      if (!playlist) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Playlist not found' });
      }
      if (playlist.owner.toString() !== req.user._id.toString()) {
        return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'Not authorized to update this playlist' });
      }
      playlist = await Playlist.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      res.status(StatusCodes.OK).json({ success: true, data: playlist });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Delete a playlist
  // @route   DELETE /api/playlists/:id
  // @access  Private (Owner only)
  async deletePlaylist(req, res, next) {
    try {
      const playlist = await Playlist.findById(req.params.id);
      if (!playlist) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Playlist not found' });
      }
      if (playlist.owner.toString() !== req.user._id.toString()) {
        return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'Not authorized to delete this playlist' });
      }
      await playlist.deleteOne();
      res.status(StatusCodes.OK).json({ success: true, data: {}, message: 'Playlist deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Add a song to a playlist
  // @route   POST /api/playlists/:id/songs
  // @access  Private (Owner only)
  async addSongToPlaylist(req, res, next) {
    try {
      const { songId } = req.body;
      const playlist = await Playlist.findById(req.params.id);
      if (!playlist) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Playlist not found' });
      }
      if (playlist.owner.toString() !== req.user._id.toString()) {
        return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'Not authorized to modify this playlist' });
      }
      await playlist.addSong(songId);
      res.status(StatusCodes.OK).json({ success: true, data: playlist });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Remove a song from a playlist
  // @route   DELETE /api/playlists/:id/songs/:songId
  // @access  Private (Owner only)
  async removeSongFromPlaylist(req, res, next) {
    try {
      const { id, songId } = req.params;
      const playlist = await Playlist.findById(id);
      if (!playlist) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Playlist not found' });
      }
      if (playlist.owner.toString() !== req.user._id.toString()) {
        return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'Not authorized to modify this playlist' });
      }
      await playlist.removeSong(songId);
      res.status(StatusCodes.OK).json({ success: true, data: playlist });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Follow/Unfollow a playlist
  // @route   POST /api/playlists/:id/follow
  // @access  Private
  async followPlaylist(req, res, next) {
    try {
      const playlist = await Playlist.findById(req.params.id);

      if (!playlist) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Playlist not found' });
      }

      // Prevent owner from following their own playlist
      if (playlist.owner.toString() === req.user._id.toString()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'You cannot follow your own playlist' });
      }

      await playlist.toggleFollow(req.user._id);

      res.status(StatusCodes.OK).json({
        success: true,
        data: {
          followers: playlist.followers.length,
          isFollowing: playlist.followers.includes(req.user._id)
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PlaylistController(); 