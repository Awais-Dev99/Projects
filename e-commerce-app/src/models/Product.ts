import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: false , default: "General"},
  images: {
    type: [String], // Array of strings
    required: true
  },
  stock: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const Product = models.Product || model('Product', ProductSchema);
export default Product;