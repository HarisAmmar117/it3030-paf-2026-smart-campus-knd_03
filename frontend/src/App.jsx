import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

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
// import LoginPage from "./pages/auth/LoginPage";

function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />

          {/* ====== MEMBER 3 — Tickets ====== */}
          <Route path="/tickets" element={<TicketLayout />}>
            <Route index element={<TicketListPage />} />
            <Route path="create" element={<TicketCreatePage />} />
            {/* <Route path=":id" element={<TicketDetailPage />} /> */}
          </Route>

          {/* ====== MEMBER 1 — Facilities ====== */}
          <Route path="/facilities" element={<FacilityLayout />}>
            <Route index element={<FacilityListPage />} />
            <Route path="add" element={<FacilityCreatePage />} />
            <Route path="edit/:id" element={<FacilityEditPage />} />
          </Route>

          {/* ====== MEMBER 2 — Bookings ====== */}
          <Route path="/bookings" element={<BookingLayout />}>
            <Route index element={<BookingListPage />} />
            <Route path="create" element={<BookingCreatePage />} />
          </Route>

          {/* ====== MEMBER 4 — Notifications & Auth ====== */}
          <Route path="/notifications" element={<NotificationLayout />}>
            <Route index element={<NotificationListPage />} />
          </Route>

          {/* Auth Route (to be implemented) */}
          {/* <Route path="/login" element={<LoginPage />} /> */}

          {/* 404 Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;