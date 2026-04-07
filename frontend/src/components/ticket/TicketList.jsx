import { useEffect, useState, useCallback } from "react";
import { deleteTicket, getTickets, updateTicket } from "../../api/ticketApi";
import "./TicketList.css";

const STATUS_OPTIONS = ["", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"];
const PRIORITY_OPTIONS = ["", "LOW", "MEDIUM", "HIGH", "CRITICAL"];
const CATEGORY_OPTIONS = ["ELECTRICAL", "PLUMBING", "NETWORK", "HARDWARE", "SOFTWARE", "SAFETY", "OTHER"];

function statusClass(status) {
  return `badge badge-${String(status || "").toLowerCase().replace("_", "-")}`;
}

function priorityClass(priority) {
  return `badge badge-${String(priority || "").toLowerCase()}`;
}

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editTicketId, setEditTicketId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const currentUserId = 101;

  const loadTickets = useCallback(async () => {
  setLoading(true);
  setError("");
  try {
    const data = await getTickets({ status, priority });
    setTickets(Array.isArray(data) ? data : []);
  } catch (err) {
    setError(err.message || "Unable to load tickets");
  } finally {
    setLoading(false);
  }
}, [status, priority]);

  useEffect(() => {
  loadTickets();
}, [loadTickets]);

  const onApplyFilters = (e) => {
    e.preventDefault();
    loadTickets();
  };

  const onStartUpdate = (ticket) => {
    if (!(ticket.status === "OPEN" && ticket.requesterId === currentUserId)) return;

    setEditTicketId(ticket.id);
    setEditForm({
      title: ticket.title,
      description: ticket.description,
      resourceLocation: ticket.resourceLocation,
      preferredContactDetails: ticket.preferredContactDetails,
      category: ticket.category,
      priority: ticket.priority,
    });
  };

  const onEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSaveUpdate = async (e) => {
    e.preventDefault();
    if (!editTicketId || !editForm) return;

    setSavingEdit(true);
    setError("");
    try {
      await updateTicket(editTicketId, editForm);
      setEditTicketId(null);
      setEditForm(null);
      await loadTickets();
    } catch (err) {
      setError(err.message || "Unable to update ticket");
    } finally {
      setSavingEdit(false);
    }
  };

  const onCancelUpdate = () => {
    setEditTicketId(null);
    setEditForm(null);
  };

  const onDeleteTicket = async (ticketId) => {
    const confirmed = window.confirm("Delete this ticket?");
    if (!confirmed) return;

    try {
      await deleteTicket(ticketId);
      await loadTickets();
    } catch (err) {
      setError(err.message || "Unable to delete ticket");
    }
  };

  return (
    <div className="ticket-list-shell fade-in">
      <div className="ticket-list-header">
        <div>
          <h2>Ticket Queue</h2>
          <p>Review raised tickets and monitor status in real time.</p>
        </div>
        <button type="button" className="btn-secondary" onClick={loadTickets} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <form className="ticket-filters card" onSubmit={onApplyFilters}>
        <div className="filter-group">
          <label htmlFor="statusFilter">Status</label>
          <select
            id="statusFilter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s || "ALL"} value={s}>
                {s || "ALL"}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="priorityFilter">Priority</label>
          <select
            id="priorityFilter"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p || "ALL"} value={p}>
                {p || "ALL"}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            Apply Filters
          </button>
        </div>
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && tickets.length === 0 && (
        <div className="card empty-state">
          <h3>No tickets found</h3>
          <p>Try changing filters or create a new ticket from the student view.</p>
        </div>
      )}

      <div className="ticket-grid">
        {tickets.map((t) => (
          <article className="ticket-card" key={t.id}>
            {(() => {
              const canModify = t.status === "OPEN" && t.requesterId === currentUserId;
              return (
                <>
            <div className="ticket-card-top">
              <h3>#{t.id} {t.title}</h3>
              <span className={statusClass(t.status)}>{t.status}</span>
            </div>

            <p className="ticket-desc">{t.description}</p>

            <div className="ticket-meta">
              <div><strong>Location:</strong> {t.resourceLocation}</div>
              <div><strong>Category:</strong> {t.category}</div>
              <div><strong>Contact:</strong> {t.preferredContactDetails}</div>
              <div><strong>Requester:</strong> {t.requesterId}</div>
              <div><strong>Assignee:</strong> {t.assigneeId ?? "Unassigned"}</div>
              <div>
                <strong>Priority:</strong>{" "}
                <span className={priorityClass(t.priority)}>{t.priority}</span>
              </div>
            </div>

            <div className="ticket-footer">
              <small>Created: {new Date(t.createdAt).toLocaleString()}</small>
              <small>Updated: {new Date(t.updatedAt).toLocaleString()}</small>
            </div>

            <div className="ticket-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => onStartUpdate(t)}
                disabled={!canModify}
                title={canModify ? "Update ticket" : "Only your OPEN tickets can be updated"}
              >
                Update
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => onDeleteTicket(t.id)}
                disabled={!canModify}
                title={canModify ? "Delete ticket" : "Only your OPEN tickets can be deleted"}
              >
                Delete
              </button>
            </div>

            {editTicketId === t.id && editForm ? (
              <form className="ticket-edit-form" onSubmit={onSaveUpdate}>
                <div className="ticket-edit-grid">
                  <div className="form-group">
                    <label htmlFor={`title-${t.id}`}>Title</label>
                    <input
                      id={`title-${t.id}`}
                      name="title"
                      value={editForm.title}
                      onChange={onEditChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor={`category-${t.id}`}>Category</label>
                    <select
                      id={`category-${t.id}`}
                      name="category"
                      value={editForm.category}
                      onChange={onEditChange}
                      required
                    >
                      {CATEGORY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor={`description-${t.id}`}>Description</label>
                    <textarea
                      id={`description-${t.id}`}
                      name="description"
                      value={editForm.description}
                      onChange={onEditChange}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor={`location-${t.id}`}>Resource / Location</label>
                    <input
                      id={`location-${t.id}`}
                      name="resourceLocation"
                      value={editForm.resourceLocation}
                      onChange={onEditChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor={`contact-${t.id}`}>Contact Details</label>
                    <input
                      id={`contact-${t.id}`}
                      name="preferredContactDetails"
                      value={editForm.preferredContactDetails}
                      onChange={onEditChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor={`priority-${t.id}`}>Priority</label>
                    <select
                      id={`priority-${t.id}`}
                      name="priority"
                      value={editForm.priority}
                      onChange={onEditChange}
                      required
                    >
                      {PRIORITY_OPTIONS.filter(Boolean).map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="ticket-edit-actions">
                  <button type="submit" className="btn-primary" disabled={savingEdit}>
                    {savingEdit ? "Saving..." : "Save"}
                  </button>
                  <button type="button" className="btn-secondary" onClick={onCancelUpdate} disabled={savingEdit}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : null}
                </>
              );
            })()}
          </article>
        ))}
      </div>
    </div>
  );
}