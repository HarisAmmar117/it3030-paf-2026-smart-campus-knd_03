const BASE_URL = "http://localhost:8081";

// ========================
// BOOKING ENDPOINTS
// ========================

// CREATE BOOKING
export async function createBooking(payload, userId = 2) {
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

// GET ALL BOOKINGS
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

//GET USER BOOKINGS
export async function getUserBookings({ userId = 2, status, resource } = {}) {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (resource) params.append("resource", resource);

  const response = await fetch(`${BASE_URL}/api/bookings/my?${params.toString()}`, {
    method: "GET",
    headers: {
      "userId": String(userId),
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

  return data;
}

// UPDATE BOOKING
export async function updateBooking(bookingId, payload, userId = 2) {
  const response = await fetch(`${BASE_URL}/api/bookings/${bookingId}`, {
    method: "PUT", // or PATCH based on your backend
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

// UPDATE BOOKING STATUS (IMPORTANT)
export async function updateBookingStatus(
  bookingId,
  status,
  userId = 2
) {
  const response = await fetch(
    `${BASE_URL}/api/bookings/${bookingId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
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
      (data && (data.error || data.message)) ||
      "Failed to update booking status";
    throw new Error(message);
  }

  return data;
}

// DELETE BOOKING
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