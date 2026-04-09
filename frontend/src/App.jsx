import { Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./App.css";
import { hasTicketAdminAccess, isUserRole, isAdminOrSupport } from "./utils/authSession";
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

// ========================
// MEMBER 2 — Booking Pages
// ========================
import BookingLayout from "./pages/booking/BookingLayout";
import BookingListPage from "./pages/booking/BookingListPage";
import BookingCreatePage from "./pages/booking/BookingCreatePage";
import UserBookingsPage from "./pages/booking/UserBookingsPage";

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
// AUTH PAGES
// ========================
import LoginPage from "./pages/auth/LoginPage";

function RequireAdmin({ children, redirectTo = "/tickets" }) {
  if (!hasTicketAdminAccess()) return <Navigate to={redirectTo} replace />;
  return children;
}

RequireAdmin.propTypes = {
  children: PropTypes.node.isRequired,
  redirectTo: PropTypes.string,
};

function RequireAuth({ children, redirectTo = "/login" }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to={redirectTo} replace />;
  return children;
}

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
  redirectTo: PropTypes.string,
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

// Require Admin or Support Staff for viewing all bookings
function RequireAdminOrSupport({ children }) {
  if (!isAdminOrSupport()) {
    // If user is regular user, redirect to their own bookings
    if (isUserRole()) return <Navigate to="/bookings/my-bookings" replace />;
    return <Navigate to="/login" replace />;
  }
  return children;
}

RequireAdminOrSupport.propTypes = {
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
            <Route 
              path="admin" 
              element={
                <RequireAdmin redirectTo="/tickets">
                  <AdminTicketPage />
                </RequireAdmin>
              } 
            />
          </Route>

          {/* ====== MEMBER 1 — Facilities ====== */}
          <Route 
            path="/facilities" 
            element={
              <RequireAuth>
                <FacilityLayout /> 
              </RequireAuth>
            }
          >
            <Route index element={<FacilityListPage />} />
            <Route path="add" element={<FacilityCreatePage />} />
            <Route path="edit/:id" element={<FacilityEditPage />} />
          </Route>

          {/* ====== MEMBER 2 — Bookings ====== */}
          <Route 
            path="/bookings" 
            element={
              <RequireAuth>
                <BookingLayout />
              </RequireAuth>
            }
          >
            {/* Admin/Support Staff view - all bookings */}
            <Route 
              index 
              element={
                <RequireAdminOrSupport>
                  <BookingListPage />
                </RequireAdminOrSupport>
              } 
            />
            
            {/* Create booking - only regular users */}
            <Route 
              path="create" 
              element={
                <RequireUser>
                  <BookingCreatePage />
                </RequireUser>
              } 
            />
            
            {/* User's own bookings view - only regular users */}
            <Route 
              path="my-bookings" 
              element={
                <RequireUser>
                  <UserBookingsPage />
                </RequireUser>
              } 
            />
          </Route>

          {/* ====== MEMBER 4 — Notifications ====== */}
          <Route 
            path="/notifications" 
            element={
              <RequireAuth>
                <NotificationLayout />
              </RequireAuth>
            }
          >
            <Route index element={<NotificationListPage />} />
          </Route>

          {/* Auth Route */}
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