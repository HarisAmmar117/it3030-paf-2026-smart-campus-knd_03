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