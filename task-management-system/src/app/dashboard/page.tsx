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
  <div className="min-h-screen flex flex-col lg:flex-row">

    {/* ✅ SIDEBAR / TOPBAR */}
    <div className="
      w-full lg:w-64
      bg-gray-900 text-white
      p-4 lg:p-6
      flex lg:flex-col justify-between items-center lg:items-stretch
    ">
      
      {/* Top */}
      <div className="flex flex-col lg:block w-full">
        <h2 className="text-lg lg:text-xl font-semibold mb-2 lg:mb-6">
          Task Manager
        </h2>

        <div className="bg-gray-800 p-3 lg:p-4 rounded-lg">
          <p className="text-xs lg:text-sm text-gray-400">Logged in as</p>
          <p className="text-sm lg:text-lg font-medium">
            {name || "User"}
          </p>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-3 py-1 lg:px-4 lg:py-2 rounded mt-3 lg:mt-6 text-sm"
      >
        Logout
      </button>
    </div>

    {/* ✅ MAIN */}
    <div className="flex-1 p-4 sm:p-6 bg-gray-100">

      {/* HEADER */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">
          {name ? `Welcome, ${name} 👋` : "My Tasks"}
        </h1>
      </div>

      {/* ✅ COLUMNS CONTAINER */}
      <div className="
        flex flex-col gap-4
        md:flex-row md:overflow-x-auto md:pb-2
        lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible
      ">

        <div className="min-w-full md:min-w-[300px] lg:min-w-0">
          <Column
            title="Not Started"
            tasks={notStarted}
            onClick={openModal}
            onDelete={handleDelete}
            onAdd={handleAddTask}
          />
        </div>

        <div className="min-w-full md:min-w-[300px] lg:min-w-0">
          <Column
            title="In Progress"
            tasks={inProgress}
            onClick={openModal}
            onDelete={handleDelete}
          />
        </div>

        <div className="min-w-full md:min-w-[300px] lg:min-w-0">
          <Column
            title="Completed"
            tasks={completed}
            onClick={openModal}
            onDelete={handleDelete}
          />
        </div>

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
)}