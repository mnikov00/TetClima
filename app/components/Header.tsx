"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Menu, Phone, Mail, Snowflake, Flame, X, ChevronDown } from "lucide-react";
import { cn } from "./ui/utils";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  { href: "/", label: "Начало", hover: "hover:text-blue-600" },
  { href: "/products", label: "Климатици", hover: "hover:text-blue-600" },
  { href: "/services", label: "Услуги", hover: "hover:text-blue-600" },
  { href: "/about", label: "За нас", hover: "hover:text-red-600" },
  { href: "/contact", label: "Контакти", hover: "hover:text-red-600" },
] as const;

const servicesLinks = [
  { href: "/services/installation", label: "Монтаж на климатици" },
  { href: "/services/maintenance", label: "Профилактика на климатици" },
  { href: "/services/repair", label: "Сервиз и ремонт на климатици" },
  { href: "/services/inspection", label: "Оглед за климатици" },
] as const;

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const closeTimerRef = useRef<number | null>(null);

  const strapiUrl = useMemo(
    () => (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337").replace(/\/$/, ""),
    [],
  );

  useEffect(() => {
    // Load types that actually exist in Strapi (unique product.type)
    const loadTypes = async () => {
      try {
        const res = await fetch(
          // Only show types for NORMAL products:
          // isRefurbished is either false or null/empty.
          `${strapiUrl}/api/products?fields[0]=type&filters[$or][0][isRefurbished][$eq]=false&filters[$or][1][isRefurbished][$null]=true&pagination[pageSize]=1000`,
          { cache: "no-store" },
        );
        if (!res.ok) return;
        const json = await res.json();
        const data = Array.isArray(json?.data) ? json.data : [];
        const types = Array.from(
          new Set<string>(
            data
              .map((it: any) =>
                String(it?.type ?? it?.attributes?.type ?? "").trim(),
              )
              .filter((v: string) => Boolean(v)),
          ),
        ).sort((a: string, b: string) => a.localeCompare(b, "bg"));
        setProductTypes(types);
      } catch {
        // ignore
      }
    };
    loadTypes();
  }, [strapiUrl]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      setMobileProductsOpen(false);
      setMobileServicesOpen(false);
    }
  }, [mobileOpen]);

  const openProducts = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setProductsOpen(true);
  };

  const scheduleCloseProducts = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => setProductsOpen(false), 120);
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="hidden md:flex justify-between items-center px-6 py-2 bg-gradient-to-r from-indigo-800 via-purple-700 to-red-600 text-white text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+359876083921" className="flex items-center gap-2 hover:underline">
              <Phone size={14} />
              <span>+359 876 083 921</span>
            </a>
            <a href="mailto:tetclima3@gmail.com" className="flex items-center gap-2 hover:underline">
              <Mail size={14} />
              <span>tetclima3@gmail.com</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Snowflake size={14} />
            <span>Безплатна консултация</span>
            <Flame size={14} />
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
              <Image
                src="/logo.png"
                alt="Logo"
                width={50}
                height={50}
              />
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  TETCLIMA
                </p>
                <p className="text-xs text-slate-500 border-t">климатични решения</p>
              </div>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-8" aria-label="Основна навигация">
            {navLinks.map(({ href, label, hover }) => {
              if (href === "/products") {
                return (
                  <div
                    key={href}
                    className="relative"
                    onMouseEnter={openProducts}
                    onMouseLeave={scheduleCloseProducts}
                  >
                    <Link
                      href="/products"
                      className={cn("inline-flex items-center gap-1 text-slate-800 transition-colors font-medium", hover)}
                      aria-haspopup="menu"
                      aria-expanded={productsOpen}
                      onClick={(e) => {
                        // If we are already on /products, force-reset filters by navigating through a reset flag.
                        // This avoids staying on the same client state.
                        e.preventDefault();
                        setProductsOpen(false);
                        const target =
                          pathname === "/products" ? "/products?reset=1" : "/products";
                        router.push(target);
                      }}
                    >
                      Климатици
                      <ChevronDown className={cn("size-4 text-slate-500 transition-transform", productsOpen && "rotate-180")} />
                    </Link>
                    {productsOpen ? (
                      <div
                        role="menu"
                        // Use padding-top instead of margin-top so there's no hover gap (prevents disappearing).
                        className="absolute left-0 top-full pt-2 w-max max-w-[min(320px,calc(100vw-2rem))]"
                        onMouseEnter={openProducts}
                        onMouseLeave={scheduleCloseProducts}
                      >
                        <div className="rounded-lg border border-slate-200 bg-white shadow-lg p-1.5">
                          {productTypes.length ? (
                            productTypes.map((t) => (
                              <Link
                                key={t}
                                href={`/products?type=${encodeURIComponent(t)}`}
                                role="menuitem"
                                className="block rounded-md px-3 py-2 text-sm text-slate-800 whitespace-nowrap hover:bg-slate-50"
                                onClick={() => setProductsOpen(false)}
                              >
                                {t}
                              </Link>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-slate-500 whitespace-nowrap">
                              Няма добавени типове.
                            </div>
                          )}
                          <div className="my-1.5 border-t border-slate-100" />
                          <Link
                            href="/refurbished"
                            role="menuitem"
                            className="block rounded-md px-3 py-2 text-sm font-semibold text-slate-900 whitespace-nowrap hover:bg-slate-50"
                            onClick={() => setProductsOpen(false)}
                          >
                            Рециклирани
                          </Link>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              }

              if (href !== "/services") {
                return (
                  <Link key={href} href={href} className={cn("text-slate-800 transition-colors font-medium", hover)}>
                    {label}
                  </Link>
                );
              }

              return (
                <div
                  key={href}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <Link
                    href="/services"
                    className={cn(
                      "inline-flex items-center gap-1 text-slate-800 transition-colors font-medium",
                      hover,
                    )}
                    aria-haspopup="menu"
                    aria-expanded={servicesOpen}
                    onClick={() => setServicesOpen(false)}
                  >
                    Услуги
                    <ChevronDown
                      className={cn(
                        "size-4 text-slate-500 transition-transform",
                        servicesOpen && "rotate-180",
                      )}
                    />
                  </Link>
                  {servicesOpen ? (
                    <div
                      role="menu"
                      className="absolute left-0 top-full pt-2 w-max max-w-[min(320px,calc(100vw-2rem))]"
                    >
                      <div className="rounded-lg border border-slate-200 bg-white shadow-lg p-1.5">
                        {servicesLinks.map((l) => (
                          <Link
                            key={l.href}
                            href={l.href}
                            role="menuitem"
                            className="block rounded-md px-3 py-2 text-sm text-slate-800 whitespace-nowrap hover:bg-slate-50"
                            onClick={() => setServicesOpen(false)}
                          >
                            {l.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/contact" className="hidden md:block">
              <Button className="hover:cursor-pointer bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white border-0">
                Свържете се
              </Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label={mobileOpen ? "Затвори менюто" : "Отвори менюто"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile slide-over (lg+ uses horizontal nav) */}
      <div
        className={cn(
          "fixed inset-0 z-100 lg:hidden",
          !mobileOpen && "pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-black/50 backdrop-blur-[1px] transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          aria-label="Затвори менюто"
          tabIndex={mobileOpen ? 0 : -1}
          onClick={() => setMobileOpen(false)}
        />
        <div
          id="mobile-navigation"
          className={cn(
            "absolute top-0 right-0 flex h-full w-[min(100%,320px)] max-w-[90vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-white/20 px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600">
            <span className="text-base font-bold text-white">Меню</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              aria-label="Затвори"
              onClick={() => setMobileOpen(false)}
            >
              <X size={22} className="text-white" />
            </Button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Мобилна навигация">
            {/* Начало */}
            <Link
              href="/"
              className="rounded-lg px-4 py-3 text-lg font-medium text-slate-800 transition-colors hover:text-blue-600 active:bg-slate-100"
              onClick={() => setMobileOpen(false)}
            >
              Начало
            </Link>

            {/* Климатици: click on text -> /products, click on chevron -> dropdown */}
            <div className="rounded-lg overflow-hidden">
              <div className="flex items-stretch">
                <Link
                  href="/products"
                  className="flex-1 px-4 py-3 text-lg font-medium text-slate-800 transition-colors hover:text-blue-600 active:bg-slate-100"
                  onClick={() => setMobileOpen(false)}
                >
                  Климатици
                </Link>
                <button
                  type="button"
                  className="px-3 py-3 text-slate-700 active:bg-slate-100"
                  aria-label="Отвори категории продукти"
                  aria-expanded={mobileProductsOpen}
                  onClick={() => setMobileProductsOpen((o) => !o)}
                >
                  <ChevronDown
                    className={cn(
                      "size-5 transition-transform",
                      mobileProductsOpen && "rotate-180",
                    )}
                  />
                </button>
              </div>

              {mobileProductsOpen ? (
                <div className="px-2 pb-2">
                  {productTypes.length ? (
                    productTypes.map((t) => (
                      <Link
                        key={t}
                        href={`/products?type=${encodeURIComponent(t)}`}
                        className="block rounded-md px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 active:bg-slate-100"
                        onClick={() => setMobileOpen(false)}
                      >
                        {t}
                      </Link>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-slate-500">
                      Няма добавени типове.
                    </div>
                  )}
                  <div className="my-1.5 border-t border-slate-100" />
                  <Link
                    href="/refurbished"
                    className="block rounded-md px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 active:bg-slate-100"
                    onClick={() => setMobileOpen(false)}
                  >
                    Рециклирани
                  </Link>
                </div>
              ) : null}
            </div>

            {/* Услуги: tap text -> /services, tap chevron -> dropdown */}
            <div className="rounded-lg overflow-hidden">
              <div className="flex items-stretch">
                <Link
                  href="/services"
                  className="flex-1 px-4 py-3 text-lg font-medium text-slate-800 transition-colors hover:text-blue-600 active:bg-slate-100"
                  onClick={() => setMobileOpen(false)}
                >
                  Услуги
                </Link>
                <button
                  type="button"
                  className="px-3 py-3 text-slate-700 active:bg-slate-100"
                  aria-label="Отвори подменю услуги"
                  aria-expanded={mobileServicesOpen}
                  onClick={() => setMobileServicesOpen((o) => !o)}
                >
                  <ChevronDown
                    className={cn(
                      "size-5 transition-transform",
                      mobileServicesOpen && "rotate-180",
                    )}
                  />
                </button>
              </div>

              {mobileServicesOpen ? (
                <div className="px-2 pb-2">
                  {servicesLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 active:bg-slate-100"
                      onClick={() => setMobileOpen(false)}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            <Link
              href="/about"
              className="rounded-lg px-4 py-3 text-lg font-medium text-slate-800 transition-colors hover:text-red-600 active:bg-slate-100"
              onClick={() => setMobileOpen(false)}
            >
              За нас
            </Link>
            <Link
              href="/contact"
              className="rounded-lg px-4 py-3 text-lg font-medium text-slate-800 transition-colors hover:text-red-600 active:bg-slate-100"
              onClick={() => setMobileOpen(false)}
            >
              Контакти
            </Link>
          </nav>

          <div className="border-t border-slate-100 p-4 space-y-3 bg-slate-50/80">
            <Link href="/contact" className="block" onClick={() => setMobileOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white border-0">
                Свържете се
              </Button>
            </Link>
            <a
              href="tel:+359876083921"
              className="flex items-center gap-2 text-sm text-slate-700"
            >
              <Phone size={16} className="text-blue-600 shrink-0" />
              +359 876 083 921
            </a>
            <a
              href="mailto:tetclima3@gmail.com"
              className="flex items-center gap-2 text-sm text-slate-700 break-all"
            >
              <Mail size={16} className="text-red-600 shrink-0" />
              tetclima3@gmail.com
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
