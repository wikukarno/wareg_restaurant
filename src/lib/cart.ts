import { atom } from "nanostores";

export type CartLine = { slug: string; qty: number };
export type CartState = { items: CartLine[] };

const STORAGE_KEY = "wareg:cart";

function readInitial(): CartState {
  if (typeof localStorage === "undefined") return { items: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      "items" in parsed &&
      Array.isArray((parsed as CartState).items)
    ) {
      return parsed as CartState;
    }
    return { items: [] };
  } catch {
    return { items: [] };
  }
}

export const cart = atom<CartState>(readInitial());

cart.subscribe((state) => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
});

export function addItem(slug: string, qty = 1): void {
  const current = cart.get();
  const idx = current.items.findIndex((i) => i.slug === slug);
  const next: CartState = { items: [...current.items] };
  if (idx >= 0) {
    next.items[idx] = { ...next.items[idx], qty: next.items[idx].qty + qty };
  } else {
    next.items.push({ slug, qty });
  }
  cart.set(next);
}

export function setQty(slug: string, qty: number): void {
  if (qty <= 0) return removeItem(slug);
  const current = cart.get();
  cart.set({
    items: current.items.map((i) => (i.slug === slug ? { ...i, qty } : i)),
  });
}

export function removeItem(slug: string): void {
  const current = cart.get();
  cart.set({ items: current.items.filter((i) => i.slug !== slug) });
}

export function clearCart(): void {
  cart.set({ items: [] });
}

export function totalCount(state: CartState): number {
  return state.items.reduce((sum, i) => sum + i.qty, 0);
}
