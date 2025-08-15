const express = require("express");
const router = express.Router();
const db = require("./db"); // sesuaikan path koneksi DB kamu

// Ganti password
router.post("/", (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // Cek apakah user sudah login
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const username = req.session.user.username;

  // 1. Ambil password lama dari database
  db.query("SELECT password FROM users WHERE username = ?", [username], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const currentPassword = results[0].password;

    // 2. Cek apakah password lama cocok
    if (oldPassword !== currentPassword) {
      return res.status(400).json({ success: false, message: "Password lama salah" });
    }

    // 3. Update password baru
    db.query("UPDATE users SET password = ? WHERE username = ?", [newPassword, username], (err) => {
      if (err) return res.status(500).json({ success: false, message: "Gagal update password" });

      res.json({ success: true });
    });
  });
});

module.exports = router;
