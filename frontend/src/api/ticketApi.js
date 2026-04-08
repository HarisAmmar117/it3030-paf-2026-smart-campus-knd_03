const BASE_URL = "http://localhost:8081";

export async function createTicket(payload, userId = 101) {
  const response = await fetch(`${BASE_URL}/api/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": String(userId),
    },
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) || "Failed to create ticket";
    throw new Error(message);
  }

  return data;
}

export async function getTickets(filters = {}) {
  const params = new URLSearchParams();

  if (filters.status) params.append("status", filters.status);
  if (filters.priority) params.append("priority", filters.priority);

  const query = params.toString();
  const url = `${BASE_URL}/api/tickets${query ? `?${query}` : ""}`;

  const response = await fetch(url);
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = [];
  }

  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) || "Failed to fetch tickets";
    throw new Error(message);
  }

  return data;
}

export async function updateTicket(ticketId, payload, userId = 101) {
  const response = await fetch(`${BASE_URL}/api/tickets/${ticketId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": String(userId),
    },
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) || "Failed to update ticket";
    throw new Error(message);
  }

  return data;
}

export async function deleteTicket(ticketId, userId = 101) {
  const response = await fetch(`${BASE_URL}/api/tickets/${ticketId}`, {
    method: "DELETE",
    headers: {
      "X-User-Id": String(userId),
    },
  });

  if (!response.ok) {
    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    const message =
      (data && (data.error || data.message)) || "Failed to delete ticket";
    throw new Error(message);
  }
}

// ========================
// COMMENT ENDPOINTS
// ========================

export async function getComments(ticketId) {
  const response = await fetch(`${BASE_URL}/api/tickets/${ticketId}/comments`);
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = [];
  }
  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) || "Failed to fetch comments";
    throw new Error(message);
  }
  return data;
}

export async function addComment(ticketId, content, userId = 101) {
  const response = await fetch(
    `${BASE_URL}/api/tickets/${ticketId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": String(userId),
      },
      body: JSON.stringify({ content }),
    }
  );
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) || "Failed to add comment";
    throw new Error(message);
  }
  return data;
}

export async function updateComment(
  ticketId,
  commentId,
  content,
  userId = 101,
  role = "USER"
) {
  const response = await fetch(
    `${BASE_URL}/api/tickets/${ticketId}/comments/${commentId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": String(userId),
        "X-User-Role": role,
      },
      body: JSON.stringify({ content }),
    }
  );
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) || "Failed to update comment";
    throw new Error(message);
  }
  return data;
}

export async function deleteComment(
  ticketId,
  commentId,
  userId = 101,
  role = "USER"
) {
  const response = await fetch(
    `${BASE_URL}/api/tickets/${ticketId}/comments/${commentId}`,
    {
      method: "DELETE",
      headers: {
        "X-User-Id": String(userId),
        "X-User-Role": role,
      },
    }
  );
  if (!response.ok) {
    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    const message =
      (data && (data.error || data.message)) || "Failed to delete comment";
    throw new Error(message);
  }
}

// ========================
// ATTACHMENT ENDPOINTS
// ========================

export async function getAttachments(ticketId) {
  const response = await fetch(
    `${BASE_URL}/api/tickets/${ticketId}/attachments`
  );
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = [];
  }
  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) || "Failed to fetch attachments";
    throw new Error(message);
  }
  return data;
}

export async function uploadAttachments(ticketId, files) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await fetch(
    `${BASE_URL}/api/tickets/${ticketId}/attachments`,
    {
      method: "POST",
      body: formData,
    }
  );
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) || "Failed to upload attachments";
    throw new Error(message);
  }
  return data;
}

export async function deleteAttachment(ticketId, attachmentId) {
  const response = await fetch(
    `${BASE_URL}/api/tickets/${ticketId}/attachments/${attachmentId}`,
    { method: "DELETE" }
  );
  if (!response.ok) {
    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    const message =
      (data && (data.error || data.message)) || "Failed to delete attachment";
    throw new Error(message);
  }
}

// Helper: build URL to view an uploaded image
export function getAttachmentImageUrl(filePath) {
  // filePath from backend is like "uploads/tickets/1/uuid_name.jpg"
  return `${BASE_URL}/${filePath.replace(/\\\\/g, "/")}`;
}

// ========================
// ADMIN ENDPOINTS
// ========================

export async function assignTicket(ticketId, assigneeId, userId = 1, role = "ADMIN") {
  const response = await fetch(`${BASE_URL}/api/tickets/${ticketId}/assign`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": String(userId),
      "X-User-Role": role,
    },
    body: JSON.stringify({ assigneeId }),
  });
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) || "Failed to assign ticket";
    throw new Error(message);
  }
  return data;
}

export async function updateTicketStatus(
  ticketId,
  payload,
  userId = 1,
  role = "ADMIN"
) {
  const response = await fetch(`${BASE_URL}/api/tickets/${ticketId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": String(userId),
      "X-User-Role": role,
    },
    body: JSON.stringify(payload),
  });
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) || "Failed to update status";
    throw new Error(message);
  }
  return data;
}