const userRoutes = require('./userRoute')
const songRoutes = require('./songRoute')

const Router = (app) => {
    app.use('/user', userRoutes)
    app.use('/', songRoutes)
}

module.exports = Router
