import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getNotifications, markAsRead, markAllAsRead } from "../../api/notificationApi";
import { getCurrentUserId } from "../../utils/authSession";
import "./UserNotificationPage.css";

const TYPE_LABELS = {
    BOOKING_APPROVED: { label: "Booking Approved", color: "success", icon: "✅" },
    BOOKING_REJECTED: { label: "Booking Rejected", color: "danger", icon: "❌" },
    BOOKING_CREATED: { label: "Booking Created", color: "info", icon: "📅" },
    TICKET_STATUS_CHANGED: { label: "Ticket Updated", color: "warning", icon: "🎫" },
    NEW_COMMENT: { label: "New Comment", color: "info", icon: "💬" },
};

export default function UserNotificationPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [filter, setFilter] = useState("all"); // all, unread, read
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const [selectMode, setSelectMode] = useState(false);

    // Get current user ID from auth session
    const currentUserId = getCurrentUserId();
    const userName = localStorage.getItem("userName") || "User";

    const loadNotifications = useCallback(async () => {
        if (!currentUserId) {
            setError("User not authenticated. Please log in.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");
        try {
            const data = await getNotifications(currentUserId);
            const sortedData = Array.isArray(data)
                ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                : [];
            setNotifications(sortedData);
        } catch (err) {
            setError(err.message || "Failed to load notifications");
        } finally {
            setLoading(false);
        }
    }, [currentUserId]);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleMarkAsRead = async (id) => {
        if (!currentUserId) return;
        try {
            await markAsRead(id, currentUserId);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
            setSuccess("Marked as read");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (!currentUserId) return;
        try {
            await markAllAsRead(currentUserId);
            setNotifications(prev =>
                prev.map(n => ({ ...n, read: true }))
            );
            setSuccess("All notifications marked as read");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleBulkMarkAsRead = async () => {
        if (selectedNotifications.length === 0) return;
        if (!currentUserId) return;

        try {
            await Promise.all(
                selectedNotifications.map(id => markAsRead(id, currentUserId))
            );
            setNotifications(prev =>
                prev.map(n =>
                    selectedNotifications.includes(n.id) ? { ...n, read: true } : n
                )
            );
            setSuccess(`${selectedNotifications.length} notification(s) marked as read`);
            setSelectedNotifications([]);
            setSelectMode(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const toggleSelectNotification = (id) => {
        setSelectedNotifications(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const selectAllUnread = () => {
        const unreadIds = filteredNotifications
            .filter(n => !n.read)
            .map(n => n.id);
        setSelectedNotifications(unreadIds);
    };

    const clearSelection = () => {
        setSelectedNotifications([]);
        setSelectMode(false);
    };

    const getRelativeTime = (dateString) => {
        if (!dateString) return "Just now";
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
        return date.toLocaleDateString();
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === "unread") return !n.read;
        if (filter === "read") return n.read;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    // If user is not logged in
    if (!currentUserId) {
        return (
            <div className="user-notification-page">
                <div className="notification-page-container">
                    <div className="empty-state">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        <h3>Please Log In</h3>
                        <p>You need to be logged in to view your notifications.</p>
                        <Link to="/login" className="btn-primary" style={{ marginTop: "20px", display: "inline-block" }}>
                            Go to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="user-notification-page">
            <div className="notification-page-container">
                {/* Header with user greeting */}
                <div className="notification-page-header">
                    <div className="header-left">
                        <div className="header-icon-wrapper">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </div>
                        <div>
                            <h1>My Notifications</h1>
                            <p>Hello, {userName || "User"}! Stay updated with your latest alerts</p>
                        </div>
                    </div>
                    <div className="header-right">
                        {unreadCount > 0 && (
                            <button className="mark-all-btn" onClick={handleMarkAllAsRead}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Mark all as read
                            </button>
                        )}
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

                {/* Stats Bar */}
                <div className="notification-stats-bar">
                    <div className="stats-left">
                        <div className="stat-card">
                            <span className="stat-value">{notifications.length}</span>
                            <span className="stat-label">Total</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{unreadCount}</span>
                            <span className="stat-label">Unread</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{notifications.filter(n => n.read).length}</span>
                            <span className="stat-label">Read</span>
                        </div>
                    </div>
                    <div className="stats-right">
                        {selectMode && selectedNotifications.length > 0 && (
                            <button className="bulk-read-btn" onClick={handleBulkMarkAsRead}>
                                Mark Selected ({selectedNotifications.length}) as Read
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="notification-filters-bar">
                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${filter === "all" ? "active" : ""}`}
                            onClick={() => setFilter("all")}
                        >
                            All
                            <span className="filter-count">{notifications.length}</span>
                        </button>
                        <button
                            className={`filter-tab ${filter === "unread" ? "active" : ""}`}
                            onClick={() => setFilter("unread")}
                        >
                            Unread
                            {unreadCount > 0 && <span className="filter-count unread">{unreadCount}</span>}
                        </button>
                        <button
                            className={`filter-tab ${filter === "read" ? "active" : ""}`}
                            onClick={() => setFilter("read")}
                        >
                            Read
                            <span className="filter-count">{notifications.filter(n => n.read).length}</span>
                        </button>
                    </div>
                    <div className="filter-actions">
                        {!selectMode ? (
                            <button className="select-mode-btn" onClick={() => setSelectMode(true)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <polyline points="9 12 11 14 15 10" />
                                </svg>
                                Select
                            </button>
                        ) : (
                            <>
                                <button className="select-all-unread-btn" onClick={selectAllUnread}>
                                    Select all unread
                                </button>
                                <button className="cancel-select-btn" onClick={clearSelection}>
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Notifications List */}
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading notifications...</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="empty-state">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <h3>No notifications found</h3>
                        <p>
                            {filter === "unread"
                                ? "You've read all your notifications! 🎉"
                                : filter === "read"
                                    ? "You haven't read any notifications yet"
                                    : "You don't have any notifications yet"}
                        </p>
                    </div>
                ) : (
                    <div className="notifications-list">
                        {filteredNotifications.map((notification) => {
                            const meta = TYPE_LABELS[notification.type] || {
                                label: notification.type?.replace(/_/g, " ") || "Notification",
                                color: "info",
                                icon: "📢"
                            };

                            return (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${!notification.read ? "unread" : ""}`}
                                >
                                    {selectMode && (
                                        <div className="notification-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={selectedNotifications.includes(notification.id)}
                                                onChange={() => toggleSelectNotification(notification.id)}
                                            />
                                        </div>
                                    )}

                                    <div className="notification-icon-wrapper">
                                        <span className={`notification-icon ${meta.color}`}>
                                            {meta.icon}
                                        </span>
                                    </div>

                                    <div className="notification-content">
                                        <div className="notification-header">
                                            <div className="notification-info">
                                                <span className={`type-badge ${meta.color}`}>
                                                    {meta.label}
                                                </span>
                                                {!notification.read && (
                                                    <span className="unread-badge">New</span>
                                                )}
                                            </div>
                                            <span className="notification-time">
                                                {getRelativeTime(notification.createdAt)}
                                            </span>
                                        </div>

                                        <p className="notification-message">{notification.message}</p>

                                        {notification.referenceId && (
                                            <div className="notification-reference">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                    <line x1="8" y1="12" x2="16" y2="12" />
                                                </svg>
                                                <span>Reference ID: {notification.referenceId}</span>
                                            </div>
                                        )}

                                        <div className="notification-actions">
                                            {!notification.read && (
                                                <button
                                                    className="action-btn mark-read"
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}