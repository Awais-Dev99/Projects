"use client";

import { useState } from "react";
import InteractionBar from "@/components/InteractionBar";

export default function HomeClient({ posts, userId }: { posts: any[]; userId: string }) {
  const [selectedPost, setSelectedPost] = useState(posts[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile toggle

  return (
  <div className="flex h-full w-full overflow-hidden relative">
    
    {/* MOBILE OVERLAY */}
    {isSidebarOpen && (
      <div 
        className="fixed inset-0 bg-black/20 z-40 md:hidden" 
        onClick={() => setIsSidebarOpen(false)}
      />
    )}

    {/* SIDEBAR */}
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-72 bg-[#fcfcfc] border-r border-gray-100 transform transition-transform duration-300 ease-in-out
      md:relative md:translate-x-0 md:flex md:flex-col shrink-0
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    `}>
      <div className="p-6 border-b border-gray-50 bg-white flex justify-between items-center">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Articles</h3>
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 text-xl">&times;</button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {posts.map((post: any) => (
          <button
            key={post._id}
            onClick={() => {
              setSelectedPost(post);
              setIsSidebarOpen(false);
            }}
            className={`w-full text-left p-4 rounded-2xl transition-all border ${
              selectedPost?._id === post._id
                ? "bg-white border-gray-200 shadow-sm ring-1 ring-black/5"
                : "border-transparent hover:bg-gray-100 text-gray-500"
            }`}
          >
            <p className="text-[10px] font-black uppercase mb-1 text-blue-600">{post.author?.name}</p>
            <h4 className="text-sm font-bold line-clamp-2">{post.title}</h4>
          </button>
        ))}
      </div>
    </aside>

    {/* MAIN CONTENT AREA: Removed constraints to allow full-screen width */}
    <main className="flex-1 h-full overflow-y-auto bg-white custom-scrollbar relative">
      
      {/* MOBILE MENU BUTTON */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-30 bg-blue-600 text-white p-4 rounded-full shadow-2xl active:scale-95 transition-transform"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {selectedPost ? (
        /* 
           FIX: Removed 'max-w-3xl' and 'mx-auto'. 
           Added 'w-full' and 'lg:px-20' for a wide, edge-to-edge feel on laptops.
        */
        <div className="w-full min-h-full py-8 md:py-16 px-6 md:px-12 lg:px-20">
          
          {/* We wrap the header and text in a wide container (max-w-6xl) 
              so it doesn't look unreadable on giant monitors, but 
              it will now fill the "Full Screen" on standard laptops. */}
          <div className="max-w-6xl">
            <header className="mb-8 md:mb-12">
              <span className="text-[10px] md:text-xs font-bold text-gray-400">
                {new Date(selectedPost.createdAt).toLocaleDateString()}
              </span>
              <h2 className="text-3xl md:text-6xl font-black text-gray-900 mt-2 tracking-tighter leading-tight">
                {selectedPost.title}
              </h2>
            </header>

            <div className="text-gray-700 text-base md:text-xl leading-relaxed whitespace-pre-line mb-20">
              {selectedPost.content.replace(/<[^>]*>?/gm, "")}
            </div>

            <div className="bg-gray-50/50 p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] border border-gray-100">
              <InteractionBar
                postId={selectedPost._id}
                userId={userId}
                initialLikes={selectedPost.likes?.length || 0}
                initialDislikes={selectedPost.dislikes?.length || 0}
                initialComments={selectedPost.comments || []}
                isDashboard={true}
              />
            </div>
          </div>

        </div>
      ) : (
        <div className="flex h-full items-center justify-center text-gray-400 font-medium">
          Select an article to start reading.
        </div>
      )}
    </main>
  </div>
);
}