import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import "./Navbar.css";
import logo from "../../../public/zenith-logo.png";
import {
  getCurrentRole,
  isAdminOrSupport,
  isUserRole,
  getCurrentUserId
} from "../../utils/authSession";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from "../../api/notificationApi";

// Core management links (shown to all logged-in users)
const MANAGEMENT_LINKS = [
  {
    to: "/tickets",
    label: "Tickets",
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
      </svg>
    )
  },
  {
    to: "/facilities",
    label: "Facilities",
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="4" y="10" width="6" height="11" rx="1" />
        <rect x="14" y="6" width="6" height="15" rx="1" />
        <path d="M4 4v6M14 4v2M2 21h20" />
      </svg>
    )
  },
];

// Public links (Home & About) - shown to non-authenticated users AND regular users
const PUBLIC_LINKS = [
  {
    to: "/",
    label: "Home",
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    end: true
  },
  {
    to: "/about",
    label: "About",
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    )
  },
];

// Get role-based booking links
const getBookingLinks = () => {
  const isAdminOrSupportUser = isAdminOrSupport();
  const isRegularUser = isUserRole();

  if (isAdminOrSupportUser) {
    // Admin/Support sees: All Bookings
    return [
      {
        to: "/bookings",
        label: "All Bookings",
        icon: () => (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
          </svg>
        )
      }
    ];
  } else if (isRegularUser) {
    // Regular user sees: My Bookings + Create Booking
    return [
      {
        to: "/bookings/my-bookings",
        label: "My Bookings",
        icon: () => (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
          </svg>
        )
      }
    ];
  }

  return [];
};

// Admin-only Notification nav link (routes to NotificationListPage)
const ADMIN_NOTIFICATION_LINK = [
  {
    to: "/notifications",
    label: "Notification",
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    )
  }
];

// Get navbar links based on authentication status and role
const getNavLinks = (isLoggedIn) => {
  if (!isLoggedIn) {
    // Non-authenticated users: Home + About only
    return PUBLIC_LINKS;
  }

  const isRegularUser = isUserRole();
  const bookingLinks = getBookingLinks();

  if (isRegularUser) {
    // Regular users: Home + About + Management Links + Booking Links (NO Notification link — they use the bell)
    return [...PUBLIC_LINKS, ...MANAGEMENT_LINKS, ...bookingLinks];
  } else {
    // Admin/Support users: Management Links + Booking Links + Notification link
    return [...MANAGEMENT_LINKS, ...bookingLinks, ...ADMIN_NOTIFICATION_LINK];
  }
};

