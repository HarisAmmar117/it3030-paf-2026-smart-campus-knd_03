import { Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./App.css";
import { hasTicketAdminAccess, isUserRole } from "./utils/authSession";
import { useLocation } from "react-router-dom";
// Shared layout
import Navbar from "./components/common/Navbar";

// ========================
// MEMBER 3 — Ticket Pages
// ========================
import TicketLayout from "./pages/ticket/TicketLayout";
import TicketCreatePage from "./pages/ticket/TicketCreatePage";
import TicketListPage from "./pages/ticket/TicketListPage";
import AdminTicketPage from "./pages/ticket/AdminTicketPage";

// ========================
// MEMBER 1 — Facility Pages
// ========================
import FacilityLayout from "./pages/facility/FacilityLayout";
import FacilityListPage from "./pages/facility/FacilityListPage";
import FacilityCreatePage from "./pages/facility/FacilityCreatePage";
import FacilityEditPage from "./pages/facility/FacilityEditPage";
import UserFacilityPage from "./pages/facility/UserFacilityPage";

// ========================
// MEMBER 2 — Booking Pages
// ========================
import BookingLayout from "./pages/booking/BookingLayout";
import BookingListPage from "./pages/booking/BookingListPage";
import BookingCreatePage from "./pages/booking/BookingCreatePage";

// ========================
// MEMBER 4 — Notification & Auth Pages
// ========================
import NotificationLayout from "./pages/notification/NotificationLayout";
import NotificationListPage from "./pages/notification/NotificationListPage";

// ========================
// PUBLIC PAGES
// ========================
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";

// ========================
// AUTH PAGES (to be implemented)
// ========================
import LoginPage from "./pages/auth/LoginPage";

function RequireAdmin({ children }) {
  if (!hasTicketAdminAccess()) return <Navigate to="/tickets" replace />;
  return children;
}

RequireAdmin.propTypes = {
  children: PropTypes.node.isRequired,
};

function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

function RequireUser({ children }) {
  if (!isUserRole()) {
    if (hasTicketAdminAccess()) return <Navigate to="/tickets/admin" replace />;
    return <Navigate to="/login" replace />;
  }
  return children;
}

RequireUser.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";
  const token = localStorage.getItem("token");
  const loginRedirectPath = hasTicketAdminAccess() ? "/tickets/admin" : "/tickets";

  return (
    <div className="app-layout">
      {!hideNavbar && <Navbar />}
      <main className="app-main">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />

          {/* ====== MEMBER 3 — Tickets ====== */}
          <Route
              path="/tickets"
              element={
                <RequireAuth>
                  <TicketLayout />
                </RequireAuth>
              }
            >
            <Route
              index
              element={
                <RequireUser>
                  <TicketListPage />
                </RequireUser>
              }
            />
            <Route
              path="create"
              element={
                <RequireUser>
                  <TicketCreatePage />
                </RequireUser>
              }
            />
            <Route path="admin" element={
                <RequireAdmin>
                  <AdminTicketPage />
                </RequireAdmin>
              } />
            {/* <Route path=":id" element={<TicketDetailPage />} /> */}
          </Route>

          {/* ====== MEMBER 1 — Facilities ====== */}
          <Route path="/facilities" element={
             <RequireAuth>
            <FacilityLayout /> 
             </RequireAuth>}>
            <Route index element={<FacilityListPage />} />
            <Route path="add" element={<FacilityCreatePage />} />
            <Route path="edit/:id" element={<FacilityEditPage />} />
          </Route>
          <Route path="/user-facilities" element={<FacilityLayout />}>
            <Route index element={<UserFacilityPage />} />
          </Route>

          {/* ====== MEMBER 2 — Bookings ====== */}
          <Route path="/bookings" element={
            <RequireAuth>
            <BookingLayout />
            </RequireAuth>
            }>
            <Route index element={<BookingListPage />} />
            <Route path="create" element={<BookingCreatePage />} />
          </Route>

          {/* ====== MEMBER 4 — Notifications & Auth ====== */}
          <Route path="/notifications" element={
            <RequireAuth>
            <NotificationLayout />
            </RequireAuth>
            }>
            <Route index element={<NotificationListPage />} />
          </Route>

          {/* Auth Route (to be implemented) */}
          <Route
            path="/login"
            element={token ? <Navigate to={loginRedirectPath} replace /> : <LoginPage />}
          />

          {/* 404 Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;