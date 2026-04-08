import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";
import logo from "../../../public/zenith-logo.png";

const MODULE_LINKS = [
  { 
    to: "/", 
    label: "Home", 
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    end: true
  },
  { 
    to: "/tickets", 
    label: "Tickets", 
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
      </svg>
    )
  },
  { 
    to: "/facilities", 
    label: "Facilities", 
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="4" y="10" width="6" height="11" rx="1" />
        <rect x="14" y="6" width="6" height="15" rx="1" />
        <path d="M4 4v6M14 4v2M2 21h20" />
      </svg>
    )
  },
  { 
    to: "/bookings", 
    label: "Bookings", 
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
      </svg>
    )
  },
  { 
    to: "/notifications", 
    label: "Notifications", 
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    )
  },
  { 
    to: "/about", 
    label: "About", 
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    )
  },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

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

  const toggleTheme = () => setIsDark(!isDark);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
              <span className="brand-title">Zenith</span>
              <span className="brand-subtitle">Smart Campus Operations</span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="navbar-links-desktop">
            {MODULE_LINKS.map((item) => (
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
            {/* Theme Toggle with Sun/Moon Icons */}
            <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
              {isDark ? (
                /* Sun icon for dark mode (click to switch to light) */
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
                /* Moon icon for light mode (click to switch to dark) */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* User Avatar */}
            <div className="user-avatar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

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
            {MODULE_LINKS.map((item) => (
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
                <div className="mobile-user-name">John Doe</div>
                <div className="mobile-user-email">john@campus.edu</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}