// Helper function to get role display name
const getRoleDisplayName = (role) => {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "SUPPORT_STAFF":
      return "Support";
    default:
      return "";
  }
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  const token = localStorage.getItem("token");
  const role = getCurrentRole();
  const isLoggedIn = !!token;
  const userName = localStorage.getItem("userName") || "User";
  const userEmail = localStorage.getItem("userEmail") || "";
  const userId = getCurrentUserId();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);

  // Build dynamic navigation links based on authentication status and role
  const MODULE_LINKS = getNavLinks(isLoggedIn);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await getNotifications(userId);
      const notificationsArray = Array.isArray(data) ? data : (data.data || []);
      const latest = notificationsArray
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      const formatted = latest.map((n) => ({
        id: n.id,
        heading:
          n.type === "TICKET_STATUS_CHANGED" && /high priority ticket/i.test(n.message || "")
            ? "HIGH TICKET ARRIVED"
            : n.type?.replace(/_/g, " ") || "Notification",
        content: n.message || n.title || "No content",
        time: formatTime(n.createdAt),
        read: n.read || false,
      }));

      setNotifications(formatted);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, [userId]);

  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return;
    try {
      const count = await getUnreadCount(userId);
      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  }, [userId]);

  const formatTime = (dateStr) => {
    if (!dateStr) return "Just now";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [isLoggedIn, fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => setIsDark(!isDark);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleNotification = () => setIsNotificationOpen(!isNotificationOpen);

  const handleMarkAsRead = async (id) => {
    if (!userId) return;
    try {
      await markAsRead(id, userId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    try {
      await markAllAsRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    window.location.href = "/login";
  };

  const visibleLinks = MODULE_LINKS;
  const roleDisplayName = getRoleDisplayName(role);
  const displayName = roleDisplayName ? `${userName} (${roleDisplayName})` : userName;

  return (
    <>
      <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
        <div className="navbar-container">
          {/* Logo / Brand */}
          <NavLink to="/" className="navbar-brand" onClick={closeMobileMenu}>
            <div className="brand-icon">
              <img src={logo} alt="Zenith Logo" className="brand-logo-img" />
            </div>
            <div className="brand-text">
              <span className="brand-title">ZENITH</span>
              <span className="brand-subtitle">Smart Campus Operations</span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="navbar-links-desktop">
            {visibleLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                <span className="nav-icon">
                  {item.icon()}
                </span>
                <span className="nav-label">{item.label}</span>
                <span className="nav-indicator"></span>
              </NavLink>
            ))}
          </div>

          {/* Right Section */}
          <div className="navbar-right">
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
              {isDark ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* Notification Bell — shown only to regular Users (Admins use the nav link) */}
            {isLoggedIn && isUserRole() && (
              <div className="notification-wrapper" ref={notificationRef}>
                <button onClick={toggleNotification} className="notification-btn" aria-label="Notifications">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>

                {isNotificationOpen && (
                  <div className="notification-dropdown">
                    <div className="notification-header">
                      <h3>Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={handleMarkAllAsRead} className="mark-all-read">
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="notification-list">
                      {notifications.length === 0 ? (
                        <div className="notification-empty">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                          </svg>
                          <p>No notifications</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`notification-item ${!n.read ? "unread" : ""}`}
                            onClick={() => handleMarkAsRead(n.id)}
                          >
                            <div className="notification-dot"></div>
                            <div className="notification-content">
                              <div className="notification-heading">{n.heading}</div>
                              <div className="notification-message">{n.content}</div>
                              <div className="notification-time">{n.time}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="notification-footer">
                      <NavLink to="/user-notifications" onClick={() => setIsNotificationOpen(false)}>
                        View all notifications
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Name Chip with Role */}
            {isLoggedIn && (
              <div className="user-name-chip" title={`${userEmail} | Role: ${role}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>{displayName}</span>
              </div>
            )}

            {/* Login/Logout Button */}
            {isLoggedIn ? (
              <button onClick={handleLogout} className="logout-btn" title={`Logout (${role})`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            ) : (
              <NavLink to="/login" className="login-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Login
              </NavLink>
            )}

            {/* Mobile Menu Button */}
            <button
              className={`mobile-menu-btn ${isMobileMenuOpen ? "active" : ""}`}
              onClick={toggleMobileMenu}
              aria-label="Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? "open" : ""}`} onClick={closeMobileMenu}>
        <div className="mobile-menu-container" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-header">
            <div className="mobile-brand">
              <div className="brand-icon">
                <img src={logo} alt="Zenith Logo" className="brand-logo-img" />
              </div>
              <div>
                <div className="mobile-brand-title">Zenith</div>
                <div className="mobile-brand-subtitle">Smart Campus Operations</div>
              </div>
            </div>
          </div>
          <div className="mobile-menu-links">
            {visibleLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `mobile-nav-link ${isActive ? "mobile-nav-link-active" : ""}`
                }
                onClick={closeMobileMenu}
              >
                <span className="mobile-nav-icon">{item.icon()}</span>
                <span className="mobile-nav-label">{item.label}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </NavLink>
            ))}
          </div>
          <div className="mobile-menu-footer">
            <div className="mobile-user-info">
              <div className="mobile-user-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <div className="mobile-user-name">{isLoggedIn ? displayName : "Guest"}</div>
                <div className="mobile-user-email">
                  {isLoggedIn ? userEmail || role : "Not signed in"}
                </div>
              </div>
            </div>
            {!isLoggedIn && (
              <div className="mobile-login-section">
                <NavLink to="/login" className="mobile-login-btn" onClick={closeMobileMenu}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  Sign In
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}