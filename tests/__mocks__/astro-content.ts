export async function getCollection() {
  return [];
}
export type CollectionEntry<_T extends string> = {
  id: string;
  data: Record<string, unknown>;
};
