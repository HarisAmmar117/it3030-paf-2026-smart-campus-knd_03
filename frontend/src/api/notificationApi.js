const BASE_URL = "http://localhost:8081";

// CREATE
export async function createNotification(payload) {
    const response = await fetch(`${BASE_URL}/api/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error((data && data.message) || "Failed to create notification");
    return data;
}

// READ — all notifications (no recipientId = admin sees all)
export async function getAllNotifications() {
    const response = await fetch(`${BASE_URL}/api/notifications`);
    const data = await response.json().catch(() => []);
    if (!response.ok) throw new Error((data && data.message) || "Failed to fetch notifications");
    return data;
}

// READ — one user's notifications
export async function getNotifications(recipientId) {
    const response = await fetch(`${BASE_URL}/api/notifications?recipientId=${recipientId}`);
    const data = await response.json().catch(() => []);
    if (!response.ok) throw new Error((data && data.message) || "Failed to fetch notifications");
    return data;
}

// READ — unread count
export async function getUnreadCount(recipientId) {
    const response = await fetch(`${BASE_URL}/api/notifications/unread-count?recipientId=${recipientId}`);
    const data = await response.json().catch(() => ({ unreadCount: 0 }));
    if (!response.ok) throw new Error("Failed to fetch unread count");
    return data.unreadCount;
}

// UPDATE — edit message/type
export async function updateNotification(notificationId, payload) {
    const response = await fetch(`${BASE_URL}/api/notifications/${notificationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error((data && data.message) || "Failed to update notification");
    return data;
}

// UPDATE — mark one as read
export async function markAsRead(notificationId, userId) {
    const response = await fetch(`${BASE_URL}/api/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: { "X-User-Id": String(userId) },
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error((data && data.message) || "Failed to mark as read");
    return data;
}

// UPDATE — mark all as read
export async function markAllAsRead(userId) {
    const response = await fetch(`${BASE_URL}/api/notifications/read-all`, {
        method: "PATCH",
        headers: { "X-User-Id": String(userId) },
    });
    if (!response.ok) throw new Error("Failed to mark all as read");
}

// DELETE
export async function deleteNotification(notificationId, userId) {
    const response = await fetch(`${BASE_URL}/api/notifications/${notificationId}`, {
        method: "DELETE",
        headers: { "X-User-Id": String(userId) },
    });
    if (!response.ok) throw new Error("Failed to delete notification");
}