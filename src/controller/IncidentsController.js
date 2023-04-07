const Sentry = require('@sentry/node')
const dbConnection = require('../config/dbConnection')
const mysql = require('mysql2')
const { resolve } = require('@sentry/utils')
const verifyAccessToken = require('../config/jwtHelper').verifyAccessToken
const jwt = require('jsonwebtoken')
const { findRelatedStudents, getRandomStudent, getStaffId, addIncident, addStudentIncident } = require('./helpers/incidentHelper')

exports.fetchAll = async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!verifyAccessToken(token)) return res.sendStatus(401)
    const { active } = req.params
    let sqlQuery
    if (active == 0) {
        sqlQuery = 'SELECT * FROM incidents where status = 0 OR status = 1 ORDER BY date DESC'
    } else {
        sqlQuery = 'SELECT * FROM incidents where status is NULL ORDER BY date DESC'
    }
    dbConnection.query(sqlQuery, (err, result) => {
        if (err) Sentry.captureException(new Error(err))
        return res.json(result)
    })
}

exports.fetchOne = async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!verifyAccessToken(token)) return res.sendStatus(401)
    const { incidentId } = req.params 
    const sqlQuery = 
        'SELECT incident_id, event, date, status, screenshot, first_name, ' +
        'last_name FROM incidents LEFT JOIN staff ON resolved_user = staff_id ' +
        'where incident_id = ?'
    const query = mysql.format(sqlQuery, [incidentId])
    dbConnection.query(query, async (err, result) => {
        if (err) Sentry.captureException(new Error(err))
        const students = await findRelatedStudents(incidentId)
        result[0].students = students
        return res.json(result[0])
    })
}

exports.add = async (req, res) => {
    const { event, date, imageUrl } = req.body
    if (event == null || date == null || imageUrl == null) {
        return res.sendStatus(400)
    }

    const incidentId = await addIncident(event, date, imageUrl)
    const studentId = await getRandomStudent()

    const result = await addStudentIncident(studentId, incidentId)
    if (result > 0) {
        return res.send("Incident added successfully")
    } else {
        return res.send(400)
    }
}

exports.resolve = async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!verifyAccessToken(token)) return res.sendStatus(401)
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    var email = decoded.user
    const staffId = await getStaffId(email)
    const { status, incidentId } = req.body
    const sqlQuery = 'UPDATE incidents SET status = ?, resolved_user = ? WHERE incident_id = ?'
    const query = mysql.format(sqlQuery, [status, staffId, incidentId])
    dbConnection.query(query, async (err, result) => {
        if (err) Sentry.captureException(new Error(err))
        else return res.send("Incident marked resolved")
    })
}