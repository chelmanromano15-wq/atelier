import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use(express.static("public"));

const __dirname = path.resolve();

// ==== Conectare MongoDB ====
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectat la MongoDB"))
  .catch((err) => console.error("❌ Eroare MongoDB:", err));

// ==== MODELE ====
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  code: String,
  bust: String,
  waist: String,
  length: String,
  images: [String],
});

const Product = mongoose.model("Product", productSchema);
const CollectionProduct = mongoose.model("CollectionProduct", productSchema);

const orderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  items: [
    {
      name: String,
      price: Number,
      code: String,
      images: [String],
    },
  ],
  total: Number,
  date: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

// ==== API PRODUSE (STOC) ====
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post("/api/products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json({ message: "Produs adăugat în stoc" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare la adăugarea produsului în stoc" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Produs șters" });
});

// ==== API COLECȚIE NOUĂ ====
app.get("/api/collection", async (req, res) => {
  const products = await CollectionProduct.find();
  res.json(products);
});

app.post("/api/collection", async (req, res) => {
  try {
    const newProduct = new CollectionProduct(req.body);
    await newProduct.save();
    res.json({ message: "Produs adăugat în colecția nouă" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare la adăugarea produsului în colecția nouă" });
  }
});

app.delete("/api/collection/:id", async (req, res) => {
  await CollectionProduct.findByIdAndDelete(req.params.id);
  res.json({ message: "Produs din colecție șters" });
});

// ==== API COMENZI ====
app.get("/api/orders", async (req, res) => {
  const orders = await Order.find().sort({ date: -1 });
  res.json(orders);
});
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch {
    res.status(404).json({ message: "Produsul nu a fost găsit" });
  }
});


app.post("/api/orders", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.json({ message: "Comandă salvată cu succes" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare la salvarea comenzii" });
  }
});

app.delete("/api/orders/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Comandă ștearsă cu succes" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare la ștergerea comenzii" });
  }
});

// ==== SERVER ====
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server pornit pe portul ${PORT}`));
