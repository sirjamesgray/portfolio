"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { Send, MapPin, ToggleLeft, ToggleRight, Calendar, Clock, Loader2, Sun } from "lucide-react";
import { BellIcon } from "@/components/ui/bell";
import { HeartIcon, type HeartIconHandle } from "@/components/ui/heart";
import { ZapIcon } from "@/components/ui/zap";
import { RefreshCWIcon } from "@/components/ui/refresh-cw";
import { WifiIcon, type WifiIconHandle } from "@/components/ui/wifi";
import { MoonIcon } from "@/components/ui/moon";
import { DownloadIcon, type DownloadIconHandle } from "@/components/ui/download";
import { UserIcon, type UserIconHandle } from "@/components/ui/user";
import { CheckIcon } from "@/components/ui/check";
import { VolumeIcon } from "@/components/ui/volume";
import { LockIcon, type LockIconHandle } from "@/components/ui/lock";
import { LockOpenIcon, type LockOpenIconHandle } from "@/components/ui/lock-open";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

// Style definitions for different visual aesthetics
// Uses CSS custom properties for colors that cascade to children
// forcedTheme: "light" | "dark" | null - forces the style to ignore system theme
// Order: neon, blueprint, neumorphism, glassmorphism, pixel, paper, leather
export const SHOWCASE_STYLES = {
  neon: {
    forcedTheme: "dark" as const,
    container: "bg-slate-950 [--showcase-text:#ffffff] [--showcase-muted:rgba(167,243,252,0.8)] [--showcase-glow:0_0_10px_rgba(6,182,212,0.5)] [--showcase-accent:#06b6d4] [--showcase-accent-hover:#22d3ee] [--showcase-badge-text:#0f172a] [--showcase-neon-glow:0_0_8px_rgba(6,182,212,0.6),0_0_16px_rgba(6,182,212,0.3)]",
    card: "bg-slate-900/90 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6),0_0_20px_rgba(6,182,212,0.3),inset_0_0_12px_rgba(6,182,212,0.15)]",
  },
  blueprint: {
    forcedTheme: "dark" as const,
    container: "bg-blue-950 [background-image:linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] [background-size:20px_20px] [--showcase-text:#ffffff] [--showcase-muted:rgba(191,219,254,0.8)] [--showcase-accent:#3b82f6] [--showcase-accent-hover:#60a5fa] [--showcase-badge-text:#ffffff]",
    card: "bg-blue-900/50 border-blue-400/40 border-dashed !rounded-none",
  },
  neumorphism: {
    forcedTheme: "light" as const,
    container: "bg-slate-200 [--showcase-text:#334155] [--showcase-muted:#64748b] [--showcase-accent:#6366f1] [--showcase-accent-hover:#818cf8] [--showcase-badge-text:#ffffff] [--showcase-neu-shadow-light:inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] [--showcase-neu-bg:#cbd5e1]",
    card: "bg-slate-200 border-transparent shadow-[6px_6px_12px_rgba(0,0,0,0.08),-6px_-6px_12px_rgba(255,255,255,0.9)]",
  },
  glassmorphism: {
    forcedTheme: "light" as const,
    container: "bg-[linear-gradient(135deg,#e9d5ff_0%,#fbcfe8_50%,#a5f3fc_100%)] [--showcase-text:#1f2937] [--showcase-muted:rgba(55,65,81,0.8)] [--showcase-accent:#a855f7] [--showcase-accent-hover:#c084fc] [--showcase-badge-text:#ffffff]",
    card: "bg-white/70 backdrop-blur-xl border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.1)]",
  },
  pixel: {
    forcedTheme: "dark" as const,
    container: "bg-[#1a1c2c] [--showcase-text:#f4f4f4] [--showcase-muted:#5d5d8a] [--showcase-accent:#29adff] [--showcase-accent-hover:#00e436] [--showcase-badge-text:#1a1c2c]",
    card: "bg-[#2a2d3e] border-2 border-[#3a3f5c] !rounded-none shadow-[4px_4px_0px_#0d0e14]",
  },
  paper: {
    forcedTheme: "light" as const,
    container: "bg-[#f5f0e6] [--showcase-text:#1c1917] [--showcase-muted:#57534e] [--showcase-accent:#b45309] [--showcase-accent-hover:#92400e] [--showcase-badge-text:#fef3c7]",
    card: "bg-[#faf8f3] border-amber-800/15 shadow-[2px_2px_8px_rgba(180,160,120,0.12)]",
  },
  leather: {
    forcedTheme: "dark" as const,
    container: "bg-gradient-to-br from-amber-950 to-stone-900 [--showcase-text:#ffffff] [--showcase-muted:rgba(253,230,138,0.8)] [--showcase-accent:#d97706] [--showcase-accent-hover:#f59e0b] [--showcase-badge-text:#1c1917]",
    card: "bg-gradient-to-br from-amber-900/80 to-amber-950/80 border-amber-700/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),0_4px_8px_rgba(0,0,0,0.3)]",
  },
} as const;

