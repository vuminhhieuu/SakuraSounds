const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Comment = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    song: { type: Schema.Types.ObjectId, ref: 'Song' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }

})

module.exports = mongoose.model('Comment', Comment)
