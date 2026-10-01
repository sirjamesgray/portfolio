"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { BoardShot, WorkShot } from "@/lib/public-work";

type Props = {
  board: BoardShot;
  children: React.ReactNode;
};

/** Opens a design board at full size. Detail frames sit under the main board. */
export function BoardLightbox({ board, children }: Props) {
  const [open, setOpen] = useState(false);
  const frames: WorkShot[] = [board, ...(board.details ?? [])];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full cursor-zoom-in text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {children}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto p-3 sm:max-w-[min(96vw,1100px)]">
          <DialogTitle className="pr-8 text-base">{board.alt}</DialogTitle>
          <div className="space-y-4">
            {frames.map((frame) => (
              <Image
                key={frame.src}
                src={frame.src}
                alt={frame.alt}
                width={frame.width}
                height={frame.height}
                sizes="(min-width: 1024px) 1100px, 96vw"
                className="h-auto w-full rounded-md"
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
