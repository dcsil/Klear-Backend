const express = require('express')
const router = express.Router()

const incidentsController = require('../controller/IncidentsController')

router.post('/incidents/add', incidentsController.add)
router.get('/incidents/all/:active', incidentsController.fetchAll)
router.get('/incidents/get/:incidentId', incidentsController.fetchOne)
router.post('/incidents/resolve', incidentsController.resolve)

module.exports = router