// Demo authentication for the prototype: accounts live only in this
// browser's localStorage. Passwords are salted + SHA-256 hashed so they are
// never stored in plain text, but this is NOT real security — production
// needs server-side accounts.

const USERS_KEY = 'pgpt_users';
const SESSION_KEY = 'pgpt_session';

export class AuthError extends Error {}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage blocked (private mode etc.); session just won't persist
  }
}

async function hashPassword(password, salt) {
  const bytes = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

const normalizeEmail = (email) => email.trim().toLowerCase();

export function getCurrentUser() {
  return read(SESSION_KEY, null);
}

export async function register({ name, email, password }) {
  const users = read(USERS_KEY, {});
  const key = normalizeEmail(email);
  if (users[key]) {
    throw new AuthError('An account with this email already exists. Try logging in.');
  }

  const salt = crypto.randomUUID();
  users[key] = {
    name: name.trim(),
    email: key,
    salt,
    passwordHash: await hashPassword(password, salt),
    createdAt: new Date().toISOString(),
  };
  write(USERS_KEY, users);

  const session = { name: users[key].name, email: key };
  write(SESSION_KEY, session);
  return session;
}

export async function login({ email, password }) {
  const user = read(USERS_KEY, {})[normalizeEmail(email)];
  if (!user || (await hashPassword(password, user.salt)) !== user.passwordHash) {
    throw new AuthError('Incorrect email or password.');
  }

  const session = { name: user.name, email: user.email };
  write(SESSION_KEY, session);
  return session;
}

export function logout() {
  write(SESSION_KEY, null);
}
