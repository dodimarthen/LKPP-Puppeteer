import mysql from "mysql2";
import {
  SQL_Address,
  SQL_User,
  SQL_Password,
  Selected_Database,
} from "../config.js";

const con = mysql.createConnection({
  host: SQL_Address,
  user: SQL_User,
  password: SQL_Password,
  database: Selected_Database,
});

con.connect(function (err) {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database!");
});
export const insertData = async (
  ID_Paket,
  Status_Paket,
  Url_Paket,
  Negosiasi_Result
) => {
  const sql = `INSERT INTO LKPP (ID_Paket, Status_Paket, Url_Paket, Negosiasi_Result) VALUES (?, ?, ?, ?)`;

  return new Promise((resolve, reject) => {
    con.query(
      sql,
      [ID_Paket, Status_Paket, Url_Paket, Negosiasi_Result],
      function (err, result) {
        if (err) {
          console.error("Error inserting data:", err);
          return reject(err);
        }
        console.log("Data inserted successfully, ID:", result.insertId);
        resolve(result.insertId);
      }
    );
  });
};
