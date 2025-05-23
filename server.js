import express from 'express';
import mysql from 'mysql2';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors'; //Cross-Origin Resource Sharing, sistem keamanan browser yang mengatur fetching data yang berbeda domain

dotenv.config();
const app = express(); //objek utama dari express
const port = 3001;

 
app.use(express.urlencoded({ extended: true })); //middleware untuk membaca data dari form HTML
app.use(express.json()); //middleware untuk membaca data body dengan format JSON.
app.use(cors({
  origin: 'http://localhost:3000' // mengizinkan request dari frontend nextJS
}));

 
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'example'
}); // membuat variable db yang isinya koneksi ke database yang digunakan untuk projek ini

db.connect((err) => {
  if (err) {
    return console.error('Gagal konek ke database:', err.message);
  }
  console.log('Berhasil konek ke database!');
}); // mengeksekusi perintah db.connect, mengkoneksikan dengan database, kalau error, memberi error massage ke terminal "gagal konek ke database". kalau sukses memberi massage sukses.

// Login route
app.post('/login', (req, res) => { // req res = callback function
  const { email, password } = req.body; //jika frontend request POST ke server ini, akan mengambil value email dan password dari body request

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?'; //membuat query yang berisi SELECT * FROM users (membaca semua isi tabel users) WHERE email = ? AND password = ?'(mencari data dari array email dan password, dengan ? sebagai placeholder)
  db.query(query, [email, password], (err, results) => { // eksekusi query ke dalam db, email, password adalah data yang menggantikan placeholder ?, err, results adalah callback function
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ success: false, message: 'Database error' }); // kalau error, memberi massage ke terminal "query error", dan memberi respon ke server dengan status(500) yang berarti "internal server error" dengan massage "database error"
    }

    if (results.length > 0) {
      const username = results[0].email;
      res.json({ success: true, username });
    } else {
      res.json({ success: false, message: 'Email atau password salah' });
    } //kalau sukses (length > 0, membuat variable username dengan value email yang ditemukan, lalu mengirim respons JSON ke client dengan menampilkan username tersebut, jika password atau email tidak ditemukan/salah (length <= 0) maka akan mengirim respon JSON massage "Email atau password salah"
  });
});

// Signup route
app.post('/signup', (req, res) => { //endpoint sign up
  const { email, password } = req.body;

  const checkQuery = 'SELECT * FROM users WHERE email = ?'; //memasukkan 'checkQuery'(variable yang berisi variabel yang berisi string query SQL untuk memeriksa apakah email tertentu sudah ada di database. dengan mengecek array email (email = ?)
  db.query(checkQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' }); //kalau gagal, mengirimkan respon status(500) dan massage 'database error'

    if (results.length > 0) {
      return res.json({ success: false, message: 'Email sudah digunakan' });
    } //kalau result.length > 0 artinya sudah ada yang memakai emailnya

    const insertQuery = 'INSERT INTO users (email, password) VALUES (?, ?)'; //memasukkan 'insertQuery" dengan email dan password yang sudah diisi client
    db.query(insertQuery, [email, password], (err) => {
      if (err) return res.status(500).json({ success: false, message: 'Gagal mendaftar' }); //kalau gagal, mengirimkan respon status(500) dan massage 'Gagal mendaftar'

      res.json({ success: true, message: 'Pendaftaran berhasil!' }); //kalau sukses, memberi respon JSON massage "Pendaftaran berhasil" pada client.
    });
  });
});

 
app.listen(port, () => { 
  console.log(`🚀 Server backend berjalan di http://localhost:${port}`);
}); //menjalankan method app.Listen untuk menjalankan server web dan membuatnya mulai "mendengarkan" (listening) permintaan (request) dari client pada port tertentu. setelah sukses akan menampilkan pesan di terminal "🚀 Server backend berjalan di http://localhost:(port)" 
