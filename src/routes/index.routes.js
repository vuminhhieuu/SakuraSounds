const { PathAPI } = require('../constants/paths')
const userRoutes = require('./user.routes')

const Router = app => {
  //User routes
  app.use(PathAPI.User.Base, userRoutes)
  // Home route
  app.use(PathAPI.Empty, async (req, res) => {
    try {
      res.render('pages/home', { user: req.user })
    } catch (error) {
      next(error)
    }
  })
}

module.exports = Router
