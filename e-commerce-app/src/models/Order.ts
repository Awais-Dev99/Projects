import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Orders must be tied to an authenticated user
  },
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      title: String,
      quantity: Number,
      price: Number,
    }
  ],
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, default: "Credit Card" },
  cardLast4: { type: String, required: true },
  cardExpiry: { type: String, required: true },
  status: { type: String, default: "Pending" }, // Pending, Processing, Shipped, Delivered, Cancelled
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);