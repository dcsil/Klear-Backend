const bcrypt = require('bcrypt')
const Sentry = require('@sentry/node')
const dbConnection = require('../config/dbConnection')
const mysql = require('mysql2')
const generateAccessToken = require('../config/jwtHelper').generateAccessToken

exports.register = async (req, res) => {
  const { firstName, lastName, email } = req.body
  if (firstName === null || lastName === null || email === null) {
    res.sendStatus(400)
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  const sqlSearch = 'SELECT * FROM staff WHERE email = ?'
  const searchQuery = mysql.format(sqlSearch, [email])
  const sqlInsert = 'INSERT INTO staff VALUES (NULL,?,?,?,?)'
  const inserQuery = mysql.format(sqlInsert, [firstName, lastName, email, hashedPassword])
  dbConnection.query(searchQuery, (err, result) => {
    if (err) Sentry.captureException(new Error(err))
    console.log('------> Search Results')
    console.log(result.length)
    if (result.length !== 0) {
      console.log('------> User already exists')
      res.sendStatus(409)
      return
    } else {
      dbConnection.query(inserQuery, (err, result) => {
        if (err) throw (err)
        console.log('--------> Created new User')
        const token = generateAccessToken({ user: email })
        res.json({ accessToken: token })
      })
    }
  })
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  if (email == null || password == null) {
    res.sendStatus(400)
    return
  }
  const sqlSearch = 'select * from staff where email = ?'
  const searchQuery = mysql.format(sqlSearch, [email])
  dbConnection.query(searchQuery, async (err, result) => {
    if (err) Sentry.captureException(new Error(err))
    if (result.length === 0) {
      console.log('--------> User does not exist')
      res.sendStatus(401)
    } else {
      const hashedPassword = result[0].password
      if (await bcrypt.compare(password, hashedPassword)) {
        console.log('---------> Login Successful')
        const token = generateAccessToken({ user: email })
        res.json({ accessToken: token })
      } else {
        console.log('---------> Password Incorrect')
        res.send('Password incorrect!')
      }
    }
  })
}
