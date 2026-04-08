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
// (Uncomment when Member 2 creates their pages)
// ========================
import BookingLayout from "./pages/booking/BookingLayout";
import BookingListPage from "./pages/booking/BookingListPage";
import BookingCreatePage from "./pages/booking/BookingCreatePage";

// ========================
// MEMBER 4 — Notification & Auth Pages
// (Uncomment when Member 4 creates their pages)
// ========================
import NotificationLayout from "./pages/notification/NotificationLayout";
import NotificationListPage from "./pages/notification/NotificationListPage";
// import LoginPage from "./pages/auth/LoginPage";

function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main">
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/tickets" replace />} />

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
          {/* <Route path="/login" element={<LoginPage />} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;