const Song = require('../models/song')

const getSongs = async (req, res, next) => {
    try {
        const songs = await Song.find()
        return songs
    }
    catch (error) {
        console.error(error)
        res.status(500).send('Server error')
    }
}

module.exports = {
    getSongs
}
