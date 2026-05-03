"use client";

import { useActionState } from "react"; // Imported from 'react'
import { approveAuthor, rejectAuthor } from "@/lib/actions";

interface Props {
  id: string;
  type: "approve" | "reject";
}
const initialState: ActionState = { error: null, success: false };
export default function AdminActionButton({ id, type }: Props) {
  const actionToRun = type === "approve" ? approveAuthor : rejectAuthor;
  
  /**
   * useActionState hook:
   * [state] - The value returned from your action
   * [formAction] - The function to pass to the <form action>
   * [isPending] - Built-in boolean for loading states
   */
  const [state, formAction, isPending] = useActionState(actionToRun, null);

  return (
    <form action={formAction} className="relative inline-block">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={isPending}
        className={
          type === "approve"
            ? "bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition disabled:opacity-50 min-w-[100px]"
            : "bg-white text-red-600 border border-red-100 px-5 py-2 rounded-xl text-sm font-bold hover:bg-red-50 transition disabled:opacity-50 min-w-[100px]"
        }
      >
        {isPending ? "..." : type === "approve" ? "Approve" : "Reject"}
      </button>
      
      {state?.error && (
        <p className="text-[10px] text-red-500 absolute left-0 -bottom-4 whitespace-nowrap">
          {state.error}
        </p>
      )}
    </form>
  );
}