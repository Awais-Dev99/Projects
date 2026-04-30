"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePost } from "@/lib/actions"; // Ensure this action exists

interface PostProps {
  post: {
    _id: string;
    title: string;
    content: string;
  };
}

export default function EditForm({ post }: PostProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // We use a Server Action approach here for better reliability in Next.js 15
  const handleUpdate = async (formData: FormData) => {
    setLoading(true);
    try {
      await updatePost(post._id, formData);
      router.push("/author/dashboard");
      router.refresh();
    } catch (err) {
      alert("Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
      <form action={handleUpdate} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 px-1">
            Article Title
          </label>
          <input
            name="title"
            type="text"
            required
            className="w-full px-5 py-4 text-xl font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            defaultValue={post.title}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 px-1">
            Content
          </label>
          <textarea
            name="content"
            required
            rows={12}
            className="w-full px-5 py-4 text-lg bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none"
            defaultValue={post.content}
          />
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-full font-bold shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
          >
            {loading ? "Saving..." : "Update Post"}
          </button>
        </div>
      </form>
    </div>
  );
}