export type ShowcaseStyle = keyof typeof SHOWCASE_STYLES;

// Style context
import { createContext, useContext } from "react";
const StyleContext = createContext<ShowcaseStyle>("paper");
const useStyle = () => useContext(StyleContext);
const useStyleClasses = () => SHOWCASE_STYLES[useStyle()];

// Blueprint cross corner marker
function BlueprintCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const positionClasses = {
    tl: "-top-1 -left-1",
    tr: "-top-1 -right-1",
    bl: "-bottom-1 -left-1",
    br: "-bottom-1 -right-1",
  };
  return (
    <div className={cn("absolute w-2 h-2", positionClasses[position])}>
      <div className="absolute top-1/2 left-0 w-full h-px bg-blue-300" />
      <div className="absolute left-1/2 top-0 h-full w-px bg-blue-300" />
    </div>
  );
}

function InteractiveCard({
  children,
  className,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  const styles = useStyleClasses();
  const activeStyle = useStyle();
  const isNeon = activeStyle === "neon";
  const isBlueprint = activeStyle === "blueprint";
  return (
    <div
      className={cn(
        "relative flex items-center gap-3 rounded-xl border px-5 py-4 transition-all duration-500 shrink-0 h-[72px]",
        isNeon && "[text-shadow:var(--showcase-glow)]",
        styles.card,
        className
      )}
      style={{ color: "var(--showcase-text)" }}
    >
      {isBlueprint && (
        <>
          <BlueprintCorner position="tl" />
          <BlueprintCorner position="tr" />
          <BlueprintCorner position="bl" />
          <BlueprintCorner position="br" />
        </>
      )}
      {label && (
        <span
          className="absolute top-1 right-2 text-[9px] font-mono opacity-50"
          style={{ color: "var(--showcase-muted)" }}
        >
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

// Style-specific component styling
const getStyleConfig = (style: ShowcaseStyle) => {
  const configs = {
    paper: {
      switch: {
        track: "bg-amber-200/50",
        trackChecked: "!bg-[var(--showcase-accent)]",
        thumb: "bg-white shadow-sm",
        thumbChecked: "",
      },
      checkbox: {
        base: "border-amber-400/50",
        checked: "!bg-[var(--showcase-accent)] !border-[var(--showcase-accent)]",
      },
      slider: {
        track: "bg-amber-200/50",
        range: "bg-[var(--showcase-accent)]",
        thumb: "border-[var(--showcase-accent)] bg-white",
      },
      badge: {
        default: "!bg-[var(--showcase-accent)] text-amber-50",
        secondary: "bg-amber-100 text-amber-800 border-amber-300/50",
        outline: "border-amber-400/50 text-amber-700",
      },
      button: "!bg-[var(--showcase-accent)] hover:!bg-[var(--showcase-accent-hover)] text-white",
      progress: { track: "bg-amber-200/30", bar: "bg-[var(--showcase-accent)]" },
      segmented: {
        container: "bg-amber-100/50 border border-amber-300/30",
        item: "text-amber-700/70",
        itemActive: "bg-white text-amber-900 shadow-sm",
      },
    },
    neon: {
      switch: {
        track: "bg-cyan-950 border border-cyan-500/30",
        trackChecked: "!bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]",
        thumb: "bg-slate-900 shadow-[0_0_6px_rgba(6,182,212,0.8)]",
        thumbChecked: "!bg-white",
      },
      checkbox: {
        base: "border-cyan-500/50 bg-cyan-950/50 shadow-[0_0_6px_rgba(6,182,212,0.3)]",
        checked: "!bg-cyan-500 !border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.6)]",
      },
      slider: {
        track: "bg-cyan-950 border border-cyan-500/30",
        range: "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]",
        thumb: "border-cyan-400 bg-slate-900 shadow-[0_0_8px_rgba(6,182,212,0.6)]",
      },
      badge: {
        default: "!bg-cyan-500 text-slate-900 shadow-[0_0_10px_rgba(6,182,212,0.5)]",
        secondary: "bg-cyan-950 text-cyan-300 border-cyan-500/40 shadow-[0_0_6px_rgba(6,182,212,0.2)]",
        outline: "border-cyan-500/50 text-cyan-300 shadow-[0_0_6px_rgba(6,182,212,0.2)]",
      },
      button: "!bg-cyan-500 hover:!bg-cyan-400 text-slate-900 shadow-[0_0_12px_rgba(6,182,212,0.4)] hover:shadow-[0_0_16px_rgba(6,182,212,0.6)]",
      progress: { track: "bg-cyan-950 border border-cyan-500/30", bar: "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" },
      segmented: {
        container: "bg-cyan-950 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2),inset_0_0_6px_rgba(6,182,212,0.1)]",
        item: "text-cyan-500/60",
        itemActive: "bg-cyan-500 text-slate-900 shadow-[0_0_10px_rgba(6,182,212,0.6)]",
      },
    },
    leather: {
      switch: {
        track: "bg-amber-950/50 border border-amber-700/30",
        trackChecked: "!bg-[var(--showcase-accent)]",
        thumb: "bg-amber-100 shadow-md",
        thumbChecked: "",
      },
      checkbox: {
        base: "border-amber-600/50 bg-amber-950/30",
        checked: "!bg-[var(--showcase-accent)] !border-amber-500",
      },
      slider: {
        track: "bg-amber-950/50 border border-amber-700/30",
        range: "bg-[var(--showcase-accent)]",
        thumb: "border-amber-500 bg-amber-100 shadow-md",
      },
      badge: {
        default: "!bg-[var(--showcase-accent)] text-amber-950",
        secondary: "bg-amber-900/50 text-amber-200 border-amber-600/40",
        outline: "border-amber-500/50 text-amber-200",
      },
      button: "!bg-[var(--showcase-accent)] hover:!bg-[var(--showcase-accent-hover)] text-amber-950 shadow-md",
      progress: { track: "bg-amber-950/30", bar: "bg-[var(--showcase-accent)]" },
      segmented: {
        container: "bg-amber-950/40 border border-amber-700/40",
        item: "text-amber-400/60",
        itemActive: "bg-amber-700 text-amber-100 shadow-md",
      },
    },
    blueprint: {
      switch: {
        track: "bg-blue-950 border border-blue-400/40 border-dashed",
        trackChecked: "!bg-blue-500 !border-solid",
        thumb: "bg-blue-100",
        thumbChecked: "",
      },
      checkbox: {
        base: "border-blue-400/50 border-dashed bg-blue-950/50",
        checked: "!bg-blue-500 !border-blue-400 !border-solid",
      },
      slider: {
        track: "bg-blue-950 border border-blue-400/40 border-dashed",
        range: "bg-blue-500",
        thumb: "border-blue-400 bg-blue-100",
      },
      badge: {
        default: "!bg-blue-500 text-white",
        secondary: "bg-blue-900/50 text-blue-200 border-blue-400/40 border-dashed",
        outline: "border-blue-400/50 border-dashed text-blue-200",
      },
      button: "!bg-blue-500 hover:!bg-blue-400 text-white",
      progress: { track: "bg-blue-950 border border-blue-400/30 border-dashed", bar: "bg-blue-500" },
      segmented: {
        container: "bg-blue-950 border border-blue-400/40 border-dashed !rounded-none",
        item: "text-blue-300/60",
        itemActive: "bg-blue-500 text-white !rounded-none",
      },
    },
    neumorphism: {
      switch: {
        track: "bg-slate-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.7)]",
        trackChecked: "!bg-indigo-500 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]",
        thumb: "bg-slate-100 shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.8)]",
        thumbChecked: "",
      },
      checkbox: {
        base: "bg-slate-200 border-transparent shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.7)]",
        checked: "!bg-indigo-500 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]",
      },
      slider: {
        track: "bg-slate-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.7)]",
        range: "bg-indigo-500",
        thumb: "border-transparent bg-slate-100 shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,0.8)]",
      },
      badge: {
        default: "!bg-indigo-500 text-white shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.5)]",
        secondary: "bg-slate-200 text-slate-600 border-transparent shadow-[2px_2px_4px_rgba(0,0,0,0.08),-2px_-2px_4px_rgba(255,255,255,0.7)]",
        outline: "bg-slate-200 border-transparent text-slate-600 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.7)]",
      },
      button: "!bg-slate-200 !text-indigo-600 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.8)] hover:shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.8)]",
      progress: {
        track: "bg-slate-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.7)]",
        bar: "bg-indigo-500"
      },
      segmented: {
        container: "bg-slate-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.6)]",
        item: "text-slate-500",
        itemActive: "bg-slate-100 text-indigo-600 shadow-[2px_2px_4px_rgba(0,0,0,0.08),-2px_-2px_4px_rgba(255,255,255,0.7)]",
      },
    },
    glassmorphism: {
      switch: {
        track: "bg-white/20 backdrop-blur-sm border border-white/30",
        trackChecked: "!bg-purple-500/80 backdrop-blur-sm",
        thumb: "bg-white shadow-lg",
        thumbChecked: "",
      },
      checkbox: {
        base: "border-white/40 bg-white/20 backdrop-blur-sm",
        checked: "!bg-purple-500/80 !border-purple-400/50 backdrop-blur-sm",
      },
      slider: {
        track: "bg-white/20 backdrop-blur-sm border border-white/30",
        range: "bg-purple-500/80",
        thumb: "border-white/50 bg-white shadow-lg",
      },
      badge: {
        default: "!bg-purple-500/80 text-white backdrop-blur-sm",
        secondary: "bg-white/30 text-gray-700 border-white/40 backdrop-blur-sm",
        outline: "border-white/50 text-gray-700 backdrop-blur-sm",
      },
      button: "!bg-purple-500/80 hover:!bg-purple-500/90 text-white backdrop-blur-sm shadow-lg",
      progress: { track: "bg-white/20 backdrop-blur-sm", bar: "bg-purple-500/80" },
      segmented: {
        container: "bg-white/20 backdrop-blur-sm border border-white/30",
        item: "text-gray-600/70",
        itemActive: "bg-white/60 text-gray-800 backdrop-blur-sm shadow-sm",
      },
    },
    pixel: {
      switch: {
        track: "bg-[#3a3f5c] border-[2px] border-[#5d5d8a] !rounded-none",
        trackChecked: "!bg-[#00e436] !border-[#00e436]",
        thumb: "bg-[#f4f4f4] !rounded-none shadow-[2px_2px_0px_#0d0e14]",
        thumbChecked: "",
      },
      checkbox: {
        base: "border-[2px] border-[#5d5d8a] bg-[#3a3f5c] !rounded-none",
        checked: "!bg-[#29adff] !border-[#29adff]",
      },
      slider: {
        track: "bg-[#3a3f5c] border-[2px] border-[#5d5d8a] !rounded-none",
        range: "bg-[#29adff]",
        thumb: "border-[2px] border-[#5d5d8a] bg-[#f4f4f4] !rounded-none shadow-[2px_2px_0px_#0d0e14]",
      },
      badge: {
        default: "!bg-[#29adff] text-[#1a1c2c] !rounded-none border-[2px] border-[#29adff] shadow-[2px_2px_0px_#0d0e14]",
        secondary: "bg-[#3a3f5c] text-[#f4f4f4] !rounded-none border-[2px] border-[#5d5d8a] shadow-[2px_2px_0px_#0d0e14]",
        outline: "!rounded-none border-[2px] border-[#5d5d8a] text-[#f4f4f4]",
      },
      button: "!bg-[#29adff] hover:!bg-[#00e436] text-[#1a1c2c] !rounded-none border-[2px] border-[#29adff] hover:border-[#00e436] shadow-[3px_3px_0px_#0d0e14] hover:shadow-[2px_2px_0px_#0d0e14] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
      progress: { track: "bg-[#3a3f5c] border-[2px] border-[#5d5d8a] !rounded-none", bar: "bg-[#29adff]" },
      segmented: {
        container: "bg-[#3a3f5c] border-[2px] border-[#5d5d8a] !rounded-none",
        item: "text-[#5d5d8a] !rounded-none",
        itemActive: "bg-[#29adff] text-[#1a1c2c] !rounded-none shadow-[2px_2px_0px_#0d0e14]",
      },
    },
  };
  return configs[style];
};

// Themed component wrappers with style-specific styling
function ThemedSwitch({ checked, onCheckedChange, className }: { checked: boolean; onCheckedChange: (checked: boolean) => void; className?: string }) {
  const activeStyle = useStyle();
  const config = getStyleConfig(activeStyle);

  return (
    <div
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-[1.15rem] w-8 shrink-0 cursor-pointer items-center rounded-full transition-all duration-200",
        config.switch.track,
        checked && config.switch.trackChecked,
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none block size-4 rounded-full transition-transform duration-200",
          config.switch.thumb,
          checked && config.switch.thumbChecked,
          checked ? "translate-x-[calc(100%-2px)]" : "translate-x-0"
        )}
      />
    </div>
  );
}

function ThemedSlider({ value, onValueChange, max = 100, step = 1, className }: { value: number[]; onValueChange: (value: number[]) => void; max?: number; step?: number; className?: string }) {
  const activeStyle = useStyle();
  const config = getStyleConfig(activeStyle);
  const percentage = ((value[0] || 0) / max) * 100;

  return (
    <div className={cn("relative flex w-full touch-none items-center select-none h-4", className)}>
      <div className={cn("relative h-1.5 w-full overflow-hidden rounded-full", config.slider.track)}>
        <div
          className={cn("absolute h-full rounded-full transition-all duration-300", config.slider.range)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={value[0]}
        onChange={(e) => onValueChange([parseInt(e.target.value)])}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div
        className={cn("absolute size-4 rounded-full border-2 transition-all duration-300", config.slider.thumb)}
        style={{ left: `calc(${percentage}% - 8px)` }}
      />
    </div>
  );
}

function ThemedCheckbox({ checked, onCheckedChange, className }: { checked: boolean; onCheckedChange: (checked: boolean) => void; className?: string }) {
  const activeStyle = useStyle();
  const config = getStyleConfig(activeStyle);

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "size-4 shrink-0 rounded-[4px] border transition-all duration-200 flex items-center justify-center",
        config.checkbox.base,
        checked && config.checkbox.checked,
        className
      )}
    >
      {checked && (
        <svg className="size-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  );
}

function ThemedButton({ children, size = "sm", className }: { children: React.ReactNode; size?: "sm" | "default" | "lg" | "icon"; className?: string }) {
  const activeStyle = useStyle();
  const config = getStyleConfig(activeStyle);

  const sizeClasses = {
    sm: "h-8 rounded-md gap-1.5 px-3 text-sm",
    default: "h-9 px-4 py-2",
    lg: "h-10 rounded-md px-6",
    icon: "size-9",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all rounded-md",
        sizeClasses[size],
        config.button,
        className
      )}
    >
      {children}
    </button>
  );
}

function ThemedBadge({ children, variant = "default", className }: { children: React.ReactNode; variant?: "default" | "secondary" | "outline" | "destructive"; className?: string }) {
  const activeStyle = useStyle();
  const config = getStyleConfig(activeStyle);

  const variantClass = variant === "destructive"
    ? "bg-red-500 text-white"
    : config.badge[variant as keyof typeof config.badge] || config.badge.default;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium transition-all",
        variantClass,
        className
      )}
    >
      {children}
    </span>
  );
}

