import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { notFound } from "next/navigation";
import InteractionBar from "@/components/InteractionBar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  await connectDB();
  
  // 1. Unwrap the params Promise
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  // 2. Fetch the post using .lean() to get a plain JavaScript object
  const rawPost = await Post.findOne({ slug: slug })
    .populate("author", "name")
    .populate("comments.user", "name")
    .lean();

  if (!rawPost) {
    notFound();
  }

  // 3. SERIALIZE the data: This prevents the "Maximum call stack size exceeded" error
  // by removing Mongoose internal circular references and converting ObjectIDs to strings.
  const post = JSON.parse(JSON.stringify(rawPost));

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
          {post.title}
        </h1>
        <p className="text-gray-400 mt-4 font-bold uppercase tracking-widest text-xs">
          By {post.author?.name || "Unknown"}
        </p>
      </header>

      <div className="prose max-w-none mb-16 whitespace-pre-wrap text-gray-700 leading-relaxed">
        {post.content}
      </div>

      <div className="border-t pt-10">
        <InteractionBar 
          postId={post._id}
          userId={userId} // Ensure userId is passed for comment permissions
          initialLikes={post.likes?.length || 0}
          initialDislikes={post.dislikes?.length || 0}
          initialComments={post.comments || []}
        />
      </div>
    </div>
  );
}