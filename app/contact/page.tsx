"use client";

import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";

function isValidBgPhone(raw: string) {
  const s = String(raw || "").trim();
  const digits = s.replace(/[^\d]/g, "");
  if (digits.length < 9) return false;
  if (digits.startsWith("0")) return digits.length === 10;
  if (digits.startsWith("359")) return digits.length === 12;
  return digits.length >= 9 && digits.length <= 13;
}

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [phoneError, setPhoneError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("idle");
    setPhoneError("");
    setSubmitting(true);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      firstName: String(fd.get("firstName") || "").trim(),
      lastName: String(fd.get("lastName") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      subject: String(fd.get("subject") || "").trim(),
      message: String(fd.get("message") || "").trim(),
    };

    try {
      if (!isValidBgPhone(payload.phone)) {
        setPhoneError("Моля, въведете валиден телефонен номер (напр. 0888 123 456 или +359 888 123 456).");
        setSubmitting(false);
        return;
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Контакти</h1>
          <p className="text-lg opacity-90">
            Свържете се с нас за консултация и оферта
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-blue-600" size={24} />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">Адрес</h3>
                <p className="text-gray-600">
                  ул. Любляна 40Б<br />
                  София, България
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-red-200 hover:border-red-400 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Phone className="text-red-600" size={24} />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">Телефон</h3>
                <p className="text-gray-600">
                  <a href="tel:+359876083921" className="text-primary hover:underline">
                    +359 876 083 921
                  </a>
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">Имейл</h3>
                <p className="text-gray-600">
                  <a href="mailto:tetclima3@gmail.com" className="text-primary hover:underline break-all">
                    tetclima3@gmail.com
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border border-[#64748b]">
              <CardContent className="p-8 text-foreground">
                <h2 className="text-2xl font-bold mb-6 ">Изпратете запитване</h2>
                <form onSubmit={handleSubmit} className="space-y-6 max-w-full">
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="firstName">Име *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="Иван"
                          required
                          className="mt-2 max-w-full"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Фамилия *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Иванов"
                          required
                          className="mt-2 max-w-full"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Имейл адрес *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="mt-2 max-w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+359 ..."
                      required
                      inputMode="tel"
                      autoComplete="tel"
                      className="mt-2 max-w-full"
                    />
                    {phoneError ? (
                      <p className="mt-1 text-xs text-red-600">{phoneError}</p>
                    ) : null}
                  </div>
                  <div>
                    <Label htmlFor="subject">Относно</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="Тема на запитването"
                      className="mt-2 max-w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Съобщение *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Вашето съобщение..."
                      required
                      rows={6}
                      className="mt-2 max-w-full wrap-break-word"
                    />
                  </div>
                  {status === "sent" ? (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                      Съобщението е изпратено успешно.
                    </div>
                  ) : null}
                  {status === "error" ? (
                    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                      Възникна грешка при изпращане. Опитайте отново.
                    </div>
                  ) : null}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600 hover:from-blue-700 hover:via-indigo-700 hover:to-red-700 text-white"
                  >
                    {submitting ? "Изпращане..." : "Изпрати запитване"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card className="border border-[#64748b]">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Clock className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">Работно време</h3>
                      <div className="space-y-2 text-gray-600 text-sm">
                        <p><span className="font-medium text-foreground">Понеделник:</span> 9:00–19:00</p>
                        <p><span className="font-medium text-foreground">Вторник:</span> 9:00–19:00</p>
                        <p><span className="font-medium text-foreground">Сряда:</span> 9:00–19:00</p>
                        <p><span className="font-medium text-foreground">Четвъртък:</span> 9:00–19:00</p>
                        <p><span className="font-medium text-foreground">Петък:</span> 9:00–19:00</p>
                        <p><span className="font-medium text-foreground">Събота:</span> 10:00–14:00</p>
                        <p><span className="font-medium text-foreground">Неделя:</span> затворено</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-6">
                    <p className="text-sm text-gray-600">
                      <strong className="text-primary">Бърза поръчка:</strong> При запитвания, моля свържете се с нас на посочения телефон. Ще ви отговорим в най-кратък срок.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-[#64748b]">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Полезна информация</h3>
                  <div className="space-y-4 text-gray-600">
                    {[
                      "Безплатна консултация при избор на климатик",
                      "Оглед на обект и професионална оферта",
                      "Гаранционно и следгаранционно обслужване",
                      "Възможност за разсрочено плащане",
                      "Доставка в цялата страна",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600 text-white">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-2">Нужда от спешна помощ?</h3>
                  <p className="mb-4 opacity-90">
                    Нашият екип е на разположение за спешни случаи.
                  </p>
                  <Button variant="secondary" size="lg" className="w-full" asChild>
                    <a href="tel:+359876083921">
                      <Phone size={20} className="mr-2" />
                      Обадете се сега
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
