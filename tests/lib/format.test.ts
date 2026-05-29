import { describe, it, expect } from "vitest";
import { formatIDR } from "~/lib/format";

describe("formatIDR", () => {
  it("formats integers with thousand separator", () => {
    expect(formatIDR(225000)).toBe("Rp 225.000");
  });
  it("formats small values", () => {
    expect(formatIDR(15000)).toBe("Rp 15.000");
  });
  it("formats zero", () => {
    expect(formatIDR(0)).toBe("Rp 0");
  });
  it("rounds decimals", () => {
    expect(formatIDR(225000.7)).toBe("Rp 225.001");
  });
});
