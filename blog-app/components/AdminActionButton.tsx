'use client';

import { useActionState } from "react";
import { approveAuthor, rejectAuthor } from "@/lib/actions";

interface ActionState {
  error: string | null;
  success: boolean;
}

interface Props {
  id: string;
  type: "approve" | "reject";
}

const initialState: ActionState = { error: null, success: false };

export default function AdminActionButton({ id, type }: Props) {
  // Select the correct server action based on type
  const actionToRun = type === "approve" ? approveAuthor : rejectAuthor;
  
  // useActionState handles the transition and pending states
  const [state, formAction, isPending] = useActionState(
    async (prevState: ActionState) => {
      // We pass 'id' as the second argument to match the server action signature
      const result = await actionToRun(prevState, id);
      return result;
    },
    initialState
  );

  return (
    <div className="flex flex-col gap-1">
      <form action={formAction}>
        <button 
          disabled={isPending}
          className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
            type === 'approve' 
              ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md hover:shadow-emerald-200' 
              : 'bg-rose-500 text-white hover:bg-rose-600 shadow-md hover:shadow-rose-200'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isPending ? "Processing..." : type}
        </button>
      </form>
      
      {state?.error && (
        <p className="text-rose-500 text-[10px] font-medium animate-in fade-in slide-in-from-top-1">
          {state.error}
        </p>
      )}
    </div>
  );
}