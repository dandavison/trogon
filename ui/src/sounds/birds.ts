export function isDefaultSelectedFamily(
  family: string,
  family2order: Map<string, string>
): boolean {
  const nonPasserineDefaultSelectedFamilies = new Set([
    "Tinamous",
    "Screamers",
    "Pigeons and Doves",
    "Cuckoos",
    "Trogons",
    "Motmots",
    "Puffbirds",
    "Jacamars",
    "New World Barbets",
    "Toucans",
    "Woodpeckers"
  ]);
  return (
    family2order.get(family) === "Passeriformes" ||
    nonPasserineDefaultSelectedFamilies.has(family)
  );
}
