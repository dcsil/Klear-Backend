const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const sampleRoute = require('./routes/sampleRoute')
const authRoute = require('./routes/authRoute')
const incidentRoute = require('./routes/incidentRoute')

const app = express()

// Application middleware
app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({
  extended: true
}))
app.use('/images', express.static('upload'));



// Route endpoints
app.use('/sampleRouteMiddleName/', sampleRoute)
app.use('/', authRoute)
app.use('/', incidentRoute)

module.exports = app
