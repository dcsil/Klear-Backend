const express = require("express");
var router = express.Router();

const studentController = require('../controller/studentController')

router.get('/health', studentController.health)
router.get('/all', studentController.all)
router.get('/info', studentController.info)
router.get('/history', studentController.history)

module.exports = router