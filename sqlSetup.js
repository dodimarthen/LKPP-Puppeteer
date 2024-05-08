var mysql = require('mysql2');
const { SQL_Address, SQL_password, Selected_Database, Selected_Table, SQL_User  } = require('./config.js');


var con = mysql.createConnection({
    host : SQL_Address,
    user : SQL_User,
    password : SQL_Password
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Succesfully connected!")
});