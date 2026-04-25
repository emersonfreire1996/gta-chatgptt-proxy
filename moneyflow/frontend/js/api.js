import { storage, TOKEN_KEY } from './utils/storage.js';
import { mockApi, isMockMode } from './mock.js';

const API_BASE = window.MF_API_BASE || 'http://localhost:3001/api';

async function call(method, path, body) {
  if (isMockMode()) return mockApi(method, path, body);
  const token = storage.get(TOKEN_KEY);
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  let res;
  try {
    res = await fetch(API_BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    // Network failed → switch to mock automatically and retry
    window.__MF_MOCK = true;
    return mockApi(method, path, body);
  }
  if (res.status === 401 && !path.startsWith('/auth')) {
    storage.remove(TOKEN_KEY);
    if (!location.pathname.endsWith('index.html') && location.pathname !== '/') location.href = 'index.html';
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`);
  return data;
}

export const api = {
  get: (p) => call('GET', p),
  post: (p, b) => call('POST', p, b),
  put: (p, b) => call('PUT', p, b),
  patch: (p, b) => call('PATCH', p, b),
  delete: (p) => call('DELETE', p),
};
