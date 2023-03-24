const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const sampleRoute = require("./routes/sampleRoute");
const authRoute = require("./routes/authRoute");

const app = express();

// Application middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Route endpoints
app.use('/sampleRouteMiddleName/', sampleRoute);
app.use('/', authRoute);


module.exports = app