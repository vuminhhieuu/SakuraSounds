const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Artist = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: 'default-artist.jpg'
  },
  coverImage: {
    type: String,
    default: 'default-cover.jpg'
  },
  genres: [{
    type: String,
    trim: true
  }],
  albums: [{
    type: Schema.Types.ObjectId,
    ref: 'Album'
  }],
  songs: [{
    type: Schema.Types.ObjectId,
    ref: 'Song'
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  socialLinks: {
    website: String,
    facebook: String,
    twitter: String,
    instagram: String,
    youtube: String
  },
  monthlyListeners: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'verified'],
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
Artist.index({ name: 'text', genres: 'text', tags: 'text' })

// Virtual for follower count
Artist.virtual('followerCount').get(function() {
  return this.followers.length
})

// Virtual for song count
Artist.virtual('songCount').get(function() {
  return this.songs.length
})

// Virtual for album count
Artist.virtual('albumCount').get(function() {
  return this.albums.length
})

// Method to toggle follow
Artist.methods.toggleFollow = async function(userId) {
  const index = this.followers.indexOf(userId)
  if (index === -1) {
    this.followers.push(userId)
  } else {
    this.followers.splice(index, 1)
  }
  return this.save()
}

// Method to add song
Artist.methods.addSong = async function(songId) {
  if (!this.songs.includes(songId)) {
    this.songs.push(songId)
    return this.save()
  }
  return this
}

// Method to add album
Artist.methods.addAlbum = async function(albumId) {
  if (!this.albums.includes(albumId)) {
    this.albums.push(albumId)
    return this.save()
  }
  return this
}

// Static method to find popular artists
Artist.statics.findPopular = function(limit = 10) {
  return this.find({ status: 'active' })
    .sort({ monthlyListeners: -1 })
    .limit(limit)
    .populate('songs', 'title')
    .populate('albums', 'title')
}

module.exports = mongoose.model('Artist', Artist)
