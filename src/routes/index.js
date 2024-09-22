const songController = require('../controllers/songController')


function router(app) {

    app.get('/', songController.getHomePage)
}

module.exports = router