"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  /** Local text while typing so we do not clamp on every keystroke (that broke multi-digit entry). */
  const [minDraft, setMinDraft] = useState(minPrice);
  const [maxDraft, setMaxDraft] = useState(maxPrice);
  const minFocused = useRef(false);
  const maxFocused = useRef(false);

  useEffect(() => {
    if (!minFocused.current) setMinDraft(minPrice);
  }, [minPrice]);

  useEffect(() => {
    if (!maxFocused.current) setMaxDraft(maxPrice);
  }, [maxPrice]);

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

  /** High end of range used when committing the min box (parent max, or open = maxBound). */
  const hiForMinCommit = useMemo(() => {
    if (maxPrice === "") return maxBound;
    const x = Number(maxPrice);
    if (!Number.isFinite(x)) return maxBound;
    return clamp(x, minBound, maxBound);
  }, [minBound, maxBound, maxPrice]);

  /** Low end of range used when committing the max box (parent min, or open = minBound). */
  const loForMaxCommit = useMemo(() => {
    if (minPrice === "") return minBound;
    const x = Number(minPrice);
    if (!Number.isFinite(x)) return minBound;
    return clamp(x, minBound, maxBound);
  }, [minBound, maxBound, minPrice]);

  const commitMinFromString = (raw: string) => {
    const s = sanitizeDecimal(raw).trim();
    if (s === "" || s === ".") {
      onChangeMin("");
      setMinDraft("");
      return;
    }
    const n = Number(s);
    if (!Number.isFinite(n)) {
      onChangeMin("");
      setMinDraft("");
      return;
    }
    const next = clamp(roundMoney(n), minBound, hiForMinCommit);
    onChangeMin(next <= minBound ? "" : String(next));
    setMinDraft(next <= minBound ? "" : String(next));
  };

  const commitMaxFromString = (raw: string) => {
    const s = sanitizeDecimal(raw).trim();
    if (s === "" || s === ".") {
      onChangeMax("");
      setMaxDraft("");
      return;
    }
    const n = Number(s);
    if (!Number.isFinite(n)) {
      onChangeMax("");
      setMaxDraft("");
      return;
    }
    const next = clamp(roundMoney(n), loForMaxCommit, maxBound);
    onChangeMax(next >= maxBound ? "" : String(next));
    setMaxDraft(next >= maxBound ? "" : String(next));
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
            value={minDraft}
            onFocus={() => {
              minFocused.current = true;
            }}
            onChange={(e) => {
              const s = sanitizeDecimal(e.target.value);
              setMinDraft(s);
              if (s === "") onChangeMin("");
            }}
            onBlur={(e) => {
              minFocused.current = false;
              commitMinFromString(e.currentTarget.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
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
            value={maxDraft}
            onFocus={() => {
              maxFocused.current = true;
            }}
            onChange={(e) => {
              const s = sanitizeDecimal(e.target.value);
              setMaxDraft(s);
              if (s === "") onChangeMax("");
            }}
            onBlur={(e) => {
              maxFocused.current = false;
              commitMaxFromString(e.currentTarget.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
          />
        </div>
      </div>
    </div>
  );
}
