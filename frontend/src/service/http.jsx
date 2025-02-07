const BASE_URL = "http://localhost:5173";

// Helper function to make requests with headers and token
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    ...options,
    headers: { ...headers, ...options.headers },
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};

// Authentication endpoints
export const login = (data) => request("/users/login", { method: "POST", body: JSON.stringify(data) });

export const register = (data) => request("/users/register", { method: "POST", body: JSON.stringify(data) });

export const verify = (data) => request("/users/verify", { method: "POST", body: JSON.stringify(data) });

// Notification endpoints
export const addNotification = (data) => request("/notifications/addNotification", { method: "POST", body: JSON.stringify(data) });

export const deleteNotification = (id) => request(`/notifications/deleteNotification/${id}`, { method: "DELETE" });

export const getNotifications = () => request("/notifications/getNotifications", { method: "GET" });

// Task endpoints (corrected)
export const createTask = (data) => request("/tasks/createTask", { method: "POST", body: JSON.stringify(data) });

// Preference endpoints
export const getPreferences = () => request("/preferences/getPreferences", { method: "GET" });

export const updatePreference = (data) => request("/preferences/update", { method: "POST", body: JSON.stringify(data) });

export const mutePreference = (data) => request("/preferences/mute", { method: "POST", body: JSON.stringify(data) });

export const unmutePreference = (data) => request("/preferences/unmute", { method: "POST", body: JSON.stringify(data) });

export default {
  login,
  register,
  verify,
  addNotification,
  deleteNotification,
  getNotifications,
  createTask,
  getPreferences,
  updatePreference,
  mutePreference,
  unmutePreference,
};
