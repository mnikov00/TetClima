import { Card, CardContent } from "@/app/components/ui/card";
import { AdvantagesSection } from "@/app/services/AdvantagesSection";
import { Award, MapPin, ThumbsUp, Users } from "lucide-react";

const standardActivities = [
  "Качване на климатик и материали с асансьор",
  "Фиксиране на стойка на вътрешно тяло",
  "Технологичен отвор в стената – 1 бр.",
  "Медни тръби с термо изолация до 3 л.м.",
  "Отводняваща гофрирана тръба до 3 л.м.",
  "Комуникационен кабел до 5 л.м.",
  "Щепсел и захранващ кабел до 4 л.м.",
  "Поставяне на PVC канал до 1 л.м.",
  "Стойки за монтиране на външно тяло",
  "Свързване на двете климатични тела",
  "Вакуумиране",
  "Пуск на машината",
  "Кратък инструктаж на клиента за експлоатация",
] as const;

const standardPackages = [
  {
    titleTop: "Стандартен монтаж до 3 л.м. тръбен път",
    titleBottom: "7–14 000 BTU",
    items: standardActivities,
    price: { eur: "230 €", bgn: "449,84 лв." },
    promo: { eur: "190 €", bgn: "371,61 лв." },
  },
  {
    titleTop: "Стандартен монтаж до 3 л.м. тръбен път",
    titleBottom: "15–24 000 BTU",
    items: standardActivities,
    price: { eur: "255 €", bgn: "498,74 лв." },
    promo: { eur: "210 €", bgn: "410,72 лв." },
  },
  {
    titleTop: "Стандартен монтаж до 3 л.м. тръбен път",
    titleBottom: "30–55 000 BTU",
    items: standardActivities,
    price: { eur: "280 €", bgn: "547,63 лв." },
    promo: { eur: "220 €", bgn: "430,28 лв." },
  },
] as const;

