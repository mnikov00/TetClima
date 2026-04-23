"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { InquiryModal } from "@/app/components/InquiryModal";

type Props = {
  product: {
    id: string;
    name: string;
    brand: string;
    model: string;
  };
};

export function ProductInquiryButton({ product }: Props) {
  const [open, setOpen] = useState(false);

  const triggerClass =
    "w-full text-base sm:text-lg bg-blue-600 hover:bg-blue-700 text-white border-0";

  return (
    <>
      <InquiryModal open={open} onClose={() => setOpen(false)} product={product} />

      {/* Desktop / large screens: stays in layout under the price */}
      <div className="mb-8 hidden lg:block">
        <Button type="button" size="lg" className={triggerClass} onClick={() => setOpen(true)}>
          Изпрати запитване
        </Button>
      </div>

      {/* Mobile: fixed to bottom of the viewport */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur-sm lg:hidden">
        <Button type="button" size="lg" className={triggerClass} onClick={() => setOpen(true)}>
          Изпрати запитване
        </Button>
      </div>
    </>
  );
}

