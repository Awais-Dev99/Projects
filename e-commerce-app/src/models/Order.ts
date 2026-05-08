import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      title: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    }
  ],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  status: { 
    type: String, 
    enum: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'], 
    default: 'Processing' 
  },
  trackingNumber: { type: String, default: '' },
  paymentIntentId: { type: String }, // For Stripe reconciliation
}, { timestamps: true });

const Order = models.Order || model('Order', OrderSchema);
export default Order;