const extraPriceList = [
  {
    service:
      "Монтаж на външно тяло на мултисплит при наличие на тръбен път",
    eur: "115 €",
    bgn: "224,92 лв.",
  },
  {
    service:
      "Монтаж на вътрешно тяло 7–14 000 BTU на мултисплит при наличие на тръбен път",
    eur: "40 €",
    bgn: "78,23 лв.",
  },
  {
    service:
      "Монтаж на вътрешно тяло 15–24 000 BTU на мултисплит при наличие на тръбен път",
    eur: "50 €",
    bgn: "97,79 лв.",
  },
  {
    service:
      "Цена за 1 км пробег извън населено място с наш магазин (двупосочно)",
    eur: "0.30 €",
    bgn: "0.59 лв.",
  },
  {
    service: "Допълнителен тръбен път 7–14 000 BTU (л.м.)",
    eur: "30 €",
    bgn: "58,67 лв.",
  },
  {
    service: "Допълнителен тръбен път 15–24 000 BTU (л.м.)",
    eur: "35 €",
    bgn: "68,45 лв.",
  },
  {
    service: "Допълнителен тръбен път 30–55 000 BTU (л.м.)",
    eur: "40 €",
    bgn: "78,23 лв.",
  },
  {
    service: "Вкопаване на тръбен път в тухлена зидария (л.м.)",
    eur: "20 €",
    bgn: "39.12 лв.",
  },
  {
    service: "Вкопаване на тръбен път в бетон (л.м.) (след оглед)",
    eur: "40 €",
    bgn: "78,23 лв.",
  },
  {
    service:
      "Качване без асансьор 7–14 000 BTU (на етаж)",
    eur: "8 €",
    bgn: "15,64 лв.",
  },
  {
    service:
      "Качване без асансьор 15–24 000 BTU (на етаж)",
    eur: "12 €",
    bgn: "23,47 лв.",
  },
  { service: "Монтаж на климатик на 2 етапа", eur: "40 €", bgn: "78,23 лв." },
  { service: "Пробиване на втори технологичен отвор за тръбен път", eur: "15 €", bgn: "29,34 лв." },
  { service: "Тест с азот на тръбен път", eur: "30 €", bgn: "58,67 лв." },
  { service: "Заваряване на медна тръба", eur: "10 €", bgn: "19,56 лв." },
  { service: "Антивибрационни тампони (к-кт).", eur: "20 €", bgn: "39,12 лв." },
  { service: "PVC кондензна вана (малка) с включен монтаж", eur: "40 €", bgn: "78,23 лв." },
  { service: "PVC кондензна вана (голяма) с включен монтаж", eur: "50 €", bgn: "97,79 лв." },
  { service: "PVC кондензна вана, нагревател и термостат с включен монтаж, малка / голяма", eur: "76 € / 86 €", bgn: "148,64 / 168,20 лв." },
  { service: "Метална кондензна вана с включен монтаж, малка / голяма", eur: "48 / 58 €", bgn: "93,88 / 113,44 лв." },
  { service: "Метална кондензна вана, нагревател и термостат с включен монтаж, малка / голяма", eur: "84 / 94 €", bgn: "164,29 / 183,85 лв." },
  { service: "Допълнително гофрирана тръба 1 л.м.", eur: "4 €", bgn: "7,82 лв." },
  { service: "Допълнително PVC тръба Ф32 1 л.м.", eur: "10 €", bgn: "19,56 лв." },
  { service: "Допълнителен PVC канал 15х15 мм. на л.м.", eur: "7 €", bgn: "13,69 лв." },
  { service: "Допълнителен PVC канал 60х60 мм. на л.м.", eur: "10 €", bgn: "19,56 лв." },
  { service: "Допълнителен захранващ кабел 1 л.м. 3 x 1.5 мм", eur: "4 €", bgn: "7,82 лв." },
  { service: "Допълнителен захранващ кабел 1 л.м. 3 x 2.5 мм", eur: "4 €", bgn: "7,82 лв." },
  { service: "Допълнителен кабел за комуникация 1 л.м. 4 x 2.5 мм", eur: "4 €", bgn: "7,82 лв." },
  { service: "Вкопаване на захранващ кабел в тухлена зидария на л.м.", eur: "10 €", bgn: "19,56 лв." },
  { service: "Вкопаване на захранващ кабел в бетон на л.м. (след оглед)", eur: "15 €", bgn: "29,34 лв." },
  { service: "Изрязване на гипсокартон и изолация на л.м.", eur: "5 €", bgn: "9,78 лв." },
  { service: "Демонтаж и монтаж на стъклопакет 24 мм (80x150 см)", eur: "30 €", bgn: "58,67 лв." },
  { service: "Демонтаж на климатик 7–14 000 BTU", eur: "50 €", bgn: "97,79 лв." },
  { service: "Демонтаж на климатик 15–24 000 BTU", eur: "60 €", bgn: "117,35 лв." },
  { service: "Демонтаж на климатик 30–55 000 BTU", eur: "92 €", bgn: "179,94 лв." },
  { service: "Кондензна помпа Mini Aqua", eur: "148 €", bgn: "289,46 лв." },
  { service: "Кондензна помпа Refco GOBI", eur: "153 €", bgn: "299,24 лв." },
  { service: "Монтаж на кондензна помпа", eur: "30 €", bgn: "58,67 лв." },
  { service: "Монтаж на външно тяло с монтажен профил на л.м.", eur: "5 €", bgn: "9,78 лв." },
  { service: "Монтаж със строително скеле (осигурено от нас - височина 2 м)", eur: "30 €", bgn: "58,67 лв." },
  { service: "Монтаж с висока стълба", eur: "25 - 50 €", bgn: "48,89 - 97,79 лв." },
  { service: "Такса „нестандартен монтаж“ (след предварително съгласуване)", eur: "25 - 50 €", bgn: "48,89 - 97,79 лв." },
  { service: "Съхранение на 1 бр. климатик в наш склад след 1-ви месец (на месец)", eur: "5 €", bgn: "9,78 лв." },
] as const;

