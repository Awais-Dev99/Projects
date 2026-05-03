"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { updatePost } from "@/lib/actions";
import { generateContentHelp } from "@/lib/gemini";
import dynamic from 'next/dynamic';

// 1. Properly import the Editor component (Client-side only)
const Editor = dynamic(() => import('@/components/Editor'), { 
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-gray-50 animate-pulse rounded-xl border border-gray-200" />
});

export default function EditForm({ post }: { post: any }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content); // This now handles the HTML string
  const [loading, setLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const router = useRouter();

  const titleRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize for the Title only
  const autoResizeTitle = () => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    autoResizeTitle();
  }, [title]);

  const handleGenerateStory = async () => {
    if (!title) return alert("Title is required!");
    setIsAiLoading(true);
    try {
      const result = await generateContentHelp(`Write a professional article for the title: "${title}"`);
      if (result.success) {
        setContent(result.text || "");
      }
    } catch (err) {
      alert("AI Generation failed.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content); // Sending HTML content to the backend

    const result = await updatePost(post._id, formData);
    if (result?.success) {
      router.push("/author/dashboard");
      router.refresh();
    } else {
      alert("Update failed");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="flex flex-col gap-6 max-w-4xl mx-auto px-4">
      {/* Title Textarea (Auto-resizing) */}
      <textarea
        ref={titleRef}
        rows={1}
        className="w-full text-4xl md:text-5xl font-black border-none outline-none focus:ring-0 text-gray-900 bg-transparent resize-none overflow-hidden"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <button 
        type="button" 
        onClick={handleGenerateStory}
        disabled={isAiLoading}
        className="text-[10px] font-black uppercase tracking-widest text-blue-600 self-start hover:text-blue-800 disabled:opacity-30"
      >
        {isAiLoading ? "Regenerating..." : "✨ Regenerate Story"}
      </button>

      {/* RICH TEXT EDITOR (Replaced the second textarea) */}
      <div className="min-h-[600px] prose prose-xl max-w-none">
        <Editor 
          value={content} 
          onChange={(data: string) => setContent(data)} 
        />
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
        <div className="bg-slate-900/95 backdrop-blur-xl p-2 rounded-[2rem] shadow-2xl flex items-center justify-between border border-white/10">
          <div className="pl-6">
            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Editing Draft</span>
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all"
          >
            {loading ? "Saving..." : "Update Post"}
          </button>
        </div>
      </div>
    </form>
  );
}