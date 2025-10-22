import { Router } from "express";
import multer from "multer";
import path from "path";
import Product from "../models/Product.js";

const r = Router();

/* === configurare upload === */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e6) + ext);
  }
});
const upload = multer({ storage });

/* === generator cod articol === */
function generateArticleNumber() {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return "ART-" + rand;
}

/* === listare produse === */
r.get("/", async (_, res) => {
  const items = await Product.find().sort({ createdAt: -1 });
  res.json(items);
});

/* === adăugare produs cu imagini multiple === */
r.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const { name, slug, price, stock, category, shortDesc, description } = req.body;
    if (!req.files?.length) return res.status(400).json({ error: "Nu ai selectat imagini" });

    const imagePaths = req.files.map(f => "/uploads/" + f.filename);

    const p = await Product.create({
      name,
      slug,
      articleNumber: generateArticleNumber(),
      price: Number(price),
      stock: Number(stock) || 1,
      category,
      images: imagePaths,
      shortDesc,
      description
    });

    res.status(201).json(p);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default r;
