const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

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
  specifications: {
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
  };
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
  // Support both "specifications" and "Specifications" (as in your JSON)
  const specs = attributes.specifications || attributes.Specifications || {};

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
    // Use specifications.power as capacity fallback
    capacity: (attributes.capacity as string) || (specs.power as string) || "",
    efficiency:
      (attributes.efficiency as string) ||
      (specs.energyClass as string) ||
      "",
    type: valueToText(attributes.type),
    features: featuresArray,
    badge: (attributes.badge as string | undefined) || undefined,
    specifications: {
      class: (specs.class as string) || (attributes.type as string) || "",
      power: (specs.power as string) || "",
      color: (specs.color as string) || "",
      origin: (specs.origin as string) || "",
      coolingPower: (specs.coolingPower as string) || "",
      heatingPower: (specs.heatingPower as string) || "",
      // If you don't have energyClass in the component, reuse efficiency
      energyClass:
        (specs.energyClass as string) ||
        (attributes.efficiency as string) ||
        "",
      noiseLevel: (specs.noiseLevel as string) || "",
      refrigerant: (specs.refrigerant as string) || "",
      dimensions: (specs.dimensions as string) || "",
      weight: (specs.weight as string) || "",
    },
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