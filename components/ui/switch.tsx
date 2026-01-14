"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  // Check if using accent style via data attribute
  const accentStyle = props["data-accent-style" as keyof typeof props] as string | undefined;
  const useAccentColor = !!accentStyle;

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        !useAccentColor && "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
        useAccentColor && "data-[state=unchecked]:bg-black/20",
        className
      )}
      style={useAccentColor ? {
        backgroundColor: props.checked ? "var(--showcase-accent)" : undefined,
      } : undefined}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
          !useAccentColor && "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground",
          useAccentColor && "bg-white"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
