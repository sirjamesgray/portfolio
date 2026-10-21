"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-[44px] items-center gap-2 rounded-none bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors motion-reduce:transition-none hover:bg-emerald-800"
    >
      <Printer className="size-4" aria-hidden="true" />
      Print or save as PDF
    </button>
  );
}
