import { api } from './api.js';
import { storage, TOKEN_KEY, USER_KEY } from './utils/storage.js';

export const auth = {
  async login(email, password, remember = true) {
    const { token, user } = await api.post('/auth/login', { email, password });
    if (remember) storage.set(TOKEN_KEY, token);
    else sessionStorage.setItem(TOKEN_KEY, JSON.stringify(token));
    storage.set(USER_KEY, user);
    return user;
  },
  async register(email, password, name) {
    const { token, user } = await api.post('/auth/register', { email, password, name });
    storage.set(TOKEN_KEY, token);
    storage.set(USER_KEY, user);
    return user;
  },
  async me() {
    const { user } = await api.get('/auth/me');
    storage.set(USER_KEY, user);
    return user;
  },
  logout() {
    storage.remove(TOKEN_KEY);
    storage.remove(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    location.href = 'index.html';
  },
  isAuthed() {
    return Boolean(storage.get(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY));
  },
  user() { return storage.get(USER_KEY); },
};
