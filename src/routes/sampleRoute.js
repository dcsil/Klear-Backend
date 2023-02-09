const express = require("express");
var router = express.Router();
const dbConnection = require('../config/dbConnection');



// Get total cost of items in checkout cart.
router.get("/helloBackend", function (req, res) {
    console.log('got a request')
    return res.json({ hello: "Hello from the backend!"});
});

/* Just a testing function */
router.get("/testingDb", function (req, res) { 
    console.log("pinging db")
    dbConnection.query("SELECT * FROM cameras",
    (err, results, fields) => {
      if (!err) {
        res.send(results);
      } else {
        console.log(err);
      }
    });
})

module.exports = router