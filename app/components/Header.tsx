"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Menu, Phone, Mail, Snowflake, Flame, X } from "lucide-react";
import { cn } from "./ui/utils";

const navLinks = [
  { href: "/", label: "Начало", hover: "hover:text-blue-600" },
  { href: "/products", label: "Продукти", hover: "hover:text-blue-600" },
  { href: "/about", label: "За нас", hover: "hover:text-red-600" },
  { href: "/contact", label: "Контакти", hover: "hover:text-red-600" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
                src="/logo2.png"
                alt="Logo"
                width={50}
                height={50}
              />
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  TETCLIMA
                </p>
                <p className="text-xs text-slate-500 border-t-1">климатични решения</p>
              </div>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-8" aria-label="Основна навигация">
            {navLinks.map(({ href, label, hover }) => (
              <Link key={href} href={href} className={cn("text-slate-800 transition-colors font-medium", hover)}>
                {label}
              </Link>
            ))}
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
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <span className="text-sm font-semibold text-slate-900">Меню</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              aria-label="Затвори"
              onClick={() => setMobileOpen(false)}
            >
              <X size={22} className="text-slate-700" />
            </Button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Мобилна навигация">
            {navLinks.map(({ href, label, hover }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-lg px-4 py-3 text-lg font-medium text-slate-800 transition-colors",
                  hover,
                  "active:bg-slate-100",
                )}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
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
