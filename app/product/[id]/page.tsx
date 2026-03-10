import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { ImageWithFallback } from "@/app/components/ImageWithFallback";
import { ArrowRight, Phone, Mail, House } from "lucide-react";
import { getProducts } from "@/api";

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductDetail({ params }: ProductPageProps) {
  const allProducts = await getProducts();
  const product = allProducts[0];

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

  const specs = [
    { label: "Клас", value: product.type },
    { label: "Мощност", value: product.specifications.power },
    { label: "Цвят", value: product.specifications.color },
    { label: "Произход", value: product.specifications.origin },
    { label: "Охладителна мощност", value: product.specifications.coolingPower },
    { label: "Отоплителна мощност", value: product.specifications.heatingPower },
    { label: "Енергиен клас", value: product.specifications.energyClass },
    { label: "Ниво на шум", value: product.specifications.noiseLevel },
    { label: "Хладилен агент", value: product.specifications.refrigerant },
    { label: "Размери", value: product.specifications.dimensions },
    { label: "Тегло", value: product.specifications.weight },
  ];

  const related = allProducts
    .filter((p) => p.type === product.type && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="flex items-center max-w-7xl mx-auto px-6 py-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
            <House size={20} className="text-gray-500" />
            </Button>
          </Link>
          <ArrowRight size={20} className="mr-2" />
          <Link href="/products">
            <Button variant="ghost" className="mb-4">
              Продукти
            </Button>
          </Link>
        </div>
      </div>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="relative bg-white rounded-lg p-8 shadow-lg">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[500px] object-cover rounded-lg"
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
                  {product.price.toLocaleString()} лв.
                </p>
              </div>
              <p className="text-slate-700 mb-8 leading-relaxed">{product.description}</p>
              <div className="space-y-3 mb-8">
                <Link href="/contact">
                  <Button size="lg" className="w-full text-lg bg-blue-600 hover:bg-blue-700 text-white border-0">
                    <Phone size={20} className="mr-2" />
                    Свържете се с нас за поръчка
                  </Button>
                </Link>
                <a href="mailto:info@industrialac.com">
                  <Button size="lg" variant="outline" className="w-full text-lg border-2 border-red-600 text-red-600 bg-white hover:bg-red-50">
                    <Mail size={20} className="mr-2" />
                    Изпратете запитване
                  </Button>
                </a>
              </div>
              <Card className="mb-8 border-2 border-blue-100">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900">Основни характеристики</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                        <span className="text-blue-800">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6 text-slate-900">Технически характеристики</h2>
            <Card>
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-px bg-slate-200">
                  {specs.map(({ label, value }) => (
                    <div key={label} className="bg-white p-4">
                      <p className="text-sm text-slate-600 mb-1">{label}</p>
                      <p className="font-semibold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Подобни продукти</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {related.map((rp) => (
                <Card key={rp.id} className="hover:shadow-xl transition-shadow">
                  <CardContent className="p-4">
                    <ImageWithFallback src={rp.image} alt={rp.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                    <h3 className="font-semibold mb-2">{rp.brand} {rp.model}</h3>
                    <p className="text-sm text-gray-600 mb-2">{rp.name}</p>
                    <p className="text-xl font-bold text-primary mb-4">{rp.price.toLocaleString()} лв.</p>
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
