import { useState } from "react";
import { Trash2 } from "lucide-react";

type Task = {
  id: string;
  title: string;
  description?: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  dueDate?: string;
};

const priorityColors = {
  HIGH: "bg-red-100 text-red-600",
  MEDIUM: "bg-yellow-100 text-yellow-600",
  LOW: "bg-green-100 text-green-600",
};

export default function TaskCard({
  task,
  onDelete,
}: {
  task: Task;
  onDelete: (id: string) => Promise<void> | void;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    if (deleting) return; // prevent double click

    try {
      setDeleting(true);
      await onDelete(task.id); // works with async or sync
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
  <div
  className="bg-white p-3 rounded-xl border flex justify-between items-start
             shadow-sm cursor-pointer
             transition-all duration-200 ease-out
             hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] hover:bg-gray-50 hover:border-blue-200"
>
      {/* LEFT */}
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-gray-800">
          {task.title}
        </h3>

        <span
          className={`text-[10px] px-2 py-0.5 rounded-full w-fit ${priorityColors[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      {/* DELETE BUTTON */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className={`flex items-center justify-center w-8 h-8 rounded-full transition
          ${deleting
            ? "bg-red-100 cursor-not-allowed"
            : "hover:bg-red-50 active:scale-90"}
        `}
      >
        {deleting ? (
          // 🔄 Spinner
          <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Trash2 size={16} className="text-red-500" />
        )}
      </button>
    </div>
  );
}