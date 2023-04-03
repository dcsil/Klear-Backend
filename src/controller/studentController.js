const express = require("express");
var router = express.Router();
const Sentry = require("@sentry/node");
const dbConnection = require('../config/dbConnection');
const verifyAccessToken = require('../config/jwtHelper').verifyAccessToken

/* Health check */
exports.health = (req,res) => {
  return res.json({ hello: 'Hello from the backend!' })
};

/* Get all students */
exports.all = (req, res) => { 
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!verifyAccessToken(token)) return res.sendStatus(401)
  dbConnection.query("SELECT * FROM students ORDER BY first_name",
  (err, results, fields) => {
    if (!err) {
      res.send(results);
    } else {
      Sentry.captureException(new Error("When getting all students: "+err));
    }
  });
};

/* Get student info */
exports.info = (req, res) => { 
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!verifyAccessToken(token)) return res.sendStatus(401)
  if (!req.params.student_id == null) return res.sendStatus(400)
  dbConnection.query("SELECT * FROM students WHERE student_id = " + req.params.student_id,
  (err, results, fields) => {
    if (!err) {
      res.send(results);
    } else {
      Sentry.captureException(new Error("When getting student info: "+err));
    }
  });
};

/* Get student incidents and activities */
exports.history = (req, res) => { 
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!verifyAccessToken(token)) return res.sendStatus(401)
  if (req.params.student_id == null) return res.sendStatus(400)

  const results = [];
  dbConnection.query("SELECT * FROM `student_incidents` JOIN incidents ON student_incidents.incident_id = incidents.incident_id WHERE student_id = " + req.params.student_id,
  (err, incidents, fields) => {
    if (!err) {
      for (var i = 0; i < incidents.length; i++) {
          incidents[i]["type"] = "incident";
          results.push(incidents[i]);
      }
    } else {
      Sentry.captureException(new Error("When getting student incidents: "+ err));
    }
  });
  dbConnection.query("SELECT * FROM activities WHERE student_id = " + req.params.student_id,
  (err, activities, fields) => {
    if (!err) {
      for (var i = 0; i < activities.length; i++) {
        activities[i]["type"] = "activity";
        results.push(activities[i]);
      }
      res.send(results);
    } else {
      Sentry.captureException(new Error("When getting student activities: "+ err));
    }
  });
    
};
