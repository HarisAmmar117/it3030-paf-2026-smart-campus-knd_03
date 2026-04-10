import { useEffect, useState, useCallback } from "react";
import { getUserBookings, updateBookingStatus, deleteBooking, getAllResources } from "../../api/BookingApi";
import "./UserBookingsPage.css";

const STATUS_OPTIONS = ["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"];

function statusClass(status) {
  return `status-badge status-${String(status || "").toLowerCase()}`;
}

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [cancellingId, setCancellingId] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  const userId = Number(localStorage.getItem("userId")) || 2;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const loadResources = useCallback(async () => {
    try {
      const data = await getAllResources();
      setResources(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load resources:", err);
    }
  }, []);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUserBookings({ userId });
      const bookingsArray = Array.isArray(data) ? data : [];
      
      // Debug: Log the first booking to see what fields are present
      if (bookingsArray.length > 0) {
        console.log("First booking object:", bookingsArray[0]);
        console.log("createdAt field:", bookingsArray[0].createdAt);
        console.log("All keys:", Object.keys(bookingsArray[0]));
      }
      
      setBookings(bookingsArray);
      setFilteredBookings(bookingsArray);
    } catch (err) {
      setError(err.message || "Unable to load your bookings");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadResources();
    loadBookings();
  }, [loadResources, loadBookings]);

  useEffect(() => {
    let filtered = [...bookings];
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(b => b.status === statusFilter);
    }
    setFilteredBookings(filtered);
  }, [statusFilter, bookings]);

  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmed) return;

    setCancellingId(bookingId);
    setError("");
    setSuccess("");

    try {
      await updateBookingStatus(bookingId, "CANCELLED");
      setSuccess("Booking cancelled successfully!");
      await loadBookings();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to cancel booking");
      setTimeout(() => setError(""), 3000);
    } finally {
      setCancellingId(null);
    }
  };

  const toggleTheme = () => setIsDark(!isDark);

  const getResourceName = (resourceId) => {
    const resource = resources.find(r => r.id === resourceId);
    return resource?.name || `Resource #${resourceId}`;
  };

  // Enhanced date formatter that handles multiple formats
  const formatDateTime = (dateValue) => {
    if (!dateValue) return "N/A";
    
    try {
      let date;
      
      // Handle different input types
      if (typeof dateValue === 'string') {
        // Try parsing the string directly
        date = new Date(dateValue);
        
        // If that fails, try replacing space with T (for MySQL format)
        if (isNaN(date.getTime()) && dateValue.includes(' ')) {
          date = new Date(dateValue.replace(' ', 'T'));
        }
      } else if (dateValue instanceof Date) {
        date = dateValue;
      } else if (typeof dateValue === 'object' && dateValue !== null) {
        // Handle LocalDateTime object from Java (might be serialized as array or object)
        if (Array.isArray(dateValue) && dateValue.length >= 3) {
          // Format: [year, month, day, hour, minute, second]
          const [year, month, day, hour, minute, second] = dateValue;
          date = new Date(year, month - 1, day, hour || 0, minute || 0, second || 0);
        } else if (dateValue.year !== undefined) {
          // Object format: { year: 2026, month: 4, day: 10, hour: 19, minute: 27, second: 54 }
          date = new Date(
            dateValue.year,
            (dateValue.month || 1) - 1,
            dateValue.day || 1,
            dateValue.hour || 0,
            dateValue.minute || 0,
            dateValue.second || 0
          );
        }
      }
      
      // Check if date is valid
      if (!date || isNaN(date.getTime())) {
        console.warn("Could not parse date:", dateValue);
        return String(dateValue);
      }
      
      // Format as "Apr 10, 2026, 7:27:54 PM"
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error("Date formatting error:", error, "for value:", dateValue);
      return String(dateValue);
    }
  };

  const canCancel = (status) => {
    return status === "PENDING";
  };

  return (
    <div className="user-bookings-container">
      <div className="user-bookings-card">
        <button onClick={toggleTheme} className="global-theme-toggle" aria-label="Toggle theme">
          {isDark ? (
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <div className="user-bookings-header">
          <div className="header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
            </svg>
          </div>
          <div className="header-text">
            <h1>My Bookings</h1>
            <p>View and manage your resource reservations</p>
          </div>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <label>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              Status
            </label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {success && (
          <div className="alert alert-success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            {success}
          </div>
        )}
        {error && (
          <div className="alert alert-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <div className="bookings-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <h3>No bookings found</h3>
              <p>{statusFilter !== "ALL" ? "Try changing your filter" : "You haven't made any bookings yet"}</p>
            </div>
          ) : (
            <div className="bookings-grid">
              {filteredBookings.map((booking) => (
                <div key={booking.bookingId} className="booking-card-item">
                  <div className="booking-card-header">
                    <div className="booking-title">
                      <span className="booking-id">#{booking.bookingId}</span>
                      <span className={statusClass(booking.status)}>{booking.status}</span>
                    </div>
                  </div>

                  <div className="booking-resource">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="4" y="10" width="6" height="11" rx="1" />
                      <rect x="14" y="6" width="6" height="15" rx="1" />
                      <path d="M4 4v6M14 4v2M2 21h20" />
                    </svg>
                    <span>{getResourceName(booking.resourceId)}</span>
                  </div>

                  <div className="booking-details">
                    <div className="detail-row">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <div className="detail-info">
                        <span className="detail-label">Start Time</span>
                        <span className="detail-value">{formatDateTime(booking.startTime)}</span>
                      </div>
                    </div>
                    <div className="detail-row">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <div className="detail-info">
                        <span className="detail-label">End Time</span>
                        <span className="detail-value">{formatDateTime(booking.endTime)}</span>
                      </div>
                    </div>
                    <div className="detail-row">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <div className="detail-info">
                        <span className="detail-label">Attendees</span>
                        <span className="detail-value">{booking.attendees} people</span>
                      </div>
                    </div>
                    <div className="detail-row">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <div className="detail-info">
                        <span className="detail-label">Purpose</span>
                        <span className="detail-value">{booking.purpose || "Not specified"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="booking-footer">
                    <div className="footer-date">
                  
                    </div>
                    {canCancel(booking.status) && (
                      <button 
                        className="cancel-btn"
                        onClick={() => handleCancelBooking(booking.bookingId)}
                        disabled={cancellingId === booking.bookingId}
                      >
                        {cancellingId === booking.bookingId ? (
                          <span className="spinner-small"></span>
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                            Cancel Booking
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}