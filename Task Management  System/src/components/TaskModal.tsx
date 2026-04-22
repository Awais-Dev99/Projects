"use client";

import { useState, useEffect } from "react";
import { createTask, updateTask } from "@/services/taskService";

type Task = {
  id: string;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  dueDate?: string;
};

type Props = {
  task: Task | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function TaskModal({ task, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [status, setStatus] = useState<
    "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED"
  >("NOT_STARTED");
  const [dueDate, setDueDate] = useState("");

  // ✅ Fill form
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setPriority(task.priority || "MEDIUM");
      setStatus(task.status || "NOT_STARTED");
      setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setStatus("NOT_STARTED");
      setDueDate("");
    }
  }, [task]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not logged in");
      return;
    }

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    // ✅ CLEAN PAYLOAD (NO TS ERRORS)
    const payload = {
      title: title.trim(),
      ...(description.trim() && { description: description.trim() }),
      priority,
      status,
      ...(dueDate && { dueDate }),
    };

    try {
      if (task) {
        await updateTask( task.id, payload);
      } else {
        await createTask(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Save error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
        <h2 className="text-lg font-semibold">
          {task ? "Edit Task" : "Add Task"}
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border p-2 rounded"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border p-2 rounded"
        />
        <p>
<label>Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          className="w-full border p-2 rounded"
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select></p>
        <p>
<label>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="w-full border p-2 rounded"
        >
          <option value="NOT_STARTED">NOT_STARTED</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
        </select></p>
        <p>
<label>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border p-2 rounded"
        />
</p>
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {task ? "Update" : "Create"}
          </button>

          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}