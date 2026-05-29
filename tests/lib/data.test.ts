import { describe, it, expect } from "vitest";
import { sortDishes } from "~/lib/data";

const mk = (price: number, rating: number) =>
  ({ data: { price, rating } } as { data: { price: number; rating: number } });

describe("sortDishes", () => {
  it("sorts by price ascending", () => {
    const result = sortDishes([mk(50, 4.5), mk(20, 4.0), mk(30, 4.2)], "price-asc");
    expect(result.map((r) => r.data.price)).toEqual([20, 30, 50]);
  });

  it("sorts by price descending", () => {
    const result = sortDishes([mk(50, 4.5), mk(20, 4.0), mk(30, 4.2)], "price-desc");
    expect(result.map((r) => r.data.price)).toEqual([50, 30, 20]);
  });

  it("sorts by popularity (rating desc) for popular", () => {
    const result = sortDishes([mk(50, 4.5), mk(20, 4.9), mk(30, 4.2)], "popular");
    expect(result.map((r) => r.data.rating)).toEqual([4.9, 4.5, 4.2]);
  });

  it("does not mutate input", () => {
    const input = [mk(50, 4.5), mk(20, 4.0)];
    sortDishes(input, "price-asc");
    expect(input.map((r) => r.data.price)).toEqual([50, 20]);
  });
});
