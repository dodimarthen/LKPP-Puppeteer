import {
  SQL_Address,
  SQL_User,
  SQL_Password,
  Selected_Database,
  user_email_mailer,
  password_email_mailer,
  receiver_testing_email,
  receiver_testing_email_2,
  receiver_testing_email_3,
  receiver_testing_email_4,
} from "../config.js";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";
const dbConfig = {
  host: SQL_Address,
  user: SQL_User,
  password: SQL_Password,
  database: Selected_Database,
};

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // or another email service
  auth: {
    user: user_email_mailer,
    pass: password_email_mailer,
  },
});

// Function to insert or update data in the `iu_ppk` table
// Function to insert or update data in the `iu_ppk` table
export async function insertDataiuppk(data) {
  const connection = await mysql.createConnection(dbConfig);

  try {
    const selectQuery = `
      SELECT * FROM iu_ppk WHERE id_paket = ?;
    `;

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

    // Check if the data has changed
    const [existingData] = await connection.execute(selectQuery, [idPaket]);

    const isDataChanged =
      !existingData[0] ||
      existingData[0].etalase_produk !== etalaseProduk ||
      existingData[0].nama_paket !== namaPaket ||
      existingData[0].satuan_kerja !== satuanKerja ||
      existingData[0].nama_ppk !== namaPPK ||
      existingData[0].tujuan_pengiriman_barang !== alamatPengiriman ||
      existingData[0].total_produk !== totalProduk ||
      existingData[0].no_kontrak !== noKontrak;

    if (!isDataChanged) {
      console.log(`No changes detected for Paket ${idPaket}. Email not sent.`);
      return;
    }

    // Insert or update the data in the database
    const [result] = await connection.execute(upsertQuery, [
      idPaket,
      etalaseProduk,
      namaPaket,
      satuanKerja,
      namaPPK,
      alamatPengiriman,
      totalProduk,
      noKontrak,
    ]);

    console.log("Data inserted or updated successfully in iu_ppk");
    console.log("Upsert Result:", result);

    // Prepare email content
    const subject = `Paket ${idPaket} [Proses kontrak ppk]`;
    const details = `
      <h3>Details Information:</h3>
      <ul>
        <li>Etalase Produk: ${etalaseProduk}</li>
        <li>ID Paket: ${idPaket}</li>
        <li>Nama Paket: ${namaPaket}</li>
        <li>Satuan Kerja: ${satuanKerja}</li>
        <li>Nama PPK: ${namaPPK}</li>
        <li>Alamat Pengiriman: ${alamatPengiriman}</li>
        <li>Total Produk: ${totalProduk}</li>
        <li>No Kontrak: ${noKontrak}</li>
      </ul>
    `;

    // Send email
    await transporter.sendMail({
      from: user_email_mailer,
      to: [
        receiver_testing_email,
        receiver_testing_email_2,
        receiver_testing_email_3,
        receiver_testing_email_4,
      ],
      subject: subject,
      html: details,
    });

    console.log(`Email sent successfully for Paket ${idPaket}`);
  } catch (error) {
    console.error("Error inserting or updating data in iu_ppk:", error);
  } finally {
    await connection.end();
  }
}
