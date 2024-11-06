const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Artist = new Schema({
    name: { type: 'string', required: true },
    albums: [{ type: Schema.Types.ObjectId, ref: 'Album' }],
})

module.exports = mongoose.model('Artist', Artist)
