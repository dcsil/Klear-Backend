const mysql = require('mysql2');

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'csc49100',
    database: 'klear'
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