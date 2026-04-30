import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["reader", "author", "admin"],
      default: "reader",
    },
    status: {
      type: String,
      enum: ["pending", "approved"],
      // Logic: Authors must be approved by Admin; Readers are auto-approved
      default: function (this: any) {
        return this.role === "author" ? "pending" : "approved";
      },
    },
  },
  { timestamps: true }
);

// Prevent re-compiling the model if it already exists
const User = models.User || model("User", UserSchema);
export default User;