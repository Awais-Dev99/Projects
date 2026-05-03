import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import AuthorDashboardClient from "./AuthorDashboardClient";

export const dynamic = "force-dynamic";

export default async function AuthorDashboard() {
  await connectDB();
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!session || !userId) return <div className="p-10">Please Log In</div>;

  const myPosts = await Post.find({ 
    author: new mongoose.Types.ObjectId(userId) 
  }).sort({ createdAt: -1 });

  // Convert MongoDB objects to plain JSON for the Client Component
  const serializedPosts = JSON.parse(JSON.stringify(myPosts));

  return <AuthorDashboardClient initialPosts={serializedPosts} />;
}