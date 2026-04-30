import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User"; 
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import InteractionBar from "@/components/InteractionBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  await connectDB();
  
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  // 1. Fetch posts and use .lean() correctly (removed the extra semicolon)
  // We explicitly select comments to ensure the array is present for the count
  const rawPosts = await Post.find({ status: "published" })
    .populate("author", "name") 
    .populate({
    path: "comments.user",
    select: "name"
  })
    .select("+comments")
    .sort({ createdAt: -1 })
    .lean();

  // 2. Critical: Serialize the data to prevent "Maximum Call Stack" errors
  const posts = JSON.parse(JSON.stringify(rawPosts));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Latest Articles</h1>
        <p className="text-gray-500 mt-2 text-lg">Explore stories from our community of authors.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: any) => (
          <div 
            key={post._id} 
            className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
          >
            {/* Post Content */}
            <div className="p-8 flex-1">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-black border border-blue-100">
                  {post.author?.name?.charAt(0) || "U"}
                </span>
                <span className="text-sm font-bold text-gray-700">
                  {post.author?.name || "Deleted User"}
                </span>
              </div>

              {/* Fixed link to match your 'blog' folder */}
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h2>
              </Link>
              
              <p className="text-gray-500 line-clamp-3 mb-6 text-sm leading-relaxed">
                {post.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
              </p>
              
              <div className="flex items-center justify-between border-t border-gray-50 pt-5">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Published {new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </span>
              </div>
            </div>

            {/* --- INTERACTION SECTION --- */}
            <div className="bg-gray-50/80 px-8 py-5 flex items-center justify-between border-t border-gray-100">
              <InteractionBar 
                postId={post._id}
                userId={userId} 
                initialLikes={post.likes?.length || 0}
                initialDislikes={post.dislikes?.length || 0}
                initialComments={post.comments || []}
                isDashboard={true}
              />

              <Link 
                href={`/blog/${post.slug}`}
                className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 hover:text-blue-800 transition-colors"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
          <p className="text-gray-400 text-lg font-medium">No articles have been published yet.</p>
        </div>
      )}
    </div>
  );
}