"use client";

import { useState, useTransition } from "react";
import { handleLikeDislike, addComment, deleteComment, updateComment } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InteractionBar({ 
  postId, 
  initialLikes, 
  initialDislikes, 
  initialComments,
  isDashboard = false // Receives this from the Home Page
}: any) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const currentUserId = (session?.user as any)?.id;

  // --- HELPER: LOGIN GUARD ---
  const ensureLogin = () => {
    if (!currentUserId) {
      alert("Please login to interact with this post!");
      router.push("/login");
      return false;
    }
    return true;
  };

  // --- ACTIONS ---
  
  const handleLike = (type: "like" | "dislike") => {
    if (!ensureLogin()) return;
    startTransition(async () => {
      await handleLikeDislike(postId, currentUserId, type);
    });
  };

  const handlePostComment = async () => {
    if (!ensureLogin()) return;
    if (!commentText.trim()) return;

    startTransition(async () => {
      await addComment(postId, currentUserId, commentText);
      setCommentText("");
    });
  };

  const handleDelete = async (commentId: string) => {
    if (!ensureLogin()) return;
    if (!confirm("Are you sure you want to delete this comment?")) return;
    
    startTransition(async () => {
      await deleteComment(postId, commentId, currentUserId);
    });
  };

  const handleUpdate = async (commentId: string) => {
    if (!ensureLogin()) return;
    startTransition(async () => {
      await updateComment(postId, commentId, currentUserId, editText);
      setEditingCommentId(null);
    });
  };

  return (
    <div className={`w-full ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
      {/* 1. INTERACTION BUTTONS */}
      <div className="flex gap-6 items-center py-2">
        <button 
          onClick={() => handleLike("like")} 
          className="flex items-center gap-2 group transition-all"
        >
          <span className="text-xl group-hover:scale-125 transition-transform">👍</span>
          <span className="text-sm font-black text-gray-700">{initialLikes}</span>
        </button>

        <button 
          onClick={() => handleLike("dislike")} 
          className="flex items-center gap-2 group transition-all"
        >
          <span className="text-xl group-hover:scale-125 transition-transform">👎</span>
          <span className="text-sm font-black text-gray-700">{initialDislikes}</span>
        </button>

        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 group transition-all"
        >
          <span className="text-xl group-hover:rotate-12 transition-transform">💬</span>
          <span className="text-sm font-black text-gray-700">{initialComments?.length || 0}</span>
        </button>
      </div>

      {/* 2. COMMENT SECTION */}
      {showComments && (
        <div className="mt-6 space-y-5 border-t border-gray-100 pt-6 animate-in fade-in slide-in-from-top-4 duration-300">
          
          {currentUserId ? (
            <div className="flex gap-3 bg-gray-50 p-2 rounded-[1.5rem] border border-gray-100">
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                className="flex-1 bg-transparent px-4 py-2 text-sm outline-none font-medium"
              />
              <button 
                onClick={handlePostComment}
                disabled={!commentText.trim()}
                className="bg-black text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-30"
              >
                Post
              </button>
            </div>
          ) : (
            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 text-center">
              <p className="text-xs font-bold text-blue-600">
                <Link href="/login" className="underline underline-offset-4">Login</Link> to join the conversation and post a comment.
              </p>
            </div>
          )}

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {initialComments?.length > 0 ? (
              initialComments.map((comment: any) => (
                <div key={comment._id} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm group transition-all hover:border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1.5">
  {comment.user?.name || "Anonymous Reader"}
</p>
                      
                      {editingCommentId === comment._id ? (
                        <div className="space-y-3">
                          <textarea 
                            className="w-full border-2 border-gray-100 p-3 rounded-xl text-sm outline-none focus:border-black transition-all"
                            value={editText}
                            rows={3}
                            onChange={(e) => setEditText(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button onClick={() => handleUpdate(comment._id)} className="text-[10px] font-black bg-black text-white px-4 py-2 rounded-lg uppercase">Save</button>
                            <button onClick={() => setEditingCommentId(null)} className="text-[10px] font-black bg-gray-200 text-gray-600 px-4 py-2 rounded-lg uppercase">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-700 leading-relaxed font-medium">{comment.content}</p>
                      )}
                    </div>

                    {/* --- THE FIX: ADDED !isDashboard --- */}
                    {/* --- THE FIX: Robust permission check --- */}
{!isDashboard && 
 currentUserId && 
 comment.user?._id?.toString() === currentUserId.toString() && 
 !editingCommentId && (
  <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
    <button 
      onClick={() => { setEditingCommentId(comment._id); setEditText(comment.content); }}
      className="text-[10px] font-black text-gray-400 hover:text-black transition-colors uppercase tracking-tighter"
    >
      Edit
    </button>
    <button 
      onClick={() => handleDelete(comment._id)}
      className="text-[10px] font-black text-gray-400 hover:text-red-600 transition-colors uppercase tracking-tighter"
    >
      Delete
    </button>
  </div>
)}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                      {new Date(comment.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-sm text-gray-400 font-medium italic">No comments yet. Be the first to start the discussion!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}