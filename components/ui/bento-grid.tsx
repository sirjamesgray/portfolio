import { ComponentPropsWithoutRef, ReactNode } from "react"

import { cn } from "@/lib/utils"
import { CARD_INTERACTIVE_SOLID } from "@/lib/cards"
import { CursorGlow, GLOW_COLORS } from "@/components/ui/cursor-glow"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className: string
  background: ReactNode
  Icon: React.ComponentType<{ className?: string }>
  description: string
  href?: string
  cta?: string
  /** Custom glow color for CursorGlow. Defaults to emerald. */
  glowColor?: string
  /** Enable sparkles on this card. Respects SparkleProvider context. */
  sparkle?: boolean
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  glowColor,
  sparkle,
  ...props
}: BentoCardProps) => (
  <CursorGlow color={glowColor} sparkle={sparkle}>
    <div
      key={name}
      className={cn(
        "group relative col-span-3 flex flex-col justify-between overflow-hidden",
        // Card system interactive glass styles
        `${CARD_INTERACTIVE_SOLID.base} ${CARD_INTERACTIVE_SOLID.shadow} ${CARD_INTERACTIVE_SOLID.hover}`,
        // dark styles
        "dark:bg-background/50 transform-gpu",
        className
      )}
      {...props}
    >
      <div>{background}</div>
      <div className="p-4">
        <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1">
          <Icon className="h-12 w-12 origin-left transform-gpu text-neutral-700 dark:text-neutral-300" />
          <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
            {name}
          </h3>
          <p className="max-w-lg text-neutral-400">{description}</p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
    </div>
  </CursorGlow>
)

export { BentoCard, BentoGrid }
