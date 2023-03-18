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

exports.login = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    const sqlSearch = "select * from staff where email = ?"
    const search_query = mysql.format(sqlSearch,[email])
    dbConnection.query (search_query, async (err, result) => {        
        if (err) throw (err)
        if (result.length == 0) {
            console.log("--------> User does not exist")
            res.sendStatus(404)
        } 
        else {
            const hashedPassword = result[0].password
            if (await bcrypt.compare(password, hashedPassword)) {
                console.log("---------> Login Successful")
                res.send(`${first_name} ${last_name} is logged in!`)
            } 
            else {
                console.log("---------> Password Incorrect")
                res.send("Password incorrect!")
            }
        }
    })
}