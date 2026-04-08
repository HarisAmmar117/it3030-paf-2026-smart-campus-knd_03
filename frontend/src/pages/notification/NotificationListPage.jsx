import { useEffect, useState, useCallback } from "react";
import {
    getAllNotifications,
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    updateNotification,
} from "../../api/notificationApi";

const CURRENT_USER_ID = 101;

const TYPE_OPTIONS = [
    "BOOKING_APPROVED",
    "BOOKING_REJECTED",
    "TICKET_STATUS_CHANGED",
    "NEW_COMMENT",
];

const TYPE_LABELS = {
    BOOKING_APPROVED: { label: "Booking Approved", color: "badge-resolved" },
    BOOKING_REJECTED: { label: "Booking Rejected", color: "badge-rejected" },
    TICKET_STATUS_CHANGED: { label: "Ticket Updated", color: "badge-open" },
    NEW_COMMENT: { label: "New Comment", color: "badge-in-progress" },
};

const EMPTY_FORM = {
    recipientId: CURRENT_USER_ID,
    type: "TICKET_STATUS_CHANGED",
    message: "",
    referenceId: "",
};

export default function NotificationListPage() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [activeTab, setActiveTab] = useState("view");

    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);

    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState(null);
    const [saving, setSaving] = useState(false);

    const loadAll = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [data, count] = await Promise.all([
                getAllNotifications(),
                getUnreadCount(CURRENT_USER_ID),
            ]);
            setNotifications(Array.isArray(data) ? data : []);
            setUnreadCount(count);
        } catch (err) {
            setError(err.message || "Unable to load notifications");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadAll(); }, [loadAll]);

    useEffect(() => {
        if (!success) return;
        const t = setTimeout(() => setSuccess(""), 3000);
        return () => clearTimeout(t);
    }, [success]);

    const onFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const onCreateSubmit = async (e) => {
        e.preventDefault();
        setCreating(true);
        setError("");
        try {
            await createNotification({
                ...form,
                recipientId: Number(form.recipientId),
                referenceId: form.referenceId ? Number(form.referenceId) : null,
            });
            setSuccess("Notification created successfully!");
            setForm(EMPTY_FORM);
            setActiveTab("view");
            await loadAll();
        } catch (err) {
            setError(err.message || "Failed to create notification");
        } finally {
            setCreating(false);
        }
    };

    const onMarkRead = async (id) => {
        try {
            await markAsRead(id, CURRENT_USER_ID);
            setSuccess("Marked as read");
            await loadAll();
        } catch (err) { setError(err.message); }
    };

    const onMarkAllRead = async () => {
        try {
            await markAllAsRead(CURRENT_USER_ID);
            setSuccess("All notifications marked as read");
            await loadAll();
        } catch (err) { setError(err.message); }
    };

    const onDelete = async (id) => {
        if (!window.confirm("Delete this notification?")) return;
        try {
            await deleteNotification(id, CURRENT_USER_ID);
            setSuccess("Notification deleted");
            await loadAll();
        } catch (err) { setError(err.message); }
    };

    const onStartUpdate = (n) => {
        setEditId(n.id);
        setEditForm({ type: n.type, message: n.message, referenceId: n.referenceId ?? "" });
    };

    const onEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const onSaveUpdate = async (e) => {
        e.preventDefault();
        if (!editId || !editForm) return;
        setSaving(true);
        setError("");
        try {
            await updateNotification(
                editId,
                {
                    type: editForm.type,
                    message: editForm.message,
                    referenceId: editForm.referenceId ? Number(editForm.referenceId) : null,
                },
                CURRENT_USER_ID
            );
            setSuccess("Notification updated");
            setEditId(null);
            setEditForm(null);
            await loadAll();
        } catch (err) {
            setError(err.message || "Failed to update notification");
        } finally {
            setSaving(false);
        }
    };

    const onCancelUpdate = () => { setEditId(null); setEditForm(null); };

    return (
        <div className="ticket-list-shell fade-in">

            {/* Header */}
            <div className="ticket-list-header">
                <div>
                    <h2>
                        Notification Queue
                        {unreadCount > 0 && (
                            <span className="badge badge-open" style={{ marginLeft: 10, fontSize: "0.75rem" }}>
                                {unreadCount} unread
                            </span>
                        )}
                    </h2>
                    <p>Review notifications and monitor status in real time.</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn-secondary" onClick={loadAll} disabled={loading}>
                        {loading ? "Refreshing..." : "Refresh"}
                    </button>
                    {unreadCount > 0 && (
                        <button className="btn-secondary" onClick={onMarkAllRead}>
                            ✓ Mark All Read
                        </button>
                    )}
                </div>
            </div>

            {/* Tab buttons — matches ticket page View/Create tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                <button
                    type="button"
                    className={activeTab === "view" ? "btn-primary" : "btn-secondary"}
                    onClick={() => setActiveTab("view")}
                >
                    View Notifications
                </button>
                <button
                    type="button"
                    className={activeTab === "create" ? "btn-primary" : "btn-secondary"}
                    onClick={() => setActiveTab("create")}
                >
                    Create Notification
                </button>
            </div>

            {/* Alerts */}
            {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
            {success && <div className="alert alert-success" style={{ marginBottom: 16 }}>{success}</div>}

            {/* ── CREATE TAB ── */}
            {activeTab === "create" && (
                <form className="card" onSubmit={onCreateSubmit}>
                    <h3 style={{ marginBottom: 20 }}>Create Notification</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

                        <div className="form-group" style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="recipientId">Recipient User ID</label>
                            <input
                                id="recipientId" name="recipientId" type="number"
                                value={form.recipientId} onChange={onFormChange} required
                            />
                        </div>

                        <div className="form-group" style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="type">Notification Type</label>
                            <select id="type" name="type" value={form.type} onChange={onFormChange} required>
                                {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <div className="form-group" style={{ display: "flex", flexDirection: "column", gridColumn: "1 / -1" }}>
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message" name="message" value={form.message}
                                onChange={onFormChange} rows={3}
                                placeholder="e.g. Your booking for Lab A has been approved."
                                required
                            />
                        </div>

                        <div className="form-group" style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="referenceId">Reference ID (optional)</label>
                            <input
                                id="referenceId" name="referenceId" type="number"
                                value={form.referenceId} onChange={onFormChange}
                                placeholder="Booking or Ticket ID"
                            />
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                        <button type="submit" className="btn-primary" disabled={creating}>
                            {creating ? "Sending..." : "Send Notification"}
                        </button>
                        <button
                            type="button" className="btn-secondary"
                            onClick={() => { setActiveTab("view"); setForm(EMPTY_FORM); }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* ── VIEW TAB ── */}
            {activeTab === "view" && (
                <>
                    {!loading && notifications.length === 0 && (
                        <div className="card empty-state">
                            <h3>No notifications yet</h3>
                            <p>Create a notification using the button above.</p>
                        </div>
                    )}

                    <div className="ticket-grid">
                        {notifications.map((n) => {
                            const meta = TYPE_LABELS[n.type] || { label: n.type, color: "badge-closed" };
                            return (
                                <article
                                    className="ticket-card"
                                    key={n.id}
                                    style={{
                                        borderLeft: n.read
                                            ? "4px solid var(--border-light)"
                                            : "4px solid var(--primary-500)",
                                        opacity: n.read ? 0.82 : 1,
                                    }}
                                >
                                    <div className="ticket-card-top">
                                        <h3>#{n.id} <span className={`badge ${meta.color}`}>{meta.label}</span></h3>
                                        {!n.read && (
                                            <span className="badge badge-open" style={{ fontSize: "0.7rem" }}>NEW</span>
                                        )}
                                    </div>

                                    <p className="ticket-desc">{n.message}</p>

                                    <div className="ticket-meta">
                                        <div><strong>Recipient:</strong> {n.recipientId}</div>
                                        {n.referenceId && <div><strong>Reference ID:</strong> {n.referenceId}</div>}
                                        <div>
                                            <strong>Status:</strong>{" "}
                                            <span className={`badge ${n.read ? "badge-resolved" : "badge-open"}`}>
                                                {n.read ? "READ" : "UNREAD"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="ticket-footer">
                                        <small>Created: {new Date(n.createdAt).toLocaleString()}</small>
                                    </div>

                                    <div className="ticket-actions">
                                        {!n.read && (
                                            <button type="button" className="btn-secondary" onClick={() => onMarkRead(n.id)}>
                                                ✓ Mark Read
                                            </button>
                                        )}
                                        <button type="button" className="btn-secondary" onClick={() => onStartUpdate(n)}>
                                            Update
                                        </button>
                                        <button type="button" className="btn-danger" onClick={() => onDelete(n.id)}>
                                            Delete
                                        </button>
                                    </div>

                                    {/* Inline edit form */}
                                    {editId === n.id && editForm && (
                                        <form className="ticket-edit-form" onSubmit={onSaveUpdate}>
                                            <div className="ticket-edit-grid">
                                                <div className="form-group full-width">
                                                    <label htmlFor={`edit-type-${n.id}`}>Notification Type</label>
                                                    <select
                                                        id={`edit-type-${n.id}`} name="type"
                                                        value={editForm.type} onChange={onEditChange} required
                                                    >
                                                        {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                                                    </select>
                                                </div>
                                                <div className="form-group full-width">
                                                    <label htmlFor={`edit-msg-${n.id}`}>Message</label>
                                                    <textarea
                                                        id={`edit-msg-${n.id}`} name="message"
                                                        value={editForm.message} onChange={onEditChange}
                                                        rows={3} required
                                                    />
                                                </div>
                                                <div className="form-group full-width">
                                                    <label htmlFor={`edit-ref-${n.id}`}>Reference ID (optional)</label>
                                                    <input
                                                        id={`edit-ref-${n.id}`} name="referenceId" type="number"
                                                        value={editForm.referenceId} onChange={onEditChange}
                                                        placeholder="Booking or Ticket ID"
                                                    />
                                                </div>
                                            </div>
                                            <div className="ticket-edit-actions">
                                                <button type="submit" className="btn-primary" disabled={saving}>
                                                    {saving ? "Saving..." : "Save"}
                                                </button>
                                                <button type="button" className="btn-secondary" onClick={onCancelUpdate} disabled={saving}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
