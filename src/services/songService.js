const Song = require('../models/songModel')

const getSongs = async () => {
    try {
        const songs = await Song.find()
        return songs
    } catch (error) {
        console.error(error)
        res.status(500).send('Server error')
    }
}

module.exports = {
    getSongs,
}
