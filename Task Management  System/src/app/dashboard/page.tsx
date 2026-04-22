"use client";

import Column from "@/components/Column";
import { useEffect, useState } from "react";
import { getTasks, deleteTask } from "@/services/taskService";
import TaskModal from "@/components/TaskModal";
import { useRouter } from "next/navigation";

type Task = {
  id: string;
  title: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");

  const router = useRouter();

  // ✅ LOAD USER + TASKS
  useEffect(() => {
    fetchTasks();

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setName(user?.name || "");
      } catch {
        console.error("Invalid user data");
      }
    }
  }, []);

  // ✅ FETCH TASKS
  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // ✅ PRIORITY SORT
  const sortByPriority = (tasks: Task[]) => {
    const order = { HIGH: 1, MEDIUM: 2, LOW: 3 };

    return [...tasks].sort(
      (a, b) => order[a.priority] - order[b.priority]
    );
  };

  // ✅ SPLIT TASKS
  const notStarted = sortByPriority(
    tasks.filter((t) => t.status === "NOT_STARTED")
  );

  const inProgress = sortByPriority(
    tasks.filter((t) => t.status === "IN_PROGRESS")
  );

  const completed = sortByPriority(
    tasks.filter((t) => t.status === "COMPLETED")
  );

  // ✅ HANDLERS
  const openModal = (task: Task) => {
    setSelectedTask(task);
    setIsOpen(true);
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    fetchTasks();
  };

  return (
  <div className="flex min-h-screen">

    {/* ✅ SIDEBAR */}
    <div className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between">
      
      {/* Top Section */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Task Manager</h2>

        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Logged in as</p>
          <p className="text-lg font-medium">
            {name || "User"}
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded mt-6"
      >
        Logout
      </button>
    </div>

    {/* ✅ MAIN CONTENT */}
    <div className="flex-1 p-6 bg-gray-100">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          {name ? `Welcome, ${name} 👋` : "My Tasks"}
        </h1>
      </div>

      {/* COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Column
          title="Not Started"
          tasks={notStarted}
          onClick={openModal}
          onDelete={handleDelete}
          onAdd={handleAddTask}
        />

        <Column
          title="In Progress"
          tasks={inProgress}
          onClick={openModal}
          onDelete={handleDelete}
        />

        <Column
          title="Completed"
          tasks={completed}
          onClick={openModal}
          onDelete={handleDelete}
        />
      </div>

      {/* MODAL */}
      {isOpen && (
        <TaskModal
          task={selectedTask}
          onClose={() => setIsOpen(false)}
          onSuccess={fetchTasks}
        />
      )}
    </div>
  </div>
);
}