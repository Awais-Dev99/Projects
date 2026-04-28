import mongoose, { Schema, model, models } from "mongoose";

const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Article = models.Article || model("Blog Article", ArticleSchema);

export default Article;