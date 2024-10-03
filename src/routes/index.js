const express = require('express')
const router = express.Router()


const songController = require('../controllers/songController')

router.use('/', songController.getHomePage)

module.exports = router