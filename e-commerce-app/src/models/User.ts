import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  image: { type: String },
}, { timestamps: true });

// Next.js fix: prevents recreating the model on every hot reload
const User = models.User || model('User', UserSchema);
export default User;