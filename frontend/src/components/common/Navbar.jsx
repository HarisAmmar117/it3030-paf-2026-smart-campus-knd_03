import { NavLink } from "react-router-dom";
import "./Navbar.css";

// Top-level module links — each member's section
const MODULE_LINKS = [
  { to: "/tickets", label: "🎫 Tickets", active: true },
  { to: "/facilities", label: "🏢 Facilities", active: true },
  { to: "/bookings", label: "📅 Bookings", active: false },
  { to: "/notifications", label: "🔔 Notifications", active: false },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo / Brand */}
        <NavLink to="/" className="navbar-brand">
          <span className="navbar-logo">🏛️</span>
          <span className="navbar-title">CampusHub</span>
        </NavLink>

        {/* Module Navigation */}
        <div className="navbar-links">
          {MODULE_LINKS.map((item) =>
            item.active ? (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "navbar-link-active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <span key={item.to} className="navbar-link navbar-link-disabled">
                {item.label}
              </span>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
