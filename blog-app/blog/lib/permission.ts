type Role = "OWNER" | "AUTHOR" | "READER";

// 🔐 Check if user has required role
export function hasPermission(userRole: Role, required: Role[]) {
  return required.includes(userRole);
}

// 🔒 Specific helpers (optional but clean)
export function isOwner(role: Role) {
  return role === "OWNER";
}

export function isAuthor(role: Role) {
  return role === "AUTHOR";
}

export function isReader(role: Role) {
  return role === "READER";
}