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
      setFilteredBookings(list);
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

  // ✅ Frontend filtering
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

  // ✅ Edit
  const onStartUpdate = (booking) => {
    setEditBookingId(booking.bookingId);
    setEditForm({
      resourceId: booking.resourceId,
      startTime: booking.startTime,
      endTime: booking.endTime,
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
          <p>Manage all bookings</p>
        </div>
        <button
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
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Resource</label>
          {loadingResources ? (
            <div>Loading...</div>
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

      {/* TABLE */}
      <div className="booking-table-wrapper">
        <table className="booking-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Resource</th>
              <th>Start</th>
              <th>End</th>
              <th>Attendees</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.map((b) => {
              const resourceName =
                resources.find((r) => r.id === b.resourceId)?.name ||
                b.resourceId;

              return (
                <>
                  <tr key={b.bookingId}>
                    <td>#{b.bookingId}</td>
                    <td>{resourceName}</td>
                    <td>{new Date(b.startTime).toLocaleString()}</td>
                    <td>{new Date(b.endTime).toLocaleString()}</td>
                    <td>{b.attendees}</td>
                    <td>
                      <span className={statusClass(b.status)}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-secondary"
                        onClick={() => onStartUpdate(b)}
                      >
                        Update
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => onDeleteBooking(b.bookingId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {/* EDIT ROW */}
                  {editBookingId === b.bookingId && editForm && (
                    <tr className="edit-row">
                      <td colSpan="7">
                        <form
                          onSubmit={onSaveUpdate}
                          className="edit-form-inline"
                        >
                          <select
                            name="resourceId"
                            value={editForm.resourceId}
                            onChange={onEditChange}
                          >
                            {resources.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                              </option>
                            ))}
                          </select>

                          <input
                            type="datetime-local"
                            name="startTime"
                            value={editForm.startTime}
                            onChange={onEditChange}
                          />

                          <input
                            type="datetime-local"
                            name="endTime"
                            value={editForm.endTime}
                            onChange={onEditChange}
                          />

                          <input
                            type="number"
                            name="attendees"
                            value={editForm.attendees}
                            onChange={onEditChange}
                          />

                          <select
                            name="status"
                            value={editForm.status}
                            onChange={onEditChange}
                          >
                            {STATUS_OPTIONS.filter(Boolean).map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>

                          <button className="btn-primary" type="submit">
                            Save
                          </button>
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={onCancelUpdate}
                          >
                            Cancel
                          </button>
                        </form>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}