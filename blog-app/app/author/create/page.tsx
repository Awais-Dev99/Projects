"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createPost } from "@/lib/actions";
import { generateContentHelp } from "@/lib/gemini";
import Link from "next/link";
import dynamic from 'next/dynamic';

// Import the Editor component (Client-side only)
const Editor = dynamic(() => import('@/components/Editor'), { 
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-gray-50 animate-pulse rounded-xl border border-gray-200" />
});

export default function CreatePost() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const titleRef = useRef<HTMLTextAreaElement>(null);

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
    if (!title) return alert("Please enter a title first!");
    setIsAiLoading(true);
    
    try {
      const result = await generateContentHelp(`Write a professional article for: "${title}"`);
      if (result?.success && result.text) {
        setContent(result.text);
      } else {
        alert(result?.error || "AI returned an empty response.");
      }
    } catch (err) {
      alert("Network error: Could not reach the server.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const authorId = (session?.user as any)?.id;
    if (!authorId) return alert("You must be logged in.");

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    const result = await createPost(formData, authorId);
    if (result?.success) {
      router.push("/author/dashboard");
      router.refresh();
    } else {
      alert(result?.error || "Failed to create post");
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <nav className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="w-full px-6 md:px-12 py-5 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <Link href="/author/dashboard" className="text-slate-400 hover:text-slate-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Draft in Author</span>
          </div>
          <div className="text-xs font-medium text-slate-300">
            {content.length > 0 ? `${content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} words` : 'Empty story'}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto w-full px-6 pt-16 pb-40">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <textarea
            ref={titleRef}
            rows={1}
            placeholder="Article Title"
            className="w-full text-4xl md:text-5xl font-black border-none outline-none focus:ring-0 placeholder:text-gray-100 text-gray-900 resize-none overflow-hidden bg-transparent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <button 
            type="button"
            onClick={handleGenerateStory}
            disabled={isAiLoading || !title}
            className="text-[10px] font-black uppercase tracking-widest text-blue-600 self-start hover:text-blue-800 transition-colors disabled:opacity-30 flex items-center gap-2"
          >
            {isAiLoading ? "Writing article..." : "✨ Generate Article from Title"}
          </button>
          
          <div className="min-h-[600px]">
            <Editor value={content} onChange={setContent} />
          </div>

          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
            <div className="bg-slate-900/95 backdrop-blur-xl p-2 rounded-[2rem] shadow-2xl flex items-center justify-between border border-white/10">
              <div className="pl-6">
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Ready?</span>
              </div>
              <button 
                type="submit" 
                disabled={loading} 
                className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all disabled:bg-slate-700"
              >
                {loading ? "Publishing..." : "Publish Story"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}