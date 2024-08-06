var mysql = require("mysql2");
const {
  SQL_Address,
  SQL_Password,
  Selected_Database,
  Selected_Table,
  SQL_User,
} = require("../config.js");

var con = mysql.createConnection({
  host: SQL_Address,
  user: SQL_User,
  password: SQL_Password,
  database: Selected_Database,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Succesfully connected!");

  var sampleData = {
    nama_pemesan: "John Doe",
    jabatan_pemesan: "Manager",
    nip_pemesan: "12345",
    email_pemesan: "john.doe@example.com",
    no_telp_pemesan: "123-456-7890",
    no_sertifikat_pbj_pemesan: "PB123",
    nama_pembeli: "Jane Smith",
    jabatan_pembeli: "Assistant Manager",
    nip_pembeli: "54321",
    email_pembeli: "jane.smith@example.com",
    no_telp_pembeli: "987-654-3210",
    no_sertifikat_pbj_pembeli: "PB321",
    etalase_produk: "Etalase A",
    id_paket: 1001,
    nama_paket: "Sample Package",
    satuan_kerja: "Department XYZ",
    alamat_satuan_kerja: "123 Main Street",
    alamat_pengiriman: "456 Elm Street",
    no_kontrak: "K123",
    tanggal_kontrak: "2024-05-08",
    status_paket: "Pending",
    nama_barang: "Sample Item",
    kuantitas_barang: 10,
    harga_barang: 100.0,
    harga_ongkir: 20.0,
    tanggal_pengiriman: "2024-05-15",
    total_harga: 1020.0,
  };

  con.query(
    "INSERT INTO hasil_scrap set ?",
    sampleData,
    function (err, result) {
      if (err) throw err;
      console.log("Sample data inserted!");
    }
  );
  con.end();
});
