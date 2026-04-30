import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AuthorDashboard() {
  await connectDB();
  
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  // 1. Authentication & Session Check
  if (!session || !userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <p className="text-gray-600 text-lg">Please log in to view your dashboard.</p>
        <Link href="/login" className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-gray-800 transition-all">
          Go to Login
        </Link>
      </div>
    );
  }

  // 2. Data Fetching with ID Validation
  const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);
  let myPosts = [];

  if (isValidObjectId) {
    myPosts = await Post.find({ 
      author: new mongoose.Types.ObjectId(userId) 
    }).sort({ createdAt: -1 });
  } else {
    console.warn("DASHBOARD WARNING: User ID is not a valid MongoDB ObjectId:", userId);
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Articles</h1>
          <p className="text-gray-500 mt-2 text-lg">Manage, edit, and track your published content.</p>
        </div>
        <Link 
          href="/author/create" 
          className="bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl active:scale-95"
        >
          + Create New Article
        </Link>
      </div>

      {/* Articles List */}
      <div className="grid gap-6">
        {myPosts.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-[2rem] p-20 text-center bg-gray-50/50">
            <p className="text-gray-400 text-xl font-medium">
              {isValidObjectId 
                ? "You haven't published any articles yet." 
                : "Admin accounts cannot view articles here. Please use an Author account."}
            </p>
            {isValidObjectId && (
              <Link href="/author/create" className="text-blue-600 font-bold mt-4 inline-block hover:underline">
                Write your first post now →
              </Link>
            )}
          </div>
        ) : (
          myPosts.map((post) => (
            <div 
              key={post._id.toString()} 
              className="bg-white border border-gray-100 p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm hover:shadow-xl hover:border-gray-200 transition-all group"
            >
              <div className="space-y-3 mb-6 md:mb-0">
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {post.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4">
                  <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-[0.1em] ${
                    post.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {post.status || 'Draft'}
                  </span>
                  <span className="text-sm text-gray-400 font-medium">
                    Published {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Link 
  href={`/author/edit/${post._id.toString()}`}
  className="px-6 py-2 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors"
>
  Edit
</Link>
                <Link 
                  href={`/blog/${post.slug}`} 
                  className="bg-gray-100 text-gray-900 w-12 h-12 rounded-xl flex items-center justify-center font-bold hover:bg-black hover:text-white transition-all shadow-sm"
                  title="View Live Article"
                >
                  →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}