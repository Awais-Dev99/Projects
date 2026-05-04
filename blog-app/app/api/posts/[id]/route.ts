import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Explicitly include authOptions
import { NextRequest, NextResponse } from "next/server";

// 1. params must be a Promise in Next.js 15
export async function PATCH(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  // 2. Await the params to get the ID
  const { id } = await params;
  
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { title, content } = await req.json();
    await connectDB();

    // Verify Ownership
    const post = await Post.findById(id);
    if (!post) {
        return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (post.author.toString() !== (session.user as any).id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}