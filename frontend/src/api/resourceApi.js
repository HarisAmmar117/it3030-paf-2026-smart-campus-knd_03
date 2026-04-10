import { BASE_URL, getAuthHeaders } from "./apiClient";

// ========================
// GET all resources (optional type filter)
// ========================
export async function getResources(filters = {}) {
  const params = new URLSearchParams();

  if (filters.type) params.append("type", filters.type);

  const query = params.toString();
  const url = `${BASE_URL}/api/resources${query ? `?${query}` : ""}`;

  const response = await fetch(url, {
    headers: getAuthHeaders()
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

// ========================
// GET single resource by ID
// ========================
export async function getResourceById(id) {
  const response = await fetch(`${BASE_URL}/api/resources/${id}`, {
    headers: getAuthHeaders()
  });

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

// ========================
// CREATE a new resource
// ========================
export async function createResource(payload) {
  const response = await fetch(`${BASE_URL}/api/resources`, {
    method: "POST",
    headers: getAuthHeaders(),
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
      (data && (data.error || data.message)) || "Failed to create resource";
    throw new Error(message);
  }

  return data;
}

// ========================
// UPDATE a resource by ID
// ========================
export async function updateResource(id, payload) {
  const response = await fetch(`${BASE_URL}/api/resources/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
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
      (data && (data.error || data.message)) || "Failed to update resource";
    throw new Error(message);
  }

  return data;
}

// ========================
// DELETE a resource by ID
// ========================
export async function deleteResource(id) {
  const response = await fetch(`${BASE_URL}/api/resources/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) || "Failed to delete resource";
    throw new Error(message);
  }

  return data;
}