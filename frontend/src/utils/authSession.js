export function getCurrentRole() {
  // temporary source until full auth context is wired
  return (localStorage.getItem("role") || "USER").toUpperCase();
}

export function getCurrentUserId() {
  const parsed = Number(localStorage.getItem("userId"));
  return Number.isFinite(parsed) ? parsed : null;
}

export function isAdminRole() {
  return getCurrentRole() === "ADMIN";
}

export function isSupportStaffRole() {
  return getCurrentRole() === "SUPPORT_STAFF";
}

export function hasTicketAdminAccess() {
  const role = getCurrentRole();
  return role === "ADMIN" || role === "SUPPORT_STAFF";
}

export function isUserRole() {
  return getCurrentRole() === "USER";
}