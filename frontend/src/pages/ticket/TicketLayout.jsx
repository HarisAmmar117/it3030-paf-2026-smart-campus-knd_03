import { NavLink, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { hasTicketAdminAccess } from "../../utils/authSession";
import "./TicketLayout.css";

const TICKET_TABS = [
  { 
    to: "/tickets", 
    label: "View Tickets", 
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
    to: "/tickets/create", 
    label: "Create Ticket", 
    end: false,
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="12" y1="18" x2="12" y2="12"/>
        <line x1="9" y1="15" x2="15" y2="15"/>
      </svg>
    )
  },
  {
    to: "/tickets/admin",
    label: "Admin Panel",
    end: false,
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M12 2l7 4v6c0 5-3.5 8.7-7 10-3.5-1.3-7-5-7-10V6l7-4z" />
        <path d="M9.5 12.5l1.8 1.8 3.2-3.6" />
      </svg>
    )
  },
];

export default function TicketLayout() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);
  const visibleTicketTabs = TICKET_TABS.filter((tab) => {
    if (hasTicketAdminAccess()) {
      return tab.to === "/tickets/admin";
    }

    return tab.to !== "/tickets/admin";
  });
  return (
    <div className="ticket-layout">
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
            <span>Ticket Management</span>
          </div>
          <h1>Support Ticket System</h1>
          <p>Track, manage, and resolve campus issues efficiently</p>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="tabs-container">
        <div className="tabs-wrapper">
         {visibleTicketTabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `ticket-tab ${isActive ? "ticket-tab-active" : ""}`
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
            <span>© 2024 Support Ticket System</span>
            <span className="footer-separator">•</span>
            <span>24/7 Support Available</span>
          </div>
          <div className="footer-stats">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Average response: &lt; 2 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
}