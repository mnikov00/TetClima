"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

function isValidBgPhone(raw: string) {
  const s = String(raw || "").trim();
  const digits = s.replace(/[^\d]/g, "");
  if (digits.length < 9) return false;
  if (digits.startsWith("0")) return digits.length === 10;
  if (digits.startsWith("359")) return digits.length === 12;
  return digits.length >= 9 && digits.length <= 13;
}

type ProductInfo = {
  id: string;
  name: string;
  brand: string;
  model: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  product: ProductInfo;
};

export function InquiryModal({ open, onClose, product }: Props) {
  const productTitle = useMemo(() => {
    const base = `${product.brand} ${product.model}`.trim();
    return base || product.name || "Продукт";
  }, [product]);

  const productUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/product/${product.id}`;
  }, [product.id]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setError("");
    setSent(false);
  }, [open, product.id]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const canSubmit =
    firstName.trim().length > 1 &&
    lastName.trim().length > 1 &&
    isValidBgPhone(phone) &&
    email.trim().length > 5 &&
    !submitting;

  const submit = async () => {
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          product: {
            id: product.id,
            title: productTitle,
            url: productUrl,
          },
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Неуспешно изпращане");
      }

      setSent(true);
    } catch (e: any) {
      setError(e?.message || "Възникна грешка. Опитайте отново.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-pointer bg-black/50"
        aria-label="Затвори"
        onClick={onClose}
      />
      <Card className="relative w-full max-w-lg border border-slate-200 bg-white shadow-2xl">
        <button
          type="button"
          className="absolute right-3 top-3 cursor-pointer rounded-md p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Затвори"
          onClick={onClose}
        >
          <X className="size-5" />
        </button>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-slate-900 pr-8">
            Запитване за: {productTitle}
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Попълнете данните си и ще се свържем с вас.
          </p>

          {sent ? (
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
              Запитването е изпратено успешно.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="inquiry-firstname">Име *</Label>
                    <Input
                      id="inquiry-firstname"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Иван"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inquiry-lastname">Фамилия *</Label>
                    <Input
                      id="inquiry-lastname"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Иванов"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="inquiry-phone">Телефон *</Label>
                <Input
                  id="inquiry-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+359 ..."
                  inputMode="tel"
                  autoComplete="tel"
                  className="mt-2"
                />
                {phone.trim().length > 0 && !isValidBgPhone(phone) ? (
                  <p className="mt-1 text-xs text-red-600">
                    Моля, въведете валиден телефонен номер (напр. 0888 123 456 или +359 888 123 456).
                  </p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="inquiry-email">Email адрес *</Label>
                <Input
                  id="inquiry-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="mt-2"
                />
              </div>

              {error ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <Button
                type="button"
                size="lg"
                disabled={!canSubmit}
                onClick={submit}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600 hover:from-blue-700 hover:via-indigo-700 hover:to-red-700 text-white border-0 disabled:opacity-50"
              >
                {submitting ? "Изпращане..." : "Изпрати запитване"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

