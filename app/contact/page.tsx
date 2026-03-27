"use client";

import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Благодарим ви за запитването! Ще се свържем с вас скоро.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
            <Card>
              <CardContent className="p-8 text-foreground">
                <h2 className="text-2xl font-bold mb-6 ">Изпратете запитване</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Име и фамилия *</Label>
                    <Input id="name" type="text" placeholder="Вашето име" required className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="email">Имейл адрес *</Label>
                    <Input id="email" type="email" placeholder="your@email.com" required className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input id="phone" type="tel" placeholder="+359 ..." required className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="subject">Относно</Label>
                    <Input id="subject" type="text" placeholder="Тема на запитването" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="message">Съобщение *</Label>
                    <Textarea id="message" placeholder="Вашето съобщение..." required rows={6} className="mt-2" />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600 hover:from-blue-700 hover:via-indigo-700 hover:to-red-700 text-white"
                  >
                    Изпрати запитване
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">Работно време</h3>
                      <div className="space-y-2 text-gray-600 text-sm">
                        <p><span className="font-medium text-foreground">Неделя:</span> затворено</p>
                        <p><span className="font-medium text-foreground">Понеделник:</span> 9:00–19:00</p>
                        <p><span className="font-medium text-foreground">Вторник:</span> 9:00–19:00</p>
                        <p><span className="font-medium text-foreground">Сряда:</span> 9:00–19:00</p>
                        <p><span className="font-medium text-foreground">Четвъртък:</span> 9:00–19:00</p>
                        <p><span className="font-medium text-foreground">Петък:</span> 9:00–19:00</p>
                        <p><span className="font-medium text-foreground">Събота:</span> 10:00–14:00</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-6">
                    <p className="text-sm text-gray-600">
                      <strong className="text-primary">Бърза поръчка:</strong> За спешни запитвания ни се обадете на телефона. Отговаряме в рамките на 1 работен час.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
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
