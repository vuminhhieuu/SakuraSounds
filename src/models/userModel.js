const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: { type: String, default: 'default.jpg' },
    registrationDate: { type: Date, default: Date.now },
    playlists: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }],
    lastLogin: { type: Date },
    status: { type: String, default: 'active' },
})

module.exports = mongoose.model('User', User)
