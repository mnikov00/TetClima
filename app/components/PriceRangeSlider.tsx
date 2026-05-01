"use client";

import { useMemo, useState } from "react";
import { formatPriceEur } from "@/lib/currency";
import { Input } from "@/app/components/ui/input";
import { cn } from "@/app/components/ui/utils";

type Props = {
  minBound: number;
  maxBound: number;
  minPrice: string;
  maxPrice: string;
  onChangeMin: (value: string) => void;
  onChangeMax: (value: string) => void;
  idPrefix?: string;
};

function clamp(n: number, lo: number, hi: number) {
  return Math.min(Math.max(n, lo), hi);
}

function roundMoney(n: number) {
  return Math.round(n * 100) / 100;
}

function sanitizeDecimal(raw: string) {
  return raw.replace(/[^\d.,]/g, "").replace(",", ".");
}

/** Shared visuals: transparent track, thumbs receive pointer events. */
const dualRangeInputClass = cn(
  "pointer-events-none absolute left-0 top-0 h-10 w-full cursor-pointer appearance-none bg-transparent",
  "[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent",
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:mt-[-5px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-md",
  "[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-transparent",
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:shadow-md",
);

export function PriceRangeSlider({
  minBound,
  maxBound,
  minPrice,
  maxPrice,
  onChangeMin,
  onChangeMax,
  idPrefix = "price",
}: Props) {
  const [topZ, setTopZ] = useState<"min" | "max">("max");

  const boundsOk =
    Number.isFinite(minBound) &&
    Number.isFinite(maxBound) &&
    minBound >= 0 &&
    maxBound >= minBound;

  const step = useMemo(() => {
    if (!boundsOk || maxBound <= minBound) return 1;
    const span = maxBound - minBound;
    if (span <= 100) return 1;
    if (span <= 500) return 5;
    return Math.max(5, Math.round(span / 80));
  }, [boundsOk, minBound, maxBound]);

  const { lo, hi } = useMemo(() => {
    if (!boundsOk) return { lo: 0, hi: 0 };
    if (maxBound === minBound) return { lo: minBound, hi: maxBound };

    const rawLo = minPrice === "" ? minBound : Number(minPrice);
    const rawHi = maxPrice === "" ? maxBound : Number(maxPrice);
    const a = Number.isFinite(rawLo) ? clamp(rawLo, minBound, maxBound) : minBound;
    const b = Number.isFinite(rawHi) ? clamp(rawHi, minBound, maxBound) : maxBound;
    return { lo: Math.min(a, b), hi: Math.max(a, b) };
  }, [boundsOk, minBound, maxBound, minPrice, maxPrice]);

  const span = maxBound - minBound;
  const loPct = span > 0 ? ((lo - minBound) / span) * 100 : 0;
  const hiPct = span > 0 ? ((hi - minBound) / span) * 100 : 100;

  if (!boundsOk) {
    return <p className="text-xs text-slate-500">Няма данни за цена.</p>;
  }

  if (maxBound === minBound) {
    return (
      <p className="text-sm text-slate-600">
        Цени в каталога: {formatPriceEur(minBound)}
      </p>
    );
  }

  const applyLo = (n: number) => {
    const next = clamp(roundMoney(n), minBound, hi);
    onChangeMin(next <= minBound ? "" : String(next));
  };

  const applyHi = (n: number) => {
    const next = clamp(roundMoney(n), lo, maxBound);
    onChangeMax(next >= maxBound ? "" : String(next));
  };

  return (
    <div className="space-y-4 pt-1">
      <div className="relative mx-0.5 h-10 select-none">
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-slate-200" />
        <div
          className="pointer-events-none absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-blue-600"
          style={{
            left: `${loPct}%`,
            width: `${Math.max(0, hiPct - loPct)}%`,
          }}
        />
        <input
          id={`${idPrefix}-lo`}
          type="range"
          min={minBound}
          max={maxBound}
          step={step}
          value={lo}
          aria-label="Минимална цена"
          className={dualRangeInputClass}
          style={{ zIndex: topZ === "min" ? 30 : 20 }}
          onPointerDown={() => setTopZ("min")}
          onChange={(e) => {
            const v = Number(e.target.value);
            const next = clamp(v, minBound, hi);
            onChangeMin(next <= minBound ? "" : String(roundMoney(next)));
          }}
        />
        <input
          id={`${idPrefix}-hi`}
          type="range"
          min={minBound}
          max={maxBound}
          step={step}
          value={hi}
          aria-label="Максимална цена"
          className={dualRangeInputClass}
          style={{ zIndex: topZ === "max" ? 30 : 20 }}
          onPointerDown={() => setTopZ("max")}
          onChange={(e) => {
            const v = Number(e.target.value);
            const next = clamp(v, lo, maxBound);
            onChangeMax(next >= maxBound ? "" : String(roundMoney(next)));
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${idPrefix}-in-min`} className="mb-1 block text-xs text-slate-600">
            От
          </label>
          <Input
            id={`${idPrefix}-in-min`}
            inputMode="decimal"
            placeholder={String(minBound)}
            value={minPrice}
            onChange={(e) => {
              const s = sanitizeDecimal(e.target.value);
              if (s === "") {
                onChangeMin("");
                return;
              }
              const n = Number(s);
              if (!Number.isFinite(n)) return;
              applyLo(n);
            }}
            onBlur={() => {
              if (minPrice === "") return;
              const n = Number(minPrice);
              if (!Number.isFinite(n)) onChangeMin("");
              else applyLo(n);
            }}
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-in-max`} className="mb-1 block text-xs text-slate-600">
            До
          </label>
          <Input
            id={`${idPrefix}-in-max`}
            inputMode="decimal"
            placeholder={String(maxBound)}
            value={maxPrice}
            onChange={(e) => {
              const s = sanitizeDecimal(e.target.value);
              if (s === "") {
                onChangeMax("");
                return;
              }
              const n = Number(s);
              if (!Number.isFinite(n)) return;
              applyHi(n);
            }}
            onBlur={() => {
              if (maxPrice === "") return;
              const n = Number(maxPrice);
              if (!Number.isFinite(n)) onChangeMax("");
              else applyHi(n);
            }}
          />
        </div>
      </div>
    </div>
  );
}
