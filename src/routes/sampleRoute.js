const express = require("express");
var router = express.Router();

// Get total cost of items in checkout cart.
router.get("/helloBackend", function (req, res) {
    console.log('got a request')
    return res.json({ hello: "Hello from the backend!"});
});

module.exports = router