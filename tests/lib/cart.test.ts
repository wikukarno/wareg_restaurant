import { describe, it, expect, beforeEach } from "vitest";
import { cart, addItem, removeItem, setQty, clearCart, totalCount } from "~/lib/cart";

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
  clearCart();
});

describe("cart store", () => {
  it("starts empty", () => { expect(cart.get().items).toEqual([]); });
  it("addItem inserts a new line", () => {
    addItem("seafood-paella", 1);
    expect(cart.get().items).toEqual([{ slug: "seafood-paella", qty: 1 }]);
  });
  it("addItem increments existing line", () => {
    addItem("seafood-paella", 1);
    addItem("seafood-paella", 2);
    expect(cart.get().items).toEqual([{ slug: "seafood-paella", qty: 3 }]);
  });
  it("setQty replaces qty; setQty 0 removes", () => {
    addItem("a", 1);
    setQty("a", 5);
    expect(cart.get().items).toEqual([{ slug: "a", qty: 5 }]);
    setQty("a", 0);
    expect(cart.get().items).toEqual([]);
  });
  it("removeItem deletes a line", () => {
    addItem("a", 1);
    addItem("b", 2);
    removeItem("a");
    expect(cart.get().items).toEqual([{ slug: "b", qty: 2 }]);
  });
  it("totalCount sums qty", () => {
    addItem("a", 2);
    addItem("b", 3);
    expect(totalCount(cart.get())).toBe(5);
  });
  it("persists to localStorage on change", () => {
    addItem("a", 1);
    const raw = localStorage.getItem("wareg:cart");
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toEqual({ items: [{ slug: "a", qty: 1 }] });
  });
});
