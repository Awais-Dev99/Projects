"use server";

import { connectDB } from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import Post from "@/models/Post";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

// --- TYPES ---
export type ActionState = {
  error: string | null;
  success: boolean;
};

// Helper to clean and generate slugs
const generateSlug = (title: string) => {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base}-${Math.random().toString(36).substring(2, 7)}`;
};

// --- 1. LIKE / DISLIKE ACTION ---
export async function handleLikeDislike(postId: string, userId: string, type: "like" | "dislike") {
  try {
    await connectDB();
    const mainField = type === "like" ? "likes" : "dislikes";
    const oppositeField = type === "like" ? "dislikes" : "likes";

    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");

    const alreadyDone = post[mainField].some((id: any) => id.toString() === userId);

    if (alreadyDone) {
      await Post.findByIdAndUpdate(postId, { $pull: { [mainField]: userId } });
    } else {
      await Post.findByIdAndUpdate(postId, {
        $pull: { [oppositeField]: userId },
        $addToSet: { [mainField]: userId }
      });
    }
    
    revalidatePath("/reader/dashboard");
    revalidatePath("/");
  } catch (error) {
    console.error("Like/Dislike Error:", error);
  }
}

// --- 2. COMMENT ACTIONS ---
export async function addComment(postId: string, userId: string, content: string) {
  if (!content.trim()) return { error: "Content is required" };
  try {
    await connectDB();
    const commentData = {
      user: new mongoose.Types.ObjectId(userId),
      content,
      createdAt: new Date()
    };
    await Post.findByIdAndUpdate(postId, { $push: { comments: commentData } });
    revalidatePath("/reader/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Add Comment Error:", error);
    return { error: "Failed to add comment" };
  }
}

export async function deleteComment(postId: string, commentId: string, userId: string) {
  try {
    await connectDB();
    await Post.findByIdAndUpdate(postId, {
      $pull: { comments: { _id: commentId, user: userId } }
    });
    revalidatePath("/reader/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete comment" };
  }
}

export async function updateComment(postId: string, commentId: string, userId: string, newContent: string) {
  try {
    await connectDB();
    await Post.updateOne(
      { _id: postId, "comments._id": commentId, "comments.user": userId },
      { $set: { "comments.$.content": newContent } }
    );
    revalidatePath("/reader/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update comment" };
  }
}

// --- 3. POST MANAGEMENT ---
export async function deletePost(prevState: any, id: string): Promise<ActionState> {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Unauthenticated", success: false };

    const post = await Post.findById(id);
    if (!post) return { error: "Post not found", success: false };

    // Security: Check ownership or admin status
    const isOwner = post.author.toString() === (session.user as any).id;
    const isAdmin = (session.user as any).role === "admin";

    if (!isOwner && !isAdmin) {
      return { error: "Unauthorized", success: false };
    }

    await Post.findByIdAndDelete(id);
    revalidatePath("/author/dashboard");
    revalidatePath("/");
    return { error: null, success: true };
  } catch (e) {
    return { error: "Failed to delete post", success: false };
  }
}

export async function createPost(formData: FormData, authorId: string) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || !content) return { error: "Title and Content are required" };

  try {
    await connectDB();
    const slug = generateSlug(title);

    const newPost = new Post({
      title,
      content,
      slug,
      author: new mongoose.Types.ObjectId(authorId),
      status: "published",
    });

    await newPost.save();
    revalidatePath("/author/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error.code === 11000) return { error: "Title already exists." };
    return { error: "Failed to save post." };
  }
}

export async function updatePost(postId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || !content) return { error: "Title and Content are required" };

  try {
    await connectDB();
    const updatedSlug = generateSlug(title);

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, content, slug: updatedSlug },
      { new: true }
    );

    if (!updatedPost) return { error: "Post not found" };

    revalidatePath("/author/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error.code === 11000) return { error: "An article with this title already exists." };
    return { error: "Failed to update article." };
  }
}

// --- 4. ADMIN ACTIONS ---
export async function approveAuthor(prevState: any, userId: string): Promise<ActionState> {
  if (!userId) return { error: "User ID is required", success: false };
  try {
    await connectDB();
    // Set role to author and update status
    await User.findByIdAndUpdate(userId, { role: "author", status: "approved" });
    revalidatePath("/admin/dashboard");
    return { error: null, success: true };
  } catch (error) {
    return { error: "Failed to approve author", success: false };
  }
}

export async function rejectAuthor(prevState: any, userId: string): Promise<ActionState> {
  if (!userId) return { error: "User ID is required", success: false };
  try {
    await connectDB();
    await User.findByIdAndDelete(userId);
    revalidatePath("/admin/dashboard");
    return { error: null, success: true };
  } catch (error) {
    return { error: "Failed to reject author", success: false };
  }
}