const express = require('express');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();
const app = express();
const port = 3002;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static HTML files
app.use(express.static(path.join(__dirname, 'public'))); // Folder tempat login.html & signup.html

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'example'
});

db.connect((err) => {
  if (err) {
    return console.error('Error connecting to the database:', err.message);
  }
  console.log('Connected to the database successfully!');
});

// Halaman utama (login + signup)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
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
      // Redirect kembali ke halaman utama frontend
      res.redirect(`http://localhost:3000?username=${encodeURIComponent(username)}`);
    } else {
      res.send('<script>alert("Email atau password salah"); window.location.href="/";</script>');
    }
  });
});

// Signup route
app.post('/signup', (req, res) => {
  const { email, password } = req.body;

  const checkQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length > 0) {
      return res.send('<script>alert("Email sudah digunakan"); window.location.href="/";</script>');
    }

    const insertQuery = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(insertQuery, [email, password], (err) => {
      if (err) return res.status(500).json({ message: 'Gagal mendaftar' });

      res.send('<script>alert("Pendaftaran berhasil!"); window.location.href="/";</script>');
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
