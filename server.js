const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcrypt');
const accountsRoutes = require('./accounts');
const passRoutes = require('./password-change');
const itemsRoutes = require('./items');
const categoryRoutes = require('./category')
const storeRoutes = require('./store')

dotenv.config();
const app = express();
const port = 3001;

// Middleware untuk session
app.use(session({
  secret: 'rahasia-super-aman',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true kalau pakai HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60
  },
}));

// Middleware umum
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Koneksi ke database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use("/accounts", accountsRoutes);
app.use("/password-change", passRoutes);
app.use("/items", itemsRoutes);
app.use("/category", categoryRoutes);
app.use("/store", storeRoutes);

db.connect((err) => {
  if (err) {
    return console.error('Gagal konek ke database:', err.message);
  }
  console.log('Berhasil konek ke database!');
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length > 0) {
      const user = results[0];
      bcrypt.compare(password, user.password, (err, Matched) => {
        if (err) return res.status(500).json({ success: false, message: 'Error saat verifikasi password' });

        if (Matched) {
          req.session.user = { id: user.id, email: user.email };
          const username = user.email.split("@")[0];
          res.json({ success: true, email: user.username, username });
        } else {
          res.json({ success: false, message: 'Email atau password salah' });
        }
      });
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

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ success: false, message: 'Error saat enkripsi password' });

      const insertQuery = 'INSERT INTO users (email, password) VALUES (?, ?)';
      db.query(insertQuery, [email, hashedPassword], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Gagal mendaftar' });

        res.json({ success: true, message: 'Pendaftaran berhasil!' });
      });
    });
  });
});

// Ambil semua user (hanya id dan email)
app.get('/users', (req, res) => {
  db.query('SELECT id, email FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Gagal mengambil user' });
    }
    res.json(results);
  });
});

// Ganti password user berdasarkan ID
app.put('/users/:id/password', (req, res) => {
  const userId = req.params.id;
  const { oldPassword, newPassword } = req.body;

  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Field tidak lengkap' });
  }

  const getQuery = 'SELECT * FROM users WHERE id = ?';

  db.query(getQuery, [userId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    const user = results[0];

    bcrypt.compare(oldPassword, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ success: false, message: 'Gagal verifikasi password lama' });

      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Password lama salah' });
      }

      bcrypt.hash(newPassword, 10, (err, hashedNewPassword) => {
        if (err) return res.status(500).json({ success: false, message: 'Gagal hash password baru' });

        const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
        db.query(updateQuery, [hashedNewPassword, userId], (err) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Gagal update password' });
          }

          res.json({ success: true, message: 'Password berhasil diubah!' });
        });
      });
    });
  });
});



// Start server
app.listen(port, () => {
  console.log(`🚀 Server backend berjalan di http://localhost:${port}`);
});
