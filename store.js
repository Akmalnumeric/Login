const express = require("express");
const router = express.Router();
const db = require("./db");

router.get("/", (req, res) => {
  const query = "SELECT store_id, name FROM store"; 

  db.query(query, (err, rows) => {
    if (err) {
      console.error("Error ambil stores:", err);
      return res.status(500).json({ error: "Gagal mengambil toko" });
    }

    const store = rows.map((row) => ({
      id: row.id,
      name: row.name,
    }));

    res.json(store);
  });
});

router.post("/", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nama toko wajib diisi" });
  }

    db.query(
    "INSERT INTO store (name) VALUES (?)",
    [name],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Gagal menambahkan toko" });
      res.status(201).json({ id: result.insertId, name });
    }
  );
});

router.delete("/", (req, res) => {
  const { category } = req.params;
  db.query("DELETE FROM store WHERE LOWER(name)) = LOWER(?)", [category], (err, result) => {
    if (err) {
      console.error("ERR DELETE category", err);
      return res.status(500).json({ error: "Gagal menghapus toko" });
    }
    res.json({
      success: true,
      deleted: result.affectedRows,
      category,
      message: "Toko berhasil dihapus"
    });
  });
});


module.exports = router;
