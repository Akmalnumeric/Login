import express from 'express';
import mysql from 'mysql2';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const port = 3001;

 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000' // frontend Next.js
}));

 
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'example'
});

db.connect((err) => {
  if (err) {
    return console.error('Gagal konek ke database:', err.message);
  }
  console.log('Berhasil konek ke database!');
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length > 0) {
      const username = results[0].email;
      res.json({ success: true, username });
    } else {
      res.json({ success: false, message: 'Email atau password salah' });
    }
  });
});

// Signup route
app.post('/signup', (req, res) => {
  const { email, password } = req.body;

  const checkQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });

    if (results.length > 0) {
      return res.json({ success: false, message: 'Email sudah digunakan' });
    }

    const insertQuery = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(insertQuery, [email, password], (err) => {
      if (err) return res.status(500).json({ success: false, message: 'Gagal mendaftar' });

      res.json({ success: true, message: 'Pendaftaran berhasil!' });
    });
  });
});

 
app.listen(port, () => {
  console.log(`🚀 Server backend berjalan di http://localhost:${port}`);
});
