"use client";

import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/services/taskService";

type Task = {
  id: string;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  dueDate?: string;
};

export default function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // ✅ Load token properly
  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  // 🔄 Fetch tasks
  async function fetchTasks() {
    try {
      if (!token) return;
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Run when token is ready
  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  // ➕ Create
  async function addTask(taskData: any) {
    try {
      if (!token) return;

      const newTask = await createTask(token);
      setTasks((prev) => [newTask, ...prev]);
    } catch (error) {
      console.error("Create error:", error);
    }
  }

  // ✏️ Update
  async function editTask(id: string, data: any) {
    try {
      if (!token) return;

      const updated = await updateTask(token, id);

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
    } catch (error) {
      console.error("Update error:", error);
    }
  }

  // 🗑 Delete
  async function removeTask(id: string) {
    try {
      if (!token) return;

      await deleteTask(token);

      setTasks((prev) =>
        prev.filter((t) => t.id !== id)
      );
    } catch (error) {
      console.error("Delete error:", error);
    }
  }

  return {
    tasks,
    loading,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
  };
}