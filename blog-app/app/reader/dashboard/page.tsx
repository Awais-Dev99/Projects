import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ReaderDashboardClient from "./ReaderDashboardClient";

export const dynamic = "force-dynamic";

export default async function ReaderDashboard() {
  await connectDB();
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  // Fetching all published articles
  const allArticles = await Post.find({ status: "published" })
    .populate("author", "name") 
    .populate({
      path: "comments.user",
      select: "name" 
    })
    .sort({ createdAt: -1 });

  // Convert Mongoose documents to plain objects for the Client Component
  const serializedArticles = JSON.parse(JSON.stringify(allArticles));

  return (
    <ReaderDashboardClient 
      initialPosts={serializedArticles} 
      userId={userId} 
    />
  );
}