import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { AdvantagesSection } from "@/app/services/AdvantagesSection";
import { Award, MapPin, ShieldCheck, Sparkles } from "lucide-react";

const packages = [
  {
    top: "Годишно обслужване",
    btu: "до 14 000 BTU",
    eur: "45 €",
    bgn: "88.01 лв.",
    meta: "годишно",
  },
  {
    top: "Годишно обслужване",
    btu: "15–24 000 BTU",
    eur: "50 €",
    bgn: "97.79 лв.",
    meta: "годишно",
  },
  {
    top: "Годишно обслужване",
    btu: "над 24 000 BTU",
    eur: "65 €",
    bgn: "127,13 лв.",
    meta: "годишно",
  },
] as const;

const included = [
  "Преглед на вътрешно тяло",
  "Почистване на вътрешно тяло",
  "Преглед на външно климатично тяло",
  "Измерване на работно налягане",
  "Измерване на температура на изпарение на фреона",
  "Почистване на филтърна секция",
  "Проверка на електрически връзки",
  "Преглед и почистване на дренажна система",
] as const;

const options = [
  {
    text: "Опция: почистване на турбина",
    eur: "от 25 до 60 €",
    bgn: "от 48,89 до 117,35 лв.",
  },
  {
    text: "Опция: почистване външно тяло на адрес",
    eur: "30 €",
    bgn: "58,67 лв.",
  },
] as const;

const extraList = [
  { service: "Годишно обслужване на колонен климатик", eur: "70 €", bgn: "136,91 лв." },
  { service: "Годишно обслужване на касетъчен климатик", eur: "70 €", bgn: "136,91 лв." },
  { service: "Годишно обслужване на канален климатик", eur: "70 €", bgn: "136,91 лв." },
  { service: "Годишно обслужване Fujitsu Nocria / Daikin Ururu Sarara", eur: "65 €", bgn: "127,13 лв." },
  { service: "Годишно обслужване на двоен мултисплит", eur: "70 €", bgn: "136.91 лв." },
  { service: "Годишно обслужване на троен мултисплит", eur: "107 €", bgn: "209.27 лв." },
  { service: "Годишно обслужване на четворен мултисплит", eur: "143 €", bgn: "279.68 лв." },
  { service: "Пълно обслужване в сервиз 7–14 000 BTU", eur: "82 €", bgn: "160.38 лв." },
  { service: "Пълно обслужване в сервиз 15–24 000 BTU", eur: "82 €", bgn: "160.38 лв." },
  { service: "Профилактика абонамент 3 години 7–14 000 BTU", eur: "114 €", bgn: "222.96 лв." },
  { service: "Профилактика абонамент 3 години 15–24 000 BTU", eur: "122 €", bgn: "238.61 лв." },
] as const;

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Профилактика на климатици</h1>
          <p className="text-lg opacity-90 max-w-4xl">
            Профилактиката на климатика (годишно обслужване) е от съществено значение както за добрата работа на уреда, така и за Вашето здраве. При профилактика се почиства и дезинфекцира топлообменника на вътрешното тяло и се унищожават натрупаните вредни микроорганизми.
          </p>
        </div>
      </div>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Цени (стенен тип)
          </h2>

          <div className="grid lg:grid-cols-3 gap-8">
            {packages.map((p) => (
              <Card key={p.btu} className="bg-white border border-slate-200 shadow-sm">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-3">
                    <div className="text-sm font-semibold text-slate-700">{p.top}</div>
                    <div className="text-2xl font-bold text-slate-900 mt-1">{p.btu}</div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2 flex-wrap">
                    <span className="text-2xl font-bold text-blue-600">{p.eur}</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-xl font-semibold text-red-600">{p.bgn}</span>
                    <span className="text-xs text-slate-500 ml-auto">{p.meta}</span>
                  </div>
                  <div className="mt-auto pt-5">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0" asChild>
                      <Link href="/contact">Заявете услугата</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Какво включва годишното обслужване
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {included.map((it) => (
                <div key={it} className="bg-white border border-slate-200 rounded-lg p-4 text-slate-700 shadow-sm">
                  {it}
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 text-sm text-slate-700">
              {options.map((o) => (
                <div key={o.text} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-slate-700">* {o.text}</span>
                  <span className="text-slate-300">(</span>
                  <span className="font-semibold text-blue-600">{o.eur}</span>
                  <span className="text-slate-300">|</span>
                  <span className="font-semibold text-red-600">{o.bgn}</span>
                  <span className="text-slate-300">)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AdvantagesSection
        stats={[
          { value: "97%", label: "от клиентите", description: "са доволни от услугите ни по поддръжка", icon: <Sparkles className="size-6" /> },
          { value: "30+", label: "отговорни техници", description: "които да се погрижат за Вашата климатична техника", icon: <ShieldCheck className="size-6" /> },
          { value: "15+", label: "години опит", description: "в обслужването на климатични системи", icon: <Award className="size-6" /> },
          { value: "14+", label: "точки на покритие", description: "в София и страната с пълен набор от услуги", icon: <MapPin className="size-6" /> },
        ]}
      />

      <section className="pb-14">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Допълнителен ценоразпис (климатици от различен тип)
          </h2>

          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-[720px] grid grid-cols-[1fr_140px_140px] gap-px bg-slate-200 text-sm">
                <div className="bg-slate-50 p-4 font-semibold text-slate-700">Услуга</div>
                <div className="bg-slate-50 p-4 font-semibold text-slate-700">Цена (EUR)</div>
                <div className="bg-slate-50 p-4 font-semibold text-slate-700">Цена (BGN)</div>
                {extraList.map((row) => (
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
        </div>
      </section>
    </div>
  );
}

