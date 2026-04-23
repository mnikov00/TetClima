import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { AdvantagesSection } from "@/app/services/AdvantagesSection";
import { Camera, MapPin, ShieldCheck, Zap } from "lucide-react";

export default function InspectionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Оглед за климатици</h1>
          <p className="text-lg opacity-90 max-w-4xl">
            Безплатен оглед от разстояние или оглед на място. Огледът се отнася за климатични системи в жилища, търговски и административни обекти във всички градове в страната, в които има наши магазини.
          </p>
        </div>
      </div>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Безплатен оглед от разстояние
                </h2>
                <p className="text-slate-700 leading-relaxed">
                  Оглед от разстояние е бърза услуга преди закупуването на климатична техника. Можете да заснемете помещенията с мобилното си устройство (снимки/видео) или да изпратите скица на стаите.
                </p>
                <div className="mt-6">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0" asChild>
                    <Link href="/contact">Заявете оглед</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Оглед на място
                </h2>
                <p className="text-slate-700 leading-relaxed">
                  Ако желаете оглед в населено място, в което няма наш магазин, се заплащат транспортни разходи на техническия екип: <strong>0,30 € | 0.59 лв.</strong> за 1 км пробег.
                </p>
                <div className="mt-6 text-sm text-slate-700 leading-relaxed">
                  <p className="font-semibold text-slate-900 mb-2">Изпратете материали за оглед на:</p>
                  <p>
                    E-mail: <a className="text-blue-700 underline" href="mailto:tetclima3@gmail.com">tetclima3@gmail.com</a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Кога е задължително да поискате оглед?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Помещения със сложна форма (П/Г-образни), колони или интериорни елементи, които пречат на въздушния поток.",
                "Липса на достъп за монтаж на външното тяло (без прозорци на стената, последен етаж, скосени тавани и др.).",
                "Големи помещения – търговски площи, складове, заведения (за точна преценка на необходимата мощност).",
                "Съмнения за сложен монтаж – когато е възможно да е нужна автовишка/специализиран транспорт.",
              ].map((t) => (
                <div key={t} className="bg-white border border-slate-200 rounded-lg p-5 text-slate-700 shadow-sm">
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AdvantagesSection
        stats={[
          { value: "0", label: "скрити изненади", description: "предварителният оглед намалява риска от усложнения", icon: <ShieldCheck className="size-6" /> },
          { value: "1", label: "консултация", description: "ясни препоръки за мощност и позициониране", icon: <Zap className="size-6" /> },
          { value: "2", label: "опции", description: "оглед от разстояние или на място според нуждите", icon: <Camera className="size-6" /> },
          { value: "9:00–19:00", label: "в работни дни", description: "лесно записване и организация", icon: <MapPin className="size-6" /> },
        ]}
      />
    </div>
  );
}

