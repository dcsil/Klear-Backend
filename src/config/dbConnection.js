const mysql = require('mysql2');
require('dotenv').config()

const mysqlConnection = mysql.createConnection({
    host: process.env.MYSQL_HOST, 
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });

mysqlConnection.connect((err) => {
    if (!err) {
      console.log("Connected");
    } else {
      console.log("Connection Failed");
      console.log(err)
    }
  });
  
module.exports = mysqlConnection;