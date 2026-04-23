import Link from "next/link";
import { Separator } from "./ui/separator";
import { Facebook, Instagram } from "lucide-react";

const PHONE_DISPLAY = "+359 876 083 921";
const PHONE_TEL = "+359876083921";
const EMAIL = "tetclima3@gmail.com";
const ADDRESS = "ул. Любляна 40Б, София, България";

const FACEBOOK_URL =
  "https://www.facebook.com/people/Tetclima/61566161110994";
const INSTAGRAM_URL = "https://www.instagram.com/tetclima";

async function loadNormalProductTypes(): Promise<string[]> {
  const strapiUrl = (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337").replace(
    /\/$/,
    "",
  );

  try {
    const res = await fetch(
      // Only normal products: isRefurbished = false OR null
      `${strapiUrl}/api/products?fields[0]=type&filters[$or][0][isRefurbished][$eq]=false&filters[$or][1][isRefurbished][$null]=true&pagination[pageSize]=1000`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    const json: any = await res.json();
    const data: any[] = Array.isArray(json?.data) ? json.data : [];
    const types = Array.from(
      new Set(
        data
          .map((it) => String(it?.type ?? it?.attributes?.type ?? "").trim())
          .filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b, "bg"));
    return types;
  } catch {
    return [];
  }
}

export async function Footer() {
  const productTypes = await loadNormalProductTypes();

  return (
    <footer className="bg-gradient-to-r from-indigo-800 via-purple-700 to-red-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">TetClima</h3>
            <p className="text-sm opacity-90 mb-4">
              Водещ доставчик на професионални климатични системи с над 15 години опит в осигуряването на комфорт и енергийна ефективност.
            </p>
            <div className="flex gap-4">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-75 hover:opacity-100 transition-opacity"
                aria-label="TetClima във Facebook"
              >
                <Facebook size={22} />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-75 hover:opacity-100 transition-opacity"
                aria-label="TetClima в Instagram"
              >
                <Instagram size={22} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Климатици</h4>
            <ul className="space-y-2 text-sm opacity-90">
              {productTypes.length ? (
                productTypes.map((t) => (
                  <li key={t}>
                    <Link
                      href={`/products?type=${encodeURIComponent(t)}`}
                      className="hover:opacity-100"
                    >
                      {t}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link href="/products" className="hover:opacity-100">
                    Климатици
                  </Link>
                </li>
              )}
              <li><Link href="/refurbished" className="hover:opacity-100">Рециклирани</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Услуги</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link href="/services/installation" className="hover:opacity-100">Монтаж на климатици</Link></li>
              <li><Link href="/services/maintenance" className="hover:opacity-100">Профилактика на климатици</Link></li>
              <li><Link href="/services/repair" className="hover:opacity-100">Сервиз и ремонт на климатици</Link></li>
              <li><Link href="/services/inspection" className="hover:opacity-100">Оглед за климатици</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Контакти</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li>{ADDRESS}</li>
              <li className="pt-1">
                <strong>Телефон:</strong>{" "}
                <a href={`tel:${PHONE_TEL}`} className="underline hover:opacity-100">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <strong>Имейл:</strong>{" "}
                <a href={`mailto:${EMAIL}`} className="underline hover:opacity-100 break-all">
                  {EMAIL}
                </a>
              </li>
              <li className="mt-2 border-t border-white/20 pt-3 text-xs leading-relaxed">
                <strong className="block mb-1">Работно време</strong>
                Пон.–Пет.: 9:00–19:00<br />
                Съб.: 10:00–14:00<br />
                Нед.: затворено
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 opacity-30" />

        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 text-sm opacity-90">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-center sm:text-left">
            <span>
              &copy; {new Date().getFullYear()} TetClima. Всички права запазени.
            </span>
            <span className="text-white/75">Designed by MN</span>
          </div>
          <div className="flex gap-6 flex-wrap justify-center">
            <Link href="/personal-data" className="hover:opacity-100">
              Защита на лични данни
            </Link>
            <Link href="/terms" className="hover:opacity-100">Общи условия</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
