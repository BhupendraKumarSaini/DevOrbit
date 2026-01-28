const API = import.meta.env.VITE_API_URL;

/* Unified API fetch helper */
export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("adminToken");

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // If body is FormData, DO NOT set Content-Type
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API}${endpoint}`, {
    ...options,
    headers,
  });

  /* Handle unauthorized (expired / invalid token) */
  if (res.status === 401) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("dashboardPage");

    throw new Error("Unauthorized");
  }

  /* Parse response safely */
  const contentType = res.headers.get("content-type");
  const data =
    contentType && contentType.includes("application/json")
      ? await res.json()
      : null;

  if (!res.ok) {
    throw new Error(data?.message || "API request failed");
  }

  return data;
};
