import { describe, it, expect, beforeEach } from "vitest";
import { authState, registerUser, login, logout, getCurrentUser } from "~/lib/auth";

class MemoryStorage {
  private store = new Map<string, string>();
  getItem(k: string) { return this.store.get(k) ?? null; }
  setItem(k: string, v: string) { this.store.set(k, v); }
  removeItem(k: string) { this.store.delete(k); }
  clear() { this.store.clear(); }
}

beforeEach(() => {
  // @ts-expect-error: provide minimal localStorage shim
  globalThis.localStorage = new MemoryStorage();
  logout();
});

describe("auth store", () => {
  it("starts logged out (after logout call)", () => {
    expect(getCurrentUser()).toBeNull();
  });
  it("registers and logs in a new user", () => {
    const res = registerUser({ name: "Tia", email: "tia@example.com", password: "secret12" });
    expect(res.ok).toBe(true);
    expect(getCurrentUser()?.email).toBe("tia@example.com");
  });
  it("rejects duplicate email on register", () => {
    registerUser({ name: "Tia", email: "tia@example.com", password: "secret12" });
    logout();
    const res = registerUser({ name: "Other", email: "tia@example.com", password: "secret12" });
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/email/i);
  });
  it("login succeeds with correct password", () => {
    registerUser({ name: "Tia", email: "tia@example.com", password: "secret12" });
    logout();
    const res = login("tia@example.com", "secret12");
    expect(res.ok).toBe(true);
    expect(getCurrentUser()?.email).toBe("tia@example.com");
  });
  it("login fails with wrong password", () => {
    registerUser({ name: "Tia", email: "tia@example.com", password: "secret12" });
    logout();
    const res = login("tia@example.com", "wrong");
    expect(res.ok).toBe(false);
  });
  it("login fails for unknown email", () => {
    const res = login("ghost@example.com", "anything");
    expect(res.ok).toBe(false);
  });
});
