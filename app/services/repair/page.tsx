import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { AdvantagesSection } from "@/app/services/AdvantagesSection";
import { Clock, ShieldCheck, Wrench, Zap } from "lucide-react";

const visitPrices = [
  { top: "Посещение и диагностика", btu: "7–14 000 BTU", eur: "35 €", bgn: "68.45 лв." },
  { top: "Посещение и диагностика", btu: "15–24 000 BTU", eur: "45 €", bgn: "88.01 лв." },
  { top: "Посещение и диагностика", btu: "30–55 000 BTU", eur: "55 €", bgn: "107.57 лв." },
] as const;

const priceRows = [
  { service: "Повикване на технически екип без основателна причина", eur: "25 €", bgn: "48.89 лв." },
  { service: "Диагностика (колонен/канален/касетъчен) на адрес", eur: "55 €", bgn: "107.57 лв." },
  { service: "Диагностика на мултисплит на адрес", eur: "42 €", bgn: "82.14 лв." },
  { service: "Диагностика на климатик в наш сервиз", eur: "30 €", bgn: "58.67 лв." },
  { service: "Диагностика (колонен/канален/касетъчен) в наш сервиз", eur: "50 €", bgn: "97.79 лв." },
  { service: "Диагностика на мултисплит в наш сервиз", eur: "50 €", bgn: "97.79 лв." },
  { service: "Демонтаж/монтаж вътрешно/външно тяло до 14 000 BTU", eur: "40 €", bgn: "78.23 лв." },
  { service: "Демонтаж/монтаж вътрешно/външно тяло 15–24 000 BTU", eur: "50 €", bgn: "97.79 лв." },
  { service: "Демонтаж/монтаж цяла сплит система до 14 000 BTU", eur: "50 €", bgn: "97.79 лв." },
  { service: "Демонтаж/монтаж цяла сплит система 15–24 000 BTU", eur: "60 €", bgn: "117.35 лв." },
  { service: "Рециклиране на вентилаторен мотор на вътрешно тяло", eur: "62 €", bgn: "121.26 лв." },
  { service: "Рециклиране на вентилаторен мотор на външно тяло", eur: "62 €", bgn: "121.26 лв." },
  { service: "Подмяна на четирипътен вентил (труд)", eur: "80 €", bgn: "156.46 лв." },
  { service: "Подмяна на компресор (труд)", eur: "80 €", bgn: "156.46 лв." },
  { service: "Подмяна на температурен сензор или датчик", eur: "20 €", bgn: "39.11 лв." },
  { service: "Демонтаж/монтаж на перка за вентилатор на външно тяло", eur: "25 €", bgn: "48.89 лв." },
  { service: "Демонтаж/монтаж на турбина за вентилатор на вътрешно тяло", eur: "30 €", bgn: "58.67 лв." },
  { service: "Демонтаж/монтаж на вътрешна платка", eur: "30 €", bgn: "58.67 лв." },
  { service: "Демонтаж/монтаж на външна платка", eur: "40 €", bgn: "78.23 лв." },
  { service: "Демонтаж/монтаж вътрешен фан мотор", eur: "40 €", bgn: "78.23 лв." },
  { service: "Демонтаж/монтаж външен фан мотор", eur: "30 €", bgn: "58.67 лв." },
  { service: "Подмяна на кранове на външно тяло (на брой)", eur: "30 €", bgn: "58.67 лв." },
  { service: "Подмяна на щуцери на вътрешно тяло (на брой)", eur: "30 / 60 €", bgn: "58.67 / 117.35 лв." },
  { service: "100 гр зареждане с R407C (труд + зареждане)", eur: "10 €", bgn: "19.56 лв." },
  { service: "100 гр зареждане с R410A (труд + зареждане)", eur: "12 €", bgn: "23.47 лв." },
  { service: "100 гр зареждане с R32 (труд + зареждане)", eur: "12 €", bgn: "23.47 лв." },
  { service: "Почистване на турбина", eur: "25 / 60 €", bgn: "48.89 / 117.35 лв." },
  { service: "Почистване на външно тяло на адрес", eur: "30 €", bgn: "58.67 лв." },
  { service: "Подмяна на ел. кондензатор (според марка/модел)", eur: "30 / 60 €", bgn: "58.67 / 117.35 лв." },
  { service: "Ремонт на ел. блок или платка (според марка/модел)", eur: "100 / 200 €", bgn: "195.58 / 391.17 лв." },
  { service: "Тест с азот", eur: "30 €", bgn: "58.67 лв." },
  { service: "Отстраняване на пропуск", eur: "80 €", bgn: "156.47 лв." },
  { service: "Заварка със сребърен припой", eur: "20 €", bgn: "39.11 лв." },
  { service: "Заварка на пропуск (на брой)", eur: "10 €", bgn: "19.56 лв." },
  { service: "Температурен сензор или датчик (на брой)", eur: "20 €", bgn: "39.11 лв." },
  { service: "Удължаване на кондензен маркуч (до 1 м)", eur: "20 €", bgn: "39.11 лв." },
  { service: "Цена за кран на външно тяло (на брой)", eur: "10 / 40 €", bgn: "19.56 / 78.23 лв." },
] as const;

