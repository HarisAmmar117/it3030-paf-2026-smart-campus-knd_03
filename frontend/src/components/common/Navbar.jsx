import { NavLink } from "react-router-dom";
import "./Navbar.css";

const MODULE_LINKS = [
  { to: "/tickets", label: "🎫 Tickets" },
  { to: "/facilities", label: "🏢 Facilities" },
  { to: "/bookings", label: "📅 Bookings" },
  { to: "/notifications", label: "🔔 Notifications" },
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
          {MODULE_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `navbar-link ${isActive ? "navbar-link-active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}