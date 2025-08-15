const express = require("express");
const router = express.Router();
const db = require("./db");

// GET all accounts
router.get("/", (req, res) => {
  db.query("SELECT * FROM accounts", (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(results);
  });
});

// POST new account
router.post("/", (req, res) => {
  const { username, active, keterangan } = req.body;
  const createdBy = req.session.user?.id;
  console.log("💡 Body:", req.body);
  console.log("💡 Session:", req.session);
  if (!username) return res.status(400).json({ message: "Username wajib diisi" });
  if (!username || !createdBy) {
    return res.status(400).json({ success: false, message: "Data tidak lengkap atau belum login" });
  }

  const query = "INSERT INTO accounts (username, active, keterangan, created_by) VALUES (?, ?, ?, ?)";
  db.query(query, [username, active, keterangan, createdBy], (err) => {
    if (err) return res.status(500).json({ message: "Gagal tambah user" });
    res.json({ message: "User berhasil ditambahkan" });
  });
});

// PUT update account 
router.put("/:username", (req, res) => {
  const { username } = req.params;
  const { active, keterangan } = req.body;

  const query = "UPDATE accounts SET active = ?, keterangan = ? WHERE username = ?";
  db.query(query, [active, keterangan, username], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal update user" });
    res.json({ message: "User berhasil diupdate" });
  });
});

// DELETE account 
router.delete("/:username", (req, res) => {
  const { username } = req.params;

  db.query("DELETE FROM accounts WHERE username = ?", [username], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal hapus user" });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json({ message: "User berhasil dihapus" });
  });
});

module.exports = router;