export default function RepairPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Сервиз и ремонт на климатици</h1>
          <p className="text-lg opacity-90 max-w-4xl">
            TetClima разполага със собствена сервизна база, обслужваща гаранционно и извънгаранционно всички видове климатици. За да се диагностицира проблемът се прави посещение на място от нашите квалифицирани техници. Свържете се с нас, за да Ви запишем час в удобен за Вас ден.
          </p>
        </div>
      </div>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Цени за посещение и диагностика
          </h2>

          <div className="grid lg:grid-cols-3 gap-8">
            {visitPrices.map((p) => (
              <Card key={p.btu} className="bg-white border border-slate-200 shadow-sm">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-3">
                    <div className="text-sm font-semibold text-slate-700">{p.top}</div>
                    <div className="text-2xl font-bold text-slate-900 mt-1">{p.btu}</div>
                  </div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-2xl font-bold text-blue-600">{p.eur}</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-xl font-semibold text-red-600">{p.bgn}</span>
                  </div>
                  <div className="mt-auto pt-5">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0" asChild>
                      <Link href="/contact">Заявете посещение</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <AdvantagesSection
        stats={[
          { value: "15+", label: "години опит", description: "в сервизиране и ремонт на климатици", icon: <Clock className="size-6" /> },
          { value: "30+", label: "техници", description: "за бърза реакция и качествена диагностика", icon: <Wrench className="size-6" /> },
          { value: "100%", label: "прозрачност", description: "ясни цени и предварителна диагностика", icon: <ShieldCheck className="size-6" /> },
          { value: "1", label: "контакт", description: "лесно записване и организация на посещение", icon: <Zap className="size-6" /> },
        ]}
      />

      <section className="pb-14">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Цени за сервиз и ремонт
          </h2>

          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-[720px] grid grid-cols-[1fr_140px_140px] gap-px bg-slate-200 text-sm">
                <div className="bg-slate-50 p-4 font-semibold text-slate-700">Услуга</div>
                <div className="bg-slate-50 p-4 font-semibold text-slate-700">Цена (EUR)</div>
                <div className="bg-slate-50 p-4 font-semibold text-slate-700">Цена (BGN)</div>
                {priceRows.map((row) => (
                  <div key={row.service} className="contents">
                    <div className="bg-white p-4 text-slate-700">{row.service}</div>
                    <div className="bg-white p-4 font-semibold text-blue-600">{row.eur}</div>
                    <div className="bg-white p-4 font-semibold text-red-600">{row.bgn}</div>
                  </div>
                ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 space-y-4 text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>Гаранционен сервиз:</strong> При възникнали проблеми при гаранционни климатици, закупени от наш партньор/доставчик, клиентът получава безплатно отстраняване на проблема при условията на гаранцията.
            </p>
            <p>
              <strong>Извънгаранционен сервиз:</strong> Извършваме сервизиране на следгаранционни климатици на всички производители. Работим с оригинални резервни части от вносителите.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

