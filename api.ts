const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/** Normalized fields used by filters / legacy UI; plus any keys from Strapi (snake_case, etc.). */
export type ProductSpecifications = {
  class: string;
  power: string;
  color: string;
  origin: string;
  coolingPower: string;
  heatingPower: string;
  energyClass: string;
  noiseLevel: string;
  refrigerant: string;
  dimensions: string;
  weight: string;
} & Record<string, string | number | null | undefined>;

export interface Product {
  // Strapi v5 documentId (used in URLs like /api/products/:documentId)
  id: string;
  // Optional internal numeric id from Strapi (not used in URLs)
  numericId?: number;
  name: string;
  brand: string;
  model: string;
  image: string;
  price: number;
  capacity: string;
  efficiency: string;
  type: string;
  features: string[];
  badge?: string;
  specifications: ProductSpecifications;
  description: string;
}

function valueToText(value: any): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(valueToText).join(", ");
  if (typeof value === "object") {
    return (
      (value.title as string | undefined) ||
      (value.name as string | undefined) ||
      (value.slug as string | undefined) ||
      (value.model as string | undefined) ||
      (value.type as string | undefined) ||
      String(value.id ?? "")
    );
  }
  return String(value);
}

function mapStrapiProduct(item: any): Product {
  // Strapi v5 can return fields directly on the item (no attributes),
  // so fall back to the root object when attributes is missing.
  const attributes = item.attributes || item || {};
  // Support both "specifications" and "Specifications" (Strapi component name)
  const specsRaw =
    attributes.specifications || attributes.Specifications || {};
  const specsObj =
    typeof specsRaw === "object" && specsRaw !== null ? { ...specsRaw } : {};
  // Don't treat Strapi relation ids as spec fields
  delete specsObj.id;
  delete specsObj.documentId;

  const str = (v: unknown) =>
    v === null || v === undefined || v === "" ? "" : String(v);

  // Normalized legacy keys (used by /products filters) + snake_case from Strapi kept via spread
  const legacySpecs: Pick<
    ProductSpecifications,
    | "class"
    | "power"
    | "color"
    | "origin"
    | "coolingPower"
    | "heatingPower"
    | "energyClass"
    | "noiseLevel"
    | "refrigerant"
    | "dimensions"
    | "weight"
  > = {
    class: str(specsObj.class) || str(attributes.type) || "",
    power: str(specsObj.power) || str(specsObj.power_btu) || "",
    color: str(specsObj.color),
    origin: str(specsObj.origin) || str(specsObj.country_of_origin),
    coolingPower: str(specsObj.coolingPower) || str(specsObj.cooling_power),
    heatingPower: str(specsObj.heatingPower) || str(specsObj.heating_power),
    energyClass:
      str(specsObj.energyClass) ||
      str(specsObj.cooling_energy_class) ||
      str(attributes.efficiency),
    noiseLevel:
      str(specsObj.noiseLevel) ||
      str(specsObj.indoor_noise_level) ||
      str(specsObj.outdoor_noise_level),
    refrigerant: str(specsObj.refrigerant),
    dimensions:
      str(specsObj.dimensions) ||
      str(specsObj.indoor_unit_dimensions) ||
      str(specsObj.outdoor_unit_dimensions),
    weight:
      str(specsObj.weight) ||
      str(specsObj.indoor_unit_weight) ||
      str(specsObj.outdoor_unit_weight),
  };

  const specifications: ProductSpecifications = {
    ...specsObj,
    ...legacySpecs,
  };

  // Support both v4-style media (image.data.attributes.url)
  // and v5-style media (image.url).
  const imageAttributes =
    attributes.image?.data?.attributes || attributes.image || {};
  const imageUrl = imageAttributes.url
    ? `${STRAPI_URL}${imageAttributes.url}`
    : "/placeholder.jpg";

  const rawFeatures = attributes.features;
  const featuresArray: string[] = Array.isArray(rawFeatures)
    ? rawFeatures.map((f: any) => valueToText(f))
    : [];

  const numericId =
    typeof item.id === "number" ? item.id : Number(item.id ?? 0) || undefined;
  const documentId =
    (attributes.documentId as string) ||
    (item.documentId as string) ||
    (numericId !== undefined ? String(numericId) : "");

  return {
    id: documentId,
    numericId,
    name: (attributes.name as string) || (attributes.model as string) || "",
    brand: valueToText(attributes.brand),
    model: (attributes.model as string) || "",
    image: imageUrl,
    price: (attributes.price as number) ?? 0,
    capacity:
      str(attributes.capacity) ||
      str(specsObj.power_btu) ||
      legacySpecs.power,
    efficiency:
      str(attributes.efficiency) ||
      str(specsObj.cooling_energy_class) ||
      legacySpecs.energyClass,
    type: valueToText(attributes.type),
    features: featuresArray,
    badge: (attributes.badge as string | undefined) || undefined,
    specifications,
    description: (attributes.description as string) || "",
  };
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${STRAPI_URL}/api/products?populate=*`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const json = await res.json();
  const data = json.data || [];
  return data.map((item: any) => mapStrapiProduct(item));
}

export async function getProductById(id: string | number): Promise<Product | null> {
  const idParam = String(id || "").trim();
  if (!idParam) {
    return null;
  }

  const res = await fetch(`${STRAPI_URL}/api/products/${idParam}?populate=*`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const json = await res.json();
  if (!json.data) {
    return null;
  }

  return mapStrapiProduct(json.data);
}