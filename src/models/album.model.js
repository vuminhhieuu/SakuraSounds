const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Album = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  coverImage: {
    type: String,
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  songs: [{
    type: Schema.Types.ObjectId,
    ref: 'Song'
  }],
  genre: [{
    type: String,
    trim: true
  }],
  type: {
    type: String,
    enum: ['album', 'single', 'ep'],
    default: 'album'
  },
  totalDuration: {
    type: Number,
    default: 0
  },
  totalTracks: {
    type: Number,
    default: 0
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active'
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
})

// Index for search
Album.index({ title: 'text', genre: 'text', tags: 'text' })

// Virtual for like count
Album.virtual('likeCount').get(function() {
  return this.likes.length
})

// Method to add song to album
Album.methods.addSong = async function(songId) {
  if (!this.songs.includes(songId)) {
    this.songs.push(songId)
    this.totalTracks = this.songs.length
    return this.save()
  }
  return this
}

// Method to remove song from album
Album.methods.removeSong = async function(songId) {
  const index = this.songs.indexOf(songId)
  if (index > -1) {
    this.songs.splice(index, 1)
    this.totalTracks = this.songs.length
    return this.save()
  }
  return this
}

// Method to toggle like
Album.methods.toggleLike = async function(userId) {
  const index = this.likes.indexOf(userId)
  if (index === -1) {
    this.likes.push(userId)
  } else {
    this.likes.splice(index, 1)
  }
  return this.save()
}

// Static method to find popular albums
Album.statics.findPopular = function(limit = 10) {
  return this.find({ status: 'active' })
    .sort({ 'likes.length': -1 })
    .limit(limit)
    .populate('artist', 'name')
    .populate('songs', 'title duration')
}

module.exports = mongoose.model('Album', Album)
