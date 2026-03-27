import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { ImageWithFallback } from "@/app/components/ImageWithFallback";
import { ArrowRight, Phone, House } from "lucide-react";
import { getProductById, getProducts } from "@/api";
import {
  EUR_TO_BGN,
  formatPriceBgnFromEur,
  formatPriceEur,
} from "@/lib/currency";

interface ProductPageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function ProductDetail({ params }: ProductPageProps) {
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
    { key: "cooling_energy_class", label: "Енергиен клас охлаждане" },
    { key: "heating_energy_class", label: "Енергиен клас отопление" },
    { key: "power_btu", label: "Мощност (BTU)" },
    { key: "recommended_cooling_volume", label: "Препоръчителен обем (охлаждане) (м³)" },
    { key: "recommended_heating_volume", label: "Препоръчителен обем (отопление) (м³)" },
    { key: "cooling_power", label: "Отдавана мощност (охлаждане) (kW)" },
    { key: "heating_power", label: "Отдавана мощност (отопление) (kW)" },
    { key: "power_consumption_cooling", label: "Консумирана мощност (охлаждане) (kW)" },
    { key: "power_consumption_heating", label: "Консумирана мощност (отопление) (kW)" },
    { key: "power_supply_voltage", label: "Захранващо напрежение (V)" },
    { key: "seer", label: "SEER (сезонна ефективност охлаждане)" },
    { key: "scop", label: "SCOP (сезонна ефективност отопление)" },
    { key: "indoor_noise_level", label: "Ниво на шум (вътрешно тяло) (dB)" },
    { key: "outdoor_noise_level", label: "Ниво на шум (външно тяло) (dB)" },
    { key: "indoor_unit_dimensions", label: "Размери вътрешно тяло (Ш x В x Д) (mm)" },
    { key: "outdoor_unit_dimensions", label: "Размери външно тяло (Ш x В x Д) (mm)" },
    { key: "indoor_unit_weight", label: "Тегло вътрешно тяло (kg)" },
    { key: "outdoor_unit_weight", label: "Тегло външно тяло (kg)" },
    { key: "cooling_operating_range", label: "Работен диапазон охлаждане (°C)" },
    { key: "heating_operating_range", label: "Работен диапазон отопление (°C)" },
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <nav
          aria-label="Навигация"
          className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center gap-x-1 gap-y-1 text-sm"
        >
          <Link href="/" className="inline-flex">
            <Button variant="ghost" size="icon" className="shrink-0 text-slate-600" aria-label="Начало">
              <House className="size-5 text-slate-500" />
            </Button>
          </Link>
          <ArrowRight className="size-4 shrink-0 text-slate-400" aria-hidden />
          <Link href="/products">
            <Button variant="ghost" size="sm" className="h-9 px-2 text-slate-700 font-medium">
              Продукти
            </Button>
          </Link>
          <ArrowRight className="size-4 shrink-0 text-slate-400" aria-hidden />
          <span
            className="h-9 inline-flex items-center max-w-[min(100%,320px)] truncate px-2 font-semibold text-slate-900"
            title={`${product.brand} ${product.model}`}
          >
            {product.brand} {product.model}
          </span>
        </nav>
      </div>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="relative bg-white rounded-lg p-8 shadow-lg">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full object-cover rounded-lg"
                />
                {product.badge && (
                  <Badge className="absolute top-12 left-12 bg-primary text-lg px-4 py-2">
                    {product.badge}
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <Badge className="mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600 border-0 text-white shadow-md">
                {product.type}
              </Badge>
              <h1 className="text-4xl font-bold mb-2 text-slate-900">
                {product.brand} {product.model}
              </h1>
              <p className="text-xl text-slate-600 mb-6">{product.name}</p>
              <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-lg p-6 mb-8 border-2 border-blue-200">
                <p className="text-sm text-slate-600 mb-2">Цена</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                  {formatPriceEur(product.price)}
                </p>
                <p className="text-base text-slate-700 mt-2">
                  ≈ {formatPriceBgnFromEur(product.price)}{" "}
                  <span className="text-sm text-slate-500">(1 € = {EUR_TO_BGN} лв.)</span>
                </p>
              </div>
              <div className="mb-8">
                <Link href="/contact">
                  <Button size="lg" className="w-full text-lg bg-blue-600 hover:bg-blue-700 text-white border-0">
                    <Phone size={20} className="mr-2" />
                    Свържете се с нас за поръчка
                  </Button>
                </Link>
              </div>
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
                <Card
                  key={rp.id}
                  className="hover:shadow-xl transition-shadow bg-white border border-slate-200 text-slate-900"
                >
                  <CardContent className="p-4">
                    <ImageWithFallback src={rp.image} alt={rp.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                    <h3 className="font-semibold mb-2 text-slate-900">
                      {rp.brand} {rp.model}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">{rp.name}</p>
                    <div className="mb-4">
                      <p className="text-xl font-bold text-blue-600">{formatPriceEur(rp.price)}</p>
                      <p className="text-xs text-slate-600">≈ {formatPriceBgnFromEur(rp.price)}</p>
                    </div>
                    <Link href={"/product/" + rp.id}>
                      <Button className="w-full" size="sm">Виж детайли</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
