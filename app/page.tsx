import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { ImageWithFallback } from "@/app/components/ImageWithFallback";
import { Thermometer, Zap, Shield, Clock, Award, Wrench } from "lucide-react";
import { getProducts, type Product } from "@/api";

export default async function Home() {
  const products: Product[] = await getProducts();
  const featuredProducts = products.slice(0, 3);

  return (
    <div>
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-red-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                <span className="text-slate-900">Професионални </span>
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-500 bg-clip-text text-transparent">климатични</span>
                <span className="text-red-600"> решения</span>
              </h1>
              <p className="text-xl text-slate-700 mb-8">
                Предлагаме широка гама от високоефективни климатични системи от водещи световни производители. Качество, надеждност и енергийна ефективност.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/products">
                  <Button size="lg" className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white border-0">
                    Виж всички продукти
                  </Button>
                </Link>
                <Link href="/contact">
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
                  <Clock className="text-blue-600 shrink-0" size={20} />
                  <span className="text-sm text-slate-800">Бърза доставка</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="text-blue-600 shrink-0" size={20} />
                  <span className="text-sm text-slate-800">Сертифицирани продукти</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1729183672500-46c52a897de5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Климатични системи"
                className="w-full h-[500px] object-cover rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-b from-blue-600 to-red-600 text-white p-6 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">15+</div>
                <div className="text-sm">Години опит</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Популярни продукти
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Разгледайте нашите най-търсени климатични системи
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="block"
            >
                <Card className="group hover:shadow-xl transition-all border-2 hover:border-blue-200 cursor-pointer h-full">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-lg"
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
                    <CardTitle className="mb-2 text-slate-900">
                      {product.brand} {product.model}
                    </CardTitle>
                    <p className="text-sm text-slate-600 mb-2">{product.name}</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent mb-4">
                      {product.price.toLocaleString()} лв.
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <Thermometer size={16} className="text-blue-600" />
                        <span className="text-sm text-slate-700">Мощност: {product.capacity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap size={16} className="text-red-600" />
                        <span className="text-sm text-slate-700">Клас: {product.efficiency}</span>
                      </div>
                    </div>
                    <Button className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white border-0">
                      Виж детайли
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link href="/products">
              <Button size="lg" className="cursor-pointer text-lg px-8 border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-50">
                Виж всички продукти
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
              <Card key={item.title} className={`border-2 hover:border-${item.border}-300 transition-colors`}>
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
    </div>
  );
}
