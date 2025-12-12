const express = require("express")
const app = express();
const PORT = 5000;
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cors = require("cors")

//app.use(cors())

app.use(express.json());

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./inventory.db');



const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.json({eror_msg :"Invalid JWT Token"});
  } else {
    jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
      if (error) {
        response.status(401);
        response.json({error_msg :"Invalid JWT Token"});
      } else {
        next();
      }
    });
  }
};


app.get("/users", authenticateToken , (req, res)=>{
  db.all(`select * from users`,[],(err, rows) =>{
    res.json(rows)
  })
})

app.post ("/register", async (req, res)=>{
  const {name, password} = req.body
  const hashedPassword = await bcrypt.hash(password, 10);

  db.get(`select * from users where name = '${name}'`,(err, user) =>{
    if (err) return res.json({error:  err})
    if (user === undefined){
    db.run(`insert into users (name, password) values(?,?)`, [name, hashedPassword], (err)=>{
      if (err) return res.status(500).json({ error: err });
      const payload = {
        name: name,
      };
      const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
      res.send({ jwtToken });
    })
  }else {
    res.status = 400;
    res.json({error_msg :"User already exists"});
  }
  })
})

app.post("/login", async (req, res)=>{
  const {name, password} = req.body

   db.get(`select * from users where name = '${name}'`,async (err, user) =>{
    if (err) return res.json({error:  err})
    if (user === undefined){
      res.status(400);
      res.json({error_msg :"Invalid User"});
    }else {
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (isPasswordMatched) {
      const payload = {
        name: name,
      };
      const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
      res.json({ jwtToken });
    } else {
      res.status(400);
      res.json({error_msg:"Invalid Password"});
    }
  }})

})

app.delete("/users/:id", async (req, res)=>{
  const {id} = req.params
  const query = `delete from users where id = ${id}`
  await db.run(query)
  res.json({msg : 'done'})
})


app.get("/api/products", authenticateToken, (req, res) => {
  let { name, category } = req.query;

  // Convert " " " into empty string
  if (name === '""') name = "";
  if (category === '""') category = "";

  let query = "SELECT * FROM products WHERE 1=1";
  let params = [];

  // Only filter if NOT empty
  if (name && name.trim() !== "") {
    query += " AND name LIKE ?";
    params.push(`%${name}%`);
  }

  if (category && category.trim() !== "") {
    query += " AND category = ?";
    params.push(category);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(rows);
  });
});

// UPDATE STOCK + HISTORY

app.put("/api/products/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { new_stock, name, brand, user_info } = req.body;

   if (new_stock === undefined) {
    return res.status(400).json({ error: "new_stock is required" });
  }

  const newStock = Number(new_stock);

  db.get("SELECT stock FROM products WHERE id = ?", [id], (err, product) => {
    if (err || !product)
      return res.status(404).json({ error: "Product not found" });

    const old_quantity = product.stock;

  db.run("UPDATE products SET stock = ?, name = ?, brand = ? WHERE id = ?", [newStock, name, brand, id], (err) => {
      if (err) return res.status(500).json({ error: err });

      // Insert into history
      const historyQuery = `
        INSERT INTO inventory_history (product_id, old_quantity, new_quantity, change_date, user_info)
        VALUES (?, ?, ?, datetime('now'), ?)
      `;

db.run(historyQuery, [id, old_quantity, new_stock, user_info || "updated"], (err) => {
        if (err) return res.status(500).json({ error: err });

        res.json({ message: "Stock updated", old_quantity, new_quantity: new_stock, name });
      });
    });
  });
});


app.delete("/api/products/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err });

    if (this.changes === 0)
      return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product deleted" });
  });
});


// GET INVENTORY HISTORY FOR A PRODUCT

app.get("/api/products/:id/history", authenticateToken, (req, res) => {
  const { id } = req.params;

  db.all("SELECT * FROM inventory_history WHERE product_id = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

app.post("/products",authenticateToken, async (req, res)=>{
  const {name, stock, category, brand} = req.body

  const addQuery = `insert into products (name, category, brand, stock)
  values('${name}', '${category}', '${brand}', ${stock})`

  const dbResponse = await db.run(addQuery)
  const productId = dbResponse.lastID
  res.send(productId)
})


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


