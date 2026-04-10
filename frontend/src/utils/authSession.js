import { jwtDecode } from "jwt-decode";

// ========================
// TOKEN HELPERS
// ========================
function getToken() {
  return localStorage.getItem("token");
}

function getDecodedToken() {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid JWT token:", error);
    return null;
  }
}

// ========================
// CORE USER DATA
// ========================

export function getCurrentRole() {
  const decoded = getDecodedToken();
  return decoded?.role?.toUpperCase() || "USER";
}

export function getCurrentUserId() {
  const decoded = getDecodedToken();

  // support both naming styles
  return decoded?.userId || decoded?.id || null;
}

export function getCurrentEmail() {
  const decoded = getDecodedToken();
  return decoded?.email || null;
}

export function getCurrentName() {
  const decoded = getDecodedToken();
  return decoded?.name || "User";
}

// ========================
// ROLE CHECKS
// ========================

export function isAdminRole() {
  return getCurrentRole() === "ADMIN";
}

export function isSupportStaffRole() {
  return getCurrentRole() === "SUPPORT_STAFF";
}

export function isUserRole() {
  return getCurrentRole() === "USER";
}

export function isAdminOrSupport() {
  const role = getCurrentRole();
  return role === "ADMIN" || role === "SUPPORT_STAFF";
}

export function hasTicketAdminAccess() {
  return isAdminOrSupport();
}

// ========================
// USER DISPLAY
// ========================

export function getUserDisplayName() {
  const name = getCurrentName();
  const role = getCurrentRole();

  if (role === "ADMIN") return `${name} (Admin)`;
  if (role === "SUPPORT_STAFF") return `${name} (Support)`;
  return name;
}

// ========================
// PERMISSION SYSTEM
// ========================

export function hasPermission(requiredRole) {
  const roleHierarchy = {
    ADMIN: 3,
    SUPPORT_STAFF: 2,
    USER: 1,
  };

  const userRole = getCurrentRole();

  return (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 0);
}

// ========================
// AUTH STATUS
// ========================

export function isLoggedIn() {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem("token");
}