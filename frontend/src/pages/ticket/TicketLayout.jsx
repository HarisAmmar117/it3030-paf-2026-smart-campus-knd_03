import { NavLink, Outlet } from "react-router-dom";
import "./TicketLayout.css";

const TICKET_TABS = [
  { to: "/tickets", label: "View Tickets", end: true },
  { to: "/tickets/create", label: "Create Ticket", end: false },
];

export default function TicketLayout() {
  return (
    <div className="ticket-layout">
      {/* Sub-navigation tabs */}
      <div className="ticket-tabs">
        {TICKET_TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `ticket-tab ${isActive ? "ticket-tab-active" : ""}`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* Page content rendered here */}
      <Outlet />
    </div>
  );
}
