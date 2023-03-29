const express = require("express");
var router = express.Router();
const Sentry = require("@sentry/node");
const dbConnection = require('../config/dbConnection');

/* Health check */
router.get("/health", function(req,res){
    return res.json({ hello: 'Hello from the backend!' })
})

/* Get all students */
router.get("/all", function (req, res) { 
    dbConnection.query("SELECT * FROM students",
    (err, results, fields) => {
      if (!err) {
        res.send(results);
      } else {
        Sentry.captureException(new Error("Something went wrong :/"));
      }
    });
})

/* Get activities under the students */
router.get("/activities", function (req, res) { 
    dbConnection.query("SELECT * FROM activities WHERE student_id = " + req.body.student_id,
    (err, results, fields) => {
      if (!err) {
        res.send(results);
      } else {
        Sentry.captureException(new Error("Something went wrong :/"));
      }
    });
})

/* Get student info */
router.get("/info", function (req, res) { 
    dbConnection.query("SELECT * FROM students WHERE student_id = " + req.body.student_id,
    (err, results, fields) => {
      if (!err) {
        res.send(results);
      } else {
        Sentry.captureException(new Error("Something went wrong :/"));
      }
    });
})

/* Get student incidents */
router.get("/incidents", function (req, res) { 
    dbConnection.query("SELECT * FROM `student_incidents` JOIN incidents ON student_incidents.incident_id = incidents.incident_id WHERE student_id = " + req.body.student_id,
    (err, results, fields) => {
      if (!err) {
        res.send(results);
      } else {
        Sentry.captureException(new Error("Something went wrong :/"));
      }
    });
})

module.exports = router