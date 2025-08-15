const express = require("express");
const router = express.Router();
const db = require("./db"); // koneksi mysql2 versi callback

// GET all items
router.get("/", (req, res) => {
  db.query("SELECT * FROM items", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Gagal mengambil data" });
    }
    res.json(rows);
  });
});

// GET item by ID
router.get("/by-id/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM items WHERE id = ?", [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Gagal mengambil data item berdasarkan ID" });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: "Item tidak ditemukan" });
    }

    res.json(rows[0]);
  });
});

// Ambil item berdasarkan kategori
router.get("/by-category/:category", (req, res) => {
  const { category } = req.params;

  db.query(
    "SELECT name, store, price FROM items WHERE LOWER(category) = LOWER(?)",
    [category],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Gagal mengambil produk berdasarkan kategori" });
      }
      if (rows.length === 0) {
        return res.status(404).json({ error: "Produk tidak ditemukan" });
      }

      res.json(rows);
    }
  );
});


// POST buat item baru
router.post("/", (req, res) => {
  const { name, store, price, category } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: "Nama dan harga wajib diisi" });
  }

  db.query(
    "INSERT INTO items (name, store, price, category) VALUES (?, ?, ?, ?)",
    [name, store, price, category],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Gagal menambahkan data" });
      }
      res.status(201).json({ id: result.insertId, name, store, price, category });
    }
  );
});

// PUT update item
router.put("/:id", (req, res) => {
  const { name, store, price, category } = req.body;
  db.query(
    "UPDATE items SET name = ?, store = ?, price = ?, category = ? WHERE id = ?",
    [name, store, price, category, req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Gagal mengupdate data" });
      }
      res.json({ message: "Item berhasil diupdate" });
    }
  );
});

// DELETE item
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM items WHERE id = ?", [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Gagal menghapus data" });
    }
    res.json({ message: "Item berhasil dihapus" });
  });
});

// GET distinct categories
router.get("/category", (req, res) => {
  const { startsWith } = req.query;

  const query = startsWith
    ? "SELECT DISTINCT category AS name FROM items WHERE category LIKE ?"
    : "SELECT DISTINCT category AS name FROM items";

  const params = startsWith ? [`${startsWith}%`] : [];

  db.query(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Gagal mengambil kategori" });
    }

    const categories = rows.map((row) => ({
      id: row.name.toLowerCase().replace(/\s+/g, "-"),
      name: row.name,
    }));

    res.json(categories);
  });
});

// POST add new category
router.post("/category", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nama kategori wajib diisi" });
  }

    db.query(
    "INSERT INTO items (name, store, price, category) VALUES (?, ?, ?, ?)",
    ["dummy", "dummy", 0, name],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Gagal menambahkan kategori" });
      res.status(201).json({ id: result.insertId, name });
    }
  );
});

module.exports = router;
