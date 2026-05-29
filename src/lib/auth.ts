import { atom } from "nanostores";

export type User = { name: string; email: string };
type StoredUser = User & { password: string };

const USERS_KEY = "wareg:users";
const AUTH_KEY = "wareg:auth";
const DEMO_USER: StoredUser = {
  name: "Demo Diner",
  email: "demo@wareg.id",
  password: "demo1234",
};

function readUsers(): StoredUser[] {
  if (typeof localStorage === "undefined") return [DEMO_USER];
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify([DEMO_USER]));
    return [DEMO_USER];
  }
  try {
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [DEMO_USER];
  } catch {
    return [DEMO_USER];
  }
}

function writeUsers(users: StoredUser[]): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readAuth(): User | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export const authState = atom<User | null>(readAuth());

authState.subscribe((user) => {
  if (typeof localStorage === "undefined") return;
  if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  else localStorage.removeItem(AUTH_KEY);
});

export function getCurrentUser(): User | null {
  return authState.get();
}

export type AuthResult = { ok: true } | { ok: false; error: string };

export function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): AuthResult {
  const email = input.email.trim().toLowerCase();
  if (!email || !input.password || !input.name) {
    return { ok: false, error: "All fields are required." };
  }
  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === email)) {
    return { ok: false, error: "That email is already registered." };
  }
  const next: StoredUser = { name: input.name, email, password: input.password };
  writeUsers([...users, next]);
  authState.set({ name: next.name, email: next.email });
  return { ok: true };
}

export function login(email: string, password: string): AuthResult {
  const e = email.trim().toLowerCase();
  const match = readUsers().find(
    (u) => u.email.toLowerCase() === e && u.password === password
  );
  if (!match) return { ok: false, error: "Invalid email or password." };
  authState.set({ name: match.name, email: match.email });
  return { ok: true };
}

export function logout(): void {
  authState.set(null);
}
