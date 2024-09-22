const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Song = new Schema({
    title: { type: String, required: true },
    artist: { type: Schema.Types.ObjectId, ref: 'Artist' },
    album: { type: Schema.Types.ObjectId, ref: 'Album' },
    genre: { type: String, required: true },
    duration: { type: Number, required: true },
    fileURl: { type: String, required: true },
    coverURL: { type: String, required: true},
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Song', Song)
