const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Playlist = new Schema({
    name: { type: String, required: true },
    createBy: { type: Schema.Types.ObjectId, ref: 'User' },
    songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Playlist', Playlist)
