"use server";

import { connectToDatabase } from "./../../lib/db";
import Product from "./../../models/Product";
import { revalidatePath } from "next/cache";

export async function deleteProduct(id: string) {
  try {
    await connectToDatabase();
    await Product.findByIdAndDelete(id);
    revalidatePath("/admin/products"); // Refresh the table automatically
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete" };
  }
}