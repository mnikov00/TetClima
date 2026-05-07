"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { ImageWithFallback } from "@/app/components/ImageWithFallback";
import {
  Thermometer,
  Zap,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Checkbox } from "@/app/components/ui/checkbox";
import { PriceRangeSlider } from "@/app/components/PriceRangeSlider";
import { getProducts, type Product } from "@/api";
import {
  formatPriceBgnFromEur,
  formatPriceEur,
} from "@/lib/currency";
import { InquiryModal } from "@/app/components/InquiryModal";

const PAGE_SIZE = 12;
const MAX_VISIBLE_PAGES = 9;

function getVisiblePages(totalPages: number, currentPage: number): number[] {
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(MAX_VISIBLE_PAGES / 2);
  let start = Math.max(1, currentPage - half);
  let end = start + MAX_VISIBLE_PAGES - 1;

  if (end > totalPages) {
    end = totalPages;
    start = end - MAX_VISIBLE_PAGES + 1;
  }

  const pages: number[] = [];
  for (let p = start; p <= end; p += 1) pages.push(p);
  return pages;
}

function ProductsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refurbishedOnly = searchParams.get("refurbished") === "1";
  const resetFlag = searchParams.get("reset") === "1";
  const didInitFromUrlRef = useRef(false);
  const returnToAfterProduct = useMemo(() => {
    const qs = searchParams.toString();
    return qs ? `/products?${qs}` : "/products";
  }, [searchParams]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedRoomSizes, setSelectedRoomSizes] = useState<string[]>([]);
  const [selectedBtus, setSelectedBtus] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPriceEur, setMinPriceEur] = useState<string>("");
  const [maxPriceEur, setMaxPriceEur] = useState<string>("");
  const [page, setPage] = useState(1);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  /** Draft filters while mobile drawer is open — applied only on „Приложи”. */
  const [draftType, setDraftType] = useState("");
  const [draftClasses, setDraftClasses] = useState<string[]>([]);
  const [draftRoomSizes, setDraftRoomSizes] = useState<string[]>([]);
  const [draftBtus, setDraftBtus] = useState<string[]>([]);
  const [draftColors, setDraftColors] = useState<string[]>([]);
  const [draftBrands, setDraftBrands] = useState<string[]>([]);
  const [draftMinPriceEur, setDraftMinPriceEur] = useState("");
  const [draftMaxPriceEur, setDraftMaxPriceEur] = useState("");
  const [openSections, setOpenSections] = useState<{
    type: boolean;
    brand: boolean;
    class: boolean;
    room: boolean;
    btu: boolean;
    color: boolean;
    price: boolean;
  }>({
    type: true,
    brand: true,
    class: false,
    room: true,
    btu: true,
    color: false,
    price: true,
  });

  const filterBase = refurbishedOnly
    ? products.filter((p) => Boolean(p.isRefurbished))
    : products.filter((p) => !p.isRefurbished);

  const types = Array.from(new Set(filterBase.map((p) => p.type))).filter(Boolean);
  const brands = Array.from(new Set(filterBase.map((p) => p.brand).filter(Boolean))).sort();
  const classes = Array.from(
    new Set(filterBase.map((p) => p.specifications.class).filter(Boolean)),
  ).sort();
  const roomSizes = Array.from(
    new Set(filterBase.map((p) => String((p.specifications as any).room_size ?? "")).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b, "bg"));
  const btus = Array.from(
    new Set(
      filterBase
        .map((p) => {
          const raw =
            (p.specifications as any).power_btu ??
            (p.specifications as any).power ??
            p.capacity ??
            "";
          const digits = String(raw).replace(/[^\d]/g, "");
          return digits ? digits : "";
        })
        .filter(Boolean),
    ),
  ).sort((a, b) => Number(a) - Number(b));
  const colors = Array.from(
    new Set(filterBase.map((p) => p.specifications.color).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b, "bg"));
  const prices = filterBase.map((p) => p.price).filter((n) => Number.isFinite(n));
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

  const getListParam = (key: string) => {
    const many = searchParams.getAll(key).map((v) => v.trim()).filter(Boolean);
    if (many.length) return many;
    const single = (searchParams.get(key) ?? "").trim();
    if (!single) return [];
    return single
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  };

  useEffect(() => {
    // Init/restore state from URL (back/refresh).
    // This is what makes filters + page "stick".
    const urlType = (searchParams.get("type") ?? "").trim();
    const urlSort = (searchParams.get("sort") ?? "").trim();
    const urlPageRaw = (searchParams.get("page") ?? "").trim();
    const urlPage = Math.max(1, Number.parseInt(urlPageRaw || "1", 10) || 1);

    const urlBrands = getListParam("brand");
    const urlClasses = getListParam("class");
    const urlRooms = getListParam("room");
    const urlBtus = getListParam("btu");
    const urlColors = getListParam("color");

    const urlMin = (searchParams.get("min") ?? "").trim();
    const urlMax = (searchParams.get("max") ?? "").trim();

    setSelectedType(urlType);
    setSelectedBrands(urlBrands);
    setSelectedClasses(urlClasses);
    setSelectedRoomSizes(urlRooms);
    setSelectedBtus(urlBtus);
    setSelectedColors(urlColors);
    setMinPriceEur(urlMin);
    setMaxPriceEur(urlMax);
    setPage(urlPage);

    if (urlSort) setSortBy(urlSort);

    if (!didInitFromUrlRef.current) {
      didInitFromUrlRef.current = true;
      setOpenSections((s) => ({
        ...s,
        type: Boolean(urlType) || s.type,
        brand: urlBrands.length > 0 || s.brand,
        class: urlClasses.length > 0 || s.class,
        room: urlRooms.length > 0 || s.room,
        btu: urlBtus.length > 0 || s.btu,
        color: urlColors.length > 0 || s.color,
        price: Boolean(urlMin || urlMax) || s.price,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const toggleClass = (value: string) => {
    setSelectedClasses((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
    setPage(1);
  };
  const toggleRoomSize = (value: string) => {
    setSelectedRoomSizes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
    setPage(1);
  };
  const toggleBtu = (value: string) => {
    setSelectedBtus((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
    setPage(1);
  };
  const toggleColor = (value: string) => {
    setSelectedColors((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
    setPage(1);
  };
  const toggleBrand = (value: string) => {
    setSelectedBrands((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
    setPage(1);
  };

  const toggleDraftClass = (value: string) => {
    setDraftClasses((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };
  const toggleDraftRoomSize = (value: string) => {
    setDraftRoomSizes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };
  const toggleDraftBtu = (value: string) => {
    setDraftBtus((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };
  const toggleDraftColor = (value: string) => {
    setDraftColors((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };
  const toggleDraftBrand = (value: string) => {
    setDraftBrands((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const setSelectedTypeWithReset: Dispatch<SetStateAction<string>> = (next) => {
    setSelectedType((prev) =>
      typeof next === "function" ? (next as (p: string) => string)(prev) : next,
    );
    setPage(1);
  };

  const clearAllFilters = () => {
    setSelectedClasses([]);
    setSelectedRoomSizes([]);
    setSelectedBtus([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setSelectedType("");
    setMinPriceEur("");
    setMaxPriceEur("");
    setPage(1);
  };

  const clearDraftFilters = () => {
    setDraftClasses([]);
    setDraftRoomSizes([]);
    setDraftBtus([]);
    setDraftColors([]);
    setDraftBrands([]);
    setDraftType("");
    setDraftMinPriceEur("");
    setDraftMaxPriceEur("");
  };

  const arraysEqualSorted = (a: string[], b: string[]) =>
    a.length === b.length &&
    [...a].sort((x, y) => x.localeCompare(y, "bg")).join("\u0001") ===
      [...b].sort((x, y) => x.localeCompare(y, "bg")).join("\u0001");

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    setDraftType(selectedType);
    setDraftClasses([...selectedClasses]);
    setDraftRoomSizes([...selectedRoomSizes]);
    setDraftBtus([...selectedBtus]);
    setDraftColors([...selectedColors]);
    setDraftBrands([...selectedBrands]);
    setDraftMinPriceEur(minPriceEur);
    setDraftMaxPriceEur(maxPriceEur);
  }, [
    mobileFiltersOpen,
    selectedType,
    selectedClasses,
    selectedRoomSizes,
    selectedBtus,
    selectedColors,
    selectedBrands,
    minPriceEur,
    maxPriceEur,
  ]);

  const mobileDraftDirty =
    draftType !== selectedType ||
    !arraysEqualSorted(draftClasses, selectedClasses) ||
    !arraysEqualSorted(draftRoomSizes, selectedRoomSizes) ||
    !arraysEqualSorted(draftBtus, selectedBtus) ||
    !arraysEqualSorted(draftColors, selectedColors) ||
    !arraysEqualSorted(draftBrands, selectedBrands) ||
    draftMinPriceEur !== minPriceEur ||
    draftMaxPriceEur !== maxPriceEur;

  const applyMobileFilters = () => {
    setSelectedType(draftType);
    setSelectedClasses([...draftClasses]);
    setSelectedRoomSizes([...draftRoomSizes]);
    setSelectedBtus([...draftBtus]);
    setSelectedColors([...draftColors]);
    setSelectedBrands([...draftBrands]);
    setMinPriceEur(draftMinPriceEur);
    setMaxPriceEur(draftMaxPriceEur);
    setPage(1);
    setMobileFiltersOpen(false);
  };

  useEffect(() => {
    if (!resetFlag) return;
    clearAllFilters();
    // Remove reset param after clearing.
    router.replace("/products", { scroll: false });
  }, [resetFlag, router]);

  const hasActiveFilters =
    selectedClasses.length > 0 ||
    selectedRoomSizes.length > 0 ||
    selectedBtus.length > 0 ||
    selectedColors.length > 0 ||
    selectedBrands.length > 0 ||
    Boolean(minPriceEur) ||
    Boolean(maxPriceEur);

  let filteredProducts = products.filter((product) => {
    if (refurbishedOnly && !product.isRefurbished) return false;
    if (!refurbishedOnly && product.isRefurbished) return false;
    if (selectedType && product.type !== selectedType) return false;
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
    if (selectedClasses.length > 0 && !selectedClasses.includes(product.specifications.class)) return false;
    const roomSize = String((product.specifications as any).room_size ?? "");
    if (selectedRoomSizes.length > 0 && !selectedRoomSizes.includes(roomSize)) return false;
    const btuRaw =
      (product.specifications as any).power_btu ??
      (product.specifications as any).power ??
      product.capacity ??
      "";
    const btuDigits = String(btuRaw).replace(/[^\d]/g, "");
    if (selectedBtus.length > 0 && !selectedBtus.includes(btuDigits)) return false;
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

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));

  useEffect(() => {
    // Don't clamp while data is still loading, otherwise returning to ?page=2
    // gets forced back to page 1 because totalPages is temporarily 1 (0 products).
    if (loading) return;
    if (products.length === 0) return;
    setPage((p) => Math.min(p, totalPages));
  }, [loading, products.length, totalPages]);

  const normalizeParams = (sp: URLSearchParams) =>
    Array.from(sp.entries())
      .sort(([ak, av], [bk, bv]) => (ak === bk ? av.localeCompare(bv) : ak.localeCompare(bk)))
      .map(([k, v]) => `${k}=${v}`)
      .join("&");

  const buildAppliedQuery = () => {
    const sp = new URLSearchParams();
    if (refurbishedOnly) sp.set("refurbished", "1");
    if (selectedType) sp.set("type", selectedType);
    for (const b of selectedBrands) sp.append("brand", b);
    for (const c of selectedClasses) sp.append("class", c);
    for (const r of selectedRoomSizes) sp.append("room", r);
    for (const btu of selectedBtus) sp.append("btu", btu);
    for (const c of selectedColors) sp.append("color", c);
    if (minPriceEur) sp.set("min", minPriceEur);
    if (maxPriceEur) sp.set("max", maxPriceEur);
    if (sortBy && sortBy !== "popular") sp.set("sort", sortBy);
    if (page > 1) sp.set("page", String(page));
    return sp;
  };

  useEffect(() => {
    // Keep applied filters + page in URL so back/refresh restores state.
    // Navbar reset still works via ?reset=1, so we ignore syncing while reset is present.
    if (loading) return;
    if (products.length === 0) return;
    if (resetFlag) return;
    if (!didInitFromUrlRef.current) return;

    const desired = buildAppliedQuery();
    const current = new URLSearchParams(searchParams.toString());
    current.delete("reset");

    const desiredNorm = normalizeParams(desired);
    const currentNorm = normalizeParams(current);
    if (desiredNorm === currentNorm) return;

    const qs = desired.toString();
    router.replace(qs ? `/products?${qs}` : "/products", { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedType,
    selectedBrands,
    selectedClasses,
    selectedRoomSizes,
    selectedBtus,
    selectedColors,
    minPriceEur,
    maxPriceEur,
    sortBy,
    page,
    refurbishedOnly,
    loading,
    products.length,
    resetFlag,
  ]);

  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paginatedProducts = sortedProducts.slice(start, start + PAGE_SIZE);
  const visiblePages = useMemo(
    () => getVisiblePages(totalPages, safePage),
    [totalPages, safePage],
  );

  const goToPage = (nextPage: number) => {
    const p = Math.max(1, Math.min(totalPages, nextPage));
    setPage(p);
    // URL syncing uses router.replace(..., { scroll: false }) to preserve filter UX,
    // so we manually scroll on pagination changes.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  const hasAnyFiltersApplied = hasActiveFilters || Boolean(selectedType);

  const hasDraftFilters =
    Boolean(draftType) ||
    draftClasses.length > 0 ||
    draftRoomSizes.length > 0 ||
    draftBtus.length > 0 ||
    draftColors.length > 0 ||
    draftBrands.length > 0 ||
    Boolean(draftMinPriceEur) ||
    Boolean(draftMaxPriceEur);

  type FiltersPanelConfig = {
    idPrefix: string;
    showTitleRow: boolean;
    scrollable: boolean;
    selectedType: string;
    setSelectedType: Dispatch<SetStateAction<string>>;
    selectedClasses: string[];
    toggleClassFn: (v: string) => void;
    selectedRoomSizes: string[];
    toggleRoomSizeFn: (v: string) => void;
    selectedBtus: string[];
    toggleBtuFn: (v: string) => void;
    selectedBrands: string[];
    toggleBrandFn: (v: string) => void;
    selectedColors: string[];
    toggleColorFn: (v: string) => void;
    minPrice: string;
    setMinPrice: (value: string) => void;
    maxPrice: string;
    setMaxPrice: (value: string) => void;
    hasFiltersForClear: boolean;
    onClearAll: () => void;
  };

  const renderFiltersPanel = (cfg: FiltersPanelConfig) => (
    <div
      className={[
        "bg-white rounded-lg shadow-sm overflow-hidden",
        cfg.scrollable ? "h-full flex flex-col" : "",
      ].join(" ")}
    >
      <div className="shrink-0 bg-white p-4 lg:p-6">
        {cfg.showTitleRow ? (
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Филтри</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={cfg.onClearAll}
              tabIndex={cfg.hasFiltersForClear ? 0 : -1}
              aria-hidden={!cfg.hasFiltersForClear}
              className={[
                "text-red-600 border-red-600 hover:bg-red-50 transition-opacity",
                cfg.hasFiltersForClear ? "opacity-100" : "opacity-0 pointer-events-none",
              ].join(" ")}
            >
              Изчисти
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={cfg.onClearAll}
              tabIndex={cfg.hasFiltersForClear ? 0 : -1}
              aria-hidden={!cfg.hasFiltersForClear}
              className={[
                "text-red-600 border-red-600 hover:bg-red-50 transition-opacity",
                cfg.hasFiltersForClear ? "opacity-100" : "opacity-0 pointer-events-none",
              ].join(" ")}
            >
              Изчисти
            </Button>
          </div>
        )}
      </div>

      {(() => {
        const listBox = (len: number) =>
          len >= 5 ? "max-h-40 overflow-auto pr-1" : "";
        const scrollId = `${cfg.idPrefix}-filters-scroll`;

        return (
      <div
        className={[
          "space-y-2 px-4 lg:px-6 pb-8",
          cfg.scrollable ? "min-h-0 flex-1 overflow-y-auto overscroll-contain" : "",
        ].join(" ")}
        id={scrollId}
        // Keep page scroll and filter scroll independent.
        // When the pointer is over the filter panel, wheel events should not scroll the page.
        onWheel={(e) => {
          if (!cfg.scrollable) return;
          e.stopPropagation();
        }}
      >
        {/* Keep a constant top inset while scrolling (so content doesn't touch/cut under the header). */}
        <div className="sticky top-0 z-10 h-4 bg-white" aria-hidden />
        <div className="rounded-md border-0">
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left"
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
            <div
              className={["px-3 pb-3 space-y-2", listBox(types.length)].join(" ")}
            >
              {types.length ? (
                types.map((t) => (
                  <div key={t} className="flex items-start gap-2">
                    <Checkbox
                      id={`${cfg.idPrefix}-type-${t}`}
                      checked={cfg.selectedType === t}
                      onCheckedChange={() =>
                        cfg.setSelectedType((prev) => (prev === t ? "" : t))
                      }
                    />
                    <label
                      htmlFor={`${cfg.idPrefix}-type-${t}`}
                      className="text-sm leading-5 cursor-pointer select-none"
                    >
                      {t}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">Няма данни.</p>
              )}
            </div>
          ) : null}
        </div>

        <div className="rounded-md border-0">
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left"
            onClick={() => setOpenSections((s) => ({ ...s, brand: !s.brand }))}
          >
            <span className="text-sm font-medium">Производител</span>
            {openSections.brand ? (
              <ChevronUp className="size-4 text-slate-500" />
            ) : (
              <ChevronDown className="size-4 text-slate-500" />
            )}
          </button>
          {openSections.brand ? (
            <div
              className={["px-3 pb-3 space-y-2", listBox(brands.length)].join(" ")}
            >
              {brands.map((brand) => (
                <div key={brand} className="flex items-start gap-2">
                  <Checkbox
                    id={`${cfg.idPrefix}-brand-${brand}`}
                    checked={cfg.selectedBrands.includes(brand)}
                    onCheckedChange={() => cfg.toggleBrandFn(brand)}
                  />
                  <label
                    htmlFor={`${cfg.idPrefix}-brand-${brand}`}
                    className="text-sm leading-5 cursor-pointer select-none"
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-md border-0">
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left"
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
            <div
              className={["px-3 pb-3 space-y-2", listBox(roomSizes.length)].join(" ")}
            >
              {roomSizes.length ? (
                roomSizes.map((room) => (
                  <div key={room} className="flex items-start gap-2">
                    <Checkbox
                      id={`${cfg.idPrefix}-room-${room}`}
                      checked={cfg.selectedRoomSizes.includes(room)}
                      onCheckedChange={() => cfg.toggleRoomSizeFn(room)}
                    />
                    <label
                      htmlFor={`${cfg.idPrefix}-room-${room}`}
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

        <div className="rounded-md border-0">
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left"
            onClick={() => setOpenSections((s) => ({ ...s, btu: !s.btu }))}
          >
            <span className="text-sm font-medium">BTU</span>
            {openSections.btu ? (
              <ChevronUp className="size-4 text-slate-500" />
            ) : (
              <ChevronDown className="size-4 text-slate-500" />
            )}
          </button>
          {openSections.btu ? (
            <div
              className={["px-3 pb-3 space-y-2", listBox(btus.length)].join(" ")}
            >
              {btus.length ? (
                btus.map((btu) => (
                  <div key={btu} className="flex items-start gap-2">
                    <Checkbox
                      id={`${cfg.idPrefix}-btu-${btu}`}
                      checked={cfg.selectedBtus.includes(btu)}
                      onCheckedChange={() => cfg.toggleBtuFn(btu)}
                    />
                    <label
                      htmlFor={`${cfg.idPrefix}-btu-${btu}`}
                      className="text-sm leading-5 cursor-pointer select-none"
                    >
                      {btu}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">Няма данни.</p>
              )}
            </div>
          ) : null}
        </div>

        <div className="rounded-md border-0">
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left"
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
            <div
              className={["px-3 pb-3 space-y-2", listBox(classes.length)].join(" ")}
            >
              {classes.length ? (
                classes.map((c) => (
                  <div key={c} className="flex items-start gap-2">
                    <Checkbox
                      id={`${cfg.idPrefix}-class-${c}`}
                      checked={cfg.selectedClasses.includes(c)}
                      onCheckedChange={() => cfg.toggleClassFn(c)}
                    />
                    <label
                      htmlFor={`${cfg.idPrefix}-class-${c}`}
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

        <div className="rounded-md border-0">
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left"
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
            <div
              className={["px-3 pb-3 space-y-2", listBox(colors.length)].join(" ")}
            >
              {colors.length ? (
                colors.map((color) => (
                  <div key={color} className="flex items-start gap-2">
                    <Checkbox
                      id={`${cfg.idPrefix}-color-${color}`}
                      checked={cfg.selectedColors.includes(color)}
                      onCheckedChange={() => cfg.toggleColorFn(color)}
                    />
                    <label
                      htmlFor={`${cfg.idPrefix}-color-${color}`}
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

        <div className="rounded-md border-0">
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left"
            onClick={() => setOpenSections((s) => ({ ...s, price: !s.price }))}
          >
            <span className="text-sm font-medium">Цена</span>
            {openSections.price ? (
              <ChevronUp className="size-4 text-slate-500" />
            ) : (
              <ChevronDown className="size-4 text-slate-500" />
            )}
          </button>
          {openSections.price ? (
            <div className="px-3 pb-3">
              <PriceRangeSlider
                idPrefix={`${cfg.idPrefix}-eur`}
                minBound={computedMin}
                maxBound={computedMax}
                minPrice={cfg.minPrice}
                maxPrice={cfg.maxPrice}
                onChangeMin={cfg.setMinPrice}
                onChangeMax={cfg.setMaxPrice}
              />
            </div>
          ) : null}
        </div>
    </div>
    );
      })()}
    </div>
  );

  const desktopFiltersPanel = renderFiltersPanel({
    idPrefix: "desk",
    showTitleRow: true,
    scrollable: true,
    selectedType,
    setSelectedType: setSelectedTypeWithReset,
    selectedClasses,
    toggleClassFn: toggleClass,
    selectedRoomSizes,
    toggleRoomSizeFn: toggleRoomSize,
    selectedBtus,
    toggleBtuFn: toggleBtu,
    selectedBrands,
    toggleBrandFn: toggleBrand,
    selectedColors,
    toggleColorFn: toggleColor,
    minPrice: minPriceEur,
    setMinPrice: (v) => {
      setMinPriceEur(v);
      setPage(1);
    },
    maxPrice: maxPriceEur,
    setMaxPrice: (v) => {
      setMaxPriceEur(v);
      setPage(1);
    },
    hasFiltersForClear: hasAnyFiltersApplied,
    onClearAll: clearAllFilters,
  });

  const mobileFiltersPanel = renderFiltersPanel({
    idPrefix: "mob",
    showTitleRow: false,
    scrollable: false,
    selectedType: draftType,
    setSelectedType: setDraftType,
    selectedClasses: draftClasses,
    toggleClassFn: toggleDraftClass,
    selectedRoomSizes: draftRoomSizes,
    toggleRoomSizeFn: toggleDraftRoomSize,
    selectedBtus: draftBtus,
    toggleBtuFn: toggleDraftBtu,
    selectedBrands: draftBrands,
    toggleBrandFn: toggleDraftBrand,
    selectedColors: draftColors,
    toggleColorFn: toggleDraftColor,
    minPrice: draftMinPriceEur,
    setMinPrice: setDraftMinPriceEur,
    maxPrice: draftMaxPriceEur,
    setMaxPrice: setDraftMaxPriceEur,
    hasFiltersForClear: hasDraftFilters,
    onClearAll: clearDraftFilters,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className={[
          "text-white py-12",
          refurbishedOnly
            ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600"
            : "bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">
            {refurbishedOnly ? "Рециклирани климатици" : "Климатици"}
          </h1>
          <p className="text-lg opacity-90">
            {refurbishedOnly
              ? "Подбрани рециклирани климатици с гаранция и проверка"
              : "Разгледайте нашата пълна гама климатични системи"}
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
            {/* Mobile filters slide-over */}
            {mobileFiltersOpen ? (
              <div className="fixed inset-0 z-[150] lg:hidden">
                <button
                  type="button"
                  className="absolute inset-0 cursor-pointer bg-black/50"
                  aria-label="Затвори филтрите"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <div className="absolute right-0 top-0 flex h-full w-[min(100%,360px)] flex-col bg-white shadow-2xl">
                  <div className="flex shrink-0 items-center justify-between border-b border-white/20 bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600 px-4 py-3">
                    <p className="text-lg font-bold text-white">Филтри</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Затвори"
                      className="text-white hover:bg-white/10 hover:text-white"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <X className="size-5" />
                    </Button>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
                    {mobileFiltersPanel}
                  </div>
                  <div className="shrink-0 border-t border-slate-100 bg-white p-4">
                    <Button
                      type="button"
                      disabled={!mobileDraftDirty}
                      className="w-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 disabled:pointer-events-none"
                      onClick={applyMobileFilters}
                    >
                      Приложи
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}

            <aside className="lg:sticky lg:top-28 self-start hidden lg:block h-[calc(100vh-7rem)]">
              {desktopFiltersPanel}
            </aside>

            <div className="min-w-0">
              <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between gap-3 sm:hidden">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setMobileFiltersOpen(true)}
                  >
                    <Filter className="size-4 mr-2" />
                    Филтри
                  </Button>
                  <div className="text-sm text-gray-600 whitespace-nowrap">
                    {sortedProducts.length} продукта
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm text-gray-600">Сортирай по:</span>
                  <Select
                    value={sortBy}
                    onValueChange={(v) => {
                      setSortBy(v);
                      setPage(1);
                    }}
                  >
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
                <div className="text-sm text-gray-600 items-center whitespace-nowrap hidden sm:flex">
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
                    href={`/product/${product.id}?from=${encodeURIComponent(returnToAfterProduct)}`}
                    className="block h-full min-w-0 cursor-pointer"
                  >
                    <Card className="group hover:shadow-xl transition-all h-full min-h-0 cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:border-blue-300">
                      <CardHeader className="shrink-0 p-0">
                        <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-white">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full max-h-full max-w-full object-contain"
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
                      <CardContent className="flex flex-1 flex-col min-h-0 min-w-0 p-6">
                        <CardTitle className="mb-2 min-w-0 shrink-0 truncate text-foreground">
                          {product.brand} {product.model}
                        </CardTitle>
                        <div className="mb-4 shrink-0">
                          <p className="line-clamp-2 break-words text-left leading-snug">
                            <span className="text-2xl font-bold text-blue-600">
                              {formatPriceEur(product.price)}
                            </span>
                            <span className="text-slate-400"> | </span>
                            <span className="text-base font-semibold text-red-600">
                              {formatPriceBgnFromEur(product.price)}
                            </span>
                          </p>
                        </div>
                        <div className="mb-0 min-h-0 flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <Thermometer size={16} className="shrink-0 text-blue-600" />
                            <span className="text-sm text-foreground">Мощност: {product.capacity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap size={16} className="shrink-0 text-red-600" />
                            <span className="text-sm text-foreground">Клас: {product.efficiency}</span>
                          </div>
                        </div>
                        <div className="mt-auto flex shrink-0 flex-col gap-2 pt-2">
                          <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">Виж детайли</Button>
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
                    onClick={() => goToPage(1)}
                    aria-label="Първа страница"
                    title="Първа страница"
                  >
                    <ChevronsLeft className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage <= 1}
                    onClick={() => goToPage(safePage - 1)}
                    aria-label="Предишна страница"
                    title="Предишна страница"
                  >
                    <ChevronLeft className="size-4 sm:hidden" />
                    <span className="hidden sm:inline">Предишна</span>
                  </Button>
                  {visiblePages[0] > 1 ? (
                    <span className="px-1 text-sm text-slate-500">…</span>
                  ) : null}
                  {visiblePages.map((p) => (
                    <Button
                      key={p}
                      variant={p === safePage ? "default" : "outline"}
                      size="sm"
                      className={p === safePage ? "bg-blue-600" : ""}
                      onClick={() => goToPage(p)}
                    >
                      {p}
                    </Button>
                  ))}
                  {visiblePages[visiblePages.length - 1] < totalPages ? (
                    <span className="px-1 text-sm text-slate-500">…</span>
                  ) : null}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage >= totalPages}
                    onClick={() => goToPage(safePage + 1)}
                    aria-label="Следваща страница"
                    title="Следваща страница"
                  >
                    <ChevronRight className="size-4 sm:hidden" />
                    <span className="hidden sm:inline">Следваща</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage >= totalPages}
                    onClick={() => goToPage(totalPages)}
                    aria-label="Последна страница"
                    title="Последна страница"
                  >
                    <ChevronsRight className="size-4" />
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

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsPageInner />
    </Suspense>
  );
}
