import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { ImageWithFallback } from "@/app/components/ImageWithFallback";
import {
  Thermometer,
  Zap,
  Shield,
  Clock,
  Award,
  Wrench,
  Leaf,
} from "lucide-react";
import { getProducts, type Product } from "@/api";
import {
  formatPriceBgnFromEur,
  formatPriceEur,
} from "@/lib/currency";

type FeaturedVariant = "main" | "refurbished";

function FeaturedProductsSection({
  title,
  description,
  products,
  variant,
  viewAllHref,
  viewAllLabel,
}: {
  title: string;
  description: string;
  products: Product[];
  variant: FeaturedVariant;
  viewAllHref: string;
  viewAllLabel: string;
}) {
  const isRefurb = variant === "refurbished";

  const sectionClass = isRefurb
    ? "py-20 bg-gradient-to-br from-emerald-50/90 via-white to-amber-50/80 border-y border-emerald-100/60"
    : "py-20 bg-white";

  const cardBorder = isRefurb
    ? "border border-emerald-200/80 bg-white/95 shadow-sm hover:border-emerald-400 hover:shadow-lg"
    : "border border-slate-200 bg-white shadow-sm hover:border-blue-300 hover:shadow-xl";

  const pricePrimary = isRefurb ? "text-emerald-700" : "text-blue-600";
  const priceSecondary = isRefurb ? "text-amber-700" : "text-red-600";
  const iconCool = isRefurb ? "text-emerald-600" : "text-blue-600";
  const iconHeat = isRefurb ? "text-amber-600" : "text-red-600";
  const ctaFull = isRefurb
    ? "w-full bg-emerald-700 hover:bg-emerald-800 text-white border-0"
    : "w-full bg-blue-600 hover:bg-blue-700 text-white border-0";
  const outlineCta = isRefurb
    ? "text-lg px-8 border-2 border-emerald-700 text-emerald-800 bg-white hover:bg-emerald-50"
    : "text-lg px-8 border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-50";

  const badgeGradient = isRefurb
    ? "from-emerald-600 via-teal-600 to-amber-600"
    : "from-blue-600 via-indigo-600 to-red-600";

  return (
    <section className={sectionClass}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          {isRefurb ? (
            <>
              <div className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-100/80 px-4 py-1.5 text-sm font-medium text-emerald-900 mb-4">
                <Leaf className="size-4 shrink-0" aria-hidden />
                Устойчив избор
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-700 to-amber-700 bg-clip-text text-transparent">
                {title}
              </h2>
              <p className="text-xl text-emerald-950/80 max-w-3xl mx-auto">
                {description}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                {title}
              </h2>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                {description}
              </p>
            </>
          )}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="block h-full min-h-0 cursor-pointer"
            >
              <Card
                className={`group flex h-full min-h-0 flex-col transition-all cursor-pointer overflow-hidden rounded-xl ${cardBorder}`}
              >
                <CardHeader className="shrink-0 p-0">
                  <div
                    className={
                      isRefurb
                        ? "relative flex h-48 w-full items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-50/50 to-white"
                        : "relative flex h-48 w-full items-center justify-center overflow-hidden bg-white"
                    }
                  >
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full max-h-full max-w-full object-contain"
                    />
                    {product.badge && (
                      <Badge
                        className={`absolute top-4 left-4 bg-gradient-to-r ${badgeGradient} border-0 text-white shadow-md max-w-[calc(100%-7.5rem)] truncate`}
                      >
                        {product.badge}
                      </Badge>
                    )}
                    <Badge
                      className={
                        isRefurb
                          ? "absolute top-4 right-4 bg-white text-emerald-900 ring-1 ring-emerald-200"
                          : "absolute top-4 right-4 bg-white text-gray-900"
                      }
                    >
                      {product.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex min-h-0 flex-1 flex-col p-6">
                  <CardTitle
                    className={[
                      "mb-2 line-clamp-3 min-h-0 overflow-hidden text-balance break-words",
                      isRefurb ? "text-emerald-950" : "text-slate-900",
                    ].join(" ")}
                  >
                    {product.brand} {product.model}
                  </CardTitle>
                  <p
                    className={
                      isRefurb
                        ? "mb-3 line-clamp-2 min-h-0 text-sm text-emerald-900/75"
                        : "mb-3 line-clamp-2 min-h-0 text-sm text-slate-600"
                    }
                  >
                    {product.name}
                  </p>
                  <div className="mb-3 shrink-0">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className={`text-2xl font-bold ${pricePrimary}`}>
                        {formatPriceEur(product.price)}
                      </span>
                      <span className="text-slate-400">|</span>
                      <span className={`text-lg font-semibold ${priceSecondary}`}>
                        {formatPriceBgnFromEur(product.price)}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4 min-h-0 shrink-0 space-y-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <Thermometer
                        size={16}
                        className={`shrink-0 ${iconCool}`}
                      />
                      <span
                        className={
                          isRefurb
                            ? "min-w-0 text-sm text-emerald-950/85"
                            : "min-w-0 text-sm text-slate-700"
                        }
                      >
                        Мощност: {product.capacity}
                      </span>
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <Zap size={16} className={`shrink-0 ${iconHeat}`} />
                      <span
                        className={
                          isRefurb
                            ? "min-w-0 text-sm text-emerald-950/85"
                            : "min-w-0 text-sm text-slate-700"
                        }
                      >
                        Клас: {product.efficiency}
                      </span>
                    </div>
                  </div>
                  <div className="mt-auto shrink-0 pt-1">
                    <Button className={ctaFull}>Виж детайли</Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link href={viewAllHref} className="cursor-pointer">
            <Button size="lg" className={outlineCta}>
              {viewAllLabel}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  const [mainProducts, refurbishedProducts] = await Promise.all([
    getProducts({ isRefurbished: false }),
    getProducts({ isRefurbished: true }),
  ]);
  const featuredMain = mainProducts.slice(0, 3);
  const featuredRefurbished = refurbishedProducts.slice(0, 3);

  return (
    <div>
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-red-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-slate-900 leading-tight">
                Вашият комфорт е наша грижа
              </h1>
              <p className="text-2xl lg:text-3xl font-semibold mb-6 w-fit max-w-full bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                Отопление и охлаждане
              </p>
              <p className="text-xl text-slate-700 mb-8">
                Предлагаме широка гама от високоефективни климатични системи от водещи световни производители. Качество, надеждност и енергийна ефективност.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/products" className="cursor-pointer">
                  <Button size="lg" className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white border-0">
                    Виж всички продукти
                  </Button>
                </Link>
                <Link href="/contact" className="cursor-pointer">
                  <Button size="lg" className="text-lg px-8 py-4 border-2 border-red-600 text-red-600 bg-white hover:bg-red-50">
                    Свържете се с нас
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="text-blue-600 shrink-0" size={20} />
                  <span className="text-sm text-slate-800">5 години гаранция</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-red-600 shrink-0" size={20} />
                  <span className="text-sm text-slate-800">Бърза доставка</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="text-blue-600 shrink-0" size={20} />
                  <span className="text-sm text-slate-800">Сертифицирани продукти</span>
                </div>
              </div>
            </div>
            <div className="relative w-full min-h-[280px] h-[min(520px,55vh)] rounded-lg shadow-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <ImageWithFallback
                src="/homepage.png"
                alt="Климатични системи — TetClima"
                className="absolute inset-0 h-full w-full object-cover object-center"
                loading="eager"
                decoding="async"
              />
              <div className="absolute bottom-5 left-5 z-10 bg-gradient-to-b from-blue-600 to-red-600 text-white px-5 py-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold leading-none">15+</div>
                <div className="text-sm mt-1 opacity-95">Години опит</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProductsSection
        title="Популярни продукти"
        description="Разгледайте нашите най-търсени климатични системи"
        products={featuredMain}
        variant="main"
        viewAllHref="/products"
        viewAllLabel="Виж всички продукти"
      />

      <section className="py-20 bg-gradient-to-br from-blue-50 to-red-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Защо да изберете нас?
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Предимства на работата с нас
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Award, title: "Сертифицирани продукти", text: "Работим само с официални представители на водещи световни марки", border: "blue" },
              { icon: Shield, title: "Гаранция и качество", text: "До 5 години гаранция на всички климатични системи", border: "red" },
              { icon: Wrench, title: "Професионален монтаж", text: "Опитни техници за инсталация и сервизно обслужване", border: "blue" },
              { icon: Zap, title: "Енергийна ефективност", text: "Продукти с висок клас на енергийна ефективност", border: "red" },
              { icon: Clock, title: "Бърза доставка", text: "Наличност на склад и бърза доставка до вашия адрес", border: "blue" },
              { icon: Thermometer, title: "Широка гама", text: "Решения за дома, офиса и индустриални обекти", border: "red" },
            ].map((item) => (
              <Card
                key={item.title}
                className={[
                  "border-2 border-[#64748b] transition-colors",
                  item.border === "red" ? "hover:border-red-600" : "hover:border-blue-600",
                ].join(" ")}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${item.border === "blue" ? "bg-blue-100" : "bg-red-100"}`}>
                    <item.icon className={item.border === "blue" ? "text-blue-600" : "text-red-600"} size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-900">{item.title}</h3>
                  <p className="text-slate-700">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {featuredRefurbished.length > 0 ? (
        <FeaturedProductsSection
          title="Рециклирани продукти"
          description="Проверени климатични системи на достъпна цена с гаранция за качество"
          products={featuredRefurbished}
          variant="refurbished"
          viewAllHref="/refurbished"
          viewAllLabel="Виж всички продукти"
        />
      ) : null}
    </div>
  );
}
