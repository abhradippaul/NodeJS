import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    tags: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;