export const runtime = "nodejs";

import { prisma } from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth";

type CreateTaskBody = {
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  dueDate?: string;
};

export async function POST(request: Request) {
  try {
    const userId = getUserIdFromToken(request);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateTaskBody = await request.json();

    // ✅ Parse date safely
    let dueDate: Date | undefined;

    if (body.dueDate) {
      const parsed = new Date(body.dueDate);
      if (!isNaN(parsed.getTime())) {
        dueDate = parsed;
      }
    }

    // ✅ BUILD DATA CLEANLY
    const data: any = {
      title: body.title,
      description: body.description || undefined,
      priority: body.priority,
      status: body.status,
      user: {
        connect: { id: userId },
      },
    };

    // ✅ ADD ONLY IF EXISTS
    if (dueDate) {
      data.dueDate = dueDate;
    }

    const task = await prisma.task.create({ data });

    return Response.json(task);
  } catch (error) {
    console.error("CREATE ERROR:", error);
    return Response.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const userId = getUserIdFromToken(request);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(tasks);
  } catch (error) {
    console.error("GET ERROR:", error);
    return Response.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}