// Progress bar component with style-specific effects
function ThemedProgressBar({ progress, className }: { progress: number; className?: string }) {
  const activeStyle = useStyle();
  const config = getStyleConfig(activeStyle);

  return (
    <div className={cn("h-1.5 w-full rounded-full overflow-hidden", config.progress.track, className)}>
      <motion.div
        className={cn("h-full rounded-full", config.progress.bar)}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}

// Segmented controller component with animated selection indicator
function ThemedSegmentedController<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  const activeStyle = useStyle();
  const config = getStyleConfig(activeStyle);
  const activeIndex = options.findIndex((o) => o.value === value);
  const itemWidth = 44; // Fixed width per item in pixels

  return (
    <div
      className={cn(
        "relative grid p-1 rounded-lg",
        config.segmented.container,
        className
      )}
      style={{ gridTemplateColumns: `repeat(${options.length}, ${itemWidth}px)` }}
    >
      {/* Animated background indicator */}
      <motion.div
        className={cn(
          "absolute top-1 bottom-1 rounded-md",
          config.segmented.itemActive
        )}
        style={{ width: itemWidth - 4 }}
        initial={false}
        animate={{
          left: 4 + activeIndex * itemWidth,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
      {/* Option buttons */}
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "relative z-10 py-1 text-xs font-medium transition-colors rounded-md text-center",
            value === option.value
              ? "text-inherit"
              : config.segmented.item
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// Icon wrapper that uses themed colors
function ThemedIcon({ icon: Icon, active, activeColor, className, ...props }: { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; active?: boolean; activeColor?: string; className?: string; [key: string]: unknown }) {
  return (
    <Icon
      className={cn("transition-colors", className)}
      style={{ color: active ? (activeColor || "var(--showcase-accent)") : "var(--showcase-muted)" }}
      {...props}
    />
  );
}

function AutoToggleSwitch() {
  const [checked, setChecked] = useState(false);
  const bellRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setChecked((prev) => {
        bellRef.current?.startAnimation();
        return !prev;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard label="Toggle">
      <BellIcon ref={bellRef} size={16} className="transition-colors" style={{ color: checked ? "var(--showcase-accent)" : "var(--showcase-muted)" }} />
      <span className="text-sm font-medium">Notifications</span>
      <ThemedSwitch checked={checked} onCheckedChange={setChecked} className="ml-auto" />
    </InteractiveCard>
  );
}

function AutoSlider() {
  const [value, setValue] = useState([30]);
  const zapRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(([current]) => {
        const next = current + 15;
        zapRef.current?.startAnimation();
        return [next > 100 ? 20 : next];
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard className="min-w-[180px]" label="Slider">
      <ZapIcon ref={zapRef} size={16} style={{ color: "var(--showcase-accent)" }} />
      <div className="flex flex-1 flex-col gap-1">
        <span className="text-sm font-medium">Performance</span>
        <ThemedSlider value={value} onValueChange={setValue} max={100} step={1} className="w-full" />
      </div>
    </InteractiveCard>
  );
}

function AutoCheckboxes() {
  const [checks, setChecks] = useState([true, false, false]);
  const checkRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  useEffect(() => {
    let index = 1;
    const interval = setInterval(() => {
      setChecks((prev) => {
        const next = [...prev];
        next[index] = !next[index];
        checkRef.current?.startAnimation();
        index = index === 2 ? 1 : 2;
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard label="Checkboxes">
      <div className="flex items-center gap-2">
        <CheckIcon ref={checkRef} size={16} style={{ color: "var(--showcase-accent)" }} />
        <span className="text-sm font-medium">Features</span>
      </div>
      <div className="flex gap-3 ml-2">
        {["Analytics", "Reports", "Alerts"].map((label, i) => (
          <div
            key={label}
            className="flex items-center gap-1.5 transition-opacity duration-200"
            style={{ opacity: checks[i] ? 1 : 0.7 }}
          >
            <ThemedCheckbox
              checked={checks[i]}
              onCheckedChange={(checked) => {
                setChecks((prev) => {
                  const next = [...prev];
                  next[i] = checked as boolean;
                  return next;
                });
              }}
            />
            <span className="text-xs transition-colors" style={{ color: checks[i] ? "var(--showcase-text)" : "var(--showcase-muted)" }}>{label}</span>
          </div>
        ))}
      </div>
    </InteractiveCard>
  );
}

function AutoButton() {
  const [clicked, setClicked] = useState(false);
  const checkRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setClicked(true);
      checkRef.current?.startAnimation();
      setTimeout(() => setClicked(false), 600);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard label="Button">
      <ThemedButton
        size="sm"
        className={cn(
          "transition-all duration-200 w-[72px] justify-center",
          clicked && "scale-95"
        )}
      >
        <AnimatePresence mode="wait">
          {clicked ? (
            <motion.span
              key="sent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center"
            >
              <CheckIcon ref={checkRef} size={14} className="mr-1" />
              Sent!
            </motion.span>
          ) : (
            <motion.span
              key="send"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center"
            >
              <Send className="mr-1 h-3 w-3" />
              Send
            </motion.span>
          )}
        </AnimatePresence>
      </ThemedButton>
    </InteractiveCard>
  );
}

function AutoBadges() {
  const [activeBadge, setActiveBadge] = useState(0);
  const badges = [
    { label: "New", variant: "default" as const },
    { label: "Popular", variant: "secondary" as const },
    { label: "Trending", variant: "outline" as const },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBadge((prev) => (prev + 1) % badges.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [badges.length]);

  return (
    <InteractiveCard label="Badges">
      <div className="flex gap-2">
        {badges.map((badge, i) => (
          <ThemedBadge
            key={badge.label}
            variant={badge.variant}
            className={cn(
              "transition-all duration-300",
              activeBadge === i ? "scale-110 ring-2 ring-[var(--showcase-accent)]/20" : "opacity-60"
            )}
          >
            {badge.label}
          </ThemedBadge>
        ))}
      </div>
    </InteractiveCard>
  );
}

function AutoLike() {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(42);
  const heartRef = useRef<HeartIconHandle>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiked((prev) => {
        setCount((c) => (prev ? c - 1 : c + 1));
        return !prev;
      });
      setTimeout(() => heartRef.current?.startAnimation(), 0);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard label="Like">
      <button
        onClick={() => {
          setLiked(!liked);
          setCount((c) => (liked ? c - 1 : c + 1));
          heartRef.current?.startAnimation();
        }}
        className="flex items-center gap-2"
      >
        <HeartIcon
          ref={heartRef}
          size={20}
          className="transition-all duration-300"
          style={{ color: liked ? "var(--showcase-accent)" : "var(--showcase-muted)", fill: liked ? "var(--showcase-accent)" : "none" }}
        />
        <span className="inline-block w-[2ch] text-left">
          <NumberFlow
            value={count}
            className="text-sm font-medium tabular-nums"
            transformTiming={{ duration: 400, easing: "ease-out" }}
          />
        </span>
      </button>
    </InteractiveCard>
  );
}

function AutoVolume() {
  const [value, setValue] = useState([65]);
  const volumeRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.random() > 0.5 ? 10 : -10;
      setValue(([current]) => {
        const next = Math.max(20, Math.min(100, current + change));
        return [next];
      });
      // Call animation outside of setState to avoid render-time updates
      setTimeout(() => volumeRef.current?.startAnimation(), 0);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard className="min-w-[160px]" label="Volume">
      <VolumeIcon ref={volumeRef} size={16} style={{ color: "var(--showcase-accent)" }} />
      <ThemedSlider value={value} onValueChange={setValue} max={100} step={1} className="w-full" />
    </InteractiveCard>
  );
}

function AutoWifi() {
  const [connected, setConnected] = useState(true);
  const wifiRef = useRef<WifiIconHandle>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setConnected((prev) => {
        wifiRef.current?.startAnimation();
        return !prev;
      });
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard label="WiFi">
      <WifiIcon ref={wifiRef} size={16} className="transition-colors" style={{ color: connected ? "var(--showcase-accent)" : "var(--showcase-muted)" }} />
      <span className="text-sm font-medium">WiFi</span>
      <ThemedSwitch checked={connected} onCheckedChange={setConnected} className="ml-auto" />
    </InteractiveCard>
  );
}

function AutoDarkMode() {
  const [dark, setDark] = useState(false);
  const moonRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDark((prev) => {
        setTimeout(() => moonRef.current?.startAnimation(), 0);
        return !prev;
      });
    }, 2700);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard label="DarkMode">
      <AnimatePresence mode="wait">
        {dark ? (
          <motion.div
            key="moon"
            initial={{ scale: 0.8, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <MoonIcon ref={moonRef} size={16} style={{ color: "var(--showcase-accent)" }} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ scale: 0.8, opacity: 0, rotate: 90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-4 w-4" style={{ color: "var(--showcase-accent)" }} />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="text-sm font-medium w-[72px]">{dark ? "Dark Mode" : "Light Mode"}</span>
      <ThemedSwitch checked={dark} onCheckedChange={setDark} className="ml-auto" />
    </InteractiveCard>
  );
}

function AutoProgress() {
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(true);
  const downloadRef = useRef<DownloadIconHandle>(null);
  const checkRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setDownloading(false);
          checkRef.current?.startAnimation();
          setTimeout(() => {
            setProgress(0);
            setDownloading(true);
            downloadRef.current?.startAnimation();
          }, 1500);
          return 100;
        }
        return prev + 8;
      });
    }, 400);

    downloadRef.current?.startAnimation();
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard className="min-w-[180px]" label="Progress">
      <AnimatePresence mode="wait">
        {downloading ? (
          <motion.div key="downloading" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
            <DownloadIcon ref={downloadRef} size={16} style={{ color: "var(--showcase-accent)" }} />
          </motion.div>
        ) : (
          <motion.div key="complete" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
            <CheckIcon ref={checkRef} size={16} style={{ color: "var(--showcase-accent)" }} />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-1 flex-col gap-1">
        <span className="text-sm font-medium w-[95px]">{downloading ? "Downloading..." : "Complete!"}</span>
        <ThemedProgressBar progress={progress} />
      </div>
    </InteractiveCard>
  );
}

function AutoSync() {
  const [syncing, setSyncing] = useState(false);
  const refreshRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);
  const checkRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncing(true);
      refreshRef.current?.startAnimation();
      setTimeout(() => {
        setSyncing(false);
        checkRef.current?.startAnimation();
      }, 1500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard label="Sync">
      <AnimatePresence mode="wait">
        {syncing ? (
          <motion.div key="syncing" initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <RefreshCWIcon ref={refreshRef} size={16} style={{ color: "var(--showcase-accent)" }} />
          </motion.div>
        ) : (
          <motion.div key="synced" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <CheckIcon ref={checkRef} size={14} style={{ color: "var(--showcase-accent)" }} />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="text-sm font-medium w-[58px]">{syncing ? "Syncing..." : "Synced"}</span>
    </InteractiveCard>
  );
}

function AutoUserStatus() {
  const [online, setOnline] = useState(true);
  const userRef = useRef<UserIconHandle>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnline((prev) => {
        userRef.current?.startAnimation();
        return !prev;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard label="UserStatus">
      <div className="relative">
        <UserIcon ref={userRef} size={16} style={{ color: "var(--showcase-muted)" }} />
        <motion.span
          className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-background"
          style={{ backgroundColor: online ? "var(--showcase-accent)" : "var(--showcase-muted)" }}
        />
      </div>
      <span className="text-sm font-medium w-[42px]">{online ? "Online" : "Away"}</span>
    </InteractiveCard>
  );
}


function AutoLocation() {
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTracking((prev) => !prev);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard label="Location">
      <motion.div animate={{ scale: tracking ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.3 }}>
        <MapPin className="h-4 w-4 transition-colors" style={{ color: tracking ? "var(--showcase-accent)" : "var(--showcase-muted)" }} />
      </motion.div>
      <span className="text-sm font-medium">Location</span>
      <ThemedSwitch checked={tracking} onCheckedChange={setTracking} className="ml-auto" />
    </InteractiveCard>
  );
}

function AutoSecurity() {
  const [locked, setLocked] = useState(true);
  const lockRef = useRef<LockIconHandle>(null);
  const lockOpenRef = useRef<LockOpenIconHandle>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLocked((prev) => {
        if (prev) {
          lockOpenRef.current?.startAnimation();
        } else {
          lockRef.current?.startAnimation();
        }
        return !prev;
      });
    }, 3100);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard label="Security">
      <AnimatePresence mode="wait">
        {locked ? (
          <motion.div
            key="locked"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LockIcon ref={lockRef} size={16} style={{ color: "var(--showcase-accent)" }} />
          </motion.div>
        ) : (
          <motion.div
            key="unlocked"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LockOpenIcon ref={lockOpenRef} size={16} style={{ color: "var(--showcase-muted)" }} />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="text-sm font-medium w-[60px]">{locked ? "Locked" : "Unlocked"}</span>
      <AnimatePresence mode="wait">
        <motion.div
          key={locked ? "secure" : "warning"}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ThemedBadge variant={locked ? "default" : "destructive"} className="ml-auto text-xs w-[56px] justify-center">
            {locked ? "Secure" : "Warning"}
          </ThemedBadge>
        </motion.div>
      </AnimatePresence>
    </InteractiveCard>
  );
}

function AutoCalendar() {
  const [day, setDay] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setDay((prev) => (prev >= 28 ? 1 : prev + 1));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard label="Calendar">
      <Calendar className="h-4 w-4" style={{ color: "var(--showcase-accent)" }} />
      <span className="text-sm font-medium tabular-nums flex items-center gap-0.5">
        Jan <span className="inline-block w-[1.5ch] text-right"><NumberFlow value={day} transformTiming={{ duration: 300, easing: "ease-out" }} /></span>
      </span>
      <ThemedBadge variant="outline" className="ml-auto text-xs tabular-nums">
        2025
      </ThemedBadge>
    </InteractiveCard>
  );
}

function AutoClock() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev + 1) % 60);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard label="Clock">
      <Clock className="h-4 w-4" style={{ color: "var(--showcase-accent)" }} />
      <span className="text-sm font-medium tabular-nums flex items-center">
        12:<NumberFlow
          value={seconds}
          format={{ minimumIntegerDigits: 2 }}
          transformTiming={{ duration: 300, easing: "ease-out" }}
        />
      </span>
      <ThemedBadge variant="secondary" className="ml-auto text-xs">
        PM
      </ThemedBadge>
    </InteractiveCard>
  );
}

function AutoLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const checkRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPausedRef.current) return;

      setProgress((prev) => {
        if (prev >= 100) {
          isPausedRef.current = true;
          setLoading(false);
          setTimeout(() => checkRef.current?.startAnimation(), 0);
          setTimeout(() => {
            setProgress(0);
            setLoading(true);
            isPausedRef.current = false;
          }, 1500);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard label="Loader">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
            <Loader2 className="h-4 w-4 animate-spin" style={{ color: "var(--showcase-accent)" }} />
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
            <CheckIcon ref={checkRef} size={16} style={{ color: "var(--showcase-accent)" }} />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="text-sm font-medium w-[68px]">{loading ? "Loading..." : "Done!"}</span>
      <span className="ml-auto text-xs tabular-nums flex items-center w-[3ch] justify-end" style={{ color: "var(--showcase-muted)" }}>
        <NumberFlow
          value={progress}
          transformTiming={{ duration: 150, easing: "ease-out" }}
        />%
      </span>
    </InteractiveCard>
  );
}

function AutoToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setOn((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard label="Power">
      <AnimatePresence mode="wait">
        {on ? (
          <motion.div key="on" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
            <ToggleRight className="h-5 w-5" style={{ color: "var(--showcase-accent)" }} />
          </motion.div>
        ) : (
          <motion.div key="off" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
            <ToggleLeft className="h-5 w-5" style={{ color: "var(--showcase-muted)" }} />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="text-sm font-medium">Power</span>
      <AnimatePresence mode="wait">
        <motion.div
          key={on ? "on" : "off"}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <ThemedBadge variant={on ? "default" : "outline"} className="ml-auto text-xs w-[32px] justify-center">
            {on ? "On" : "Off"}
          </ThemedBadge>
        </motion.div>
      </AnimatePresence>
    </InteractiveCard>
  );
}

const viewOptions = [
  { value: "list" as const, label: "List" },
  { value: "grid" as const, label: "Grid" },
  { value: "table" as const, label: "Table" },
];

function AutoSegmented() {
  const [view, setView] = useState<"list" | "grid" | "table">("list");

  useEffect(() => {
    const interval = setInterval(() => {
      setView((prev) => {
        if (prev === "list") return "grid";
        if (prev === "grid") return "table";
        return "list";
      });
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard label="Segmented" className="min-w-[200px]">
      <span className="text-sm font-medium mr-2">View</span>
      <ThemedSegmentedController
        options={viewOptions}
        value={view}
        onChange={setView}
        className="flex-1"
      />
    </InteractiveCard>
  );
}

// Row 1: Core input components
const row1Components = [
  <AutoToggleSwitch key="toggle" />,
  <AutoSlider key="slider" />,
  <AutoButton key="button" />,
  <AutoCheckboxes key="checkboxes" />,
  <AutoSegmented key="segmented" />,
  <AutoToggle key="power" />,
];

// Row 2: Status and connectivity
const row2Components = [
  <AutoWifi key="wifi" />,
  <AutoDarkMode key="darkmode" />,
  <AutoProgress key="progress" />,
  <AutoSync key="sync" />,
  <AutoUserStatus key="userstatus" />,
  <AutoSecurity key="security" />,
  <AutoLoader key="loader" />,
];

// Row 3: Display and feedback
const row3Components = [
  <AutoBadges key="badges" />,
  <AutoLike key="like" />,
  <AutoCalendar key="calendar" />,
  <AutoClock key="clock" />,
  <AutoVolume key="volume" />,
  <AutoLocation key="location" />,
];

interface UIShowcaseProps {
  style?: ShowcaseStyle;
}

export function UIShowcase({ style = "neon" }: UIShowcaseProps) {
  const styles = SHOWCASE_STYLES[style];

  return (
    <StyleContext.Provider value={style}>
      <section className={cn("relative py-6 transition-all duration-500", styles.container)}>
        <div className="flex flex-col -space-y-2">
          {/* Row 1 - scrolls left */}
          <Marquee className="[--duration:50s]" scrollable>
            {row1Components}
          </Marquee>

          {/* Row 2 - scrolls right (reversed) */}
          <Marquee reverse className="[--duration:55s]" scrollable>
            {row2Components}
          </Marquee>

          {/* Row 3 - scrolls left */}
          <Marquee className="[--duration:45s]" scrollable>
            {row3Components}
          </Marquee>
        </div>
      </section>
    </StyleContext.Provider>
  );
}
