import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User"; // REQUIRED: Explicitly import for Mongoose population
import { notFound } from "next/navigation";
import InteractionBar from "@/components/InteractionBar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: BlogPostProps) {
  await connectDB();
  
  // Next.js 15: params must be awaited
  const { slug } = await params;

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  // Fetch post and "join" user names for the author and all commenters
  const rawPost = await Post.findOne({ slug })
    .populate({
      path: "author",
      model: User,
      select: "name",
    })
    .populate({
      path: "comments.user", // Look inside the comments array
      model: User,           // Target the User collection
      select: "name",        // Only retrieve the name field
    })
    .lean();

  if (!rawPost) {
    notFound();
  }

  // Serialization: Converts MongoDB ObjectIDs to strings for the Client Component
  const post = JSON.parse(JSON.stringify(rawPost));

  return (
    <article className="min-h-screen bg-white">
      {/* Sticky Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-colors">
            ← Back to Feed
          </Link>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 hidden sm:block">
            Reading Mode
          </span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-16 md:pt-24 pb-32">
        {/* Article Header */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-12 bg-blue-600 rounded-full" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-600">Article</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[0.95] mb-8">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 border-l-4 border-gray-900 pl-6 py-2">
            <div className="space-y-1">
              <p className="text-sm font-black text-gray-900 uppercase tracking-tight">
                {post.author?.name || "Anonymous Writer"}
              </p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {new Date(post.createdAt).toLocaleDateString(undefined, { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <div 
          className="prose prose-lg max-w-none mb-20 whitespace-pre-wrap text-gray-800 leading-[1.8] font-serif selection:bg-blue-100 selection:text-blue-900"
        >
          {post.content}
        </div>

        {/* Comment & Interaction Footer */}
        <footer className="border-t border-gray-100 pt-16">
          <div className="bg-slate-50 rounded-[3rem] p-8 md:p-12 shadow-inner border border-gray-100">
            <div className="mb-10 text-center">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">What do you think?</h3>
              <p className="text-gray-500 text-sm mt-1 font-medium">Join the conversation below</p>
            </div>
            
            <InteractionBar 
              postId={post._id}
              userId={userId}
              initialLikes={post.likes?.length || 0}
              initialDislikes={post.dislikes?.length || 0}
              initialComments={post.comments || []}
            />
          </div>
        </footer>
      </div>
    </article>
  );
}