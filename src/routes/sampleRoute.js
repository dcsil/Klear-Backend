const express = require("express");
var router = express.Router();
const Sentry = require("@sentry/node");
const dbConnection = require('../config/dbConnection');


// Get total cost of items in checkout cart.
router.get("/helloBackend", function (req, res) {
    // return res.json({ hello: "Hello from the backend!"});
    return res.json({ hello: ""});
});

/* Just a testing function */
router.get("/testingDb", function (req, res) { 
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