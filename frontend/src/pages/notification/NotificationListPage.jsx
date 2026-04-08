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
import "./NotificationList.css";

const CURRENT_USER_ID = 101;

const TYPE_OPTIONS = [
    "BOOKING_APPROVED",
    "BOOKING_REJECTED",
    "TICKET_STATUS_CHANGED",
    "NEW_COMMENT",
];

const TYPE_LABELS = {
    BOOKING_APPROVED: { label: "Booking Approved", color: "badge-success" },
    BOOKING_REJECTED: { label: "Booking Rejected", color: "badge-danger" },
    TICKET_STATUS_CHANGED: { label: "Ticket Updated", color: "badge-info" },
    NEW_COMMENT: { label: "New Comment", color: "badge-warning" },
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
        <div className="notification-container">
            <div className="notification-card">
                {/* Header */}
                <div className="notification-header">
                    <div className="header-left">
                        <div className="header-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </div>
                        <div>
                            <h2>
                                Notification Queue
                                {unreadCount > 0 && (
                                    <span className="unread-badge">
                                        {unreadCount} unread
                                    </span>
                                )}
                            </h2>
                            <p>Review notifications and monitor status in real time.</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="refresh-btn" onClick={loadAll} disabled={loading}>
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
                        {unreadCount > 0 && (
                            <button className="mark-all-btn" onClick={onMarkAllRead}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Mark All Read
                            </button>
                        )}
                    </div>
                </div>

                {/* Tab buttons - matching TicketList style */}
                <div className="notification-filters">
                    <div className="filter-group">
                        <button
                            type="button"
                            className={`filter-tab ${activeTab === "view" ? "active" : ""}`}
                            onClick={() => setActiveTab("view")}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                            View Notifications
                        </button>
                        <button
                            type="button"
                            className={`filter-tab ${activeTab === "create" ? "active" : ""}`}
                            onClick={() => setActiveTab("create")}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="16" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                            Create Notification
                        </button>
                    </div>
                </div>

                {/* Alerts */}
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
                {success && (
                    <div className="alert alert-success">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        {success}
                    </div>
                )}

                {/* ── CREATE TAB ── */}
                {activeTab === "create" && (
                    <form className="create-form" onSubmit={onCreateSubmit}>
                        <div className="form-header">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="16" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                            <h3>Create Notification</h3>
                        </div>
                        
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Recipient User ID</label>
                                <input
                                    name="recipientId" type="number"
                                    value={form.recipientId} onChange={onFormChange} required
                                />
                            </div>

                            <div className="form-group">
                                <label>Notification Type</label>
                                <select name="type" value={form.type} onChange={onFormChange} required>
                                    {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label>Message</label>
                                <textarea
                                    name="message" value={form.message}
                                    onChange={onFormChange} rows={3}
                                    placeholder="e.g. Your booking for Lab A has been approved."
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Reference ID (optional)</label>
                                <input
                                    name="referenceId" type="number"
                                    value={form.referenceId} onChange={onFormChange}
                                    placeholder="Booking or Ticket ID"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-submit" disabled={creating}>
                                {creating ? (
                                    <>
                                        <span className="spinner-small"></span>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <line x1="22" y1="2" x2="11" y2="13" />
                                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                        </svg>
                                        Send Notification
                                    </>
                                )}
                            </button>
                            <button type="button" className="btn-cancel" onClick={() => { setActiveTab("view"); setForm(EMPTY_FORM); }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* ── VIEW TAB ── */}
                {activeTab === "view" && (
                    <>
                        {!loading && notifications.length === 0 && (
                            <div className="empty-state">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                </svg>
                                <h3>No notifications yet</h3>
                                <p>Create a notification using the button above.</p>
                            </div>
                        )}

                        <div className="notification-grid">
                            {notifications.map((n) => {
                                const meta = TYPE_LABELS[n.type] || { label: n.type, color: "badge-closed" };
                                return (
                                    <article className={`notification-card-item ${!n.read ? "unread" : ""}`} key={n.id}>
                                        <div className="notification-card-header">
                                            <div className="notification-title">
                                                <span className="notification-id">#{n.id}</span>
                                                <span className={`badge ${meta.color}`}>{meta.label}</span>
                                            </div>
                                            {!n.read && (
                                                <span className="new-badge">NEW</span>
                                            )}
                                        </div>

                                        <p className="notification-message">{n.message}</p>

                                        <div className="notification-meta">
                                            <div className="meta-item">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                                <span>Recipient: {n.recipientId}</span>
                                            </div>
                                            {n.referenceId && (
                                                <div className="meta-item">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                        <line x1="8" y1="12" x2="16" y2="12" />
                                                    </svg>
                                                    <span>Reference: {n.referenceId}</span>
                                                </div>
                                            )}
                                            <div className="meta-item">
                                                <span className={`badge-small ${n.read ? "badge-read" : "badge-unread"}`}>
                                                    {n.read ? "READ" : "UNREAD"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="notification-footer">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                <line x1="16" y1="2" x2="16" y2="6" />
                                                <line x1="8" y1="2" x2="8" y2="6" />
                                                <line x1="3" y1="10" x2="21" y2="10" />
                                            </svg>
                                            <small>{new Date(n.createdAt).toLocaleString()}</small>
                                        </div>

                                        <div className="notification-actions">
                                            {!n.read && (
                                                <button className="action-btn read" onClick={() => onMarkRead(n.id)}>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                    Mark Read
                                                </button>
                                            )}
                                            <button className="action-btn edit" onClick={() => onStartUpdate(n)}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M17 3l4 4-7 7H10v-4l7-7z" />
                                                    <path d="M4 20h16" />
                                                </svg>
                                                Edit
                                            </button>
                                            <button className="action-btn delete" onClick={() => onDelete(n.id)}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13" />
                                                    <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>

                                        {/* Inline edit form */}
                                        {editId === n.id && editForm && (
                                            <form className="edit-form" onSubmit={onSaveUpdate}>
                                                <div className="edit-form-header">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M17 3l4 4-7 7H10v-4l7-7z" />
                                                    </svg>
                                                    <h4>Edit Notification</h4>
                                                </div>
                                                <div className="edit-form-group">
                                                    <label>Type</label>
                                                    <select name="type" value={editForm.type} onChange={onEditChange} required>
                                                        {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
                                                    </select>
                                                </div>
                                                <div className="edit-form-group">
                                                    <label>Message</label>
                                                    <textarea name="message" value={editForm.message} onChange={onEditChange} rows={2} required />
                                                </div>
                                                <div className="edit-form-group">
                                                    <label>Reference ID (optional)</label>
                                                    <input name="referenceId" type="number" value={editForm.referenceId} onChange={onEditChange} />
                                                </div>
                                                <div className="edit-form-actions">
                                                    <button type="submit" className="btn-save" disabled={saving}>
                                                        {saving ? "Saving..." : "Save"}
                                                    </button>
                                                    <button type="button" className="btn-cancel" onClick={onCancelUpdate}>
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
        </div>
    );
}