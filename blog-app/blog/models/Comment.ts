import mongoose, { Schema, model, models } from "mongoose";

const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = models.Comment || model("Blog Comment", CommentSchema);

export default Comment;