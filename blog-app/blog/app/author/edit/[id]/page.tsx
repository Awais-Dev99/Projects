import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import EditForm from "@/components/EditForm";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const resolvedParams = await params;
  const id = resolvedParams.id;

  const post = await Post.findById(id);

  // Security Check
  if (!post || post.author.toString() !== userId) {
    redirect("/author/dashboard");
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Edit Article</h1>
          <p className="text-gray-500 mt-2">Update your content and save changes.</p>
        </div>
        <Link href="/author/dashboard" className="text-sm font-bold text-gray-400 hover:text-black transition-colors">
          Cancel
        </Link>
      </div>

      {/* FIX: Pass the whole post object to match your EditForm component's Props */}
      <EditForm post={JSON.parse(JSON.stringify(post))} />
    </div>
  );
}