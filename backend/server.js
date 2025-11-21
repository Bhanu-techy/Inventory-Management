const express = require("express")
const app = express();
const router = express.Router();
const PORT = 3000;

app.use(express.json());

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./inventory.db');

const multer = require('multer');

const upload = multer({
  dest: 'uploads/'   
});


router.post("/import", upload.single("csvFile"), (req, res) => {
  const filePath = req.file.path;
  const results = [];

  // Read the CSV file
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      results.push(row);
    })
    .on("end", () => {
      let added = 0;
      let skipped = 0;
      let skippedItems = [];

      // Process each product row
      results.forEach((product) => {
        db.get(
          "SELECT id FROM products WHERE name = ?",
          [product.name],
          (err, existing) => {

            if (existing) {
              skipped++;
              skippedItems.push(product);
            } else {
              db.run(
                `INSERT INTO products (name, unit, category, brand, stock, status, image)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                  product.name,
                  product.unit,
                  product.category,
                  product.brand,
                  product.stock,
                  product.status,
                  product.image
                ]
              );
              added++;
            }
          }
        );
      });

      // Wait a moment for async inserts
      setTimeout(() => {
        res.json({
          message: "Import completed",
          addedCount: added,
          skippedCount: skipped,
          skippedItems,
        });

        // delete uploaded CSV file
        fs.unlinkSync(filePath);
      }, 500);
    });
});



app.get("/api/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

// UPDATE STOCK + HISTORY

app.put("/api/products/:id/stock", (req, res) => {
  const { id } = req.params;
  const { new_stock, user_info } = req.body;

  if (new_stock == null) {
    return res.status(400).json({ error: "new_stock is required" });
  }

  // Get current stock
  db.get("SELECT stock FROM products WHERE id = ?", [id], (err, product) => {
    if (err || !product)
      return res.status(404).json({ error: "Product not found" });

    const old_quantity = product.stock;

    // Update stock
  db.run("UPDATE products SET stock = ? WHERE id = ?", [new_stock, id], (err) => {
      if (err) return res.status(500).json({ error: err });

      // Insert into history
      const historyQuery = `
        INSERT INTO inventory_history (product_id, old_quantity, new_quantity, change_date, user_info)
        VALUES (?, ?, ?, datetime('now'), ?)
      `;

db.run(historyQuery, [id, old_quantity, new_stock, user_info || "system"], (err) => {
        if (err) return res.status(500).json({ error: err });

        res.json({ message: "Stock updated", old_quantity, new_quantity: new_stock });
      });
    });
  });
});


app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err });

    if (this.changes === 0)
      return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product deleted" });
  });
});


// GET INVENTORY HISTORY FOR A PRODUCT

app.get("/api/products/:id/history", (req, res) => {
  const { id } = req.params;

  db.all("SELECT * FROM inventory_history WHERE product_id = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

router.get("/products/export", (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }

        let csv = "id,name,unit,category,brand,stock,status,image\n";

        rows.forEach(row => {
            csv += `${row.id},${row.name},${row.unit},${row.category},${row.brand},${row.stock},${row.status},${row.image}\n`;
        });

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=products.csv");

        res.send(csv);
    });
});



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
