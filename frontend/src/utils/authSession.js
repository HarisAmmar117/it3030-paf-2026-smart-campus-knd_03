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

// NEW: Check if user is Admin OR Support Staff (for booking management)
export function isAdminOrSupport() {
  const role = getCurrentRole();
  return role === "ADMIN" || role === "SUPPORT_STAFF";
}

// Optional: Get user display name based on role
export function getUserDisplayName() {
  const userName = localStorage.getItem("userName") || "User";
  const role = getCurrentRole();
  
  if (role === "ADMIN") return `${userName} (Admin)`;
  if (role === "SUPPORT_STAFF") return `${userName} (Support)`;
  return userName;
}

// Optional: Check if user has specific permission
export function hasPermission(requiredRole) {
  const userRole = getCurrentRole();
  const roleHierarchy = {
    ADMIN: 3,
    SUPPORT_STAFF: 2,
    USER: 1
  };
  
  return (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 0);
}