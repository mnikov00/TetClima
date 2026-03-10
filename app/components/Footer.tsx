import Link from "next/link";
import { Separator } from "./ui/separator";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
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
              <Facebook size={20} className="opacity-75 hover:opacity-100 cursor-pointer" />
              <Twitter size={20} className="opacity-75 hover:opacity-100 cursor-pointer" />
              <Linkedin size={20} className="opacity-75 hover:opacity-100 cursor-pointer" />
              <Instagram size={20} className="opacity-75 hover:opacity-100 cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Продукти</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link href="/products" className="hover:opacity-100">Инверторни климатици</Link></li>
              <li><Link href="/products" className="hover:opacity-100">Подови климатици</Link></li>
              <li><Link href="/products" className="hover:opacity-100">Касетъчни климатици</Link></li>
              <li><Link href="/products" className="hover:opacity-100">Канални климатици</Link></li>
              <li><Link href="/products" className="hover:opacity-100">Мултисплит системи</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Услуги</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><a href="#" className="hover:opacity-100">Монтаж</a></li>
              <li><a href="#" className="hover:opacity-100">Поддръжка</a></li>
              <li><a href="#" className="hover:opacity-100">Сервиз</a></li>
              <li><a href="#" className="hover:opacity-100">Консултация</a></li>
              <li><a href="#" className="hover:opacity-100">Гаранционно обслужване</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Контакти</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li>бул. &quot;Цариградско шосе&quot; 115</li>
              <li>София 1784</li>
              <li>България</li>
              <li className="pt-2">
                <strong>Телефон:</strong> +359 2 123 4567
              </li>
              <li>
                <strong>Имейл:</strong> info@industrialac.com
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 opacity-30" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-90">
          <div>
            &copy; 2026 TetClima. Всички права запазени.
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:opacity-100">Политика за поверителност</a>
            <a href="#" className="hover:opacity-100">Общи условия</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
