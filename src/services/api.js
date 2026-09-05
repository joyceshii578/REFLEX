const RAW_BASE = import.meta.env.VITE_API_URL || "https://project-reflexx-backend.onrender.com";
const API_BASE = RAW_BASE.replace(/\/$/, "");

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return { data };
}

export const api = {
  async checkHealth() {
    const url = `${API_BASE}/health`;
    console.log("Checking health at:", url);
    const res = await fetch(url);
    return res.json();
  },
  async get(path) {
    return request(path);
  },
  async post(path, body) {
    return request(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
};
