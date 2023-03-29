const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const sampleRoute = require("./routes/sampleRoute");
const studentRoute = require("./routes/studentRoute")
const authRoute = require('./routes/authRoute')

const app = express()

// Application middleware
app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({
  extended: true
}))

// Route endpoints
app.use('/sampleRouteMiddleName/', sampleRoute);
app.use('/student/', studentRoute);
app.use('/', authRoute)

module.exports = app
