const express = require("express");
const router = express.Router();
const db = require("./db");

router.get("/", (req, res) => {
  const query = "SELECT category_id, name FROM category"; 

  db.query(query, (err, rows) => {
    if (err) {
      console.error("Error ambil kategori:", err);
      return res.status(500).json({ error: "Gagal mengambil kategori" });
    }

    const categories = rows.map((row) => ({
      id: row.id,
      name: row.name,
    }));

    res.json(categories);
  });
});

router.post("/", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nama kategori wajib diisi" });
  }

    db.query(
    "INSERT INTO category (name) VALUES (?)",
    [name],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Gagal menambahkan kategori" });
      res.status(201).json({ id: result.insertId, name });
    }
  );
});

router.delete("/", (req, res) => {
  const { category } = req.params;
  db.query("DELETE FROM category WHERE LOWER(name)) = LOWER(?)", [category], (err, result) => {
    if (err) {
      console.error("ERR DELETE category", err);
      return res.status(500).json({ error: "Gagal menghapus kategori" });
    }
    res.json({
      success: true,
      deleted: result.affectedRows,
      category,
      message: "Kategori berhasil dihapus"
    });
  });
});


module.exports = router;
