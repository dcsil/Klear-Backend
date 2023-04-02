const express = require("express");
var router = express.Router();

const studentController = require('../controller/studentController')

router.get('/health', studentController.health)
router.get('/all', studentController.all)
router.get('/info/:student_id', studentController.info)
router.get('/history/:student_id', studentController.history)

module.exports = router