const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 5000;
const DB_FILE = "db.json";

app.use(cors());
app.use(express.json());

// Helper: read DB
const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));

// Helper: write DB
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");

// ------------------- USERS ROUTES -------------------

// Get all users
app.get("/users", (req, res) => {
  const db = readDB();
  res.json(db.users);
});

// Get user by ID
app.get("/users/:id", (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");
  res.json(user);
});

// Create new user
app.post("/users", (req, res) => {
  const db = readDB();
  const newUser = req.body;
  newUser.id = db.users.length ? db.users[db.users.length - 1].id + 1 : 1;
  newUser.cart = [];
  newUser.orders = [];
  db.users.push(newUser);
  writeDB(db);
  res.status(201).json(newUser);
});

// Update user
app.put("/users/:id", (req, res) => {
  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) return res.status(404).send("User not found");
  db.users[userIndex] = { ...db.users[userIndex], ...req.body, id: db.users[userIndex].id };
  writeDB(db);
  res.json(db.users[userIndex]);
});

// Delete user
app.delete("/users/:id", (req, res) => {
  const db = readDB();
  const newUsers = db.users.filter(u => u.id !== parseInt(req.params.id));
  if (newUsers.length === db.users.length) return res.status(404).send("User not found");
  db.users = newUsers;
  writeDB(db);
  res.status(204).send();
});

// ------------------- PRODUCTS ROUTES -------------------

// Get all products
app.get("/products", (req, res) => {
  const db = readDB();
  res.json(db.products);
});

// Get product by ID
app.get("/products/:id", (req, res) => {
  const db = readDB();
  const product = db.products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).send("Product not found");
  res.json(product);
});

// Create product
app.post("/products", (req, res) => {
  const db = readDB();
  const newProduct = req.body;
  newProduct.id = db.products.length ? db.products[db.products.length - 1].id + 1 : 1;
  db.products.push(newProduct);
  writeDB(db);
  res.status(201).json(newProduct);
});

// Update product
app.put("/products/:id", (req, res) => {
  const db = readDB();
  const idx = db.products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).send("Product not found");
  db.products[idx] = { ...db.products[idx], ...req.body, id: db.products[idx].id };
  writeDB(db);
  res.json(db.products[idx]);
});

// Delete product
app.delete("/products/:id", (req, res) => {
  const db = readDB();
  const newProducts = db.products.filter(p => p.id !== parseInt(req.params.id));
  if (newProducts.length === db.products.length) return res.status(404).send("Product not found");
  db.products = newProducts;
  writeDB(db);
  res.status(204).send();
});

// ------------------- START SERVER -------------------

app.get("/", (req, res) => res.send("✅ Server running!"));
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

