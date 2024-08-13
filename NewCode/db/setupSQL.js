import mysql from "mysql2";
import {
  SQL_Address,
  SQL_User,
  SQL_Password,
  Selected_Database,
} from "../../config.js";

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
  console.log("Connected!");

  // Example data to insert
  const ID_Paket = "SCE-P2408-10071760";
  const Status_Paket = "Proses kontrak ppk";
  const Url_Paket =
    "https://e-katalog.lkpp.go.id/v2/id/purchasing/paket/detail/10071760";
  const Negosiasi_Result = "rev1 rev2";

  const sql = `INSERT INTO LKPP (ID_Paket, Status_Paket, Url_Paket, Negosiasi_Result) VALUES (?, ?, ?, ?)`;

  con.query(
    sql,
    [ID_Paket, Status_Paket, Url_Paket, Negosiasi_Result],
    function (err, result) {
      if (err) {
        console.error("Error inserting data:", err);
        return;
      }
      console.log("Data inserted successfully, ID:", result.insertId);
    }
  );
});
