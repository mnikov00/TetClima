"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { ImageWithFallback } from "@/app/components/ImageWithFallback";
import { Thermometer, Zap, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Input } from "@/app/components/ui/input";
import { getProducts, type Product } from "@/api";
import { formatPriceBgnFromEur, formatPriceEur } from "@/lib/currency";
import { InquiryModal } from "@/app/components/InquiryModal";

const PAGE_SIZE = 12;

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedRoomSizes, setSelectedRoomSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPriceEur, setMinPriceEur] = useState<string>("");
  const [maxPriceEur, setMaxPriceEur] = useState<string>("");
  const [page, setPage] = useState(1);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);
  const [openSections, setOpenSections] = useState<{
    type: boolean;
    brand: boolean;
    class: boolean;
    room: boolean;
    color: boolean;
    price: boolean;
  }>({
    type: false,
    brand: false,
    class: false,
    room: false,
    color: false,
    price: false,
  });

  const types = ["all", ...Array.from(new Set(products.map((p) => p.type)))];
  const brands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort();
  const classes = Array.from(
    new Set(products.map((p) => p.specifications.class).filter(Boolean)),
  ).sort();
  const roomSizes = Array.from(
    new Set(products.map((p) => String((p.specifications as any).room_size ?? "")).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b, "bg"));
  const colors = Array.from(
    new Set(products.map((p) => p.specifications.color).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b, "bg"));
  const prices = products.map((p) => p.price).filter((n) => Number.isFinite(n));
  const computedMin = prices.length ? Math.min(...prices) : 0;
  const computedMax = prices.length ? Math.max(...prices) : 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const brandFromQuery = useMemo(() => {
    const raw = searchParams.get("brand");
    return raw ? raw.trim() : "";
  }, [searchParams]);

  useEffect(() => {
    if (!brandFromQuery) return;
    setSelectedBrands((prev) => (prev.includes(brandFromQuery) ? prev : [brandFromQuery]));
    setOpenSections((s) => ({ ...s, brand: true }));
  }, [brandFromQuery]);

  const toggleClass = (value: string) => {
    setSelectedClasses((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };
  const toggleRoomSize = (value: string) => {
    setSelectedRoomSizes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };
  const toggleColor = (value: string) => {
    setSelectedColors((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };
  const toggleBrand = (value: string) => {
    setSelectedBrands((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };
  const clearAllFilters = () => {
    setSelectedClasses([]);
    setSelectedRoomSizes([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setSelectedType("all");
    setMinPriceEur("");
    setMaxPriceEur("");
  };

  const hasActiveFilters =
    selectedClasses.length > 0 ||
    selectedRoomSizes.length > 0 ||
    selectedColors.length > 0 ||
    selectedBrands.length > 0 ||
    Boolean(minPriceEur) ||
    Boolean(maxPriceEur);

  let filteredProducts = products.filter((product) => {
    if (selectedType !== "all" && product.type !== selectedType) return false;
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
    if (selectedClasses.length > 0 && !selectedClasses.includes(product.specifications.class)) return false;
    const roomSize = String((product.specifications as any).room_size ?? "");
    if (selectedRoomSizes.length > 0 && !selectedRoomSizes.includes(roomSize)) return false;
    if (selectedColors.length > 0 && !selectedColors.includes(product.specifications.color)) return false;
    const min = minPriceEur ? Number(minPriceEur) : undefined;
    const max = maxPriceEur ? Number(maxPriceEur) : undefined;
    if (min !== undefined && Number.isFinite(min) && product.price < min) return false;
    if (max !== undefined && Number.isFinite(max) && product.price > max) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  useEffect(() => {
    setPage(1);
  }, [
    selectedType,
    sortBy,
    selectedClasses,
    selectedRoomSizes,
    selectedColors,
    selectedBrands,
    minPriceEur,
    maxPriceEur,
  ]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paginatedProducts = sortedProducts.slice(start, start + PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Продукти</h1>
          <p className="text-lg opacity-90">
            Разгледайте нашата пълна гама климатични системи
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {inquiryProduct ? (
            <InquiryModal
              open={Boolean(inquiryProduct)}
              onClose={() => setInquiryProduct(null)}
              product={{
                id: inquiryProduct.id,
                name: inquiryProduct.name,
                brand: inquiryProduct.brand,
                model: inquiryProduct.model,
              }}
            />
          ) : null}

          {loading ? (
            <div className="min-h-[200px] flex items-center justify-center">
              <p className="text-lg">Зареждане на продуктите...</p>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
              <aside className="lg:sticky lg:top-24 self-start">
                <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Филтри</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllFilters}
                      disabled={!hasActiveFilters}
                      className="text-red-600 border-red-600 hover:bg-red-50 disabled:opacity-40 disabled:pointer-events-none"
                    >
                      Изчисти
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="rounded-md border border-slate-200">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between px-3 py-2 text-left"
                        onClick={() => setOpenSections((s) => ({ ...s, type: !s.type }))}
                      >
                        <span className="text-sm font-medium">Тип</span>
                        {openSections.type ? (
                          <ChevronUp className="size-4 text-slate-500" />
                        ) : (
                          <ChevronDown className="size-4 text-slate-500" />
                        )}
                      </button>
                      {openSections.type ? (
                        <div className="px-3 pb-3">
                          <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Избери тип" />
                            </SelectTrigger>
                            <SelectContent>
                              {types.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type === "all" ? "Всички типове" : type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : null}
                    </div>

                    <div className="rounded-md border border-slate-200">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between px-3 py-2 text-left"
                        onClick={() => setOpenSections((s) => ({ ...s, room: !s.room }))}
                      >
                        <span className="text-sm font-medium">За помещения (кв.м.)</span>
                        {openSections.room ? (
                          <ChevronUp className="size-4 text-slate-500" />
                        ) : (
                          <ChevronDown className="size-4 text-slate-500" />
                        )}
                      </button>
                      {openSections.room ? (
                        <div className="px-3 pb-3 space-y-2">
                          {roomSizes.length ? (
                            roomSizes.map((room) => (
                              <div key={room} className="flex items-start gap-2">
                                <Checkbox
                                  id={`room-${room}`}
                                  checked={selectedRoomSizes.includes(room)}
                                  onCheckedChange={() => toggleRoomSize(room)}
                                />
                                <label
                                  htmlFor={`room-${room}`}
                                  className="text-sm leading-5 cursor-pointer select-none"
                                >
                                  {room}
                                </label>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-500">Няма данни.</p>
                          )}
                        </div>
                      ) : null}
                    </div>

                    <div className="rounded-md border border-slate-200">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between px-3 py-2 text-left"
                        onClick={() => setOpenSections((s) => ({ ...s, class: !s.class }))}
                      >
                        <span className="text-sm font-medium">Клас</span>
                        {openSections.class ? (
                          <ChevronUp className="size-4 text-slate-500" />
                        ) : (
                          <ChevronDown className="size-4 text-slate-500" />
                        )}
                      </button>
                      {openSections.class ? (
                        <div className="px-3 pb-3 space-y-2">
                          {classes.length ? (
                            classes.map((c) => (
                              <div key={c} className="flex items-start gap-2">
                                <Checkbox
                                  id={`class-${c}`}
                                  checked={selectedClasses.includes(c)}
                                  onCheckedChange={() => toggleClass(c)}
                                />
                                <label
                                  htmlFor={`class-${c}`}
                                  className="text-sm leading-5 cursor-pointer select-none"
                                >
                                  {c}
                                </label>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-500">Няма данни.</p>
                          )}
                        </div>
                      ) : null}
                    </div>

                    <div className="rounded-md border border-slate-200">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between px-3 py-2 text-left"
                        onClick={() => setOpenSections((s) => ({ ...s, color: !s.color }))}
                      >
                        <span className="text-sm font-medium">Цвят</span>
                        {openSections.color ? (
                          <ChevronUp className="size-4 text-slate-500" />
                        ) : (
                          <ChevronDown className="size-4 text-slate-500" />
                        )}
                      </button>
                      {openSections.color ? (
                        <div className="px-3 pb-3 space-y-2">
                          {colors.length ? (
                            colors.map((color) => (
                              <div key={color} className="flex items-start gap-2">
                                <Checkbox
                                  id={`color-${color}`}
                                  checked={selectedColors.includes(color)}
                                  onCheckedChange={() => toggleColor(color)}
                                />
                                <label
                                  htmlFor={`color-${color}`}
                                  className="text-sm leading-5 cursor-pointer select-none"
                                >
                                  {color}
                                </label>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-500">Няма данни.</p>
                          )}
                        </div>
                      ) : null}
                    </div>

                    <div className="rounded-md border border-slate-200">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between px-3 py-2 text-left"
                        onClick={() => setOpenSections((s) => ({ ...s, price: !s.price }))}
                      >
                        <span className="text-sm font-medium">Цена (EUR)</span>
                        {openSections.price ? (
                          <ChevronUp className="size-4 text-slate-500" />
                        ) : (
                          <ChevronDown className="size-4 text-slate-500" />
                        )}
                      </button>
                      {openSections.price ? (
                        <div className="px-3 pb-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs text-slate-600">От</label>
                              <Input
                                inputMode="decimal"
                                placeholder={computedMin ? String(computedMin) : "0"}
                                value={minPriceEur}
                                onChange={(e) =>
                                  setMinPriceEur(
                                    e.target.value.replace(/[^\d.,]/g, "").replace(",", ".")
                                  )
                                }
                              />
                            </div>
                            <div>
                              <label className="text-xs text-slate-600">До</label>
                              <Input
                                inputMode="decimal"
                                placeholder={computedMax ? String(computedMax) : "0"}
                                value={maxPriceEur}
                                onChange={(e) =>
                                  setMaxPriceEur(
                                    e.target.value.replace(/[^\d.,]/g, "").replace(",", ".")
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="rounded-md border border-slate-200">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between px-3 py-2 text-left"
                        onClick={() => setOpenSections((s) => ({ ...s, brand: !s.brand }))}
                      >
                        <span className="text-sm font-medium">Марка</span>
                        {openSections.brand ? (
                          <ChevronUp className="size-4 text-slate-500" />
                        ) : (
                          <ChevronDown className="size-4 text-slate-500" />
                        )}
                      </button>
                      {openSections.brand ? (
                        <div className="px-3 pb-3 space-y-2 max-h-64 overflow-auto">
                          {brands.map((brand) => (
                            <div key={brand} className="flex items-start gap-2">
                              <Checkbox
                                id={`brand-${brand}`}
                                checked={selectedBrands.includes(brand)}
                                onCheckedChange={() => toggleBrand(brand)}
                              />
                              <label
                                htmlFor={`brand-${brand}`}
                                className="text-sm leading-5 cursor-pointer select-none"
                              >
                                {brand}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </aside>

              <div className="min-w-0">
                <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm text-gray-600">Сортирай по:</span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popular">Най-популярни</SelectItem>
                        <SelectItem value="price-low">Цена: Ниска към висока</SelectItem>
                        <SelectItem value="price-high">Цена: Висока към ниска</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-sm text-gray-600 flex items-center whitespace-nowrap">
                    {sortedProducts.length} продукта
                    {sortedProducts.length > PAGE_SIZE ? (
                      <span className="text-gray-400 ml-2">
                        · стр. {safePage} / {totalPages}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {paginatedProducts.map((product) => (
                    <Link key={product.id} href={`/product/${product.id}`} className="block">
                      <Card className="group hover:shadow-xl transition-all h-full cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:border-blue-300">
                        <CardHeader className="p-0">
                          <div className="relative overflow-hidden">
                            <ImageWithFallback
                              src={product.image}
                              alt={product.name}
                              className="h-48 w-full object-cover"
                            />
                            {product.badge && (
                              <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600 border-0 text-white shadow-md">
                                {product.badge}
                              </Badge>
                            )}
                            <Badge className="absolute top-4 right-4 bg-white text-gray-900">
                              {product.type}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <CardTitle className="mb-2 text-foreground">
                            {product.brand} {product.model}
                          </CardTitle>
                          <div className="mb-4">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-2xl font-bold text-blue-600">
                                {formatPriceEur(product.price)}
                              </span>
                              <span className="text-slate-400">|</span>
                              <span className="text-base font-semibold text-red-600">
                                {formatPriceBgnFromEur(product.price)}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2">
                              <Thermometer size={16} className="text-blue-600" />
                              <span className="text-sm text-foreground">
                                Мощност: {product.capacity}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Zap size={16} className="text-red-600" />
                              <span className="text-sm text-foreground">
                                Клас: {product.efficiency}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                              Виж детайли
                            </Button>
                            <Button
                              type="button"
                              className="w-full border-2 border-red-600 text-red-600 bg-white hover:bg-red-50"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setInquiryProduct(product);
                              }}
                            >
                              Свържете се с нас
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {sortedProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      Няма намерени продукти с избраните филтри.
                    </p>
                    <Button variant="outline" onClick={clearAllFilters} className="mt-4">
                      Изчисти филтрите
                    </Button>
                  </div>
                )}

                {sortedProducts.length > PAGE_SIZE ? (
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={safePage <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Предишна
                    </Button>
                    {totalPages <= 10 ? (
                      Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <Button
                          key={p}
                          variant={p === safePage ? "default" : "outline"}
                          size="sm"
                          className={p === safePage ? "bg-blue-600" : ""}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </Button>
                      ))
                    ) : (
                      <span className="text-sm text-slate-600 px-2">
                        Страница {safePage} от {totalPages}
                      </span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={safePage >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Следваща
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

