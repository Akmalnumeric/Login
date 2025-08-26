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

  db.query("SELECT * FROM items WHERE items_id = ?", [id], (err, rows) => {
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

// POST /items
router.post("/", (req, res) => {
  const { name, store, price, category } = req.body;

  if (!name || !store || !price || !category) {
    return res.status(400).json({ error: "Semua field wajib diisi" });
  }

    // Cek category
  db.query("SELECT category_id FROM category WHERE name = ?", [category], (err, catResult) => {
    if (err) return res.status(500).json({ error: "Error cek category" });
    if (catResult.length === 0) return res.status(400).json({ error: "Category tidak ditemukan" });
    console.log(catResult);
    const categoryId = catResult[0].category_id;

    // Cek store
    db.query("SELECT store_id FROM store WHERE name = ?", [store], (err, storeResult) => {
      if (err) return res.status(500).json({ error: "Error cek store" });
      if (storeResult.length === 0) return res.status(400).json({ error: "Store tidak ditemukan" });
      console.log(storeResult);
      const storeId = storeResult[0].store_id;

      db.query(
        "INSERT INTO items (name, price, store, category) VALUES (?, ?, ?, ?)",
        [name, price, storeId, categoryId],
        (err, result) => {
          if (err) {
          console.error("Query Error:", err);
          return res.status(500).json({ error: "Gagal insert item" });
          }
          else;
          res.json({ 
          success: true, 
          id: result.insertId,
          name,
          price,
          store_id: storeId,
          category_id: categoryId
        });
      });
    });
  });
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



module.exports = router;
