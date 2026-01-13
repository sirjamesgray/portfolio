"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CARD_CROSSED_CORNERS } from "@/lib/cards";

interface CrossedCornersCardProps {
  children: ReactNode;
  className?: string;
  crossSize?: number;
}

function CornerCross({
  position,
  size = 12,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: number;
}) {
  // Center the cross on the exact corner point, extending beyond the card
  const halfSize = size / 2;
  const positionStyles = {
    "top-left": { top: -halfSize, left: -halfSize },
    "top-right": { top: -halfSize, right: -halfSize },
    "bottom-left": { bottom: -halfSize, left: -halfSize },
    "bottom-right": { bottom: -halfSize, right: -halfSize },
  };

  return (
    <div
      className="absolute pointer-events-none"
      style={{ width: size, height: size, ...positionStyles[position] }}
    >
      {/* Horizontal line - 1px thick like border */}
      <div
        className="absolute bg-emerald-500 left-0 right-0 h-px"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />
      {/* Vertical line - 1px thick like border */}
      <div
        className="absolute bg-emerald-500 top-0 bottom-0 w-px"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
    </div>
  );
}

export function CrossedCornersCard({
  children,
  className,
  crossSize = 16,
}: CrossedCornersCardProps) {
  return (
    <div className={cn(CARD_CROSSED_CORNERS.full, className)}>
      {/* Corner crosses - brighter than borders */}
      <CornerCross position="top-left" size={crossSize} />
      <CornerCross position="top-right" size={crossSize} />
      <CornerCross position="bottom-left" size={crossSize} />
      <CornerCross position="bottom-right" size={crossSize} />

      {/* Content */}
      {children}
    </div>
  );
}
