import { NavLink, Outlet } from "react-router-dom";
import "./BookingLayout.css";

const BOOKING_TABS = [
  { to: "/bookings", label: "View Bookings", end: true },
  { to: "/bookings/create", label: "Create Booking", end: false },
];

export default function BookingLayout() {
  return (
    <div className="booking-layout">
      {/* Sub-navigation tabs */}
      <div className="booking-tabs">
        {BOOKING_TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `booking-tab ${isActive ? "booking-tab-active" : ""}`
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