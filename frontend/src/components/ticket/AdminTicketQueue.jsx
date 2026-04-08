import { useEffect, useState, useCallback } from "react";
import {
  getTickets,
  assignTicket,
  updateTicketStatus,
} from "../../api/ticketApi";
import CommentSection from "./CommentSection";
import AttachmentSection from "./AttachmentSection";
import "./AdminTicketQueue.css";

const STATUS_OPTIONS = ["", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"];
const PRIORITY_OPTIONS = ["", "LOW", "MEDIUM", "HIGH", "CRITICAL"];

// Workflow: which statuses can transition to which
const STATUS_TRANSITIONS = {
  OPEN: ["IN_PROGRESS", "REJECTED"],
  IN_PROGRESS: ["RESOLVED", "CLOSED"],
  RESOLVED: ["CLOSED"],
  CLOSED: [],
  REJECTED: [],
};

const STATUS_LABELS = {
  OPEN: { label: "Open", color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
  IN_PROGRESS: { label: "In Progress", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  RESOLVED: { label: "Resolved", color: "#10b981", bg: "rgba(16,185,129,0.08)" },
  CLOSED: { label: "Closed", color: "#6b7280", bg: "rgba(107,114,128,0.08)" },
  REJECTED: { label: "Rejected", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
};

const PRIORITY_LABELS = {
  LOW: { color: "var(--priority-low)" },
  MEDIUM: { color: "var(--priority-medium)" },
  HIGH: { color: "var(--priority-high)" },
  CRITICAL: { color: "var(--priority-critical)" },
};

const ADMIN_USER_ID = 1;
const ADMIN_ROLE = "ADMIN";

export default function AdminTicketQueue() {
  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Per-ticket action states
  const [assignInputs, setAssignInputs] = useState({});
  const [statusActions, setStatusActions] = useState({});
  const [actionLoading, setActionLoading] = useState({});
  const [expandedPanels, setExpandedPanels] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [openAttachments, setOpenAttachments] = useState({});

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTickets({
        status: statusFilter,
        priority: priorityFilter,
      });
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load tickets");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const togglePanel = (id) => {
    setExpandedPanels((p) => ({ ...p, [id]: !p[id] }));
  };

  // ---- ASSIGN ----
  const handleAssign = async (ticketId) => {
    const assigneeId = assignInputs[ticketId];
    if (!assigneeId) return;
    setActionLoading((p) => ({ ...p, [ticketId]: true }));
    setError("");
    try {
      await assignTicket(ticketId, Number(assigneeId), ADMIN_USER_ID, ADMIN_ROLE);
      setAssignInputs((p) => ({ ...p, [ticketId]: "" }));
      await loadTickets();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading((p) => ({ ...p, [ticketId]: false }));
    }
  };

  // ---- STATUS UPDATE ----
  const handleStatusUpdate = async (ticketId) => {
    const action = statusActions[ticketId];
    if (!action?.status) return;

    const payload = { status: action.status };
    if (action.status === "RESOLVED") payload.resolutionNotes = action.notes || "";
    if (action.status === "REJECTED") payload.rejectionReason = action.reason || "";

    setActionLoading((p) => ({ ...p, [ticketId]: true }));
    setError("");
    try {
      await updateTicketStatus(ticketId, payload, ADMIN_USER_ID, ADMIN_ROLE);
      setStatusActions((p) => ({ ...p, [ticketId]: null }));
      await loadTickets();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading((p) => ({ ...p, [ticketId]: false }));
    }
  };

  const setStatusAction = (ticketId, field, value) => {
    setStatusActions((p) => ({
      ...p,
      [ticketId]: { ...(p[ticketId] || {}), [field]: value },
    }));
  };

  const statusInfo = (status) => STATUS_LABELS[status] || { label: status, color: "#999", bg: "#f5f5f5" };
  const priorityInfo = (priority) => PRIORITY_LABELS[priority] || { color: "#999" };

  return (
    <div className="admin-queue fade-in">
      {/* Header */}
      <div className="admin-queue-header">
        <div>
          <h2>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            Admin Ticket Queue
          </h2>
          <p>Manage, assign & update ticket workflow status</p>
        </div>
        <button type="button" className="btn-secondary" onClick={loadTickets} disabled={loading}>
          {loading ? "Refreshing..." : "⟳ Refresh"}
        </button>
      </div>

      {/* Filters */}
      <div className="admin-filters card">
        <div className="filter-group">
          <label>Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s || "ALL"} value={s}>{s || "ALL"}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Priority</label>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p || "ALL"} value={p}>{p || "ALL"}</option>
            ))}
          </select>
        </div>
        <button type="button" className="btn-primary" onClick={loadTickets} disabled={loading}>
          Apply
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && tickets.length === 0 && (
        <div className="card empty-state"><h3>No tickets found</h3></div>
      )}

      {/* Ticket list */}
      <div className="admin-ticket-list">
        {tickets.map((t) => {
          const si = statusInfo(t.status);
          const pi = priorityInfo(t.priority);
          const transitions = STATUS_TRANSITIONS[t.status] || [];
          const isExpanded = expandedPanels[t.id];
          const isLoading = actionLoading[t.id];
          const currentAction = statusActions[t.id];

          return (
            <article className={`admin-ticket ${isExpanded ? "admin-ticket-expanded" : ""}`} key={t.id}>
              {/* Top row */}
              <div className="admin-ticket-top" onClick={() => togglePanel(t.id)}>
                <div className="admin-ticket-title-row">
                  <span className="admin-ticket-id">#{t.id}</span>
                  <h3>{t.title}</h3>
                </div>
                <div className="admin-ticket-badges">
                  <span className="admin-status-badge" style={{ color: si.color, background: si.bg }}>
                    {si.label}
                  </span>
                  <span className="admin-priority-dot" style={{ background: pi.color }} title={t.priority} />
                  <svg className={`admin-chevron ${isExpanded ? "admin-chevron-open" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              {/* Summary row (always visible) */}
              <div className="admin-ticket-summary">
                <span>📍 {t.resourceLocation}</span>
                <span>📂 {t.category}</span>
                <span>👤 Requester: {t.requesterId}</span>
                <span>🔧 Assignee: {t.assigneeId ?? <em>Unassigned</em>}</span>
              </div>

              {/* Expanded panel */}
              {isExpanded && (
                <div className="admin-panel">
                  {/* Ticket details */}
                  <div className="admin-detail-section">
                    <p className="admin-desc">{t.description}</p>
                    <div className="admin-detail-grid">
                      <div><strong>Contact:</strong> {t.preferredContactDetails}</div>
                      <div><strong>Created:</strong> {new Date(t.createdAt).toLocaleString()}</div>
                      <div><strong>Updated:</strong> {new Date(t.updatedAt).toLocaleString()}</div>
                    </div>
                    {t.resolutionNotes && (
                      <div className="admin-notes-box admin-notes-resolved">
                        <strong>📝 Resolution Notes:</strong> {t.resolutionNotes}
                      </div>
                    )}
                    {t.rejectionReason && (
                      <div className="admin-notes-box admin-notes-rejected">
                        <strong>❌ Rejection Reason:</strong> {t.rejectionReason}
                      </div>
                    )}
                  </div>

                  {/* ====== ASSIGN SECTION ====== */}
                  <div className="admin-action-section">
                    <h4>🔧 Assign Technician</h4>
                    <div className="admin-action-row">
                      <input
                        type="number"
                        placeholder="Staff User ID"
                        value={assignInputs[t.id] || ""}
                        onChange={(e) =>
                          setAssignInputs((p) => ({ ...p, [t.id]: e.target.value }))
                        }
                        className="admin-input"
                      />
                      <button
                        type="button"
                        className="admin-action-btn admin-btn-assign"
                        onClick={() => handleAssign(t.id)}
                        disabled={!assignInputs[t.id] || isLoading}
                      >
                        {isLoading ? "Assigning..." : "Assign"}
                      </button>
                    </div>
                  </div>

                  {/* ====== STATUS SECTION ====== */}
                  {transitions.length > 0 && (
                    <div className="admin-action-section">
                      <h4>📋 Update Status</h4>
                      <div className="admin-status-btns">
                        {transitions.map((nextStatus) => {
                          const nsi = statusInfo(nextStatus);
                          const isSelected = currentAction?.status === nextStatus;
                          return (
                            <button
                              key={nextStatus}
                              type="button"
                              className={`admin-status-option ${isSelected ? "admin-status-selected" : ""}`}
                              style={{
                                "--btn-color": nsi.color,
                                "--btn-bg": nsi.bg,
                              }}
                              onClick={() => setStatusAction(t.id, "status", isSelected ? null : nextStatus)}
                            >
                              {nsi.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Notes for RESOLVED */}
                      {currentAction?.status === "RESOLVED" && (
                        <textarea
                          className="admin-notes-input"
                          placeholder="Resolution notes (required)..."
                          value={currentAction.notes || ""}
                          onChange={(e) => setStatusAction(t.id, "notes", e.target.value)}
                          rows={3}
                        />
                      )}

                      {/* Reason for REJECTED */}
                      {currentAction?.status === "REJECTED" && (
                        <textarea
                          className="admin-notes-input"
                          placeholder="Rejection reason (required)..."
                          value={currentAction.reason || ""}
                          onChange={(e) => setStatusAction(t.id, "reason", e.target.value)}
                          rows={3}
                        />
                      )}

                      {currentAction?.status && (
                        <div className="admin-action-row" style={{ marginTop: 8 }}>
                          <button
                            type="button"
                            className="admin-action-btn admin-btn-confirm"
                            onClick={() => handleStatusUpdate(t.id)}
                            disabled={
                              isLoading ||
                              (currentAction.status === "RESOLVED" && !currentAction.notes?.trim()) ||
                              (currentAction.status === "REJECTED" && !currentAction.reason?.trim())
                            }
                          >
                            {isLoading ? "Updating..." : `Confirm → ${statusInfo(currentAction.status).label}`}
                          </button>
                          <button
                            type="button"
                            className="admin-action-btn admin-btn-cancel"
                            onClick={() => setStatusAction(t.id, "status", null)}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ====== ATTACHMENTS & COMMENTS ====== */}
                  <div className="ticket-toggle-row">
                    <button
                      type="button"
                      className="comment-toggle-btn"
                      onClick={() => setOpenAttachments((p) => ({ ...p, [t.id]: !p[t.id] }))}
                    >
                      📎 {openAttachments[t.id] ? "Hide Attachments" : `Attachments (${t.attachmentCount || 0})`}
                    </button>
                    <button
                      type="button"
                      className="comment-toggle-btn"
                      onClick={() => setOpenComments((p) => ({ ...p, [t.id]: !p[t.id] }))}
                    >
                      💬 {openComments[t.id] ? "Hide Comments" : "Comments"}
                    </button>
                  </div>

                  {openAttachments[t.id] && <AttachmentSection ticketId={t.id} />}
                  {openComments[t.id] && <CommentSection ticketId={t.id} currentUserId={ADMIN_USER_ID} />}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
