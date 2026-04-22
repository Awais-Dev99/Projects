import { Status } from "@prisma/client";

export function getValidStatusUpdate(
  currentStatus: Status,
  newStatus: Status
): Status | null {
  if (currentStatus === "COMPLETED") {
    return null;
  }

  const validTransitions: Record<Status, Status[]> = {
    NOT_STARTED: ["IN_PROGRESS"],
    IN_PROGRESS: ["COMPLETED"],
    COMPLETED: [], // required for typing
  };

  if (!validTransitions[currentStatus]?.includes(newStatus)) {
    return null;
  }

  return newStatus;
}