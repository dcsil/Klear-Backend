const bcrypt = require("bcrypt")
const express = require("express");
var router = express.Router();
const Sentry = require("@sentry/node");
const dbConnection = require('../config/dbConnection');
const mysql = require('mysql2')

exports.register = async (req, res) => {
    const { first_name, last_name, email } = req.body
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const sqlSearch = "SELECT * FROM staff WHERE email = ?"
    const search_query = mysql.format(sqlSearch,[email])
    const sqlInsert = "INSERT INTO staff VALUES (NULL,?,?,?,?)"
    const insert_query = mysql.format(sqlInsert,[first_name, last_name, email, hashedPassword])
 
        dbConnection.query (search_query, async (err, result) => {
            if (err) throw (err)
                console.log("------> Search Results")
                console.log(result.length)
            if (result.length != 0) {
                console.log("------> User already exists")
                res.sendStatus(409) 
            } 
            else {
                dbConnection.query (insert_query, (err, result)=> {
                    if (err) throw (err)
                    console.log ("--------> Created new User")
                    console.log(result.insertId)
                    res.sendStatus(201)
                })
            }
        })
}

exports.login = (req, res) => {
    console.log("Hit this point")
    console.log(req.body)
    res.send("NOT IMPLEMENTED")
}