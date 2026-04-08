import { NavLink, Outlet } from "react-router-dom";
import "./FacilityLayout.css";

const FACILITY_TABS = [
  { to: "/facilities", label: "View Resources", end: true },
  { to: "/facilities/add", label: "Add Resource", end: false },
];

export default function FacilityLayout() {
  return (
    <div className="facility-layout">
      {/* Sub-navigation tabs */}
      <div className="facility-tabs">
        {FACILITY_TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `facility-tab ${isActive ? "facility-tab-active" : ""}`
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
