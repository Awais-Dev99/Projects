// components/DeletePostButton.tsx
"use client";

import { useActionState } from "react";
import { deletePost } from "@/lib/actions";

export default function DeletePostButton({ id }: { id: string }) {
  const [state, formAction, isPending] = useActionState(deletePost, null);

  const handleDelete = (payload: FormData) => {
    if (confirm("Are you sure you want to delete this article? This cannot be undone.")) {
      formAction(payload);
    }
  };

  return (
    <form action={handleDelete}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={isPending}
        className="w-12 h-12 rounded-xl flex items-center justify-center border border-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm disabled:opacity-50"
        title="Delete Article"
      >
        {isPending ? "..." : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        )}
      </button>
      {state?.error && <p className="text-[10px] text-red-500 absolute mt-1">{state.error}</p>}
    </form>
  );
}