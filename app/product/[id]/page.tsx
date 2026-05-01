import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { ImageWithFallback } from "@/app/components/ImageWithFallback";
import { ArrowRight, House } from "lucide-react";
import { getProductById, getProducts } from "@/api";
import {
  formatPriceBgnFromEur,
  formatPriceEur,
} from "@/lib/currency";
import { ProductInquiryButton } from "@/app/components/ProductInquiryButton";
import { ProductGallery } from "./ProductGallery";

interface ProductPageProps {
  params: Promise<{ id: string }> | { id: string };
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}

export default async function ProductDetail({ params, searchParams }: ProductPageProps) {
  const { id } = await Promise.resolve(params);
  const [product, allProducts] = await Promise.all([
    getProductById(id),
    getProducts(),
  ]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Продуктът не е намерен</h2>
          <Link href="/products">
            <Button>Обратно към продуктите</Button>
          </Link>
        </div>
      </div>
    );
  }

  const specificationRows = [
    { key: "class", label: "Клас" },
    { key: "room_size", label: "За помещения (кв.м.)" },
    { key: "heating_energy_class", label: "Енергиен клас отопление" },
    { key: "cooling_energy_class", label: "Енергиен клас охлаждане" },
    { key: "power_btu", label: "Мощност (BTU)" },
    { key: "power_supply_voltage", label: "Захранващо напрежение (V)" },
    { key: "recommended_heating_volume", label: "Препоръчителен обем (отопление) (м³)" },
    { key: "recommended_cooling_volume", label: "Препоръчителен обем (охлаждане) (м³)" },
    { key: "heating_power", label: "Отдавана мощност (отопление) (kW)" },
    { key: "cooling_power", label: "Отдавана мощност (охлаждане) (kW)" },
    { key: "power_consumption_heating", label: "Консумирана мощност (отопление) (kW)" },
    { key: "power_consumption_cooling", label: "Консумирана мощност (охлаждане) (kW)" },
    { key: "scop", label: "SCOP (сезонна ефективност отопление)" },
    { key: "seer", label: "SEER (сезонна ефективност охлаждане)" },
    { key: "indoor_noise_level", label: "Ниво на шум (вътрешно тяло) (dB)" },
    { key: "outdoor_noise_level", label: "Ниво на шум (външно тяло) (dB)" },
    { key: "indoor_unit_dimensions", label: "Размери вътрешно тяло (Ш x В x Д) (mm)" },
    { key: "outdoor_unit_dimensions", label: "Размери външно тяло (Ш x В x Д) (mm)" },
    { key: "indoor_unit_weight", label: "Тегло вътрешно тяло (kg)" },
    { key: "outdoor_unit_weight", label: "Тегло външно тяло (kg)" },
    { key: "heating_operating_range", label: "Работен диапазон отопление (°C)" },
    { key: "cooling_operating_range", label: "Работен диапазон охлаждане (°C)" },
    { key: "refrigerant", label: "Хладилен агент" },
    { key: "color", label: "Цвят" },
    { key: "country_of_origin", label: "Произход" },
    { key: "pipe_diameter", label: "Диаметър на тръбите (течност/газ) (mm)" },
    { key: "max_height_difference", label: "Денивелация (m)" },
    { key: "power_supply_location", label: "Захранване" },
    { key: "max_pipe_length", label: "Максимална дължина на тръбен път (m)" },
  ] as const;

  const specificationValues = product.specifications as Record<
    string,
    string | number | null | undefined
  >;

  const specs = specificationRows
    .map(({ key, label }) => ({
      label,
      value: specificationValues[key],
    }))
    .filter(({ value }) => value !== undefined && value !== null && value !== "");

  const related = allProducts
    .filter((p) => p.type === product.type && p.id !== product.id)
    .slice(0, 3);

  const isRefurbishedProduct = Boolean(product.isRefurbished);
  const sp = await Promise.resolve(searchParams ?? {});
  const fromRaw = Array.isArray((sp as any).from) ? (sp as any).from[0] : (sp as any).from;
  const from =
    typeof fromRaw === "string" && fromRaw.startsWith("/products")
      ? fromRaw
      : null;

  const parentListHref = from ?? (isRefurbishedProduct ? "/refurbished" : "/products");
  const parentListLabel = isRefurbishedProduct
    ? "Рециклирани климатици"
    : "Климатици";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl min-w-0 px-6">
          <nav
            aria-label="Навигация"
            className="flex flex-nowrap items-center gap-x-1 overflow-x-auto overscroll-x-contain py-4 text-sm [-webkit-overflow-scrolling:touch] [scrollbar-width:thin]"
          >
            <Link href="/" className="inline-flex shrink-0 cursor-pointer">
              <Button variant="ghost" size="icon" className="shrink-0 text-slate-600" aria-label="Начало">
                <House className="size-5 text-slate-500" />
              </Button>
            </Link>
            <ArrowRight className="size-4 shrink-0 text-slate-400" aria-hidden />
            <Link href={parentListHref} className="shrink-0 cursor-pointer">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 max-w-none whitespace-nowrap px-2 text-slate-700 font-medium"
              >
                {parentListLabel}
              </Button>
            </Link>
            <ArrowRight className="size-4 shrink-0 text-slate-400" aria-hidden />
            <span className="h-9 inline-flex shrink-0 items-center whitespace-nowrap px-2 font-semibold text-slate-900">
              {product.brand} {product.model}
            </span>
          </nav>
        </div>
      </div>

      <section className="py-12 pb-28 lg:pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="relative">
                <ProductGallery
                  images={product.images?.length ? product.images : [product.image]}
                  alt={product.name}
                />
                {product.badge ? (
                  <Badge className="absolute top-4 left-4 bg-primary text-lg px-4 py-2">
                    {product.badge}
                  </Badge>
                ) : null}
              </div>
            </div>

            <div>
              <Badge className="mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600 border-0 text-white shadow-md">
                {product.type}
              </Badge>
              <h1 className="text-4xl font-bold mb-2 text-slate-900">
                {product.brand} {product.model}
              </h1>
              <div className="mb-6">
                <p className="text-xl text-slate-600">{product.name}</p>
                <p className="text-sm text-slate-600 mt-2">
                  Производител:{" "}
                  <Link
                    href={`/products?brand=${encodeURIComponent(product.brand)}`}
                    className="cursor-pointer font-semibold text-blue-600 hover:underline"
                  >
                    {product.brand}
                  </Link>
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-lg p-6 mb-8 border-2 border-blue-200">
                <p className="text-sm text-slate-600 mb-2">Цена</p>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl font-bold text-blue-600">
                    {formatPriceEur(product.price)}
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="text-2xl font-bold text-red-600">
                    {formatPriceBgnFromEur(product.price)}
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold text-emerald-700">
                  (С включен монтаж)
                </p>
              </div>
              <ProductInquiryButton
                product={{
                  id: product.id,
                  name: product.name,
                  brand: product.brand,
                  model: product.model,
                }}
              />
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6 text-slate-900">Технически характеристики</h2>
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
                {specs.map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-sm text-slate-600 mb-1">{label}</p>
                    <p className="font-semibold text-slate-900">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {product.description ? (
            <div className="mt-12 max-w-4xl">
              <h2 className="text-3xl font-bold mb-6 text-slate-900">Описание</h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base">
                {product.description}
              </p>
            </div>
          ) : null}

          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-slate-900">Подобни продукти</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  href={"/product/" + rp.id}
                  className="block cursor-pointer"
                >
                  <Card className="cursor-pointer hover:shadow-xl transition-shadow bg-white border border-slate-200 text-slate-900 h-full">
                    <CardContent className="p-4">
                      <div className="mb-4 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-white">
                        <ImageWithFallback
                          src={rp.image}
                          alt={rp.name}
                          className="h-full w-full max-h-full max-w-full object-contain"
                        />
                      </div>
                      <h3 className="font-semibold mb-2 text-slate-900">
                        {rp.brand} {rp.model}
                      </h3>
                      <p className="text-sm text-slate-600 mb-2">{rp.name}</p>
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-xl font-bold text-blue-600">{formatPriceEur(rp.price)}</span>
                          <span className="text-slate-400">|</span>
                          <span className="text-base font-semibold text-red-600">{formatPriceBgnFromEur(rp.price)}</span>
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        size="sm"
                      >
                        Виж детайли
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
