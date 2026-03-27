"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { ImageWithFallback } from "@/app/components/ImageWithFallback";
import { Thermometer, Zap, Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Checkbox } from "@/app/components/ui/checkbox";
import { getProducts, type Product } from "@/api";
import {
  EUR_TO_BGN,
  formatPriceBgnFromEur,
  formatPriceEur,
} from "@/lib/currency";

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [selectedEnergyClasses, setSelectedEnergyClasses] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [selectedRefrigerants, setSelectedRefrigerants] = useState<string[]>([]);
  const [selectedPowerRange, setSelectedPowerRange] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [page, setPage] = useState(1);

  const types = ["all", ...Array.from(new Set(products.map((p) => p.type)))];
  const brands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort();
  const energyClasses = Array.from(
    new Set(products.map((p) => p.specifications.energyClass).filter(Boolean)),
  ).sort().reverse();
  const origins = Array.from(
    new Set(products.map((p) => p.specifications.origin).filter(Boolean)),
  ).sort();
  const refrigerants = Array.from(
    new Set(products.map((p) => p.specifications.refrigerant).filter(Boolean)),
  ).sort();
  const powerRanges = [
    { label: "До 12000 BTU", min: 0, max: 12000 },
    { label: "12000 - 18000 BTU", min: 12000, max: 18000 },
    { label: "18000 - 30000 BTU", min: 18000, max: 30000 },
    { label: "Над 30000 BTU", min: 30000, max: 999999 },
  ];

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

  const toggleEnergyClass = (value: string) => {
    setSelectedEnergyClasses((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };
  const toggleOrigin = (value: string) => {
    setSelectedOrigins((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };
  const toggleRefrigerant = (value: string) => {
    setSelectedRefrigerants((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };
  const toggleBrand = (value: string) => {
    setSelectedBrands((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };
  const togglePowerRange = (label: string) => {
    setSelectedPowerRange((prev) =>
      prev.includes(label) ? prev.filter((v) => v !== label) : [...prev, label]
    );
  };
  const clearAllFilters = () => {
    setSelectedEnergyClasses([]);
    setSelectedOrigins([]);
    setSelectedRefrigerants([]);
    setSelectedPowerRange([]);
    setSelectedBrands([]);
    setSelectedType("all");
  };

  const hasActiveFilters =
    selectedEnergyClasses.length > 0 ||
    selectedOrigins.length > 0 ||
    selectedRefrigerants.length > 0 ||
    selectedPowerRange.length > 0 ||
    selectedBrands.length > 0;

  let filteredProducts = products.filter((product) => {
    if (selectedType !== "all" && product.type !== selectedType) return false;
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
    if (selectedEnergyClasses.length > 0 && !selectedEnergyClasses.includes(product.specifications.energyClass)) return false;
    if (selectedOrigins.length > 0 && !selectedOrigins.includes(product.specifications.origin)) return false;
    if (selectedRefrigerants.length > 0 && !selectedRefrigerants.includes(product.specifications.refrigerant)) return false;
    if (selectedPowerRange.length > 0) {
      const powerBTU = parseInt(product.capacity.replace(/\D/g, ""), 10);
      const matchesRange = selectedPowerRange.some((rangeLabel) => {
        const range = powerRanges.find((r) => r.label === rangeLabel);
        return range && powerBTU > range.min && powerBTU <= range.max;
      });
      if (!matchesRange) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "efficiency":
        return b.efficiency.localeCompare(a.efficiency);
      default:
        return 0;
    }
  });

  useEffect(() => {
    setPage(1);
  }, [
    selectedType,
    sortBy,
    selectedEnergyClasses,
    selectedOrigins,
    selectedRefrigerants,
    selectedPowerRange,
    selectedBrands,
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
          {loading ? (
            <div className="min-h-[200px] flex items-center justify-center">
              <p className="text-lg">Зареждане на продуктите...</p>
            </div>
          ) : (
          <div className="flex gap-8">
            <aside className={`${showFilters ? "w-64" : "w-0"} transition-all duration-300 overflow-hidden flex-shrink-0`}>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Филтри</h3>
                  <button type="button" onClick={() => setShowFilters(false)} className="lg:hidden" aria-label="Close filters">
                    <X size={20} />
                  </button>
                </div>
                <div className="min-h-[44px] mb-4 flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    disabled={!hasActiveFilters}
                    className="w-full text-red-600 border-red-600 hover:bg-red-50 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    Изчисти всички филтри
                  </Button>
                </div>
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-sm">Марка</h4>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center gap-2">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                        />
                        <label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-sm">Енергиен клас</h4>
                  <div className="space-y-2">
                    {energyClasses.map((energyClass) => (
                      <div key={energyClass} className="flex items-center gap-2">
                        <Checkbox
                          id={`energy-${energyClass}`}
                          checked={selectedEnergyClasses.includes(energyClass)}
                          onCheckedChange={() => toggleEnergyClass(energyClass)}
                        />
                        <label htmlFor={`energy-${energyClass}`} className="text-sm cursor-pointer">
                          {energyClass}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-sm">Произход</h4>
                  <div className="space-y-2">
                    {origins.map((origin) => (
                      <div key={origin} className="flex items-center gap-2">
                        <Checkbox
                          id={`origin-${origin}`}
                          checked={selectedOrigins.includes(origin)}
                          onCheckedChange={() => toggleOrigin(origin)}
                        />
                        <label htmlFor={`origin-${origin}`} className="text-sm cursor-pointer">
                          {origin}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-sm">Хладилен агент</h4>
                  <div className="space-y-2">
                    {refrigerants.map((refrigerant) => (
                      <div key={refrigerant} className="flex items-center gap-2">
                        <Checkbox
                          id={`refrigerant-${refrigerant}`}
                          checked={selectedRefrigerants.includes(refrigerant)}
                          onCheckedChange={() => toggleRefrigerant(refrigerant)}
                        />
                        <label htmlFor={`refrigerant-${refrigerant}`} className="text-sm cursor-pointer">
                          {refrigerant}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-sm">Мощност</h4>
                  <div className="space-y-2">
                    {powerRanges.map((range) => (
                      <div key={range.label} className="flex items-center gap-2">
                        <Checkbox
                          id={`power-${range.label}`}
                          checked={selectedPowerRange.includes(range.label)}
                          onCheckedChange={() => togglePowerRange(range.label)}
                        />
                        <label htmlFor={`power-${range.label}`} className="text-sm cursor-pointer">
                          {range.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm">
                {!showFilters && (
                  <Button variant="outline" size="sm" onClick={() => setShowFilters(true)} className="lg:hidden">
                    <Filter size={16} className="mr-2" />
                    Покажи филтри
                  </Button>
                )}
                <div className="flex items-center gap-2 flex-1">
                  <Filter size={20} className="text-gray-500" />
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full sm:w-[250px]">
                      <SelectValue placeholder="Филтър по тип" />
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
                      <SelectItem value="efficiency">Енергиен клас</SelectItem>
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
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="block"
                  >
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
                        <p className="text-sm text-gray-600 mb-2">{product.name}</p>
                        <div className="mb-4">
                          <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                            {formatPriceEur(product.price)}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            ≈ {formatPriceBgnFromEur(product.price)} (1 € = {EUR_TO_BGN} лв.)
                          </p>
                        </div>
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-2">
                            <Thermometer size={16} className="text-blue-600" />
                            <span className="text-sm text-foreground">Мощност: {product.capacity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap size={16} className="text-red-600" />
                            <span className="text-sm text-foreground">Клас: {product.efficiency}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">Виж детайли</Button>
                          <Link href="/contact" onClick={(e) => e.stopPropagation()}>
                            <Button className="w-full border-2 border-red-600 text-red-600 bg-white hover:bg-red-50">
                              Свържете се с нас
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {sortedProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Няма намерени продукти с избраните филтри.</p>
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