export default function InstallationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Монтаж на климатици</h1>
          <p className="text-lg opacity-90 max-w-3xl">
            Ние от TetClima държим на качественото изпълнение на монтажните дейности. Разполагаме със собствени екипи с дългогодишен опит в монтажа на климатична техника.
          </p>
        </div>
      </div>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Стандартни монтажни дейности (стенен/подов моносплит, закупени от нас)
          </h2>

          <div className="grid lg:grid-cols-3 gap-8">
            {standardPackages.map((p) => (
              <Card key={p.titleBottom} className="bg-white border border-slate-200 shadow-sm">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-700">
                      {p.titleTop}
                    </h3>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                      {p.titleBottom}
                    </p>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700 mb-5">
                    {p.items.map((it) => (
                      <li key={it} className="flex gap-2">
                        <span className="mt-2 size-1.5 rounded-full bg-red-600 shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto border-t border-slate-100 pt-4">
                    <div className="text-sm text-slate-500 line-through">
                      <span className="font-semibold text-blue-600">{p.price.eur}</span>{" "}
                      <span className="text-slate-300">|</span>{" "}
                      <span className="font-semibold text-red-600">{p.price.bgn}</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                      <span className="text-2xl font-bold text-blue-600">{p.promo.eur}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-xl font-semibold text-red-600">{p.promo.bgn}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <AdvantagesSection
        stats={[
          {
            value: "97%",
            label: "от клиентите",
            description: "са доволни от монтажните ни услуги",
            icon: <ThumbsUp className="size-6" />,
          },
          {
            value: "10+",
            label: "отговорни техници",
            description: "които да се погрижат за Вашата климатична техника",
            icon: <Users className="size-6" />,
          },
          {
            value: "15+",
            label: "години опит",
            description: "в инсталирането на климатични системи",
            icon: <Award className="size-6" />,
          },
          {
            value: "2",
            label: "локации",
            description: "в София с пълен набор от услуги",
            icon: <MapPin className="size-6" />,
          },
        ]}
      />

      <section className="pb-14">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Допълнителен ценоразпис (инсталационни услуги и аксесоари)
          </h2>

          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-[720px] grid grid-cols-[1fr_140px_140px] gap-px bg-slate-200 text-sm">
                <div className="bg-slate-50 p-4 font-semibold text-slate-700">
                  Услуга
                </div>
                <div className="bg-slate-50 p-4 font-semibold text-slate-700">
                  Цена (EUR)
                </div>
                <div className="bg-slate-50 p-4 font-semibold text-slate-700">
                  Цена (BGN)
                </div>
                {extraPriceList.map((row) => (
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
              <strong>Уточнения:</strong> Цените за монтаж на мултисплит система са без включен тръбен път. Дължината на тръбното трасе между външното тяло и вътрешните тела се заплаща допълнително за всеки линеен метър.
            </p>
            <p>
              Клиентски материали и аксесоари не се монтират, но при настояване от клиента, услугите се заплащат еквивалентно на стойността на нашите материали и услуги. Свързването на WiFi модулите към домашната мрежа е ангажимент на клиента.
            </p>
            <p>
              <strong>ВАЖНО:</strong> При нужда от монтаж с вишка цената за наемане на автовишката се заплаща изцяло от клиента и е по действащия ценоразпис на фирмата, извършваща услугата.
            </p>
            <p>
              Монтажът е свързан с пробиване и запрашаване. В завършени жилища това може да доведе до дискомфорт. Подгответе помещението (покрийте пода и мебелите, освободете достъп до стената). Почистваме след монтаж, но финият прах е предизвикателство.
            </p>
            <p>
              С оглед на безопасността на екипите ни не използваме калцуни. Ако настилката е чувствителна (ламинат/паркет), молим да я обезопасите с найлон.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

