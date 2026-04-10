import { BASE_URL, getAuthHeaders } from "./apiClient";

// ========================
// SAFE REQUEST WRAPPER
// ========================
async function request(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {}),
      },
    });

    return response;
  } catch (error) {
    throw new Error("Network error: Backend not reachable or CORS blocked");
  }
}

// ========================
// CREATE NOTIFICATION
// ========================
export async function createNotification(payload) {
  const response = await request(`${BASE_URL}/api/notifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload || {}),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to create notification");
  }

  return data;
}

// ========================
// READ ALL (ADMIN)
// ========================
export async function getAllNotifications() {
  const response = await request(`${BASE_URL}/api/notifications`);

  const data = await response.json().catch(() => []);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch notifications");
  }

  return data;
}

// ========================
// READ USER NOTIFICATIONS
// ========================
export async function getNotifications(recipientId) {
  const response = await request(
    `${BASE_URL}/api/notifications?recipientId=${recipientId}`
  );

  const data = await response.json().catch(() => []);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch notifications");
  }

  return data;
}

// ========================
// UNREAD COUNT
// ========================
export async function getUnreadCount(recipientId) {
  const response = await request(
    `${BASE_URL}/api/notifications/unread-count?recipientId=${recipientId}`
  );

  const data = await response.json().catch(() => ({ unreadCount: 0 }));

  if (!response.ok) {
    throw new Error("Failed to fetch unread count");
  }

  return data.unreadCount;
}

// ========================
// UPDATE NOTIFICATION (PUT)
// ========================
export async function updateNotification(notificationId, payload) {
  const response = await request(
    `${BASE_URL}/api/notifications/${notificationId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload || {}),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to update notification");
  }

  return data;
}

// ========================
// MARK AS READ
// ========================
export async function markAsRead(notificationId, userId) {
  const response = await request(
    `${BASE_URL}/api/notifications/${notificationId}/read`,
    {
      method: "PATCH",
      headers: {
        "X-User-Id": String(userId),
      },
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to mark as read");
  }

  return data;
}

// ========================
// MARK ALL AS READ
// ========================
export async function markAllAsRead(userId) {
  const response = await request(
    `${BASE_URL}/api/notifications/read-all`,
    {
      method: "PATCH",
      headers: {
        "X-User-Id": String(userId),
      },
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Failed to mark all as read");
  }

  return true;
}

// ========================
// DELETE (ADMIN)
// ========================
export async function deleteNotification(notificationId) {
  const response = await request(
    `${BASE_URL}/api/notifications/${notificationId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Failed to delete notification");
  }

  return true;
}

// ========================
// DELETE (USER)
// ========================
export async function deleteNotificationByUser(notificationId, userId) {
  const response = await request(
    `${BASE_URL}/api/notifications/my/${notificationId}`,
    {
      method: "DELETE",
      headers: {
        "X-User-Id": String(userId),
      },
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Failed to delete notification");
  }

  return true;
}