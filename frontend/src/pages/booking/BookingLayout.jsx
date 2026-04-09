import { NavLink, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { isAdminOrSupport, isUserRole } from "../../utils/authSession";
import "./BookingLayout.css";

// Admin/Support tabs
const ADMIN_TABS = [
  { 
    to: "/bookings", 
    label: "All Bookings", 
    end: true, 
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
      </svg>
    )
  },
  { 
    to: "/bookings/create", 
    label: "Create Booking", 
    end: false, 
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    )
  },
];

// Regular User tabs
const USER_TABS = [
  { 
    to: "/bookings/my-bookings", 
    label: "My Bookings", 
    end: true, 
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
      </svg>
    )
  },
  { 
    to: "/bookings/create", 
    label: "Create Booking", 
    end: false, 
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    )
  },
];

export default function BookingLayout() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  const isAdmin = isAdminOrSupport();
  const isUser = isUserRole();
  
  // Select tabs based on user role
  const BOOKING_TABS = isAdmin ? ADMIN_TABS : (isUser ? USER_TABS : []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // Get appropriate header text based on role
  const getHeaderText = () => {
    if (isAdmin) {
      return {
        badge: "Booking Management",
        title: "Resource Booking System",
        description: "Manage all reservations across the campus"
      };
    } else {
      return {
        badge: "My Bookings",
        title: "Your Reservations",
        description: "View and manage your resource bookings"
      };
    }
  };

  const headerText = getHeaderText();

  return (
    <div className="booking-layout">
      {/* Global Theme Toggle */}
      <button onClick={toggleTheme} className="global-theme-toggle" aria-label="Toggle theme">
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

      {/* Header Section */}
      <div className="layout-header">
        <div className="layout-header-content">
          <div className="header-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
            </svg>
            <span>{headerText.badge}</span>
          </div>
          <h1>{headerText.title}</h1>
          <p>{headerText.description}</p>
        </div>
      </div>

      {/* Sub-navigation tabs - only show if there are tabs */}
      {BOOKING_TABS.length > 0 && (
        <div className="tabs-container">
          <div className="tabs-wrapper">
            {BOOKING_TABS.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  `booking-tab ${isActive ? "booking-tab-active" : ""}`
                }
              >
                <span className="tab-icon">{tab.icon()}</span>
                <span className="tab-label">{tab.label}</span>
                <span className="tab-indicator"></span>
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Page content rendered here */}
      <div className="layout-content">
        <Outlet />
      </div>

      {/* Footer */}
      <div className="layout-footer">
        <div className="footer-content">
          <div className="footer-info">
            <span>© 2024 Resource Booking System</span>
            <span className="footer-separator">•</span>
            <span>Secure & Reliable</span>
          </div>
          <div className="footer-stats">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Real-time updates</span>
          </div>
        </div>
      </div>
    </div>
  );
}