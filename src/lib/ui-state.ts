import { atom } from "nanostores";

export const cartOpen = atom<boolean>(false);
export const mobileMenuOpen = atom<boolean>(false);

export function openCart(): void { cartOpen.set(true); }
export function closeCart(): void { cartOpen.set(false); }
