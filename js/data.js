// ===== CSBS API Data Layer =====
// Replaces localStorage with REST API calls to the backend

// Auto-detect: local dev uses relative /api, deployed frontend uses Render backend
// ⚠️ AFTER deploying backend on Render, replace YOUR-BACKEND-NAME below with your actual Render service name
const RENDER_BACKEND_URL = 'https://YOUR-BACKEND-NAME.onrender.com/api';

const isLocalDev = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const API_BASE = isLocalDev ? '/api' : RENDER_BACKEND_URL;

// ---------- Auth helpers ----------
function getAuthHeaders() {
  const token = sessionStorage.getItem('csbs_admin_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  return headers;
}

// Safe JSON parse helper
async function safeJson(res) {
  try {
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (e) {
    return null;
  }
}

// ---------- Generic API helpers ----------
async function getData(key) {
  try {
    const res = await fetch(`${API_BASE}/${key}`);
    if (!res.ok) throw new Error('Failed to fetch ' + key);
    const data = await safeJson(res);
    if (!data || !Array.isArray(data)) return [];
    // Map MongoDB _id to id for frontend compatibility
    return data.map(item => ({ ...item, id: item._id }));
  } catch (err) {
    console.error('getData error:', err);
    return [];
  }
}

async function getItemById(key, id) {
  try {
    const res = await fetch(`${API_BASE}/${key}/${id}`);
    if (!res.ok) return null;
    const item = await safeJson(res);
    if (!item) return null;
    return { ...item, id: item._id };
  } catch (err) {
    console.error('getItemById error:', err);
    return null;
  }
}

async function addItem(key, item) {
  try {
    const res = await fetch(`${API_BASE}/${key}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error((data && data.error) || 'Failed to add item');
    return data ? { ...data, id: data._id } : null;
  } catch (err) {
    console.error('addItem error:', err);
    return null;
  }
}

async function updateItem(key, id, updates) {
  try {
    const res = await fetch(`${API_BASE}/${key}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error((data && data.error) || 'Failed to update item');
    return data ? { ...data, id: data._id } : null;
  } catch (err) {
    console.error('updateItem error:', err);
    return null;
  }
}

async function deleteItem(key, id) {
  try {
    const res = await fetch(`${API_BASE}/${key}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const data = await safeJson(res);
      throw new Error((data && data.error) || 'Failed to delete item');
    }
    return true;
  } catch (err) {
    console.error('deleteItem error:', err);
    return false;
  }
}

// ---------- Registration-specific ----------
async function getRegistrations(eventId) {
  try {
    const url = eventId ? `${API_BASE}/registrations?eventId=${eventId}` : `${API_BASE}/registrations`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch registrations');
    const data = await safeJson(res);
    if (!data || !Array.isArray(data)) return [];
    return data.map(item => ({ ...item, id: item._id }));
  } catch (err) {
    console.error('getRegistrations error:', err);
    return [];
  }
}

async function addRegistration(data) {
  try {
    const res = await fetch(`${API_BASE}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await safeJson(res);
    if (!res.ok) throw new Error((result && result.error) || 'Failed to register');
    return result ? { ...result, id: result._id } : null;
  } catch (err) {
    console.error('addRegistration error:', err);
    return null;
  }
}

async function deleteRegistrationApi(id) {
  try {
    const res = await fetch(`${API_BASE}/registrations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete registration');
    return true;
  } catch (err) {
    console.error('deleteRegistration error:', err);
    return false;
  }
}

// ---------- Auth ----------
async function loginAdmin(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error((data && data.error) || 'Invalid username or password');
  if (!data || !data.token) throw new Error('Login failed — no token received');
  sessionStorage.setItem('csbs_admin_token', data.token);
  sessionStorage.setItem('csbs_admin_logged_in', 'true');
  return data;
}

// No initialization needed — data comes from the database
