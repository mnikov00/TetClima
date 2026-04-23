"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "@/app/components/ImageWithFallback";
import { Button } from "@/app/components/ui/button";

type Props = {
  images: string[];
  alt: string;
};

export function ProductGallery({ images, alt }: Props) {
  const cleaned = useMemo(() => images.filter(Boolean), [images]);
  const [active, setActive] = useState(0);

  const activeSrc = cleaned[active] ?? cleaned[0] ?? "/placeholder.jpg";
  const canNavigate = cleaned.length > 1;

  const prev = () =>
    setActive((i) => (i - 1 + cleaned.length) % cleaned.length);
  const next = () => setActive((i) => (i + 1) % cleaned.length);

  return (
    <div>
      <div className="relative rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
        <ImageWithFallback
          src={activeSrc}
          alt={alt}
          className="w-full aspect-square sm:aspect-[4/3] object-cover"
        />

        {canNavigate ? (
          <>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow"
              aria-label="Предишна снимка"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow"
              aria-label="Следваща снимка"
            >
              <ChevronRight className="size-5" />
            </Button>
          </>
        ) : null}
      </div>

      {canNavigate ? (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {cleaned.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              className={[
                "shrink-0 rounded-lg overflow-hidden border",
                idx === active
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-slate-200 hover:border-slate-300",
              ].join(" ")}
              onClick={() => setActive(idx)}
              aria-label={`Снимка ${idx + 1}`}
            >
              <ImageWithFallback
                src={src}
                alt={alt}
                className="h-16 w-16 object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

