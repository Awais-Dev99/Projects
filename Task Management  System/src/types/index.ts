
// 👤 User type
export type User = {
  id: string;
  email: string;
  createdAt?: Date;
};

// 📝 Task priority
export type Priority = "HIGH" | "MEDIUM" | "LOW";

// 📌 Task status
export type TaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

// 📝 Task type
export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: Date;
  createdAt: Date;
  userId: string;
};

// 🔐 Auth response
export type AuthResponse = {
  message: string;
  token?: string;
  user?: User;
  error?: string;
};