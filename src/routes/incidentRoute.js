const express = require('express')
const router = express.Router()

const cvIncidentsController = require('../controller/IncidentsController')

router.post('/incidents/add', cvIncidentsController.add)
router.get('/incidents/all/:active', cvIncidentsController.fetchAll)
router.get('/incidents/get/:incidentId', cvIncidentsController.fetchOne)

module.exports = router