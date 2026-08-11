import type { Role } from "@prisma/client";

export type Permission =
  | "admin:overview"
  | "admin:users:read"
  | "admin:users:write"
  | "admin:content:write"
  | "admin:support:write"
  | "admin:settings:write"
  | "admin:audit:read"
  | "member:read"
  | "member:write";

const permissionsByRole: Record<Role, Permission[]> = {
  USER: ["member:read", "member:write"],
  CONTENT_ADMIN: ["admin:overview", "admin:content:write", "admin:audit:read"],
  SUPPORT_ADMIN: [
    "admin:overview",
    "admin:users:read",
    "admin:support:write",
    "admin:audit:read"
  ],
  SUPER_ADMIN: [
    "admin:overview",
    "admin:users:read",
    "admin:users:write",
    "admin:content:write",
    "admin:support:write",
    "admin:settings:write",
    "admin:audit:read",
    "member:read",
    "member:write"
  ]
};

export function hasPermission(role: Role, permission: Permission) {
  return permissionsByRole[role].includes(permission);
}

export function isAdminRole(role: Role) {
  return role === "CONTENT_ADMIN" || role === "SUPPORT_ADMIN" || role === "SUPER_ADMIN";
}

export function assertPermission(role: Role, permission: Permission) {
  if (!hasPermission(role, permission)) {
    throw new Error(`Permission denied: ${permission}`);
  }
}
