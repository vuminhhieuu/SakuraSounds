const express = require('express')
const { PathAPI } = require('../constants/paths')
// const userRoutes = require('./user.routes') // This is now profile.routes.js
const authRoutes = require('./auth.routes')
const profileRoutes = require('./profile.routes')
const artistRoutes = require('./artist.routes')
const songRoutes = require('./song.routes')
const albumRoutes = require('./album.routes')
const playlistRoutes = require('./playlist.routes')

const router = express.Router()

// Auth routes
router.use(PathAPI.Auth.Base, authRoutes)

// User routes (Now Profile routes)
// We use the same base path for now, but it's now pointing to profile logic
router.use(PathAPI.User.Base, profileRoutes)

// Profile routes (This line is redundant as we are using the /user path for profile)
// router.use(PathAPI.Profile.Base, profileRoutes)

// Artist routes
router.use(PathAPI.Artist.Base, artistRoutes)

// Song routes
router.use(PathAPI.Song.Base, songRoutes)

// Album routes
router.use(PathAPI.Album.Base, albumRoutes)

// Playlist routes
router.use(PathAPI.Playlist.Base, playlistRoutes)

// Home route
router.get('/', async (req, res) => {
  try {
    res.render('pages/home', { user: req.user })
  } catch (error) {
    res.status(500).render('error', { error })
  }
})

module.exports = router
