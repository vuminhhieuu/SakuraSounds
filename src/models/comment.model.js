const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Comment = new Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  song: {
    type: Schema.Types.ObjectId,
    ref: 'Song',
    required: true
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['active', 'hidden', 'deleted'],
    default: 'active'
  },
  timestamp: {
    type: Number,
    default: 0
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
})

// Index for search
Comment.index({ content: 'text' })

// Virtual for like count
Comment.virtual('likeCount').get(function() {
  return this.likes.length
})

// Virtual for reply count
Comment.virtual('replyCount').get(function() {
  return this.replies.length
})

// Method to add reply
Comment.methods.addReply = async function(replyId) {
  if (!this.replies.includes(replyId)) {
    this.replies.push(replyId)
    return this.save()
  }
  return this
}

// Method to remove reply
Comment.methods.removeReply = async function(replyId) {
  const index = this.replies.indexOf(replyId)
  if (index > -1) {
    this.replies.splice(index, 1)
    return this.save()
  }
  return this
}

// Method to toggle like
Comment.methods.toggleLike = async function(userId) {
  const index = this.likes.indexOf(userId)
  if (index === -1) {
    this.likes.push(userId)
  } else {
    this.likes.splice(index, 1)
  }
  return this.save()
}

// Method to edit comment
Comment.methods.edit = async function(newContent) {
  this.editHistory.push({
    content: this.content,
    editedAt: new Date()
  })
  this.content = newContent
  this.isEdited = true
  return this.save()
}

// Static method to find comments by song
Comment.statics.findBySong = function(songId, options = {}) {
  const query = {
    song: songId,
    status: 'active',
    parentComment: null
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .populate('user', 'username avatar')
    .populate({
      path: 'replies',
      populate: {
        path: 'user',
        select: 'username avatar'
      }
    })
    .limit(options.limit || 50)
    .skip(options.skip || 0)
}

module.exports = mongoose.model('Comment', Comment)
