import { BASE_URL, getAuthHeaders } from "./apiClient";

// ========================
// BOOKING ENDPOINTS
// ========================

// CREATE BOOKING
export async function createBooking(payload, userId) {
  const response = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
      userId: String(userId),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Failed to create booking");
  }

  return data;
}

// GET ALL BOOKINGS (Admin only)
export async function getBookings() {
  const response = await fetch(`${BASE_URL}/api/bookings`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => []);

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Failed to fetch bookings");
  }

  return data;
}

// GET SINGLE BOOKING
export async function getBookingById(bookingId) {
  const response = await fetch(`${BASE_URL}/api/bookings/${bookingId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Failed to fetch booking");
  }

  return data;
}

// GET USER BOOKINGS
export async function getUserBookings({ userId, status, resource } = {}) {
  if (!userId) throw new Error("User ID is required");

  const params = new URLSearchParams();
  if (status && status !== "ALL") params.append("status", status);
  if (resource) params.append("resource", resource);

  const response = await fetch(
    `${BASE_URL}/api/bookings/my?${params.toString()}`,
    {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
        userId: String(userId),
      },
    }
  );

  const data = await response.json().catch(() => []);

  if (!response.ok) {
    throw new Error(
      data?.error || data?.message || "Failed to fetch user bookings"
    );
  }

  return Array.isArray(data) ? data : [];
}

// PAGINATED USER BOOKINGS
export async function getUserBookingsPaginated({
  userId,
  status,
  page = 0,
  size = 10,
} = {}) {
  if (!userId) throw new Error("User ID is required");

  const params = new URLSearchParams();
  if (status && status !== "ALL") params.append("status", status);
  params.append("page", page);
  params.append("size", size);

  const response = await fetch(
    `${BASE_URL}/api/bookings/my?${params.toString()}`,
    {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
        userId: String(userId),
      },
    }
  );

  const data = await response.json().catch(() => ({
    content: [],
    totalElements: 0,
  }));

  if (!response.ok) {
    throw new Error(
      data?.error || data?.message || "Failed to fetch user bookings"
    );
  }

  return data;
}

// UPDATE BOOKING
export async function updateBooking(bookingId, payload, userId) {
  const response = await fetch(`${BASE_URL}/api/bookings/${bookingId}`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
      userId: String(userId),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Failed to update booking");
  }

  return data;
}

// UPDATE STATUS
export async function updateBookingStatus(
  bookingId,
  status,
  rejectionReason = null
) {
  const payload = rejectionReason
    ? { status, rejectionReason }
    : { status };

  const response = await fetch(
    `${BASE_URL}/api/bookings/${bookingId}/status`,
    {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to update booking status");
  }

  return data;
}

// CANCEL BOOKING
export async function cancelBooking(bookingId) {
  return updateBookingStatus(bookingId, "CANCELLED");
}

// DELETE BOOKING
export async function deleteBooking(bookingId) {
  const response = await fetch(
    `${BASE_URL}/api/bookings/${bookingId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Failed to delete booking");
  }

  return data;
}

// GET RESOURCES
export async function getAllResources(type) {
  const params = new URLSearchParams();
  if (type) params.append("type", type);

  const response = await fetch(
    `${BASE_URL}/api/resources?${params.toString()}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json().catch(() => []);

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Failed to fetch resources");
  }

  return data;
}

// GET RESOURCE BY ID
export async function getResourceById(resourceId) {
  const response = await fetch(
    `${BASE_URL}/api/resources/${resourceId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Failed to fetch resource");
  }

  return data;
}