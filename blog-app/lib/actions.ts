"use server";

import { connectDB } from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import Post from "@/models/Post";
import User from "@/models/User"; 
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import mongoose from "mongoose"; // Import mongoose for ObjectId casting

// --- 1. LIKE / DISLIKE ACTION ---
export async function handleLikeDislike(postId: string, userId: string, type: "like" | "dislike") {
  try {
    await connectDB();
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");

    const mainField = type === "like" ? "likes" : "dislikes";
    const oppositeField = type === "like" ? "dislikes" : "likes";

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

// --- 2. ADD COMMENT ACTION ---
export async function addComment(postId: string, userId: string, content: string) {
  if (!content.trim()) return { error: "Content is required" };
  try {
    await connectDB();
    const commentData = { 
      user: new mongoose.Types.ObjectId(userId), // Cast to ObjectId
      content, 
      createdAt: new Date() 
    };
    await Post.findByIdAndUpdate(postId, { $push: { comments: commentData } });
    revalidatePath("/reader/dashboard");
    revalidatePath("/");
  } catch (error) {
    console.error("Add Comment Error:", error);
  }
}

// --- 3. DELETE COMMENT ACTION ---
export async function deleteComment(postId: string, commentId: string, userId: string) {
  try {
    await connectDB();
    await Post.findByIdAndUpdate(postId, {
      $pull: { comments: { _id: commentId, user: userId } }
    });
    revalidatePath("/reader/dashboard");
  } catch (error) {
    console.error("Delete Comment Error:", error);
  }
}

// --- 4. UPDATE COMMENT ACTION ---
export async function updateComment(postId: string, commentId: string, userId: string, newContent: string) {
  try {
    await connectDB();
    await Post.updateOne(
      { _id: postId, "comments._id": commentId, "comments.user": userId },
      { $set: { "comments.$.content": newContent } }
    );
    revalidatePath("/reader/dashboard");
  } catch (error) {
    console.error("Update Comment Error:", error);
  }
}
export async function deletePost(prevState: any, formData: FormData) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const postId = formData.get("id");

    if (!session) return { error: "Unauthenticated" };

    const post = await Post.findById(postId);
    if (!post) return { error: "Post not found" };

    // Security: Check if the user owns the post
    if (post.author.toString() !== (session.user as any).id && session.user.role !== "admin") {
      return { error: "Unauthorized" };
    }

    await Post.findByIdAndDelete(postId);
    
    revalidatePath("/author/dashboard");
    return { success: true };
  } catch (e) {
    return { error: "Failed to delete post" };
  }
}
export type ActionState = {
  error: string | null;
  success: boolean;
};
// --- 5. ADMIN ACTIONS ---
export async function approveAuthor(prevState: any,formData: FormData) {
  const userId = formData.get("id") as string;
  if (!userId) return { error: "User ID is required" };
  try {
    await connectDB();
    await User.findByIdAndUpdate(userId, { status: "approved" });
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Failed to approve author" };
  }
}

export async function rejectAuthor(formData: FormData) {
  const userId = formData.get("id") as string;
  if (!userId) return { error: "User ID is required" };
  try {
    await connectDB();
    await User.findByIdAndDelete(userId);
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Failed to reject author" };
  }
}

// --- 6. CREATE POST (CRITICAL UPDATE) ---
export async function createPost(formData: FormData, authorId: string) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || !content) return { error: "Title and Content are required" };

  try {
    await connectDB();

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Clean special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with -
      .replace(/^-+|-+$/g, ""); // Trim dashes
      + "-" + Math.random().toString(36).substring(2, 7);

    const newPost = new Post({
      title,
      content,
      slug,
      author: new mongoose.Types.ObjectId(authorId), // CRITICAL: Convert string ID to ObjectId
      status: "published",
    });

    await newPost.save();

    // Revalidate multiple paths to ensure UI updates
    revalidatePath("/author/dashboard");
    revalidatePath("/reader/dashboard");
    revalidatePath("/");
    
    return { success: true };
  } catch (error: any) {
    console.error("Create Post Error:", error);
    if (error.code === 11000) return { error: "Title already exists." };
    return { error: "Failed to save post." };
  }
}
// --- 7. UPDATE POST ACTION ---
export async function updatePost(postId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || !content) return { error: "Title and Content are required" };

  try {
    await connectDB();

    // 1. Generate a clean, updated slug
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    
    // Optional: Keep the slug unique by adding a short random string
    const updatedSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 5)}`;

    // 2. Perform the update
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        title,
        content,
        slug: updatedSlug,
      },
      { new: true } // returns the updated document
    );

    if (!updatedPost) return { error: "Post not found" };

    // 3. Revalidate paths to clear the Next.js cache
    revalidatePath("/author/dashboard");
    revalidatePath(`/post/${updatedSlug}`); // Revalidate the new slug path
    revalidatePath("/reader/dashboard");
    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    console.error("Update Post Error:", error);
    if (error.code === 11000) return { error: "An article with this title already exists." };
    return { error: "Failed to update article." };
  }
}