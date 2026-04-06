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