import mongoose, { model, models } from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["user", "admin"], 
    default: "user" 
  },
  cardLast4: { type: String },
  cardExpiry: { type: String },
}, { timestamps: true });

// Next.js fix: prevents recreating the model on every hot reload
const User = models.User || model('User', UserSchema);
export default User;
