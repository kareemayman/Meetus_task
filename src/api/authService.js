const API_BASE = import.meta.env.VITE_API_BASE
const STORAGE_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token'

// Function to fetch data from API
async function rawFetch(url, { method = 'GET', body = undefined, token = null, headers = {} } = {}) {
  const finalHeaders = { 'Content-Type': 'application/json', ...headers };
  if (token) finalHeaders.Authorization = `Bearer ${token}`;

  const resp = await fetch(`${API_BASE}${url}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await resp.text();
  const data = text ? JSON.parse(text) : null;

  if (!resp.ok) {
    // throw structured error
    const err = new Error(data?.message || 'Request failed');
    err.status = resp.status;
    err.data = data;
    throw err;
  }
  return data;
}

// Function calling login endpoint
// Return the token on success
export async function loginRequest({ email, password, isEmployee = true }) {
  // POST /yeshtery/token -> { token: '...' } (expected)
  return await rawFetch('/yeshtery/token', {
    method: 'POST',
    body: { email, password, isEmployee }
  });
}

// Function to fetch user info (name, id, email, etc)
export async function fetchUserRequest(token) {
  // GET /user/info (requires Authorization)
  return await rawFetch('/user/info', {
    method: 'GET',
    token
  });
}

// storage helpers
export function saveTokenToStorage(token) {
  try { localStorage.setItem(STORAGE_KEY, token); } catch (e) {}
}
export function readTokenFromStorage() {
  try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
}
export function removeTokenFromStorage() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
}