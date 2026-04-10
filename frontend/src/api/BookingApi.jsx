const BASE_URL = "http://localhost:8081";

// ========================
// BOOKING ENDPOINTS
// ========================

// CREATE BOOKING
export async function createBooking(payload, userId) {
  const response = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "userId": String(userId),
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
      (data && (data.error || data.message)) || "Failed to create booking";
    throw new Error(message);
  }

  return data;
}

// GET ALL BOOKINGS (Admin only)
export async function getBookings() {
  const response = await fetch(`${BASE_URL}/api/bookings`);

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = [];
  }

  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) || "Failed to fetch bookings";
    throw new Error(message);
  }

  return data;
}

// GET SINGLE BOOKING
export async function getBookingById(bookingId) {
  const response = await fetch(`${BASE_URL}/api/bookings/${bookingId}`);

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) || "Failed to fetch booking";
    throw new Error(message);
  }

  return data;
}

// GET USER BOOKINGS - IMPROVED VERSION
export async function getUserBookings({ userId, status, resource } = {}) {
  // Validate userId is provided
  if (!userId) {
    throw new Error("User ID is required to fetch user bookings");
  }

  const params = new URLSearchParams();
  if (status && status !== "ALL") params.append("status", status);
  if (resource) params.append("resource", resource);

  const url = `${BASE_URL}/api/bookings/my?${params.toString()}`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "userId": String(userId),
      "Content-Type": "application/json",
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = [];
  }

  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) ||
      "Failed to fetch user bookings";
    throw new Error(message);
  }

  // Ensure we always return an array
  return Array.isArray(data) ? data : [];
}

// GET USER BOOKINGS WITH PAGINATION (Optional improvement)
export async function getUserBookingsPaginated({ userId, status, page = 0, size = 10 } = {}) {
  if (!userId) {
    throw new Error("User ID is required to fetch user bookings");
  }

  const params = new URLSearchParams();
  if (status && status !== "ALL") params.append("status", status);
  params.append("page", page);
  params.append("size", size);

  const url = `${BASE_URL}/api/bookings/my?${params.toString()}`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "userId": String(userId),
      "Content-Type": "application/json",
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = { content: [], totalElements: 0 };
  }

  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) ||
      "Failed to fetch user bookings";
    throw new Error(message);
  }

  return data;
}

// UPDATE BOOKING
export async function updateBooking(bookingId, payload, userId) {
  const response = await fetch(`${BASE_URL}/api/bookings/${bookingId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "userId": String(userId),
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
      (data && (data.error || data.message)) || "Failed to update booking";
    throw new Error(message);
  }

  return data;
}

// UPDATE BOOKING STATUS (APPROVE/REJECT/CANCEL)
export async function updateBookingStatus(bookingId, status, rejectionReason = null) {
  const payload = rejectionReason ? { status, rejectionReason } : { status };
  
  const response = await fetch(
    `${BASE_URL}/api/bookings/${bookingId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error((data && data.message) || "Failed to update booking status");
  return data;
}

// CANCEL BOOKING (User friendly wrapper)
export async function cancelBooking(bookingId, userId) {
  return updateBookingStatus(bookingId, "CANCELLED");
}

// DELETE BOOKING (Admin only)
export async function deleteBooking(bookingId) {
  const response = await fetch(`${BASE_URL}/api/bookings/${bookingId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    let data = null;
    try {
      data = await response.json();
    } catch {}
    throw new Error((data?.error || data?.message) || "Failed to delete booking");
  }
}

// GET ALL RESOURCES
export async function getAllResources(type) {
  const params = new URLSearchParams();
  if (type) params.append("type", type);

  const response = await fetch(`${BASE_URL}/api/resources?${params.toString()}`, {
    method: "GET",
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = [];
  }

  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) || "Failed to fetch resources";
    throw new Error(message);
  }

  return data;
}

// GET SINGLE RESOURCE
export async function getResourceById(resourceId) {
  const response = await fetch(`${BASE_URL}/api/resources/${resourceId}`);

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) || "Failed to fetch resource";
    throw new Error(message);
  }

  return data;
}