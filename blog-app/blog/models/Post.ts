import mongoose, { Schema, model, models } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    // Reference to the User model for population
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { 
      type: String, 
      enum: ["draft", "published"], 
      default: "published" 
    },
    // Using arrays of ObjectIds to store Reader IDs
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    
    comments: [
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
    createdAt: { type: Date, default: Date.now }
  }
],
    
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// This ensures that when we fetch posts, we can use .populate('author') 
// and .populate('comments.user') to get the names of the authors and commenters.
const Post = models.Post || model("Post", PostSchema);
export default Post;