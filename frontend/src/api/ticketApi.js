import { BASE_URL, getAuthHeaders } from "./apiClient";
import { getCurrentUserId } from "../utils/authSession";

function resolveUserId(explicitUserId) {
  return explicitUserId ?? getCurrentUserId();
}

// ========================
// SAFE FETCH (CORS + NETWORK FIX)
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
  } catch (err) {
    throw new Error(
      "Network error: Backend not reachable or CORS blocked (check Spring Security CORS + OPTIONS method)"
    );
  }
}

// ========================
// TICKETS
// ========================

export async function createTicket(payload, userId) {
  const resolvedUserId = resolveUserId(userId);

  const response = await request(`${BASE_URL}/api/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": String(resolvedUserId),
    },
    body: JSON.stringify(payload || {}),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to create ticket");
  }

  return data;
}

export async function getTickets(filters = {}) {
  const params = new URLSearchParams();

  if (filters.status) params.append("status", filters.status);
  if (filters.priority) params.append("priority", filters.priority);
  if (filters.requesterId != null)
    params.append("requesterId", String(filters.requesterId));

  const response = await request(
    `${BASE_URL}/api/tickets${params.toString() ? `?${params}` : ""}`,
    { method: "GET" }
  );

  const data = await response.json().catch(() => []);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch tickets");
  }

  return data;
}

export async function updateTicket(ticketId, payload, userId) {
  const resolvedUserId = resolveUserId(userId);

  const response = await request(`${BASE_URL}/api/tickets/${ticketId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": String(resolvedUserId),
    },
    body: JSON.stringify(payload || {}),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to update ticket");
  }

  return data;
}

export async function deleteTicket(ticketId, userId) {
  const resolvedUserId = resolveUserId(userId);

  const response = await request(`${BASE_URL}/api/tickets/${ticketId}`, {
    method: "DELETE",
    headers: {
      "X-User-Id": String(resolvedUserId),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to delete ticket");
  }

  return true;
}

// ========================
// COMMENTS
// ========================

export async function getComments(ticketId) {
  const response = await request(
    `${BASE_URL}/api/tickets/${ticketId}/comments`
  );

  const data = await response.json().catch(() => []);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch comments");
  }

  return data;
}

export async function addComment(ticketId, content, userId) {
  const resolvedUserId = resolveUserId(userId);

  const response = await request(
    `${BASE_URL}/api/tickets/${ticketId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": String(resolvedUserId),
      },
      body: JSON.stringify({ content }),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to add comment");
  }

  return data;
}

export async function updateComment(
  ticketId,
  commentId,
  content,
  userId,
  role = "USER"
) {
  const resolvedUserId = resolveUserId(userId);

  const response = await request(
    `${BASE_URL}/api/tickets/${ticketId}/comments/${commentId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": String(resolvedUserId),
        "X-User-Role": role,
      },
      body: JSON.stringify({
        content: content?.trim() || "",
      }),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to update comment");
  }

  return data;
}

export async function deleteComment(
  ticketId,
  commentId,
  userId,
  role = "USER"
) {
  const resolvedUserId = resolveUserId(userId);

  const response = await request(
    `${BASE_URL}/api/tickets/${ticketId}/comments/${commentId}`,
    {
      method: "DELETE",
      headers: {
        "X-User-Id": String(resolvedUserId),
        "X-User-Role": role,
      },
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to delete comment");
  }

  return true;
}

// ========================
// ATTACHMENTS
// ========================

export async function getAttachments(ticketId) {
  const response = await request(
    `${BASE_URL}/api/tickets/${ticketId}/attachments`
  );

  const data = await response.json().catch(() => []);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch attachments");
  }

  return data;
}

export async function uploadAttachments(ticketId, files) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const headers = getAuthHeaders();
  delete headers["Content-Type"];

  const response = await fetch(
    `${BASE_URL}/api/tickets/${ticketId}/attachments`,
    {
      method: "POST",
      headers,
      body: formData,
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to upload attachments");
  }

  return data;
}

export async function deleteAttachment(ticketId, attachmentId) {
  const response = await request(
    `${BASE_URL}/api/tickets/${ticketId}/attachments/${attachmentId}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to delete attachment");
  }

  return true;
}

// ========================
// HELPERS
// ========================

export function getAttachmentImageUrl(filePath) {
  return `${BASE_URL}/${filePath.replace(/\\\\/g, "/")}`;
}

// ========================
// ADMIN
// ========================

export async function assignTicket(ticketId, assigneeId, userId = 1, role = "ADMIN") {
  const response = await request(
    `${BASE_URL}/api/tickets/${ticketId}/assign`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": String(userId),
        "X-User-Role": role,
      },
      body: JSON.stringify({ assigneeId }),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to assign ticket");
  }

  return data;
}

export async function updateTicketStatus(
  ticketId,
  payload,
  userId = 1,
  role = "ADMIN"
) {
  const response = await request(
    `${BASE_URL}/api/tickets/${ticketId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": String(userId),
        "X-User-Role": role,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to update status");
  }

  return data;
}

export async function registerSupportStaff(payload, role = "ADMIN") {
  const response = await request(`${BASE_URL}/api/users/support-staff`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Role": role,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to register support staff");
  }

  return data;
}

export async function getUsers() {
  const response = await request(`${BASE_URL}/api/users`, {
    method: "GET",
  });
  const data = await response.json().catch(() => []);
  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) || "Failed to fetch users";
    throw new Error(message);
  }
  return Array.isArray(data) ? data : [];
}