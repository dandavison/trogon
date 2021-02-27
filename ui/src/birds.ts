export function isDefaultSelectedFamily(
  family: string,
  family2order: Map<string, string>
): boolean {
  const nonPasserineDefaultSelectedFamilies = new Set([
    "Tinamidae",
    "Anhimidae",
    "Columbidae",
    "Cuculidae",
    "Trogonidae",
    "Momotidae",
    "Bucconidae",
    "Galbulidae",
    "Capitonidae",
    "Ramphastidae",
    "Picidae"
  ]);
  return (
    family2order.get(family) === "Passeriformes" ||
    nonPasserineDefaultSelectedFamilies.has(family)
  );
}
