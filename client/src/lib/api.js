// Cliente HTTP mínimo para la API REST. Las cookies de sesión viajan solas (credentials: "include").
const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status, fields) {
    super(message);
    this.status = status;
    this.fields = fields || {};
  }
}

export async function api(path, { method = "GET", body } = {}) {
  let response;
  try {
    response = await fetch(`${BASE}/api${path}`, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("No pudimos conectar con el servidor. Revisa tu conexión a internet e inténtalo de nuevo.", 0);
  }
  let data = null;
  try {
    data = await response.json();
  } catch {
    // respuesta sin cuerpo JSON
  }
  if (!response.ok) {
    throw new ApiError(data?.error || `Error ${response.status}`, response.status, data?.fields);
  }
  return data;
}

export const get = (path) => api(path);
export const post = (path, body = {}) => api(path, { method: "POST", body });
export const put = (path, body = {}) => api(path, { method: "PUT", body });
export const patch = (path, body = {}) => api(path, { method: "PATCH", body });
export const del = (path) => api(path, { method: "DELETE", body: {} });
