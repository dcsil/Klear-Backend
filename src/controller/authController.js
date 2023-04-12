const bcrypt = require('bcrypt')
const Sentry = require('@sentry/node')
const dbConnection = require('../config/dbConnection')
const mysql = require('mysql2')
const generateAccessToken = require('../config/jwtHelper').generateAccessToken
const log = require('npmlog')

exports.register = async (req, res) => {
  const { firstName, lastName, email } = req.body
  if (firstName === null || lastName === null || email === null) return res.sendStatus(401)
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  const sqlSearch = 'SELECT * FROM staff WHERE email = ?'
  const searchQuery = mysql.format(sqlSearch, [email])
  const sqlInsert = 'INSERT INTO staff VALUES (NULL,?,?,?,?)'
  const inserQuery = mysql.format(sqlInsert, [firstName, lastName, email, hashedPassword])
  dbConnection.query(searchQuery, (err, result) => {
    if (err) Sentry.captureException(new Error(err))
    if (result.length !== 0) {
      log.warn("auth", "Account already exists, returning 409")
      return res.sendStatus(409)
    } else {
      dbConnection.query(inserQuery, (err, result) => {
        if (err) throw (err)
        log.info("auth", "Creating new account!")
        const token = generateAccessToken({ user: email })
        res.json({ accessToken: token })
      })
    }
  })
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  if (email == null || password == null) {
    return res.sendStatus(400)
  }
  const sqlSearch = 'select * from staff where email = ?'
  const searchQuery = mysql.format(sqlSearch, [email])
  dbConnection.query(searchQuery, async (err, result) => {
    if (err) Sentry.captureException(new Error(err))
    if (result.length === 0) {
      log.warn("auth", "User does not exist. Returning 401")
      return res.sendStatus(401)
    } else {
      const hashedPassword = result[0].password
      if (await bcrypt.compare(password, hashedPassword)) {
        log.info("auth", "Successfully logged in!")
        const token = generateAccessToken({ user: email })
        res.json({ accessToken: token })
      } else {
        log.info("auth", "Password was incorrect")
        return res.send('Password incorrect!')
      }
    }
  })
}
