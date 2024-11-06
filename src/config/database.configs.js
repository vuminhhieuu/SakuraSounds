const EnvVars = require('../constants/envVars')
const mongoose = require('mongoose')

const databaseConnect = async () => {
  try {
    await mongoose.connect(EnvVars.Mongo.ConnectionString)
    console.log('Connected to MongoDB')
  } catch (error) {
    throw new Error(`Error connecting to MongoDB: ${error.message}`)
  }
}

module.exports = databaseConnect
