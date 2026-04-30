"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createPost } from "@/lib/actions"; // Import the server action

export default function CreatePost() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validation: Ensure user is logged in
    const authorId = (session?.user as any)?.id;
    if (!authorId) {
      alert("You must be logged in to publish.");
      return;
    }

    setLoading(true);

    // 2. Prepare Data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    // 3. Call Server Action
    const result = await createPost(formData, authorId);

    if (result?.success) {
      router.push("/author/dashboard");
      router.refresh();
    } else {
      // Show specific error from server if available
      alert(result?.error || "Failed to create post");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Enter a catchy title..."
          className="w-full text-5xl font-black border-none outline-none focus:ring-0 placeholder:text-gray-200 text-gray-900"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        
        <textarea
          placeholder="Write your story here..."
          className="w-full min-h-[500px] text-xl border-none outline-none focus:ring-0 resize-none placeholder:text-gray-200 text-gray-700 leading-relaxed"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <div className="fixed bottom-10 right-10">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-10 py-4 rounded-full font-bold text-xl hover:bg-gray-800 transition-all shadow-2xl disabled:bg-gray-300 transform hover:-translate-y-1 active:translate-y-0"
          >
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </form>
    </div>
  );
}