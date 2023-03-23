const express = require("express");
var router = express.Router();

const staffController = require('../controller/authController');

router.post("/register", staffController.register)
router.post("/login", staffController.login)

module.exports = router