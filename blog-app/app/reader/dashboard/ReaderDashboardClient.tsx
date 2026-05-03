"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation"; // Added for refresh
import InteractionBar from "@/components/InteractionBar";

export default function ReaderDashboardClient({ initialPosts, userId }: { initialPosts: any[], userId: string }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [selectedId, setSelectedId] = useState(initialPosts[0]?._id || null);

  // Sync state if initialPosts changes (e.g., after router.refresh())
  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const selectedPost = useMemo(() => 
    posts.find(p => p._id === selectedId), 
    [posts, selectedId]
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white overflow-hidden font-sans">
      
      {/* SIDEBAR: Responsive feed */}
      <aside className="w-full lg:w-[350px] xl:w-[400px] flex-none border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/30 overflow-y-auto max-h-[35vh] lg:max-h-screen">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-6 bg-blue-600 rounded-full"></div>
            <span className="text-[15px] font-black uppercase tracking-[0.2em] text-blue-600">ArticleTitle</span>
          </div>
          
          <div className="space-y-2">
            {posts.map((post) => (
              <div 
                key={post._id} 
                onClick={() => setSelectedId(post._id)}
                className={`group cursor-pointer px-4 py-4 rounded-2xl transition-all duration-200 ${
                  selectedId === post._id 
                    ? "bg-white shadow-lg shadow-gray-200/50 ring-1 ring-gray-100" 
                    : "hover:bg-gray-100/50"
                }`}
              >
                <h3 className={`text-[19px] font-bold leading-snug ${
                  selectedId === post._id ? "text-blue-600" : "text-gray-900"
                }`}>
                  {post.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN VIEW: Description on full screen */}
      <main className="flex-1 flex flex-col min-h-0 bg-white overflow-y-auto">
        {selectedPost ? (
          <div className="w-full max-w-5xl mx-auto px-6 md:px-12 lg:px-20 pt-6 md:pt-25 pb-40">
            <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black text-white uppercase">
          {selectedPost.author?.name?.charAt(0) || "U"}
        </div>
        <span className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-900">
          {selectedPost.author?.name || "Unknown Author"}
        </span>
        <span className="text-gray-300">•</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
          {new Date(selectedPost.createdAt).toLocaleDateString()}
        </span>
      </div>
            
            <h1 className="text-4xl   md:text-6xl lg:text-4xl font-black text-gray-900 tracking-tighter leading-none mb-12">
              {selectedPost.title}
            </h1>

            {/* Description / Content Area */}
            <div 
              className="prose prose-slate max-w-none text-gray-700 text-xl md:text-1xl leading-relaxed font-small mb-24"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />

            {/* INTERACTION SECTION */}
            <div className="pt-10 border-t border-gray-100">
              <InteractionBar 
                key={selectedPost._id} 
                postId={selectedPost._id}
                slug={selectedPost.slug}
                userId={userId}
                initialLikes={selectedPost.likes?.length || 0}
                initialDislikes={selectedPost.dislikes?.length || 0}
                initialComments={selectedPost.comments || []}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-10">
            <p className="text-gray-200 font-black uppercase tracking-widest text-xl">Select a story</p>
          </div>
        )}
      </main>
    </div>
  );
}