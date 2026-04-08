import { useEffect, useState, useCallback } from "react";
import {
  getBookings,
  updateBooking,
  deleteBooking,
  getAllResources,
} from "../../api/BookingApi";
import "./BookingList.css";

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED", "CANCELLED"];

function statusClass(status) {
  return `badge badge-${String(status || "").toLowerCase().replace("_", "-")}`;
}

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [resourceFilter, setResourceFilter] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingResources, setLoadingResources] = useState(true);
  const [error, setError] = useState("");
  const [editBookingId, setEditBookingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getBookings();
      const list = Array.isArray(data) ? data : [];
      setBookings(list);
      setFilteredBookings(list);
    } catch (err) {
      setError(err.message || "Unable to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadResources = useCallback(async () => {
    setLoadingResources(true);
    try {
      const data = await getAllResources();
      setResources(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load resources");
    } finally {
      setLoadingResources(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
    loadResources();
  }, [loadBookings, loadResources]);

  useEffect(() => {
    let filtered = [...bookings];
    if (statusFilter) {
      filtered = filtered.filter(
        (b) => b.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    if (resourceFilter) {
      filtered = filtered.filter(
        (b) => String(b.resourceId) === String(resourceFilter)
      );
    }
    setFilteredBookings(filtered);
  }, [statusFilter, resourceFilter, bookings]);

  const onStartUpdate = (booking) => {
    setEditBookingId(booking.bookingId);
    setEditForm({
      resourceId: booking.resourceId,
      startTime: booking.startTime?.slice(0, 16) || "",
      endTime: booking.endTime?.slice(0, 16) || "",
      attendees: booking.attendees,
      status: booking.status,
    });
  };

  const onEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSaveUpdate = async (e) => {
    e.preventDefault();
    if (!editBookingId || !editForm) return;
    setSavingEdit(true);
    setError("");
    try {
      await updateBooking(editBookingId, editForm);
      setEditBookingId(null);
      setEditForm(null);
      await loadBookings();
    } catch (err) {
      setError(err.message || "Unable to update booking");
    } finally {
      setSavingEdit(false);
    }
  };

  const onCancelUpdate = () => {
    setEditBookingId(null);
    setEditForm(null);
  };

  const onDeleteBooking = async (bookingId) => {
    const confirmed = window.confirm("Delete this booking?");
    if (!confirmed) return;
    try {
      await deleteBooking(bookingId);
      await loadBookings();
    } catch (err) {
      setError(err.message || "Unable to delete booking");
    }
  };

  const toggleTheme = () => setIsDark(!isDark);

  const getResourceName = (resourceId) => {
    const resource = resources.find((r) => r.id === resourceId);
    return resource?.name || `Resource #${resourceId}`;
  };

  return (
    <div className="booking-list-container">
      <div className="booking-list-card">

        {/* Header */}
        <div className="list-header">
          <div className="header-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
            </svg>
          </div>
          <div className="header-text">
            <h1>Bookings</h1>
            <p>Manage and track all reservations</p>
          </div>
          <button className="refresh-btn" onClick={loadBookings} disabled={loading}>
            {loading ? (
              <span className="spinner-small"></span>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Resource</label>
            {loadingResources ? (
              <div className="skeleton-filter">Loading resources...</div>
            ) : (
              <select value={resourceFilter} onChange={(e) => setResourceFilter(e.target.value)}>
                <option value="">All resources</option>
                {resources.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            )}
          </div>

          {(statusFilter || resourceFilter) && (
            <button className="clear-filters" onClick={() => {
              setStatusFilter("");
              setResourceFilter("");
            }}>
              Clear filters
            </button>
          )}
        </div>

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

        {/* Table */}
        <div className="table-wrapper">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <h3>No bookings found</h3>
              <p>{statusFilter || resourceFilter ? "Try adjusting your filters" : "Create your first booking to get started"}</p>
            </div>
          ) : (
            <table className="booking-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Resource</th>
                  <th>Start time</th>
                  <th>End time</th>
                  <th>Attendees</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b.bookingId} className={editBookingId === b.bookingId ? "editing" : ""}>
                    <td className="booking-id">#{b.bookingId}</td>
                    <td className="resource-cell">
                      <span className="resource-icon">📌</span>
                      {getResourceName(b.resourceId)}
                    </td>
                    <td>{new Date(b.startTime).toLocaleString()}</td>
                    <td>{new Date(b.endTime).toLocaleString()}</td>
                    <td className="attendees-cell">
                      <span className="attendees-badge">{b.attendees}</span>
                    </td>
                    <td>
                      <span className={statusClass(b.status)}>{b.status}</span>
                    </td>
                    <td className="actions-cell">
                      <button className="action-btn edit" onClick={() => onStartUpdate(b)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 3l4 4-7 7H10v-4l7-7z" />
                          <path d="M4 20h16" />
                        </svg>
                        Edit
                      </button>
                      <button className="action-btn delete" onClick={() => onDeleteBooking(b.bookingId)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13" />
                          <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit Modal */}
        {editBookingId && editForm && (
          <div className="modal-overlay" onClick={onCancelUpdate}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 3l4 4-7 7H10v-4l7-7z" />
                    <path d="M4 20h16" />
                  </svg>
                </div>
                <h2>Edit booking</h2>
                <button className="modal-close" onClick={onCancelUpdate}>×</button>
              </div>
              <form onSubmit={onSaveUpdate} className="edit-form">
                <div className="form-group">
                  <label>Resource</label>
                  <select name="resourceId" value={editForm.resourceId} onChange={onEditChange}>
                    {resources.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start time</label>
                    <input type="datetime-local" name="startTime" value={editForm.startTime} onChange={onEditChange} />
                  </div>
                  <div className="form-group">
                    <label>End time</label>
                    <input type="datetime-local" name="endTime" value={editForm.endTime} onChange={onEditChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Attendees</label>
                    <input type="number" name="attendees" min="1" value={editForm.attendees} onChange={onEditChange} />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={editForm.status} onChange={onEditChange}>
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={onCancelUpdate}>Cancel</button>
                  <button type="submit" className="btn-save" disabled={savingEdit}>
                    {savingEdit ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}