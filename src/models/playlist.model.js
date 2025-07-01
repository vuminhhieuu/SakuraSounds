const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Playlist = new Schema({
  name: {
    type: String,
    required: [true, 'Playlist name is required'],
    trim: true,
    minlength: [3, 'Playlist name must be at least 3 characters long'],
    maxlength: [100, 'Playlist name must not exceed 100 characters'],
  },
  description: {
    type: String,
    maxlength: [500, 'Description must not exceed 500 characters'],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  songs: [{
    type: Schema.Types.ObjectId,
    ref: 'Song'
  }],
  coverImage: {
    type: String,
    default: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/defaults/default-playlist.png',
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },
  type: {
    type: String,
    enum: ['regular', 'favorites', 'recently_played'],
    default: 'regular'
  }
}, {
  timestamps: true
})

// Add index for better query performance
Playlist.index({ owner: 1, name: 1 }, { unique: true })

// Virtual for follower count
Playlist.virtual('followerCount').get(function() {
  return this.followers.length
})

// Virtual for song count
Playlist.virtual('songCount').get(function() {
  return this.songs.length
})

// Method to add song to playlist
Playlist.methods.addSong = async function(songId) {
  if (!this.songs.includes(songId)) {
    this.songs.push(songId)
    return this.save()
  }
  return this
}

// Method to remove song from playlist
Playlist.methods.removeSong = async function(songId) {
  const index = this.songs.indexOf(songId)
  if (index > -1) {
    this.songs.splice(index, 1)
    return this.save()
  }
  return this
}

// Method to toggle follow
Playlist.methods.toggleFollow = async function(userId) {
  const index = this.followers.indexOf(userId)
  if (index === -1) {
    this.followers.push(userId)
  } else {
    this.followers.splice(index, 1)
  }
  return this.save()
}

// Static method to find popular playlists
Playlist.statics.findPopular = function(limit = 10) {
  return this.find({ status: 'active', isPublic: true })
    .sort({ 'followers.length': -1 })
    .limit(limit)
    .populate('owner', 'username')
    .populate('songs', 'title artist')
}

module.exports = mongoose.model('Playlist', Playlist)
