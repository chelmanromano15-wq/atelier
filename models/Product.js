import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 1 },
  category: { type: String, enum: ["seara", "mireasa", "gala", "couture"], required: true },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  images: [{ type: String, required: true }],
  shortDesc: String,
  description: String,
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
