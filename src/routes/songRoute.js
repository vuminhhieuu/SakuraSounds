const express = require('express')
const router = express.Router()
const songController = require('../controllers/songController')

router.get('/', (req, res) => {
    res.render('home')
})

module.exports = router
