const Comment = require('../models/comment.model');
const Song = require('../models/song.model');
const { StatusCodes } = require('http-status-codes');

class CommentController {
  // @desc    Get all comments for a song
  // @route   GET /api/songs/:songId/comments
  // @access  Public
  async getCommentsForSong(req, res, next) {
    try {
      // We can use the static method from the model
      const comments = await Comment.findBySong(req.params.songId, req.query);
      res.status(StatusCodes.OK).json({
        success: true,
        count: comments.length,
        data: comments,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Add a comment to a song
  // @route   POST /api/songs/:songId/comments
  // @access  Private
  async addCommentToSong(req, res, next) {
    try {
      req.body.song = req.params.songId;
      req.body.user = req.user._id;

      // If it's a reply, find the parent and add the reply ID
      if (req.body.parentComment) {
        const parent = await Comment.findById(req.body.parentComment);
        if (!parent) {
          return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Parent comment not found' });
        }
      }

      const comment = await Comment.create(req.body);
      
      if (comment.parentComment) {
         const parent = await Comment.findById(comment.parentComment);
         await parent.addReply(comment._id);
      }

      res.status(StatusCodes.CREATED).json({
        success: true,
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update a comment
  // @route   PUT /api/comments/:id
  // @access  Private (Owner only)
  async updateComment(req, res, next) {
    try {
      let comment = await Comment.findById(req.params.id);
      if (!comment) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Comment not found' });
      }
      if (comment.user.toString() !== req.user._id.toString()) {
        return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'Not authorized to update this comment' });
      }

      comment = await comment.edit(req.body.content);
      
      res.status(StatusCodes.OK).json({ success: true, data: comment });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Delete a comment
  // @route   DELETE /api/comments/:id
  // @access  Private (Owner or Admin)
  async deleteComment(req, res, next) {
    try {
      const comment = await Comment.findById(req.params.id);
      if (!comment) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Comment not found' });
      }
      if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'Not authorized to delete this comment' });
      }
      
      // Instead of deleting, we change the status. This preserves replies.
      comment.status = 'deleted';
      comment.content = '[This comment has been deleted]';
      await comment.save();

      res.status(StatusCodes.OK).json({ success: true, data: {} });
    } catch (error) {
      next(error);
    }
  }

    // @desc    Like/Unlike a comment
  // @route   POST /api/comments/:id/like
  // @access  Private
  async likeComment(req, res, next) {
    try {
      const comment = await Comment.findById(req.params.id);

      if (!comment) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Comment not found' });
      }

      await comment.toggleLike(req.user._id);

      res.status(StatusCodes.OK).json({
        success: true,
        data: {
          likes: comment.likes.length,
          isLiked: comment.likes.includes(req.user._id)
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CommentController(); 