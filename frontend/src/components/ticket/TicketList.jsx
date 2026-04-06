import { useEffect, useState, useCallback } from "react";
import { getTickets } from "../../api/ticketApi";
import "./TicketList.css";

const STATUS_OPTIONS = ["", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"];
const PRIORITY_OPTIONS = ["", "LOW", "MEDIUM", "HIGH", "CRITICAL"];

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
          </article>
        ))}
      </div>
    </div>
  );
}