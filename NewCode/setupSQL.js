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

// Function to insert data into the database
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

// Function to check if data exists in the database
export const checkExistingData = async (ID_Paket) => {
  const sql = `SELECT * FROM LKPP WHERE ID_Paket = ?`;

  return new Promise((resolve, reject) => {
    con.query(sql, [ID_Paket], function (err, result) {
      if (err) {
        console.error("Error checking data:", err);
        return reject(err);
      }
      if (result.length > 0) {
        console.log(`Data found for ID_Paket ${ID_Paket}`);
        resolve(result[0]); // Return the existing record
      } else {
        console.log(`No data found for ID_Paket ${ID_Paket}`);
        resolve(null);
      }
    });
  });
};

// Function to update existing data in the database
export const updateData = async (
  ID_Paket,
  Status_Paket,
  Url_Paket,
  Negosiasi_Result
) => {
  const sql = `UPDATE LKPP SET Status_Paket = ?, Url_Paket = ?, Negosiasi_Result = ? WHERE ID_Paket = ?`;

  return new Promise((resolve, reject) => {
    con.query(
      sql,
      [Status_Paket, Url_Paket, Negosiasi_Result, ID_Paket],
      function (err, result) {
        if (err) {
          console.error("Error updating data:", err);
          return reject(err);
        }
        console.log(`Data updated successfully for ID_Paket ${ID_Paket}`);
        resolve(result);
      }
    );
  });
};

// Function to close the database connection
export const closeConnection = () => {
  con.end(function (err) {
    if (err) {
      console.error("Error closing the database connection:", err);
      return;
    }
    console.log("Database connection closed.");
  });
};
