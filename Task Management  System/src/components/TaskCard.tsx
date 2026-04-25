"use client";

import { Trash2 } from "lucide-react";

type Task = {
  id: string;
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
};

type Props = {
  task: Task;
  onDelete: (id: string) => void;
};

export default function TaskCard({ task, onDelete }: Props) {
  const priorityColor: Record<Task["priority"], string> = {
    LOW: "bg-green-100 text-green-600",
    MEDIUM: "bg-yellow-100 text-yellow-600",
    HIGH: "bg-red-100 text-red-600",
  };

  return (
    <div
      className="bg-white p-3 rounded-lg border shadow-sm 
                 flex justify-between items-center 
                 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
    >
      {/* Title */}
      <h3 className="text-sm font-medium text-gray-800">
        {task.title}
      </h3>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        
        {/* Priority */}
        <span
          className={`text-xs px-2 py-1 rounded font-medium ${priorityColor[task.priority]}`}
        >
          {task.priority}
        </span>

        {/* Delete */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="text-gray-400 hover:text-red-500 transition"
        >
          <Trash2 size={16} />
        </button>

      </div>
    </div>
  );
}