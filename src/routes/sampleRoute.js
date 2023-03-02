const express = require("express");
var router = express.Router();
const Sentry = require("@sentry/node");
const dbConnection = require('../config/dbConnection');


// Get total cost of items in checkout cart.
router.get("/helloBackend", function (req, res) {
    Sentry.captureException(new Error("This is my fake error message"));
    console.log('got a request')
    return res.json({ hello: "Hello from the backend!"});
});

/* Just a testing function */
router.get("/testingDb", function (req, res) { 
    console.log("pinging db")
    dbConnection.query("SELECT * FROM users",
    (err, results, fields) => {
      if (!err) {
        res.send(results);
      } else {
        Sentry.captureException(new Error("Something went wrong :/"));
      }
    });
})

module.exports = router