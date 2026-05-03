/**
 * Base URL for Strapi REST (no trailing slash). Value comes only from env — no hardcoded URL here.
 *
 * In **TetClima** `.env` or `.env.local` set:
 *   `NEXT_PUBLIC_STRAPI_URL=<your Strapi origin>` (no trailing slash)
 * On the server you may also set `STRAPI_URL` as a fallback (not exposed to the browser).
 *
 * Restart `next dev` or rebuild after changing env.
 */
export function getStrapiBaseUrl(): string {
  const raw = (
    process.env.NEXT_PUBLIC_STRAPI_URL?.trim() ||
    process.env.STRAPI_URL?.trim() ||
    ""
  ).replace(/\/+$/, "");
  if (!raw) {
    throw new Error(
      "Missing NEXT_PUBLIC_STRAPI_URL. Add it to TetClima .env (Strapi base URL, no trailing slash).",
    );
  }
  return raw;
}

/**
 * Strapi REST: only products shown on the site (available for sale).
 * Rows with isAvailable null are treated as available (legacy data before the field existed).
 */
function appendProductAvailabilityFilters(sp: URLSearchParams) {
  sp.set("filters[$or][0][isAvailable][$eq]", "true");
  sp.set("filters[$or][1][isAvailable][$null]", "true");
}

/**
 * URL to load distinct product types for nav/footer: normal (non-refurbished) + available only.
 */
export function strapiProductTypesUrl(strapiRoot: string): string {
  const u = new URL(`${strapiRoot.replace(/\/$/, "")}/api/products`);
  u.searchParams.set("fields[0]", "type");
  u.searchParams.set("filters[$and][0][$or][0][isRefurbished][$eq]", "false");
  u.searchParams.set("filters[$and][0][$or][1][isRefurbished][$null]", "true");
  u.searchParams.set("filters[$and][1][$or][0][isAvailable][$eq]", "true");
  u.searchParams.set("filters[$and][1][$or][1][isAvailable][$null]", "true");
  u.searchParams.set("pagination[pageSize]", "1000");
  return u.toString();
}

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
  // Optional internal numeric i from Strapi (not used in URLs)
  numericId?: number;
  name: string;
  brand: string;
  model: string;
  /** First product image (for cards). */
  image: string;
  /** All product images (Strapi media multiple). */
  images: string[];
  price: number;
  capacity: string;
  efficiency: string;
  type: string;
  features: string[];
  badge?: string;
  specifications: ProductSpecifications;
  description: string;
  isRefurbished?: boolean;
  /** false = hidden on site; true/undefined = shown (Strapi may omit on old rows). */
  isAvailable?: boolean;
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
    // "class" is used by the filters as "Клас" and should not fall back to product type.
    // If the class is missing in Strapi, keep it empty so it doesn't get mislabeled.
    class: str(specsObj.class) || "",
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

  const base = getStrapiBaseUrl();
  const toFullUrl = (url: unknown) =>
    typeof url === "string" && url
      ? url.startsWith("http")
        ? url
        : `${base}${url}`
      : "";

  // Support Strapi media in multiple shapes:
  // - v5: image: [{ url }]
  // - v5 populated: image: { data: [{ attributes: { url } } ] }
  // - v4: image: { data: { attributes: { url } } }
  const images: string[] = (() => {
    const img = attributes.image;
    if (!img) return [];
    if (Array.isArray(img)) {
      return img.map((m: any) => toFullUrl(m?.url)).filter(Boolean);
    }
    if (img?.data) {
      if (Array.isArray(img.data)) {
        return img.data
          .map((d: any) => toFullUrl(d?.attributes?.url ?? d?.url))
          .filter(Boolean);
      }
      return [toFullUrl(img.data?.attributes?.url ?? img.data?.url)].filter(
        Boolean,
      );
    }
    return [toFullUrl(img?.url)].filter(Boolean);
  })();

  const imageUrl = images[0] || "/placeholder.jpg";

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
    images: images.length ? images : [imageUrl],
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
    isRefurbished: Boolean(attributes.isRefurbished),
    isAvailable: attributes.isAvailable !== false,
  };
}

export async function getProducts(): Promise<Product[]> {
  const pageSize = 100;
  let page = 1;
  const all: any[] = [];

  // Strapi is paginated by default (often pageSize=25). Fetch all pages.
  for (;;) {
    const url = new URL(`${getStrapiBaseUrl()}/api/products`);
    url.searchParams.set("populate", "*");
    url.searchParams.set("pagination[page]", String(page));
    url.searchParams.set("pagination[pageSize]", String(pageSize));
    appendProductAvailabilityFilters(url.searchParams);

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products");

    const json = await res.json();
    const data = Array.isArray(json?.data) ? json.data : [];
    all.push(...data);

    const meta = json?.meta?.pagination;
    const pageCount =
      meta && typeof meta.pageCount === "number" ? meta.pageCount : undefined;

    // If Strapi didn't send pagination meta, assume single page.
    if (!pageCount) break;
    if (page >= pageCount) break;
    page += 1;
  }

  return all.map((item: any) => mapStrapiProduct(item));
}

export async function getProductById(id: string | number): Promise<Product | null> {
  const idParam = String(id || "").trim();
  if (!idParam) {
    return null;
  }

  const res = await fetch(`${getStrapiBaseUrl()}/api/products/${idParam}?populate=*`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const json = await res.json();
  if (!json.data) {
    return null;
  }

  const row = json.data;
  const attrs = row.attributes ?? row;
  if (attrs.isAvailable === false) {
    return null;
  }

  return mapStrapiProduct(row);
}