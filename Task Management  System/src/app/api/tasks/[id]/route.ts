export const runtime = "nodejs";

import { prisma } from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth";

// ✅ UPDATE TASK
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> } // 👈 IMPORTANT
) {
  try {
    const { id } = await context.params; // 👈 FIX HERE

    const userId = getUserIdFromToken(request);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // ✅ Check task exists
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingTask) {
      return Response.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // ✅ Safe date
    let safeDate = existingTask.dueDate;
    if (body.dueDate) {
      const parsed = new Date(body.dueDate);
      if (!isNaN(parsed.getTime())) {
        safeDate = parsed;
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id }, // ✅ NOW ID IS CORRECT
      data: {
        title: body.title ?? existingTask.title,
        description: body.description ?? existingTask.description,
        priority: body.priority ?? existingTask.priority,
        status: body.status ?? existingTask.status,
        dueDate: safeDate,
      },
    });

    return Response.json(updatedTask);
  } catch (error) {
    console.error("🔥 UPDATE ERROR FULL:", error);
    return Response.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
// ✅ DELETE TASK
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> } // 👈 FIX
) {
  try {
    const { id } = await context.params; // 👈 VERY IMPORTANT

    const userId = getUserIdFromToken(request);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const task = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!task) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    await prisma.task.delete({
      where: { id }, // ✅ use unwrapped id
    });

    return Response.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return Response.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}