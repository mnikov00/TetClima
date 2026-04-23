import Link from "next/link";
import { Card, CardContent } from "@/app/components/ui/card";
import { Wrench, ShieldCheck, Search, Sparkles } from "lucide-react";

const services = [
  {
    href: "/services/installation",
    title: "Монтаж на климатици",
    text: "Професионален монтаж от екипи с дългогодишен опит.",
    icon: Wrench,
    border: "border-blue-200 hover:border-blue-300",
  },
  {
    href: "/services/maintenance",
    title: "Профилактика на климатици",
    text: "Годишно обслужване за по-добра ефективност и здравословен въздух.",
    icon: Sparkles,
    border: "border-red-200 hover:border-red-300",
  },
  {
    href: "/services/repair",
    title: "Сервиз и ремонт на климатици",
    text: "Диагностика и ремонт – гаранционно и извънгаранционно.",
    icon: ShieldCheck,
    border: "border-blue-200 hover:border-blue-300",
  },
  {
    href: "/services/inspection",
    title: "Оглед за климатици",
    text: "Безплатен оглед от разстояние или оглед на място при нужда.",
    icon: Search,
    border: "border-red-200 hover:border-red-300",
  },
] as const;

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Услуги</h1>
          <p className="text-lg opacity-90">
            Монтаж, профилактика, сервиз и оглед за климатици.
          </p>
        </div>
      </div>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((s) => (
              <Link key={s.href} href={s.href} className="block">
                <Card className={`bg-white border shadow-sm hover:shadow-lg transition-all cursor-pointer ${s.border}`}>
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                        <s.icon className="text-slate-700" size={22} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">{s.title}</h2>
                        <p className="text-slate-600 mt-2">{s.text}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

