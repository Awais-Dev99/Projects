import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { notFound } from "next/navigation";
import InteractionBar from "@/components/InteractionBar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  await connectDB();
  
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const rawPost = await Post.findOne({ slug: slug })
    .populate("author", "name")
    .populate("comments.user", "name")
    .lean();

  if (!rawPost) {
    notFound();
  }

  // Serialization to handle MongoDB ObjectIDs for the Client Component (InteractionBar)
  const post = JSON.parse(JSON.stringify(rawPost));

  return (
    <article className="min-h-screen bg-white">
      {/* Subtle Progress/Back Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-colors">
            ← Back to Feed
          </Link>
          <div className="hidden sm:block">
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Reading Mode</span>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-16 md:pt-24 pb-32">
        {/* Post Header */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
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

        {/* Article Body */}
        <div className="prose prose-lg max-w-none mb-20 whitespace-pre-wrap text-gray-800 leading-[1.8] font-serif selection:bg-blue-100 selection:text-blue-900">
          {post.content}
        </div>

        {/* Interaction Section */}
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