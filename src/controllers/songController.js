const songService = require('../services/songService')

const getHomePage = (req, res, next) => {
    const songs = songService.getSongs()
    res.render('home', { songs })
}

module.exports = {
    getHomePage,
}
