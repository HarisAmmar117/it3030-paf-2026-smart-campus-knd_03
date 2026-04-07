import { useEffect, useState, useCallback } from "react";
import {
  getBookings,
  updateBooking,
  deleteBooking,
  getAllResources,
} from "../../api/BookingApi";
import "./BookingList.css";

const STATUS_OPTIONS = ["", "PENDING", "APPROVED", "REJECTED", "CANCELLED"];

function statusClass(status) {
  return `badge badge-${String(status || "")
    .toLowerCase()
    .replace("_", "-")}`;
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

  // ✅ Load bookings
  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getBookings();
      const list = Array.isArray(data) ? data : [];
      setBookings(list);
      setFilteredBookings(list); // initial
    } catch (err) {
      setError(err.message || "Unable to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Load resources
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

  // ✅ FRONTEND FILTERING (AUTO 🔥)
  useEffect(() => {
    let filtered = [...bookings];

    if (statusFilter) {
      filtered = filtered.filter(
        (b) =>
          b.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (resourceFilter) {
      filtered = filtered.filter(
        (b) => String(b.resourceId) === String(resourceFilter)
      );
    }

    setFilteredBookings(filtered);
  }, [statusFilter, resourceFilter, bookings]);

  // ✅ Start edit
  const onStartUpdate = (booking) => {
    setEditBookingId(booking.bookingId);
    setEditForm({
      resourceId: booking.resourceId,
      startTime: booking.startTime,
      endTime: booking.endTime,
      purpose: booking.purpose,
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

  return (
    <div className="booking-list-shell fade-in">
      <div className="booking-list-header">
        <div>
          <h2>Bookings</h2>
          <p>Manage all room, lab, and equipment bookings.</p>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={loadBookings}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Filters */}
      <div className="booking-filters card">
        <div className="filter-group">
          <label>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">ALL</option>
            {STATUS_OPTIONS.filter(Boolean).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Resource</label>
          {loadingResources ? (
            <div>Loading resources...</div>
          ) : (
            <select
              value={resourceFilter}
              onChange={(e) => setResourceFilter(e.target.value)}
            >
              <option value="">ALL</option>
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && filteredBookings.length === 0 && (
        <div className="card empty-state">
          <h3>No bookings found</h3>
          <p>Try changing filters.</p>
        </div>
      )}

      <div className="booking-grid">
        {filteredBookings.map((b) => (
          <article className="booking-card" key={b.bookingId}>
            <div className="booking-card-top">
              <h3>
                #{b.bookingId} {b.purpose}
              </h3>
              <span className={statusClass(b.status)}>
                {b.status}
              </span>
            </div>

            <div className="booking-meta">
              <div>
                <strong>Resource:</strong> {b.resourceId}
              </div>
              <div>
                <strong>Start:</strong>{" "}
                {new Date(b.startTime).toLocaleString()}
              </div>
              <div>
                <strong>End:</strong>{" "}
                {new Date(b.endTime).toLocaleString()}
              </div>
              <div>
                <strong>Attendees:</strong> {b.attendees}
              </div>
            </div>

            <div className="booking-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => onStartUpdate(b)}
              >
                Update
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => onDeleteBooking(b.bookingId)}
              >
                Delete
              </button>
            </div>

            {/* Edit Form */}
            {editBookingId === b.bookingId && editForm && (
              <form
                className="booking-edit-form"
                onSubmit={onSaveUpdate}
              >
                <div className="booking-edit-grid">
                  <div className="form-group">
                    <label>Resource</label>
                    <select
                      name="resourceId"
                      value={editForm.resourceId}
                      onChange={onEditChange}
                      required
                    >
                      {resources.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Start Time</label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={editForm.startTime}
                      onChange={onEditChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>End Time</label>
                    <input
                      type="datetime-local"
                      name="endTime"
                      value={editForm.endTime}
                      onChange={onEditChange}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Purpose</label>
                    <input
                      name="purpose"
                      value={editForm.purpose}
                      onChange={onEditChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Attendees</label>
                    <input
                      type="number"
                      min="1"
                      name="attendees"
                      value={editForm.attendees}
                      onChange={onEditChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={editForm.status}
                      onChange={onEditChange}
                    >
                      {STATUS_OPTIONS.filter(Boolean).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="booking-edit-actions">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={savingEdit}
                  >
                    {savingEdit ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={onCancelUpdate}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}