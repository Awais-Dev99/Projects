"use client";

import { Pencil, Trash2 } from "lucide-react";

/* ✅ Define Task Type */
type Task = {
  id: string;
  title: string;
  description?: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
};

/* ✅ Props Type */
type Props = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
};

export default function TaskCard({ task, onEdit, onDelete }: Props) {
  /* ✅ Typed color maps */
  const statusColor: Record<Task["status"], string> = {
    NOT_STARTED: "bg-gray-100 text-gray-600",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    COMPLETED: "bg-green-100 text-green-700",
  };

  const priorityColor: Record<Task["priority"], string> = {
    LOW: "bg-blue-100 text-blue-600",
    MEDIUM: "bg-orange-100 text-orange-600",
    HIGH: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition duration-200">
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {task.title}
      </h3>

      {/* Description */}
      <p className="text-gray-500 text-sm mb-4">
        {task.description || "No description"}
      </p>

      {/* Status + Priority */}
      <div className="flex justify-between mb-3">
        <span
          className={`px-2 py-1 text-xs rounded-full ${statusColor[task.status]}`}
        >
          {task.status.replace("_", " ")}
        </span>

        <span
          className={`px-2 py-1 text-xs rounded-full ${priorityColor[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      {/* Due Date */}
      {task.dueDate && (
        <p className="text-xs text-gray-400 mb-3">
          📅 {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white py-1 rounded-lg hover:bg-blue-600 transition"
        >
          <Pencil size={14} /> Edit
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="flex-1 flex items-center justify-center gap-1 bg-red-500 text-white py-1 rounded-lg hover:bg-red-600 transition"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}