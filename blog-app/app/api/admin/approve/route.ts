import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Security Check: Only the Master Admin can access this route
    const session = await getServerSession();
    
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized: Only the owner can manage requests." },
        { status: 403 }
      );
    }

    const { userId, action } = await req.json();

    if (!userId || !action) {
      return NextResponse.json(
        { message: "User ID and Action are required." },
        { status: 400 }
      );
    }

    await connectDB();

    // 2. Handle the "Approve" Action
    if (action === "approve") {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { status: "approved" },
        { new: true }
      );

      if (!updatedUser) {
        return NextResponse.json({ message: "User not found." }, { status: 404 });
      }

      return NextResponse.json(
        { message: `Author ${updatedUser.name} has been approved.` },
        { status: 200 }
      );
    }

    // 3. Handle the "Reject" Action (Delete from DB)
    if (action === "reject") {
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return NextResponse.json({ message: "User not found." }, { status: 404 });
      }

      return NextResponse.json(
        { message: "Request rejected and user removed." },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "Invalid action." }, { status: 400 });

  } catch (error: any) {
    console.error("Admin Action Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}