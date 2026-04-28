import mongoose, { Schema, model, models } from "mongoose";

const ReactionSchema = new Schema(
  {
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

    type: {
      type: String,
      enum: ["LIKE", "DISLIKE"],
      required: true,
    },
  },
  { timestamps: true }
);

// ❗ One reaction per user per article
ReactionSchema.index({ userId: 1, articleId: 1 }, { unique: true });

const Reaction =
  models.Reaction || model("Blog Reaction", ReactionSchema);

export default Reaction;