import Link from "next/link";
import { Button } from "./ui/button";
import { Menu, Phone, Mail, Snowflake, Flame } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="hidden md:flex justify-between items-center px-6 py-2 bg-gradient-to-r from-indigo-800 via-purple-700 to-red-600 text-white text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone size={14} />
              <span>+359 876 083 921</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} />
              <span>tetclima3@gmail.com</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Snowflake size={14} />
            <span>Безплатна консултация</span>
            <Flame size={14} />
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-blue-900">
                  TetClima
                </h1>
                <p className="text-xs text-slate-500">Климатизация и отопление</p>
              </div>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-slate-800 hover:text-blue-600 transition-colors font-medium">Начало</Link>
            <Link href="/products" className="text-slate-800 hover:text-blue-600 transition-colors font-medium">Продукти</Link>
            <Link href="/about" className="text-slate-800 hover:text-red-600 transition-colors font-medium">За нас</Link>
            <Link href="/contact" className="text-slate-800 hover:text-red-600 transition-colors font-medium">Контакти</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/contact">
              <Button className="hidden hover:cursor-pointer md:inline-flex bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white border-0">
                Свържете се
              </Button>
            </Link>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu size={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
