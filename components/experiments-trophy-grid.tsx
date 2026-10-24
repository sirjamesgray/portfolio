"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Activity,
  ArrowUpRight,
  Cpu,
  Flame,
  History,
  Layers,
  MapPin,
  Pause,
  Play,
  Sparkles,
  StepForward,
  Terminal,
  Zap,
} from "lucide-react";
import { HeatmapLogo } from "@/components/heatmap-logo";
import { LiquidMetalLogo } from "@/components/liquid-metal-logo";
import { UIShowcase, type ShowcaseStyle } from "@/components/ui-showcase";
import { CareerButton } from "@/components/career-button";
import { EXPERIENCE } from "@/lib/constants";
import type { HomeLab } from "@/lib/factory-os/types";
import { generateHomeLab, updateHomeLab } from "@/lib/factory-os/data-generator";
import styles from "./experiments-trophy.module.css";

type CategoryFilter = "all" | "systems" | "shaders" | "interfaces";

const HEATMAP_PALETTES: Record<
  "emerald" | "solar" | "cryo",
  { label: string; colors: string[]; colorBack: string }
> = {
  emerald: {
    label: "Emerald",
    colors: ["#052e16", "#10b981", "#3dd68c", "#70b8ff", "#ecfdf5"],
    colorBack: "#000000",
  },
  solar: {
    label: "Solar",
    colors: ["#1a0b2e", "#be123c", "#f97316", "#facc15", "#fef08a"],
    colorBack: "#000000",
  },
  cryo: {
    label: "Cryo",
    colors: ["#020617", "#1d4ed8", "#38bdf8", "#70b8ff", "#e0f2fe"],
    colorBack: "#000000",
  },
};

const LIQUID_FINISHES: Record<
  "emerald" | "chrome" | "cobalt",
  { label: string; colorTint: string; softness: number; shiftRed: number; shiftBlue: number }
> = {
  emerald: {
    label: "Emerald",
    colorTint: "#3dd68c",
    softness: 0.3,
    shiftRed: 0.25,
    shiftBlue: 0.35,
  },
  chrome: {
    label: "Chrome",
    colorTint: "#ffffff",
    softness: 0.18,
    shiftRed: 0.4,
    shiftBlue: 0.4,
  },
  cobalt: {
    label: "Cobalt",
    colorTint: "#70b8ff",
    softness: 0.25,
    shiftRed: 0.15,
    shiftBlue: 0.55,
  },
};

const SHOWCASE_MODES: { id: ShowcaseStyle; label: string }[] = [
  { id: "neon", label: "Neon" },
  { id: "blueprint", label: "Blueprint" },
  { id: "pixel", label: "Pixel" },
  { id: "glassmorphism", label: "Glass" },
];

function InteractiveAsciiSpecimen({
  mode,
  pulseSeed,
}: {
  mode: "radial" | "standing" | "dense";
  pulseSeed: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [coords, setCoords] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const glyphs =
      mode === "dense" ? " .,:;i1tfLCG08@" : mode === "standing" ? " .-:=+*#%@" : " .:-=+*#";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0.5, y: 0.5 };
    let raf = 0;
    let running = false;

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(1, rect.width)));
      const ny = Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(1, rect.height)));
      pointer.x = nx;
      pointer.y = ny;
      setCoords({ x: Math.round(nx * 100), y: Math.round(ny * 100) });
    };
    canvas.addEventListener("pointermove", onPointer);

    const fit = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);
      const cellW = mode === "dense" ? 8 : 10;
      const cellH = mode === "dense" ? 12 : 14;
      ctx.font = `${mode === "dense" ? 10 : 11}px ui-monospace, monospace`;
      const cols = Math.max(1, Math.floor(width / cellW));
      const rows = Math.max(1, Math.floor(height / cellH));
      const phaseOffset = pulseSeed * 1.4;

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const dx = x / cols - pointer.x;
          const dy = y / rows - pointer.y;
          const dist = Math.hypot(dx, dy);
          const wave =
            mode === "standing"
              ? Math.sin(x * 0.45 + time * 0.002 + phaseOffset) *
                  Math.cos(y * 0.45 - time * 0.002) +
                Math.sin(dist * 16 - time * 0.004)
              : Math.sin(dist * 20 - time * 0.0042 - phaseOffset) +
                Math.sin(x * 0.32 + time * 0.0016);
          const norm = Math.max(0, Math.min(1, (wave + 2) / 4));
          const index = Math.min(glyphs.length - 1, Math.floor(norm * (glyphs.length - 1)));
          ctx.fillStyle = norm > 0.68 ? "#3dd68c" : norm > 0.42 ? "#70b8ff" : "rgba(237,237,237,0.45)";
          ctx.fillText(glyphs[index], x * cellW, y * cellH + 10);
        }
      }
    };

    const frame = (now: number) => {
      if (!running) return;
      draw(now);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || document.hidden) return;
      running = true;
      fit();
      if (reduce) {
        draw(1200);
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) start();
        else stop();
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    return () => {
      stop();
      observer.disconnect();
      canvas.removeEventListener("pointermove", onPointer);
    };
  }, [mode, pulseSeed]);

  return (
    <div className="flex flex-1 flex-col justify-between gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand/30 pb-2 font-mono text-xs text-muted-foreground">
        <span className="text-brand">FIELD // {mode.toUpperCase()}</span>
        <span>
          CURSOR ({coords.x}%, {coords.y}%) · PULSE #{pulseSeed}
        </span>
      </div>
      <div className="relative flex-1 min-h-[220px] border border-brand/30 bg-black">
        <canvas
          ref={canvasRef}
          className="h-[220px] w-full cursor-crosshair touch-none block"
          aria-label="Interactive ASCII wave interference field"
        />
      </div>
      <div className="grid grid-cols-3 gap-2 font-mono text-xs">
        <div className="border border-white/15 bg-black/80 p-2">
          <div className="text-[10px] text-muted-foreground">SOLVER</div>
          <div className="text-foreground">2D WAVE</div>
        </div>
        <div className="border border-white/15 bg-black/80 p-2">
          <div className="text-[10px] text-muted-foreground">INPUT</div>
          <div className="text-brand">POINTER LIVE</div>
        </div>
        <div className="border border-white/15 bg-black/80 p-2">
          <div className="text-[10px] text-muted-foreground">RENDER</div>
          <div className="text-[#70b8ff]">CANVAS 2D</div>
        </div>
      </div>
    </div>
  );
}

