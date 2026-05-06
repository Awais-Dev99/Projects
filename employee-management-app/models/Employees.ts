// models/Employee.ts
export type EmployeeRole = 'Security Guard' | 'Engineer' | 'HR' | 'Accountant';

export interface Employee {
  _id?: string;
  name: string;
  role: EmployeeRole;
  username: string;
  password: string; // Hashed
    salary: number;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}