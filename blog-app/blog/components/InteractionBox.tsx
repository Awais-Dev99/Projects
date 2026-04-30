"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function InteractionBox({ postId, initialLikes, initialDislikes }: any) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);

  const handleAction = async (type: "like" | "dislike") => {
    if (!session) return; // Prevent action if not logged in

    const res = await fetch(`/api/posts/${postId}/interact`, {
      method: "POST",
      body: JSON.stringify({ type }),
    });

    if (res.ok) {
      const data = await res.json();
      setLikes(data.likesCount);
      setDislikes(data.dislikesCount);
    }
  };

  return (
    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-xl text-slate-900">Enjoyed this post?</h3>
        
        <div className="flex items-center gap-4">
          {/* LIKE BUTTON */}
          <button 
            disabled={!session}
            onClick={() => handleAction("like")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
              !session ? "opacity-50 cursor-not-allowed bg-slate-200" : "bg-white shadow-sm hover:scale-105 active:scale-95"
            }`}
          >
            👍 <span className="font-bold">{likes}</span>
          </button>

          {/* DISLIKE BUTTON */}
          <button 
            disabled={!session}
            onClick={() => handleAction("dislike")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
              !session ? "opacity-50 cursor-not-allowed bg-slate-200" : "bg-white shadow-sm hover:scale-105 active:scale-95"
            }`}
          >
            👎 <span className="font-bold">{dislikes}</span>
          </button>
        </div>
      </div>

      {!session ? (
        <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-blue-700 font-medium mb-3">Want to join the discussion?</p>
          <Link href="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm">
            Log in to Like or Comment
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
           {/* Placeholder for Comment Input */}
           <textarea 
            placeholder="Add a comment..."
            className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
           />
           <button className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-sm">
             Post Comment
           </button>
        </div>
      )}
    </div>
  );
}