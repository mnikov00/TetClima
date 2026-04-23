import { Card, CardContent } from "@/app/components/ui/card";
import { Award, Users, Target, TrendingUp } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">За нас</h1>
          <p className="text-lg opacity-90">Вашият надежден партньор за климатични решения</p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">Нашата история</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>От повече от 15 години предлагаме професионални климатични решения за дома, офиса и индустриални обекти.</p>
                <p>Днес сме един от водещите доставчици на климатична техника в страната, работим с Mitsubishi, Daikin, Mitsubishi Electric, Gree, Panasonic и др.</p>
                <p>Нашият екип е винаги на разположение за консултация, монтаж и сервизно обслужване.</p>
              </div>
            </div>
            <div className="space-y-6">
              <Card className="border border-[#64748b]">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">Нашата мисия</h3>
                      <p className="text-gray-600">Да осигурим комфорт чрез надеждни и енергийно ефективни климатични решения.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-[#64748b]">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">Нашата визия</h3>
                      <p className="text-gray-600">Да бъдем първи избор за климатични системи в България.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-[#64748b]">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">Нашите ценности</h3>
                      <p className="text-gray-600">Качество, надеждност и отговорност към клиентите.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {["15+", "5000+", "50+", "24/7"].map((val, i) => (
              <Card key={i} className="text-center border border-[#64748b]">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-primary mb-2">{val}</div>
                  <p className="text-gray-600">
                    {["Години опит", "Доволни клиенти", "Продуктови модела", "Техническа поддръжка"][i]}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Защо да ни изберете?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border border-[#64748b]">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Award className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Сертифицирани специалисти</h3>
                  <p className="text-gray-600">Обучени и сертифицирани от водещи производители.</p>
                </CardContent>
              </Card>
              <Card className="border border-[#64748b]">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Индивидуален подход</h3>
                  <p className="text-gray-600">Персонализирани решения за всеки проект.</p>
                </CardContent>
              </Card>
              <Card className="border border-[#64748b]">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Дългосрочна поддръжка</h3>
                  <p className="text-gray-600">Поддръжка и сервиз след продажбата.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
