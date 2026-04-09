import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./FacilityLayout.css";

const FACILITY_TABS = [
  { 
    to: "/facilities", 
    label: "View Resources", 
    end: true,
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="4" y="10" width="6" height="11" rx="1" />
        <rect x="14" y="6" width="6" height="15" rx="1" />
        <path d="M4 4v6M14 4v2M2 21h20" />
      </svg>
    )
  },
  { 
    to: "/facilities/add", 
    label: "Add Resource", 
    end: false,
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="4" y="10" width="6" height="11" rx="1" />
        <rect x="14" y="6" width="6" height="15" rx="1" />
        <path d="M4 4v6M14 4v2M2 21h20" />
        <circle cx="17" cy="9" r="3" />
        <line x1="17" y1="7" x2="17" y2="11" />
        <line x1="15" y1="9" x2="19" y2="9" />
      </svg>
    )
  },
];

export default function FacilityLayout() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const location = useLocation();
  const isUserRoute = location.pathname.startsWith('/user-facilities');
  const tabsToDisplay = isUserRoute 
    ? [{ 
        to: "/user-facilities", 
        label: "View Resources", 
        end: true,
        icon: FACILITY_TABS[0].icon
      }] 
    : FACILITY_TABS;

  return (
    <div className="facility-layout">
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
              <rect x="4" y="10" width="6" height="11" rx="1" />
              <rect x="14" y="6" width="6" height="15" rx="1" />
              <path d="M4 4v6M14 4v2" />
            </svg>
            <span>Facility Management</span>
          </div>
          <h1>Resource Management</h1>
          <p>Manage and track all campus facilities and resources</p>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="tabs-container">
        <div className="tabs-wrapper">
          {tabsToDisplay.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `facility-tab ${isActive ? "facility-tab-active" : ""}`
              }
            >
              <span className="tab-icon">{tab.icon()}</span>
              <span className="tab-label">{tab.label}</span>
              <span className="tab-indicator"></span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Page content rendered here */}
      <div className="layout-content">
        <Outlet />
      </div>

      {/* Footer */}
      <div className="layout-footer">
        <div className="footer-content">
          <div className="footer-info">
            <span>© 2024 Resource Management System</span>
            <span className="footer-separator">•</span>
            <span>Real-time availability</span>
          </div>
          <div className="footer-stats">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Live updates</span>
          </div>
        </div>
      </div>
    </div>
  );
}