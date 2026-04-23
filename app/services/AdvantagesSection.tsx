import { Card, CardContent } from "@/app/components/ui/card";

type Stat = {
  value: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
};

export function AdvantagesSection({
  title = "Предимствата на професионалния подход",
  subtitle = "при получаване на цялостна услуга",
  stats,
}: {
  title?: string;
  subtitle?: string;
  stats: Stat[];
}) {
  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
          <p className="text-slate-600 mt-2">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <Card key={s.label} className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="p-6 text-center">
                {s.icon ? (
                  <div className="mx-auto mb-3 w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
                    {s.icon}
                  </div>
                ) : null}
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="mt-2 font-semibold text-slate-900">{s.label}</div>
                <div className="mt-2 text-sm text-slate-600">{s.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

