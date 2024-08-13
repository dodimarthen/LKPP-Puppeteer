import mysql from "mysql";
import { SQL_Address, SQL_User, SQL_Password } from "../../config";

const con = mysql.createConnection({
  host: SQL_Address,
  user: SQL_User,
  password: SQL_Password,
});

con.connect(function (err) {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected!");
});
