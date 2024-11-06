const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Album = new Schema({
    title: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    artist: { type: Schema.Types.ObjectId, ref: 'Artist' },
    song: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
})

module.exports = mongoose.model('Album', Album)
