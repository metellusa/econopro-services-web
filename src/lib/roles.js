export const APP_ROLES = Object.freeze({
  ADMIN: "admin",
  STAFF: "staff",
  CONTRACTOR: "contractor",
  CLIENT: "client",
});

export const STAFF_ROLES = Object.freeze([APP_ROLES.ADMIN, APP_ROLES.STAFF]);

export const PORTAL_HOME = Object.freeze({
  admin: "/admin",
  staff: "/admin",
  contractor: "/contractor",
  client: "/client",
});

export function isStaffRole(role) {
  return STAFF_ROLES.includes(role);
}

export function portalHomeForRole(role) {
  return PORTAL_HOME[role] || "/sign-in";
}
