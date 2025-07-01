const mongoose = require('mongoose')
const Schema = mongoose.Schema

const slug = require('mongoose-slug-generator')

const songSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Song title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title must not exceed 100 characters'],
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: [true, 'Artist is required'],
  },
  album: {
    type: Schema.Types.ObjectId,
    ref: 'Album',
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [0, 'Duration must be positive'],
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true,
  },
  coverImage: {
    type: String,
    default: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/defaults/default-song.png',
  },
  audioUrl: {
    type: String,
    required: [true, 'Audio URL is required'],
  },
  lyrics: {
    type: String,
    trim: true,
  },
  releaseDate: {
    type: Date,
    default: Date.now,
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  playCount: {
    type: Number,
    default: 0,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Comment must not exceed 500 characters'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  sheetMusic: {
    type: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active'
  },
  metadata: {
    bitrate: Number,
    format: String,
    size: Number,
    sampleRate: Number
  },
  slug: { type: String, slug: 'title', unique: true },
  coverURL: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true
})

// Add indexes for better query performance
songSchema.index({ title: 1, artist: 1 }, { unique: false })
songSchema.index({ genre: 1 })
songSchema.index({ uploader: 1 })

// Virtual for like count
songSchema.virtual('likeCount').get(function() {
  return this.likes.length
})

// Virtual for comment count
songSchema.virtual('commentCount').get(function() {
  return this.comments.length
})

// Method to increment play count
songSchema.methods.incrementPlayCount = async function() {
  this.playCount += 1
  return this.save()
}

// Method to toggle like
songSchema.methods.toggleLike = async function(userId) {
  const index = this.likes.indexOf(userId)
  if (index === -1) {
    this.likes.push(userId)
  } else {
    this.likes.splice(index, 1)
  }
  return this.save()
}

// Static method to find popular songs
songSchema.statics.findPopular = function(limit = 10) {
  return this.find({ status: 'active' })
    .sort({ playCount: -1 })
    .limit(limit)
    .populate('artist', 'name')
    .populate('album', 'title')
}

mongoose.plugin(slug)
const Song = mongoose.model('Song', songSchema)

module.exports = Song
