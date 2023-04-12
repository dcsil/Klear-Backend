const mysql = require('mysql2');
require('dotenv').config()
const log = require('npmlog')


const mysqlConnection = mysql.createConnection({
    host: process.env.MYSQL_HOST, 
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });

mysqlConnection.connect((err) => {
    if (!err) {
      log.info("Connected");
    } else {
      log.info("Connection Failed");
      log.info(err)
    }
  });
  
module.exports = mysqlConnection;