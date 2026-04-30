import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User"; // Required to register the schema for population
import { getServerSession } from "next-auth";
import InteractionBar from "@/components/InteractionBar";

export default async function ReaderDashboard() {
  await connectDB();
  const session = await getServerSession();

  // 1. We now use deep population to get the name of every commenter
  // 2. We also fetch the full comments array to pass to the client component
  const allArticles = await Post.find({ status: "published" })
    .populate("author", "name") 
    .populate({
      path: "comments.user",
      select: "name" // Only pull the name of the commenter
    })
    .sort({ createdAt: -1 });

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-black mb-8 text-gray-900">Recommended for you</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {allArticles.length === 0 ? (
          <p className="text-gray-500 italic">No articles found.</p>
        ) : (
          allArticles.map((post) => (
            <div key={post._id.toString()} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-between items-start mb-2">
                   <h2 className="text-2xl font-bold text-gray-800 line-clamp-2">{post.title}</h2>
                </div>
                <p className="text-gray-500 line-clamp-3 mb-6 text-sm">
                  {post.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                </p>
              </div>
              
              <div className="flex flex-col gap-4 border-t pt-4 mt-auto">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    By {post.author?.name || "Deleted User"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {/* 
                   We pass the entire 'comments' array now. 
                   Since we populated 'comments.user', each comment object 
                   contains the name of the reader who wrote it.
                */}
                <InteractionBar 
                  postId={post._id.toString()}
                  slug={post.slug}
                  initialLikes={post.likes?.length || 0}
                  initialDislikes={post.dislikes?.length || 0}
                  initialComments={JSON.parse(JSON.stringify(post.comments || []))} 
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}