import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export type Category = "juice" | "vegetable" | "healthy" | "seafood";

export async function getMenuByCategory(
  category: Category
): Promise<CollectionEntry<"menu">[]> {
  const all = await getCollection("menu");
  return all.filter((item) => item.data.category === category);
}

export async function getMenuItem(
  slug: string
): Promise<CollectionEntry<"menu"> | undefined> {
  const all = await getCollection("menu");
  return all.find((item) => item.data.slug === slug);
}

export async function getRelatedDishes(
  slug: string,
  limit = 4
): Promise<CollectionEntry<"menu">[]> {
  const target = await getMenuItem(slug);
  if (!target) return [];
  const all = await getCollection("menu");
  return all
    .filter((item) => item.data.category === target.data.category && item.data.slug !== slug)
    .slice(0, limit);
}

export function sortDishes<T extends { data: { price: number; rating: number } }>(
  items: T[],
  sort: "popular" | "price-asc" | "price-desc"
): T[] {
  const copy = [...items];
  if (sort === "price-asc") return copy.sort((a, b) => a.data.price - b.data.price);
  if (sort === "price-desc") return copy.sort((a, b) => b.data.price - a.data.price);
  return copy.sort((a, b) => b.data.rating - a.data.rating);
}
