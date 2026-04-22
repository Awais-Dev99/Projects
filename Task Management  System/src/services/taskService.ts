const BASE_URL = "/api/tasks";

// 🔐 Helper: get auth headers safely
function getAuthHeaders() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// 🔄 Safe JSON parser
async function parseJSON(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// ✅ GET ALL TASKS
export async function getTasks() {
  const res = await fetch(BASE_URL, {
    headers: getAuthHeaders(),
  });

  const data = await parseJSON(res);

  if (!res.ok) {
    console.error("GET ERROR:", data);
    throw new Error(data?.error || "Failed to fetch tasks");
  }

  return data;
}

// ✅ CREATE TASK
export async function createTask(task: any) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(task),
  });

  const data = await parseJSON(res);

  if (!res.ok) {
    console.error("CREATE ERROR:", data);
    throw new Error(data?.error || "Failed to create task");
  }

  return data;
}

// ✅ UPDATE TASK
export async function updateTask(id: string, task: any) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(task),
  });

  const data = await parseJSON(res);

  if (!res.ok) {
    console.error("UPDATE ERROR:", data);
    throw new Error(data?.error || "Failed to update task");
  }

  return data;
}

// ✅ DELETE TASK
export async function deleteTask(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const data = await parseJSON(res);
    console.error("DELETE ERROR:", data);
    throw new Error(data?.error || "Failed to delete task");
  }

  return true;
}