export function ExperimentsTrophyGrid() {
  const [filter, setFilter] = useState<CategoryFilter>("all");

  // Case 01: HomeLab / FactoryOS live simulation state
  const [lab, setLab] = useState<HomeLab | null>(null);
  const [simRunning, setSimRunning] = useState(true);
  const [factoryTab, setFactoryTab] = useState<"pipeline" | "cells" | "telemetry">("pipeline");

  useEffect(() => {
    setLab(generateHomeLab(4));
  }, []);

  useEffect(() => {
    if (!simRunning) return;
    const timer = setInterval(() => {
      setLab((prev) => (prev ? updateHomeLab(prev) : generateHomeLab(4)));
    }, 2000);
    return () => clearInterval(timer);
  }, [simRunning]);

  const stepFacility = () => {
    setLab((prev) => (prev ? updateHomeLab(prev) : generateHomeLab(4)));
  };

  // Case 02: Heatmap shader controls
  const [heatmapPalette, setHeatmapPalette] = useState<"emerald" | "solar" | "cryo">("emerald");
  const [heatmapSpeed, setHeatmapSpeed] = useState<number>(1);

  // Case 03: Liquid metal shader controls
  const [liquidFinish, setLiquidFinish] = useState<"emerald" | "chrome" | "cobalt">("emerald");
  const [liquidRepetition, setLiquidRepetition] = useState<number>(5);

  // Case 04: UI Showcase style controls
  const [showcaseStyle, setShowcaseStyle] = useState<ShowcaseStyle>("neon");

  // Case 05: Time Machine controls (pure 2D stack, 0 3D transforms)
  const [eraIndex, setEraIndex] = useState<number>(0);

  // Case 06: ASCII Wave Field controls
  const [asciiMode, setAsciiMode] = useState<"radial" | "standing" | "dense">("radial");
  const [asciiPulse, setAsciiPulse] = useState<number>(1);

  const showSystems = filter === "all" || filter === "systems";
  const showShaders = filter === "all" || filter === "shaders";
  const showInterfaces = filter === "all" || filter === "interfaces";

  const currentHeatmap = HEATMAP_PALETTES[heatmapPalette];
  const currentLiquid = LIQUID_FINISHES[liquidFinish];
  const currentEra = EXPERIENCE[eraIndex] ?? EXPERIENCE[0];

  return (
    <div>
      {/* Top Archive Header */}
      <header className={styles.pageHeader}>
        <div className={styles.headerTopRow}>
          <span className={styles.kickerBadge}>
            <span className={styles.liveDot} aria-hidden />
            VITRINE ARCHIVE // LIVE SPECIMEN GRID
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            06 INTERACTIVE TROPHY CASES · DIRECT MANIPULATION
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Experiments
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Large-format interactive apps, WebGL shaders, and autonomous control loops mounted inside
            glassy trophy cases. Operate each live specimen directly through the glass vitrine or
            launch its standalone route.
          </p>
        </div>

        <div className={styles.telemetryStrip}>
          <div className={styles.telemetryCell}>
            <div className={styles.telemetryLabel}>DISPLAY FORMAT</div>
            <div className={styles.telemetryValue}>2-COL APP VITRINE</div>
          </div>
          <div className={styles.telemetryCell}>
            <div className={styles.telemetryLabel}>ACTIVE SPECIMENS</div>
            <div className={styles.telemetryValue}>06 LIVE SANDBOXES</div>
          </div>
          <div className={styles.telemetryCell}>
            <div className={styles.telemetryLabel}>RUNTIMES</div>
            <div className={styles.telemetryValue}>WEBGL2 · CANVAS · REACT</div>
          </div>
          <div className={styles.telemetryCell}>
            <div className={styles.telemetryLabel}>VITRINE STATE</div>
            <div className="mt-0.5 font-mono text-sm font-semibold text-brand">
              INTERACTIVE // 60FPS
            </div>
          </div>
        </div>
      </header>

      {/* Category Filter Controls */}
      <div className={styles.filterBar} role="region" aria-label="Filter trophy cases">
        <div className={styles.filterGroup}>
          {(
            [
              { id: "all", label: "All Trophy Cases (06)" },
              { id: "systems", label: "Systems & Pipelines (02)" },
              { id: "shaders", label: "WebGL Shaders (02)" },
              { id: "interfaces", label: "UI & Chrono Decks (02)" },
            ] as const
          ).map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                aria-pressed={active}
                className={`${styles.filterBtn} ${active ? styles.filterBtnActive : ""}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          CLICK CONTROLS INSIDE ANY CASE TO OPERATE SPECIMEN
        </span>
      </div>

      {/* Large App-Grid Glassy Trophy-Case Layout */}
      <div className={styles.trophyGrid}>
        {/* =================================================================
            CASE 01: HOMELAB // FACTORY-OS AUTONOMOUS ARBITRAGE PIPELINE
           ================================================================= */}
        {showSystems && (
          <article className={styles.trophyCase} data-trophy-case="factory-os">
            <span className={styles.cornerTL} aria-hidden />
            <span className={styles.cornerTR} aria-hidden />
            <span className={styles.cornerBL} aria-hidden />
            <span className={styles.cornerBR} aria-hidden />

            <div className={styles.caseCanopy}>
              <div className={styles.caseCodeGroup}>
                <span className={styles.caseNumber}>CASE 01 // EXP-01</span>
                <span className={styles.caseCategory}>AUTONOMOUS PIPELINE</span>
              </div>
              <span className={styles.caseStatus}>
                <span className={styles.liveDot} aria-hidden />
                {simRunning ? "SIMULATION LIVE" : "SIMULATION PAUSED"}
              </span>
            </div>

            <div className={styles.vitrineChamber}>
              <div className={styles.glassEnclosure}>
                <div className={styles.glassPaneOverlay} aria-hidden />
                <span className={styles.glassWatermark} aria-hidden>
                  VITRINE GLASS // LIVE APP
                </span>

                <div className={styles.specimenStage}>
                  {lab ? (
                    <div className="flex flex-1 flex-col justify-between gap-3">
                      {/* Top KPI bar inside app */}
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <div className="border border-brand/40 bg-black/90 p-2.5">
                          <div className="font-mono text-[10px] uppercase text-muted-foreground">
                            NET PROFIT
                          </div>
                          <div className="mt-0.5 font-mono text-lg font-semibold text-brand">
                            ${lab.totalProfit.toFixed(0)}
                          </div>
                        </div>
                        <div className="border border-white/15 bg-black/90 p-2.5">
                          <div className="font-mono text-[10px] uppercase text-muted-foreground">
                            REVENUE
                          </div>
                          <div className="mt-0.5 font-mono text-lg font-semibold text-foreground">
                            ${lab.totalRevenue.toFixed(0)}
                          </div>
                        </div>
                        <div className="border border-white/15 bg-black/90 p-2.5">
                          <div className="font-mono text-[10px] uppercase text-muted-foreground">
                            PRINTERS
                          </div>
                          <div className="mt-0.5 font-mono text-lg font-semibold text-[#70b8ff]">
                            {lab.printers.filter((p) => p.status === "printing").length}/
                            {lab.printers.length} LIVE
                          </div>
                        </div>
                        <div className="border border-white/15 bg-black/90 p-2.5">
                          <div className="font-mono text-[10px] uppercase text-muted-foreground">
                            SKUS LIVE
                          </div>
                          <div className="mt-0.5 font-mono text-lg font-semibold text-foreground">
                            {lab.activeListings}
                          </div>
                        </div>
                      </div>

                      {/* Dynamic Interactive Stage Body */}
                      {factoryTab === "pipeline" && (
                        <div className="space-y-2 border border-white/15 bg-black/85 p-3">
                          <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                            <span>AUTONOMOUS ARBITRAGE STAGES</span>
                            <span className="text-brand">{lab.stages.length} STAGES</span>
                          </div>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {lab.stages.slice(0, 4).map((stage) => {
                              const pct = Math.min(
                                100,
                                Math.max(18, Math.round(stage.throughputPerHour * 14))
                              );
                              return (
                                <div
                                  key={stage.stage}
                                  className="border border-white/15 bg-black p-2.5"
                                >
                                  <div className="flex items-center justify-between gap-2 text-xs">
                                    <span className="truncate font-medium text-foreground">
                                      {stage.stage.toUpperCase()}
                                    </span>
                                    <span className="font-mono text-brand uppercase">
                                      {stage.status}
                                    </span>
                                  </div>
                                  <div className="mt-1.5 h-1.5 w-full bg-white/10">
                                    <div
                                      className="h-full bg-brand"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                  <div className="mt-1.5 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                                    <span>DONE {stage.itemsCompleted}</span>
                                    <span>ACTIVE {stage.itemsProcessing}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {factoryTab === "cells" && (
                        <div className="space-y-2 border border-white/15 bg-black/85 p-3">
                          <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                            <span>3D PRINT FARM NODES ({lab.printers.length} UNITS)</span>
                            <span className="text-[#70b8ff]">THERMAL &amp; UPTIME</span>
                          </div>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {lab.printers.map((printer) => (
                              <div
                                key={printer.id}
                                className="border border-white/15 bg-black p-2.5 font-mono text-xs"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="truncate font-semibold text-foreground">
                                    {printer.name}
                                  </span>
                                  <span
                                    className={
                                      printer.status === "printing"
                                        ? "text-brand"
                                        : "text-muted-foreground"
                                    }
                                  >
                                    ● {printer.status.toUpperCase()}
                                  </span>
                                </div>
                                <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                                  <span>NOZZLE {printer.nozzleTemp.toFixed(0)}°C</span>
                                  <span>BED {printer.bedTemp.toFixed(0)}°C</span>
                                  <span>{printer.successRate.toFixed(0)}% OK</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {factoryTab === "telemetry" && (
                        <div className="space-y-2 border border-white/15 bg-black/85 p-3">
                          <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                            <span>14-DAY REVENUE VS PROFIT WAVEFORM</span>
                            <span className="text-brand">ARBITRAGE MARGIN</span>
                          </div>
                          <svg
                            viewBox="0 0 320 96"
                            className="h-28 w-full border border-white/10 bg-black p-2"
                            aria-label="Revenue and profit chart"
                          >
                            {lab.dailyHistory.slice(-14).map((pt, idx, arr) => {
                              const x = (idx / Math.max(1, arr.length - 1)) * 296 + 12;
                              const maxVal = Math.max(
                                ...arr.map((d) => Math.max(d.revenue, d.profit, 50)),
                                50
                              );
                              const yRev = 84 - (pt.revenue / maxVal) * 68;
                              const yProf = 84 - (Math.max(0, pt.profit) / maxVal) * 68;
                              return (
                                <g key={pt.date}>
                                  <rect
                                    x={x - 5}
                                    y={yRev}
                                    width="10"
                                    height={Math.max(4, 84 - yRev)}
                                    fill="rgba(112, 184, 255, 0.35)"
                                  />
                                  <rect
                                    x={x - 3}
                                    y={yProf}
                                    width="6"
                                    height={Math.max(3, 84 - yProf)}
                                    fill="rgba(61, 214, 140, 0.75)"
                                  />
                                </g>
                              );
                            })}
                          </svg>
                          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-muted-foreground">
                            <span>LAUNCHED: {lab.productsLaunched} SKUS</span>
                            <span>QUEUE: {lab.printQueue.length} JOBS</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                <div className={styles.pedestalShelf} aria-hidden />
              </div>
            </div>

            {/* Interactive Trophy Case Control Deck */}
            <div className={styles.controlDeck}>
              <span className={styles.controlDeckLabel}>VITRINE CONTROLS</span>
              <div className={styles.controlBtnGroup}>
                {(["pipeline", "cells", "telemetry"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFactoryTab(tab)}
                    aria-pressed={factoryTab === tab}
                    className={`${styles.caseCtrlBtn} ${
                      factoryTab === tab ? styles.caseCtrlBtnActive : ""
                    }`}
                  >
                    {tab === "pipeline" ? "Pipeline" : tab === "cells" ? "Cells" : "Chart"}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setSimRunning((r) => !r)}
                  aria-pressed={simRunning}
                  className={styles.caseCtrlBtn}
                >
                  {simRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  {simRunning ? "Pause" : "Run"}
                </button>
                <button type="button" onClick={stepFacility} className={styles.caseCtrlBtn}>
                  <StepForward className="h-3.5 w-3.5" />
                  Step
                </button>
              </div>
            </div>

            {/* Engraved Trophy Plaque */}
            <div className={styles.trophyPlaque}>
              <div className={styles.plaqueHeader}>
                <h2 className={styles.plaqueTitle}>HomeLab // FactoryOS</h2>
                <span className={styles.plaqueId}>SPECIMEN 01 · /experiments/factory-os</span>
              </div>
              <p className={styles.plaqueDesc}>
                Automated arbitrage &amp; micro-manufacturing control plane: research overpriced
                catalog SKUs, synthesize CAD alternatives, orchestrate a 20-cell 3D print farm, and
                monitor real-time OEE telemetry.
              </p>
              <div className={styles.plaqueFooter}>
                <div className={styles.tagList}>
                  <span className={styles.tagChip}>Simulation Engine</span>
                  <span className={styles.tagChip}>CAD Arbitrage</span>
                  <span className={styles.tagChip}>Real-Time Telemetry</span>
                </div>
                <CareerButton
                  variant="secondary"
                  size="sm"
                  icon={ArrowUpRight}
                  href="/experiments/factory-os"
                >
                  Open full app
                </CareerButton>
              </div>
            </div>
          </article>
        )}

        {/* =================================================================
            CASE 02: HEATMAP LOGO // WEBGL THERMAL CONTOUR SHADER
           ================================================================= */}
        {showShaders && (
          <article className={styles.trophyCase} data-trophy-case="heatmap-logo">
            <span className={styles.cornerTL} aria-hidden />
            <span className={styles.cornerTR} aria-hidden />
            <span className={styles.cornerBL} aria-hidden />
            <span className={styles.cornerBR} aria-hidden />

            <div className={styles.caseCanopy}>
              <div className={styles.caseCodeGroup}>
                <span className={styles.caseNumber}>CASE 02 // EXP-02</span>
                <span className={styles.caseCategory}>WEBGL SHADER</span>
              </div>
              <span className={styles.caseStatus}>
                <Flame className="h-3.5 w-3.5 text-brand" aria-hidden />
                GLSL FRAGMENT LIVE
              </span>
            </div>

            <div className={styles.vitrineChamber}>
              <div className={styles.glassEnclosure}>
                <div className={styles.glassPaneOverlay} aria-hidden />
                <span className={styles.glassWatermark} aria-hidden>
                  VITRINE GLASS // WEBGL2
                </span>

                <div className={styles.specimenStage}>
                  <div className="flex flex-1 flex-col items-center justify-between gap-4">
                    <div className="flex w-full items-center justify-between border-b border-white/15 pb-2 font-mono text-xs text-muted-foreground">
                      <span className="text-brand">PALETTE // {currentHeatmap.label.toUpperCase()}</span>
                      <span>SPEED {heatmapSpeed.toFixed(1)}x · CONTOUR 0.50</span>
                    </div>

                    <div className="relative flex items-center justify-center border border-brand/40 bg-black p-3">
                      <HeatmapLogo
                        size={210}
                        speed={heatmapSpeed}
                        contour={0.5}
                        angle={0}
                        noise={0.05}
                        innerGlow={0.5}
                        outerGlow={0.35}
                        colors={currentHeatmap.colors}
                        colorBack={currentHeatmap.colorBack}
                      />
                    </div>

                    {/* Color Stop Spectrum Bar */}
                    <div className="w-full space-y-1.5 border border-white/15 bg-black/85 p-2.5">
                      <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                        <span>THERMAL LUT STOPS</span>
                        <span>5 CHANNELS</span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {currentHeatmap.colors.map((hex) => (
                          <div key={hex} className="border border-white/20 bg-black p-1 text-center">
                            <div className="h-3 w-full" style={{ backgroundColor: hex }} />
                            <span className="mt-1 block font-mono text-[10px] text-muted-foreground">
                              {hex}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.pedestalShelf} aria-hidden />
              </div>
            </div>

            <div className={styles.controlDeck}>
              <span className={styles.controlDeckLabel}>SHADER UNIFORMS</span>
              <div className={styles.controlBtnGroup}>
                {(["emerald", "solar", "cryo"] as const).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setHeatmapPalette(preset)}
                    aria-pressed={heatmapPalette === preset}
                    className={`${styles.caseCtrlBtn} ${
                      heatmapPalette === preset ? styles.caseCtrlBtnActive : ""
                    }`}
                  >
                    {HEATMAP_PALETTES[preset].label}
                  </button>
                ))}
                {[0.6, 1, 1.8].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setHeatmapSpeed(spd)}
                    aria-pressed={heatmapSpeed === spd}
                    className={`${styles.caseCtrlBtn} ${
                      heatmapSpeed === spd ? styles.caseCtrlBtnActive : ""
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.trophyPlaque}>
              <div className={styles.plaqueHeader}>
                <h2 className={styles.plaqueTitle}>Heatmap Logo Shader</h2>
                <span className={styles.plaqueId}>SPECIMEN 02 · /experiments/heatmap-logo</span>
              </div>
              <p className={styles.plaqueDesc}>
                Real-time WebGL thermal contour shader mapping signed distance fields and animated
                multi-stop color LUTs across vector geometry with tunable inner/outer glow.
              </p>
              <div className={styles.plaqueFooter}>
                <div className={styles.tagList}>
                  <span className={styles.tagChip}>WebGL Shaders</span>
                  <span className={styles.tagChip}>Thermal LUT</span>
                  <span className={styles.tagChip}>Contour Field</span>
                </div>
                <CareerButton
                  variant="secondary"
                  size="sm"
                  icon={ArrowUpRight}
                  href="/experiments/heatmap-logo"
                >
                  Open standalone
                </CareerButton>
              </div>
            </div>
          </article>
        )}

        {/* =================================================================
            CASE 03: LIQUID METAL LOGO // CHROMATIC RIPPLE SHADER
           ================================================================= */}
        {showShaders && (
          <article className={styles.trophyCase} data-trophy-case="liquid-metal-logo">
            <span className={styles.cornerTL} aria-hidden />
            <span className={styles.cornerTR} aria-hidden />
            <span className={styles.cornerBL} aria-hidden />
            <span className={styles.cornerBR} aria-hidden />

            <div className={styles.caseCanopy}>
              <div className={styles.caseCodeGroup}>
                <span className={styles.caseNumber}>CASE 03 // EXP-03</span>
                <span className={styles.caseCategory}>WEBGL SHADER</span>
              </div>
              <span className={styles.caseStatus}>
                <Sparkles className="h-3.5 w-3.5 text-[#70b8ff]" aria-hidden />
                CHROMATIC DISPERSION
              </span>
            </div>

            <div className={styles.vitrineChamber}>
              <div className={styles.glassEnclosure}>
                <div className={styles.glassPaneOverlay} aria-hidden />
                <span className={styles.glassWatermark} aria-hidden>
                  VITRINE GLASS // SHADER
                </span>

                <div className={styles.specimenStage}>
                  <div className="flex flex-1 flex-col items-center justify-between gap-4">
                    <div className="flex w-full items-center justify-between border-b border-white/15 pb-2 font-mono text-xs text-muted-foreground">
                      <span className="text-[#70b8ff]">
                        ALLOY // {currentLiquid.label.toUpperCase()}
                      </span>
                      <span>RIPPLES {liquidRepetition}x · TINT {currentLiquid.colorTint}</span>
                    </div>

                    <div className="relative flex items-center justify-center border border-[#70b8ff]/45 bg-black p-3">
                      <LiquidMetalLogo
                        size={210}
                        speed={1}
                        repetition={liquidRepetition}
                        softness={currentLiquid.softness}
                        shiftRed={currentLiquid.shiftRed}
                        shiftBlue={currentLiquid.shiftBlue}
                        distortion={0.12}
                        contour={0.4}
                        angle={70}
                        colorBack="#00000000"
                        colorTint={currentLiquid.colorTint}
                      />
                    </div>

                    <div className="grid w-full grid-cols-3 gap-2 font-mono text-xs">
                      <div className="border border-white/15 bg-black/85 p-2">
                        <div className="text-[10px] text-muted-foreground">RED SHIFT</div>
                        <div className="text-foreground">{currentLiquid.shiftRed.toFixed(2)}</div>
                      </div>
                      <div className="border border-white/15 bg-black/85 p-2">
                        <div className="text-[10px] text-muted-foreground">BLUE SHIFT</div>
                        <div className="text-[#70b8ff]">{currentLiquid.shiftBlue.toFixed(2)}</div>
                      </div>
                      <div className="border border-white/15 bg-black/85 p-2">
                        <div className="text-[10px] text-muted-foreground">REPETITION</div>
                        <div className="text-brand">{liquidRepetition} BANDS</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.pedestalShelf} aria-hidden />
              </div>
            </div>

            <div className={styles.controlDeck}>
              <span className={styles.controlDeckLabel}>ALLOY &amp; RIPPLES</span>
              <div className={styles.controlBtnGroup}>
                {(["emerald", "chrome", "cobalt"] as const).map((finish) => (
                  <button
                    key={finish}
                    type="button"
                    onClick={() => setLiquidFinish(finish)}
                    aria-pressed={liquidFinish === finish}
                    className={`${styles.caseCtrlBtn} ${
                      liquidFinish === finish ? styles.caseCtrlBtnActive : ""
                    }`}
                  >
                    {LIQUID_FINISHES[finish].label}
                  </button>
                ))}
                {[4, 6, 9].map((rep) => (
                  <button
                    key={rep}
                    type="button"
                    onClick={() => setLiquidRepetition(rep)}
                    aria-pressed={liquidRepetition === rep}
                    className={`${styles.caseCtrlBtn} ${
                      liquidRepetition === rep ? styles.caseCtrlBtnActive : ""
                    }`}
                  >
                    {rep}x
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.trophyPlaque}>
              <div className={styles.plaqueHeader}>
                <h2 className={styles.plaqueTitle}>Liquid Metal Logo</h2>
                <span className={styles.plaqueId}>SPECIMEN 03 · /experiments/liquid-metal-logo</span>
              </div>
              <p className={styles.plaqueDesc}>
                Specular liquid-mercury shader with adjustable red/blue chromatic aberration,
                surface wave repetition, and metallic alloy tinting over SVG vector masks.
              </p>
              <div className={styles.plaqueFooter}>
                <div className={styles.tagList}>
                  <span className={styles.tagChip}>Chromatic Aberration</span>
                  <span className={styles.tagChip}>Liquid Metal</span>
                  <span className={styles.tagChip}>GLSL Ripples</span>
                </div>
                <CareerButton
                  variant="secondary"
                  size="sm"
                  icon={ArrowUpRight}
                  href="/experiments/liquid-metal-logo"
                >
                  Open standalone
                </CareerButton>
              </div>
            </div>
          </article>
        )}

        {/* =================================================================
            CASE 04: UI SHOWCASE // AUTO-TRIGGERING COMPONENT MATRIX
           ================================================================= */}
        {showInterfaces && (
          <article className={styles.trophyCase} data-trophy-case="ui-showcase">
            <span className={styles.cornerTL} aria-hidden />
            <span className={styles.cornerTR} aria-hidden />
            <span className={styles.cornerBL} aria-hidden />
            <span className={styles.cornerBR} aria-hidden />

            <div className={styles.caseCanopy}>
              <div className={styles.caseCodeGroup}>
                <span className={styles.caseNumber}>CASE 04 // EXP-04</span>
                <span className={styles.caseCategory}>UI COMPONENT SYSTEM</span>
              </div>
              <span className={styles.caseStatus}>
                <Layers className="h-3.5 w-3.5 text-brand" aria-hidden />
                19 LIVE WIDGETS
              </span>
            </div>

            <div className={styles.vitrineChamber}>
              <div className={styles.glassEnclosure}>
                <div className={styles.glassPaneOverlay} aria-hidden />
                <span className={styles.glassWatermark} aria-hidden>
                  VITRINE GLASS // LIVE UI
                </span>

                <div className={styles.specimenStage}>
                  <div className="flex flex-1 flex-col justify-between gap-3 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-2 font-mono text-xs text-muted-foreground">
                      <span className="text-brand">
                        DESIGN SYSTEM // {showcaseStyle.toUpperCase()}
                      </span>
                      <span>AUTO-LOOP + DIRECT CLICK</span>
                    </div>

                    <div className="relative w-full max-w-full overflow-hidden border border-white/15 bg-black">
                      <UIShowcase style={showcaseStyle} />
                    </div>
                  </div>
                </div>

                <div className={styles.pedestalShelf} aria-hidden />
              </div>
            </div>

            <div className={styles.controlDeck}>
              <span className={styles.controlDeckLabel}>THEME ENGINE</span>
              <div className={styles.controlBtnGroup}>
                {SHOWCASE_MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setShowcaseStyle(m.id)}
                    aria-pressed={showcaseStyle === m.id}
                    className={`${styles.caseCtrlBtn} ${
                      showcaseStyle === m.id ? styles.caseCtrlBtnActive : ""
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.trophyPlaque}>
              <div className={styles.plaqueHeader}>
                <h2 className={styles.plaqueTitle}>UI Showcase Matrix</h2>
                <span className={styles.plaqueId}>SPECIMEN 04 · /experiments/ui-showcase</span>
              </div>
              <p className={styles.plaqueDesc}>
                Multi-row component carousel featuring 19 self-triggering micro-interactions
                (switches, NumberFlow counters, segmented controls, and progress loaders) across
                hot-swappable theme tokens.
              </p>
              <div className={styles.plaqueFooter}>
                <div className={styles.tagList}>
                  <span className={styles.tagChip}>Micro-Interactions</span>
                  <span className={styles.tagChip}>Theme Tokens</span>
                  <span className={styles.tagChip}>NumberFlow</span>
                </div>
                <CareerButton
                  variant="secondary"
                  size="sm"
                  icon={ArrowUpRight}
                  href="/experiments/ui-showcase"
                >
                  Open standalone
                </CareerButton>
              </div>
            </div>
          </article>
        )}

        {/* =================================================================
            CASE 05: TIME MACHINE // CHRONOLOGICAL WINDOW DECK (2D FLAT)
           ================================================================= */}
        {showInterfaces && (
          <article className={styles.trophyCase} data-trophy-case="time-machine">
            <span className={styles.cornerTL} aria-hidden />
            <span className={styles.cornerTR} aria-hidden />
            <span className={styles.cornerBL} aria-hidden />
            <span className={styles.cornerBR} aria-hidden />

            <div className={styles.caseCanopy}>
              <div className={styles.caseCodeGroup}>
                <span className={styles.caseNumber}>CASE 05 // EXP-05</span>
                <span className={styles.caseCategory}>CHRONO DECK</span>
              </div>
              <span className={styles.caseStatus}>
                <History className="h-3.5 w-3.5 text-[#70b8ff]" aria-hidden />
                ERA {eraIndex + 1} OF {EXPERIENCE.length}
              </span>
            </div>

            <div className={styles.vitrineChamber}>
              <div className={styles.glassEnclosure}>
                <div className={styles.glassPaneOverlay} aria-hidden />
                <span className={styles.glassWatermark} aria-hidden>
                  VITRINE GLASS // CHRONO
                </span>

                <div className={styles.specimenStage}>
                  <div className="flex flex-1 flex-col justify-between gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-2 font-mono text-xs text-muted-foreground">
                      <span className="text-[#70b8ff]">
                        TIMESTAMP // {currentEra.startDate.toUpperCase()} — {currentEra.endDate.toUpperCase()}
                      </span>
                      <span>INDEX 0{eraIndex + 1}</span>
                    </div>

                    {/* Active Window Specimen Card */}
                    <div className="border border-brand/50 bg-black p-4">
                      <div className="flex items-center justify-between border-b border-white/15 pb-2.5 font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-block h-2.5 w-2.5 bg-brand" />
                          <span className="inline-block h-2.5 w-2.5 bg-[#70b8ff]" />
                          <span className="inline-block h-2.5 w-2.5 bg-white/30" />
                        </div>
                        <span className="truncate text-muted-foreground">{currentEra.company}</span>
                        <span className="text-brand">{currentEra.endDate}</span>
                      </div>

                      <div className="mt-4 flex items-start gap-3.5">
                        {currentEra.logo && (
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-white/20 bg-white/5">
                            <Image
                              src={currentEra.logo}
                              alt={`${currentEra.company} logo`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-lg font-semibold text-foreground">
                            {currentEra.company}
                          </h3>
                          <p className="text-sm font-medium text-brand">{currentEra.role}</p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 text-[#70b8ff]" aria-hidden />
                            <span>{currentEra.location}</span>
                          </div>
                        </div>
                      </div>

                      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {currentEra.positions?.[0]?.title ? `Progression: ${currentEra.positions.map((p) => p.title).join(" ← ")}` : currentEra.note ?? `${currentEra.role} (${currentEra.startDate} – ${currentEra.endDate})`}
                      </p>
                    </div>

                    {/* Interactive Era Scrubber Rail inside Specimen */}
                    <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                      {EXPERIENCE.map((item, idx) => {
                        const active = idx === eraIndex;
                        return (
                          <button
                            key={item.company}
                            type="button"
                            onClick={() => setEraIndex(idx)}
                            aria-pressed={active}
                            className={`min-h-11 border px-2 py-1 text-left font-mono text-[10px] transition-opacity ${
                              active
                                ? "border-brand bg-brand/15 text-brand"
                                : "border-white/15 bg-black text-muted-foreground hover:border-[#70b8ff] hover:text-foreground"
                            }`}
                          >
                            <div className="font-semibold">0{idx + 1}</div>
                            <div className="truncate">{item.endDate}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className={styles.pedestalShelf} aria-hidden />
              </div>
            </div>

            <div className={styles.controlDeck}>
              <span className={styles.controlDeckLabel}>CHRONO SCRUBBER</span>
              <div className={styles.controlBtnGroup}>
                <button
                  type="button"
                  onClick={() =>
                    setEraIndex((prev) => (prev - 1 + EXPERIENCE.length) % EXPERIENCE.length)
                  }
                  className={styles.caseCtrlBtn}
                >
                  Prev Era
                </button>
                <button
                  type="button"
                  onClick={() => setEraIndex((prev) => (prev + 1) % EXPERIENCE.length)}
                  className={styles.caseCtrlBtn}
                >
                  Next Era
                </button>
                <button
                  type="button"
                  onClick={() => setEraIndex(0)}
                  aria-pressed={eraIndex === 0}
                  className={`${styles.caseCtrlBtn} ${
                    eraIndex === 0 ? styles.caseCtrlBtnActive : ""
                  }`}
                >
                  Latest
                </button>
              </div>
            </div>

            <div className={styles.trophyPlaque}>
              <div className={styles.plaqueHeader}>
                <h2 className={styles.plaqueTitle}>Time Machine Scrubber</h2>
                <span className={styles.plaqueId}>SPECIMEN 05 · /experiments/time-machine</span>
              </div>
              <p className={styles.plaqueDesc}>
                Interactive chronological window deck for scrubbing through career eras and
                engineering milestones with instant state snapshots and zero scroll-hijacking.
              </p>
              <div className={styles.plaqueFooter}>
                <div className={styles.tagList}>
                  <span className={styles.tagChip}>Chrono Scrubber</span>
                  <span className={styles.tagChip}>State Snapshots</span>
                  <span className={styles.tagChip}>Framer Motion</span>
                </div>
                <CareerButton
                  variant="secondary"
                  size="sm"
                  icon={ArrowUpRight}
                  href="/experiments/time-machine"
                >
                  Open standalone
                </CareerButton>
              </div>
            </div>
          </article>
        )}

        {/* =================================================================
            CASE 06: ASCII WAVE FIELD // POINTER-REACTIVE INTERFERENCE CANVAS
           ================================================================= */}
        {showSystems && (
          <article className={styles.trophyCase} data-trophy-case="ascii-wave-field">
            <span className={styles.cornerTL} aria-hidden />
            <span className={styles.cornerTR} aria-hidden />
            <span className={styles.cornerBL} aria-hidden />
            <span className={styles.cornerBR} aria-hidden />

            <div className={styles.caseCanopy}>
              <div className={styles.caseCodeGroup}>
                <span className={styles.caseNumber}>CASE 06 // EXP-06</span>
                <span className={styles.caseCategory}>CANVAS FIELD</span>
              </div>
              <span className={styles.caseStatus}>
                <Terminal className="h-3.5 w-3.5 text-brand" aria-hidden />
                POINTER REACTIVE
              </span>
            </div>

            <div className={styles.vitrineChamber}>
              <div className={styles.glassEnclosure}>
                <div className={styles.glassPaneOverlay} aria-hidden />
                <span className={styles.glassWatermark} aria-hidden>
                  VITRINE GLASS // CANVAS
                </span>

                <div className={styles.specimenStage}>
                  <InteractiveAsciiSpecimen mode={asciiMode} pulseSeed={asciiPulse} />
                </div>

                <div className={styles.pedestalShelf} aria-hidden />
              </div>
            </div>

            <div className={styles.controlDeck}>
              <span className={styles.controlDeckLabel}>WAVE SOLVER</span>
              <div className={styles.controlBtnGroup}>
                {(["radial", "standing", "dense"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setAsciiMode(m)}
                    aria-pressed={asciiMode === m}
                    className={`${styles.caseCtrlBtn} ${
                      asciiMode === m ? styles.caseCtrlBtnActive : ""
                    }`}
                  >
                    {m === "radial" ? "Radial" : m === "standing" ? "Standing" : "Dense"}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAsciiPulse((p) => p + 1)}
                  className={styles.caseCtrlBtn}
                >
                  <Zap className="h-3.5 w-3.5 text-brand" aria-hidden />
                  Pulse
                </button>
              </div>
            </div>

            <div className={styles.trophyPlaque}>
              <div className={styles.plaqueHeader}>
                <h2 className={styles.plaqueTitle}>ASCII Interference Field</h2>
                <span className={styles.plaqueId}>SPECIMEN 06 · /#lab</span>
              </div>
              <p className={styles.plaqueDesc}>
                Pointer-reactive 2D wave interference solver rendered in monospace glyphs. Move
                your cursor across the glass vitrine or switch solver modes to deform the field.
              </p>
              <div className={styles.plaqueFooter}>
                <div className={styles.tagList}>
                  <span className={styles.tagChip}>Canvas 2D</span>
                  <span className={styles.tagChip}>Wave Interference</span>
                  <span className={styles.tagChip}>Reduced-Motion Safe</span>
                </div>
                <CareerButton
                  variant="secondary"
                  size="sm"
                  icon={Cpu}
                  href="/#lab"
                >
                  Open Builder Log
                </CareerButton>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
