import { useEffect, useState, useCallback } from "react";
import { deleteTicket, getTickets, updateTicket } from "../../api/ticketApi";
import CommentSection from "./CommentSection";
import AttachmentSection from "./AttachmentSection";
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
  const [openComments, setOpenComments] = useState({});
  const [openAttachments, setOpenAttachments] = useState({});
  const currentUserId = 101;

  const toggleComments = (ticketId) => {
    setOpenComments((prev) => ({ ...prev, [ticketId]: !prev[ticketId] }));
  };

  const toggleAttachments = (ticketId) => {
    setOpenAttachments((prev) => ({ ...prev, [ticketId]: !prev[ticketId] }));
  };

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
        <div className="header-left">
          <div className="header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
            </svg>
          </div>
          <div>
            <h2>Ticket Queue</h2>
            <p>Review raised tickets and monitor status in real time.</p>
          </div>
        </div>
        <button type="button" className="refresh-btn" onClick={loadTickets} disabled={loading}>
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

      <form className="ticket-filters" onSubmit={onApplyFilters}>
        <div className="filter-group">
          <label>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            Status
          </label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s || "ALL"} value={s}>
                {s || "ALL"}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Priority
          </label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p || "ALL"} value={p}>
                {p || "ALL"}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-actions">
          <button type="submit" className="apply-filters-btn" disabled={loading}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Apply Filters
          </button>
        </div>
      </form>

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

      {!loading && tickets.length === 0 && (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
          </svg>
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
                  <div className="ticket-card-header">
                    <div className="ticket-title">
                      <span className="ticket-id">#{t.id}</span>
                      <h3>{t.title}</h3>
                    </div>
                    <span className={statusClass(t.status)}>{t.status}</span>
                  </div>

                  <p className="ticket-description">{t.description}</p>

                  <div className="ticket-meta-grid">
                    <div className="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{t.resourceLocation}</span>
                    </div>
                    <div className="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                      <span>{t.category}</span>
                    </div>
                    <div className="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <span>{t.preferredContactDetails}</span>
                    </div>
                    <div className="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>Requester: {t.requesterId}</span>
                    </div>
                    <div className="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <span>Assignee: {t.assigneeId ?? "Unassigned"}</span>
                    </div>
                    <div className="meta-item">
                      <span className={priorityClass(t.priority)}>{t.priority}</span>
                    </div>
                  </div>

                  <div className="ticket-footer">
                    <div className="footer-date">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <small>Created: {new Date(t.createdAt).toLocaleString()}</small>
                    </div>
                    <div className="footer-date">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <small>Updated: {new Date(t.updatedAt).toLocaleString()}</small>
                    </div>
                  </div>

                  <div className="ticket-actions">
                    <button
                      type="button"
                      className="action-btn edit"
                      onClick={() => onStartUpdate(t)}
                      disabled={!canModify}
                      title={canModify ? "Update ticket" : "Only your OPEN tickets can be updated"}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 3l4 4-7 7H10v-4l7-7z" />
                        <path d="M4 20h16" />
                      </svg>
                      Update
                    </button>
                    <button
                      type="button"
                      className="action-btn delete"
                      onClick={() => onDeleteTicket(t.id)}
                      disabled={!canModify}
                      title={canModify ? "Delete ticket" : "Only your OPEN tickets can be deleted"}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13" />
                        <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
                      </svg>
                      Delete
                    </button>
                  </div>

                  {editTicketId === t.id && editForm ? (
                    <form className="ticket-edit-form" onSubmit={onSaveUpdate}>
                      <div className="edit-form-header">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 3l4 4-7 7H10v-4l7-7z" />
                          <path d="M4 20h16" />
                        </svg>
                        <h4>Edit Ticket</h4>
                      </div>
                      <div className="ticket-edit-grid">
                        <div className="form-group">
                          <label>Title</label>
                          <input name="title" value={editForm.title} onChange={onEditChange} required />
                        </div>

                        <div className="form-group">
                          <label>Category</label>
                          <select name="category" value={editForm.category} onChange={onEditChange} required>
                            {CATEGORY_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group full-width">
                          <label>Description</label>
                          <textarea name="description" value={editForm.description} onChange={onEditChange} rows={3} required />
                        </div>

                        <div className="form-group">
                          <label>Resource / Location</label>
                          <input name="resourceLocation" value={editForm.resourceLocation} onChange={onEditChange} required />
                        </div>

                        <div className="form-group">
                          <label>Contact Details</label>
                          <input name="preferredContactDetails" value={editForm.preferredContactDetails} onChange={onEditChange} required />
                        </div>

                        <div className="form-group">
                          <label>Priority</label>
                          <select name="priority" value={editForm.priority} onChange={onEditChange} required>
                            {PRIORITY_OPTIONS.filter(Boolean).map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="ticket-edit-actions">
                        <button type="submit" className="btn-save" disabled={savingEdit}>
                          {savingEdit ? "Saving..." : "Save Changes"}
                        </button>
                        <button type="button" className="btn-cancel" onClick={onCancelUpdate} disabled={savingEdit}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : null}

                  <div className="ticket-toggle-row">
                    <button type="button" className="toggle-btn" onClick={() => toggleAttachments(t.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                      {openAttachments[t.id] ? "Hide Attachments" : `Attachments (${t.attachmentCount || 0})`}
                    </button>
                    <button type="button" className="toggle-btn" onClick={() => toggleComments(t.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      {openComments[t.id] ? "Hide Comments" : "Comments"}
                    </button>
                  </div>

                  {openAttachments[t.id] && <AttachmentSection ticketId={t.id} />}
                  {openComments[t.id] && <CommentSection ticketId={t.id} currentUserId={currentUserId} />}
                </>
              );
            })()}
          </article>
        ))}
      </div>
    </div>
  );
}