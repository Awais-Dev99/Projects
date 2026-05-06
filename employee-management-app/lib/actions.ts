"use server";

import clientPromise from "./mongodb";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

/**
 * Interface defining the structure of an Employee document in MongoDB.
 * This ensures TypeScript correctly handles array operations like $push.
 */
interface EmployeeDocument {
  _id?: ObjectId;
  name: string;
  role: string;
  username: string;
  password?: string;
  salary: number;
  workingHours: string;
  accountStatus: 'active' | 'disabled';
  notifications: Array<{
    id: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
  }>;
  createdAt: Date;
}

/**
 * Creates a new employee record with a hashed password.
 */
export async function createEmployee(formData: FormData) {
  const client = await clientPromise;
  const db = client.db("ems_database");

  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const salary = Number(formData.get("salary"));
  const hours = formData.get("hours") as string;

  if (!username || !password) {
    throw new Error("Username and password are required.");
  }

  // Security: Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.collection<EmployeeDocument>("employees").insertOne({
    name,
    role,
    username,
    password: hashedPassword,
    salary,
    workingHours: hours,
    accountStatus: "active",
    notifications: [], 
    createdAt: new Date(),
  });

  revalidatePath("/admin/employees");
}

/**
 * Toggles an employee's access between 'active' and 'disabled'.
 */
export async function toggleEmployeeStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const client = await clientPromise;
  const db = client.db("ems_database");

  const user = await db.collection<EmployeeDocument>("employees").findOne({ 
    _id: new ObjectId(id) 
  });
  
  const newStatus = user?.accountStatus === 'active' ? 'disabled' : 'active';

  await db.collection<EmployeeDocument>("employees").updateOne(
    { _id: new ObjectId(id) },
    { $set: { accountStatus: newStatus } }
  );

  revalidatePath("/admin/employees");
}

/**
 * Permanently removes an employee from the database.
 */
export async function removeEmployee(formData: FormData) {
  const id = formData.get("id") as string;
  const client = await clientPromise;
  const db = client.db("ems_database");

  await db.collection<EmployeeDocument>("employees").deleteOne({ 
    _id: new ObjectId(id) 
  });

  revalidatePath("/admin/employees");
}

/**
 * Pushes a new notification to the top of an employee's notification array.
 */
export async function sendNotification(formData: FormData) {
  const employeeId = formData.get("employeeId") as string;
  const message = formData.get("message") as string;
  
  const client = await clientPromise;
  const db = client.db("ems_database");

  const newNotification = {
    id: Math.random().toString(36).substring(7),
    message,
    timestamp: new Date(),
    isRead: false
  };

  await db.collection<EmployeeDocument>("employees").updateOne(
    { _id: new ObjectId(employeeId) },
    { 
      // @ts-ignore - Handles specific TS version issues with $position
      $push: { 
        notifications: { 
          $each: [newNotification], 
          $position: 0 
        } 
      } 
    }
  );

  revalidatePath("/admin/notifications");
  revalidatePath("/dashboard");
}