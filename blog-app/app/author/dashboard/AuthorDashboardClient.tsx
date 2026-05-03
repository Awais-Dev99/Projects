"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DeletePostButton from "@/components/DeletePostButton";

export default function AuthorDashboardClient({ initialPosts }: { initialPosts: any[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [selectedId, setSelectedId] = useState(initialPosts[0]?._id || null);
  const [showComments, setShowComments] = useState(false);

  // Sync local state with fresh server data after router.refresh()
  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const currentUserId = "user_123"; 

  const selectedPost = useMemo(() => 
    posts.find(p => p._id === selectedId), 
    [posts, selectedId]
  );

  // Manual local state update to ensure UI feel instant
  const handleLikeDislike = (type: 'likes' | 'dislikes') => {
    if (!selectedPost) return;

    let updatedLikes = [...(selectedPost.likes || [])];
    let updatedDislikes = [...(selectedPost.dislikes || [])];
    const isAlreadySelected = (type === 'likes' ? updatedLikes : updatedDislikes).includes(currentUserId);

    if (isAlreadySelected) {
      if (type === 'likes') updatedLikes = updatedLikes.filter(id => id !== currentUserId);
      else updatedDislikes = updatedDislikes.filter(id => id !== currentUserId);
    } else {
      if (type === 'likes') {
        updatedLikes.push(currentUserId);
        updatedDislikes = updatedDislikes.filter(id => id !== currentUserId);
      } else {
        updatedDislikes.push(currentUserId);
        updatedLikes = updatedLikes.filter(id => id !== currentUserId);
      }
    }

    const updatedPost = { ...selectedPost, likes: updatedLikes, dislikes: updatedDislikes };
    setPosts(posts.map(p => p._id === selectedId ? updatedPost : p));
    
    // Call router.refresh() if you are using a Server Action to persist data
    // router.refresh();
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white overflow-hidden font-sans">
      
      {/* SIDEBAR: Responsive for Mobile (Top), Laptop (Left), and LED (Fixed) */}
      <aside className="w-full lg:w-[350px] xl:w-[300px] flex-none border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/20 overflow-y-auto max-h-[30vh] lg:max-h-screen">
        <div className="p-4 lg:p-6">
          <p className="text-[10px] lg:text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 lg:mb-8">
            Your Stories ({posts.length})
          </p>
          
          <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto pb-4 lg:pb-0">
            {posts.map((post) => (
              <div 
                key={post._id} 
                onClick={() => {
                  setSelectedId(post._id);
                  setShowComments(false);
                }}
                className={`group cursor-pointer px-4 lg:px-5 py-3 lg:py-4 rounded-xl lg:rounded-2xl transition-all duration-200 flex-shrink-0 lg:flex-shrink-1 w-[280px] lg:w-full ${
                  selectedId === post._id 
                    ? "bg-white shadow-lg lg:shadow-xl shadow-gray-200/50 ring-1 ring-gray-100" 
                    : "hover:bg-gray-100/50"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className={`text-sm lg:text-base font-bold truncate flex-1 ${
                    selectedId === post._id ? "text-blue-600" : "text-gray-900"
                  }`}>
                    {post.title}
                  </h3>

                  <div className={`flex items-center gap-2 shrink-0 transition-opacity ${
                    selectedId === post._id ? "opacity-100" : "opacity-0 lg:group-hover:opacity-100"
                  }`}>
                    <Link 
                      href={`/author/edit/${post._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600"
                    >
                      Edit
                    </Link>
                    <div onClick={(e) => e.stopPropagation()} className="scale-75 lg:scale-90 origin-right">
                      <DeletePostButton id={post._id} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN VIEW: Description area on remaining full screen */}
      <main className="flex-1 flex flex-col min-h-0 bg-white overflow-y-auto">
        {selectedPost ? (
          <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-6 md:pt-10 pb-40">
            
            {/* AUTHOR METADATA */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black text-white uppercase">
                {selectedPost.author?.name?.charAt(0) || "U"}
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900">
                {selectedPost.author?.name || "Author"}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                {new Date(selectedPost.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* ARTICLE TITLE */}
            <h1 className="text-3xl md:text-2xl lg:text-4xl xl:text-4xl font-black text-gray-900 tracking-tighter leading-[1.1] mb-10">
              {selectedPost.title}
            </h1>

            {/* DESCRIPTION / CONTENT */}
            <div 
              className="prose prose-slate max-w-none text-gray-700 text-lg md:text-xl lg:text-2xl leading-relaxed font-small mb-24"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />

            {/* INTERACTION SECTION */}
            <div className="pt-10 border-t border-gray-100 flex flex-wrap items-center gap-12">
              <button 
                onClick={() => handleLikeDislike('likes')}
                className={`flex items-center gap-4 transition-all ${selectedPost.likes?.includes(currentUserId) ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
              >
                <span className="text-3xl">👍</span>
                <div className="text-left">
                  <p className="text-xl font-black text-gray-900 leading-none">{selectedPost.likes?.length || 0}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Likes</p>
                </div>
              </button>

              <button 
                onClick={() => handleLikeDislike('dislikes')}
                className={`flex items-center gap-4 transition-all ${selectedPost.dislikes?.includes(currentUserId) ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
              >
                <span className="text-3xl">👎</span>
                <div className="text-left">
                  <p className="text-xl font-black text-gray-900 leading-none">{selectedPost.dislikes?.length || 0}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dislikes</p>
                </div>
              </button>

              <button 
                onClick={() => setShowComments(!showComments)}
                className={`flex items-center gap-4 transition-all ${showComments ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
              >
                <span className="text-3xl">💬</span>
                <div className="text-left">
                  <p className="text-xl font-black text-gray-900 leading-none">{selectedPost.comments?.length || 0}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Comments</p>
                </div>
              </button>
            </div>

            {/* COMMENTS AREA */}
            {showComments && (
  <div className="mt-8 p-8 bg-gray-50 rounded-3xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6">Discussion</p>
    
    {selectedPost.comments && selectedPost.comments.length > 0 ? (
      <div className="space-y-6">
        {selectedPost.comments.map((comment: any, index: number) => (
          <div key={index} className="flex flex-col gap-1 pb-4 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-gray-900 uppercase">
                {comment.user?.name || comment.author?.name || "Reader"}
              </span>
              <span className="text-[10px] text-gray-400">•</span>
              <span className="text-[10px] text-gray-400 font-bold">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            {/* FIX: Check for both 'text' and 'content' fields */}
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
              {comment.text || comment.content || "No message content"}
            </p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-400 italic">No comments to display yet.</p>
    )}
  </div>
)}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-200 font-black uppercase tracking-widest text-2xl">
            Select a Story
          </div>
        )}
      </main>
    </div>
  );
}