import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AuthorProfile({ params }: { params: { id: string } }) {
  await connectDB();
  
  const [author, posts] = await Promise.all([
    User.findById(params.id),
    Post.find({ author: params.id, status: "published" }).sort({ createdAt: -1 })
  ]);

  if (!author) notFound();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* AUTHOR HEADER */}
      <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 mb-12 text-center">
        <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-4xl font-black text-white mb-4">
          {author.name[0]}
        </div>
        <h1 className="text-3xl font-black text-slate-900">{author.name}</h1>
        <p className="text-slate-500 mt-2 capitalize font-medium">{author.role} • {posts.length} Articles</p>
      </div>

      {/* AUTHOR'S POST GRID */}
      <h2 className="text-xl font-bold text-slate-800 mb-8">Published Stories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link key={post._id} href={`/blog/${post.slug}`}>
            <div className="group bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-300 transition-all shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                {post.title}
              </h3>
              <p className="text-slate-500 text-sm mt-2 line-clamp-2">
                {post.content}
              </p>
              <div className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}