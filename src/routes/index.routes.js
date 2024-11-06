const Path = require('../constants/paths')

const Router = app => {
  app.use(Path.Empty, (req, res) => {
    res.render('home')
  })
}

module.exports = Router
