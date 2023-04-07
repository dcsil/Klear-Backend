const Sentry = require('@sentry/node')
const dbConnection = require('../../config/dbConnection')
const mysql = require('mysql2')
const log = require('npmlog')

function getStaffId(email) {
    const staffQuery = 'SELECT staff_id FROM staff WHERE email = ?'
    const query = mysql.format(staffQuery, [email])
    return new Promise((resolve, reject) => {
        dbConnection.query(query, async (err, result) => {
        if (err) Sentry.captureException(new Error(err))
        log.info('incidents', 'Staff was found: %j', result)
        resolve(result[0].staff_id)
        })
    })
}

function addIncident(event, date, imageUrl) {
    const sqlQuery = 'INSERT INTO incidents VALUES (NULL, ?, ?, NULL, NULL, ?)'
    const insertQuery = mysql.format(sqlQuery, [event, date, imageUrl])
    return new Promise((resolve, reject) => {
        dbConnection.query(insertQuery, (err, result) => {
            if (err) Sentry.captureException(new Error(err))
            log.info('incidents', 'incident was added: %j', result.insertId)
            resolve(result.insertId)
        })
    }) 
}

function getRandomStudent() {
    const studentQuery = 'SELECT student_id FROM students ORDER BY RAND() LIMIT 1'
    const randomStudent = mysql.format(studentQuery)
    return new Promise((resolve, reject) => {
        dbConnection.query(randomStudent, async (err, result) => {
        if (err) Sentry.captureException(new Error(err))
        log.info('incidents', 'Student was found: %j', result[0])
        resolve(result[0].student_id)
        })
    })
}

function addStudentIncident(studentId, incidentId) {
    const sqlQuery = 'INSERT INTO student_incidents VALUES(?, ?)'
    const query = mysql.format(sqlQuery, [studentId, incidentId])
    return new Promise((resolve, reject) => {
        dbConnection.query(query, (err, result) => {
        if (err) Sentry.captureException(new Error(err))
        log.info('incidents', 'Attached student to incident!')
        resolve(1)
        })
    })
}

function findRelatedStudents(incidentId) {
    const sqlQuery = 'SELECT student_id FROM student_incidents WHERE incident_id = ?'
    const query = mysql.format(sqlQuery, [incidentId])
    return new Promise((resolve, reject) => {
        dbConnection.query(query, (err, result) => {
            if (err) Sentry.captureException(new Error(err))
            if (result.length > 0) {
                const student = 'SELECT first_name, last_name FROM students WHERE student_id=?'
                const studentQuery = mysql.format(student, [result[0].student_id])
                dbConnection.query(studentQuery, (err, result) => {
                    if (err) Sentry.captureException(new Error(err))
                    log.info('incidents', 'student was found: %j', result)
                    resolve(result)
                })
            } else {
                resolve([])
            }
        })
    });
}

module.exports = {
    getStaffId,
    addIncident,
    findRelatedStudents,
    getRandomStudent,
    addStudentIncident
}