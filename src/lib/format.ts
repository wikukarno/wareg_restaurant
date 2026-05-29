const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatIDR(value: number): string {
  return formatter.format(value).replace(/\s+/g, " ").replace("IDR", "Rp").trim();
}
