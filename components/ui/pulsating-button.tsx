"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PulsatingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string;
  duration?: string;
}

export const PulsatingButton = React.forwardRef<
  HTMLButtonElement,
  PulsatingButtonProps
>(
  (
    {
      className,
      children,
      pulseColor = "hsl(145, 80%, 45%)",
      duration = "1.5s",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative flex cursor-pointer items-center justify-center rounded-lg bg-primary px-4 py-2 text-center text-primary-foreground",
          className
        )}
        style={
          {
            "--pulse-color": pulseColor,
            "--duration": duration,
          } as React.CSSProperties
        }
        {...props}
      >
        <div className="relative z-10">{children}</div>
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            animation: `pulsate var(--duration) ease-out infinite`,
            background: `var(--pulse-color)`,
          }}
        />
        <style jsx>{`
          @keyframes pulsate {
            0% {
              opacity: 0.6;
              transform: scale(1);
            }
            50% {
              opacity: 0;
              transform: scale(1.3);
            }
            100% {
              opacity: 0;
              transform: scale(1.3);
            }
          }
        `}</style>
      </button>
    );
  }
);

PulsatingButton.displayName = "PulsatingButton";
