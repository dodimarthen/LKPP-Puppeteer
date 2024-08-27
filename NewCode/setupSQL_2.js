import {
  SQL_Address,
  SQL_User,
  SQL_Password,
  Selected_Database,
} from "../config.js";
import mysql from "mysql2/promise"; // Use promise-based connection for async/await

// Database connection configuration
const dbConfig = {
  host: SQL_Address,
  user: SQL_User,
  password: SQL_Password,
  database: Selected_Database,
};

// Function to insert or update data in the `iu_ppk` table
export async function insertDataiuppk(data) {
  const connection = await mysql.createConnection(dbConfig);

  try {
    const upsertQuery = `
      INSERT INTO iu_ppk (id_paket, etalase_produk, nama_paket, satuan_kerja, nama_ppk, tujuan_pengiriman_barang, total_produk, no_kontrak)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        etalase_produk = VALUES(etalase_produk),
        nama_paket = VALUES(nama_paket),
        satuan_kerja = VALUES(satuan_kerja),
        nama_ppk = VALUES(nama_ppk),
        tujuan_pengiriman_barang = VALUES(tujuan_pengiriman_barang),
        total_produk = VALUES(total_produk),
        no_kontrak = VALUES(no_kontrak);
    `;

    const { informasiUtama, ppk, noKontrak } = data;

    // Extract the values for the SQL query
    const idPaket =
      informasiUtama.find((item) => item.heading === "ID Paket")?.description ||
      "";
    const etalaseProduk =
      informasiUtama.find((item) => item.heading === "Etalase Produk")
        ?.description || "";
    const namaPaket =
      informasiUtama.find((item) => item.heading === "Nama Paket")
        ?.description || "";
    const satuanKerja =
      informasiUtama.find((item) => item.heading === "Satuan Kerja")
        ?.description || "";
    const alamatPengiriman =
      informasiUtama.find((item) => item.heading === "Alamat Pengiriman")
        ?.description || "";
    const totalProduk =
      informasiUtama.find((item) => item.heading === "Total Produk")
        ?.description || "";
    const namaPPK = ppk.length > 0 ? ppk[0].description : "";

    // Log the query and parameters
    console.log("Upsert Query:", upsertQuery);
    console.log("Parameters:", [
      idPaket,
      etalaseProduk,
      namaPaket,
      satuanKerja,
      namaPPK,
      alamatPengiriman,
      totalProduk,
      noKontrak, // Add noKontrak here
    ]);

    // Insert or update the data in the database
    const [result] = await connection.execute(upsertQuery, [
      idPaket,
      etalaseProduk,
      namaPaket,
      satuanKerja,
      namaPPK,
      alamatPengiriman,
      totalProduk,
      noKontrak, // Add noKontrak here
    ]);

    console.log("Data inserted or updated successfully in iu_ppk");
    console.log("Upsert Result:", result);
  } catch (error) {
    console.error("Error inserting or updating data in iu_ppk:", error);
  } finally {
    await connection.end();
  }
}
