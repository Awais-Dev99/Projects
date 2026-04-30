import Link from "next/link";

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    slug: string;
    content: string;
    createdAt: string;
    author: {
      name: string;
    };
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="group bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col h-full">
      {/* Category Tag */}
      <div className="mb-4">
        <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
          Article
        </span>
      </div>

      {/* Title */}
      <Link href={`/blog/${post.slug}`} className="flex-grow">
        <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors mb-3 leading-tight">
          {post.title}
        </h2>
        
        {/* Preview Content (truncated to 3 lines) */}
        <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed mb-6">
          {post.content}
        </p>
      </Link>

      {/* Footer / Author Info */}
      <div className="pt-5 border-t border-slate-50 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 uppercase">
            {post.author.name[0]}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 leading-none mb-1">
              {post.author.name}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Arrow Icon */}
        <div className="text-slate-300 group-hover:text-blue-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
}