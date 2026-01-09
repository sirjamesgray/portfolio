"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Copy, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileBackButton } from "@/components/dashboard/mobile-back-button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { PulsatingButton } from "@/components/ui/pulsating-button";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { SparklesText } from "@/components/ui/sparkles-text";
import { Marquee } from "@/components/ui/marquee";
import { Ripple } from "@/components/ui/ripple";
import { DotPattern } from "@/components/ui/dot-pattern";
import { GridPattern } from "@/components/ui/grid-pattern";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { LOGO_3D_COLORS } from "@/lib/logo-colors";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import { BlurFade } from "@/components/ui/blur-fade";

// Animated icons
import { BellIcon } from "@/components/ui/bell";
import { HeartIcon } from "@/components/ui/heart";
import { ZapIcon } from "@/components/ui/zap";
import { RefreshCWIcon } from "@/components/ui/refresh-cw";
import { CogIcon } from "@/components/ui/cog";
import { WifiIcon } from "@/components/ui/wifi";
import { MoonIcon } from "@/components/ui/moon";
import { DownloadIcon } from "@/components/ui/download";
import { CheckIcon } from "@/components/ui/check";
import { VolumeIcon } from "@/components/ui/volume";
import { UserIcon } from "@/components/ui/user";
import { ArrowRightIcon } from "@/components/ui/arrow-right";
import { LockIcon } from "@/components/ui/lock";
import { LockOpenIcon } from "@/components/ui/lock-open";

import { Logo3DStatic, Logo3DRotating } from "@/components/logo-3d";

// Dynamically import rotating 3D logos to avoid SSR issues (only for the rotating version)
const Logo3DRotatingDynamic = dynamic(
  () => import("@/components/logo-3d").then((mod) => mod.Logo3DRotating),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-[400px] flex items-center justify-center">
        <div className="h-32 w-32 rounded-lg bg-emerald-500/20 animate-pulse" />
      </div>
    ),
  }
);

// Archived glassy logo version
const Logo3DGlassy = dynamic(
  () => import("@/components/logo-3d-glassy").then((mod) => mod.Logo3D),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-[400px] flex items-center justify-center">
        <div className="h-32 w-32 rounded-lg bg-emerald-500/20 animate-pulse" />
      </div>
    ),
  }
);

function ComponentCard({
  title,
  importPath,
  children,
  className,
}: {
  title: string;
  importPath: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyImport = () => {
    navigator.clipboard.writeText(importPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("rounded-xl border border-border bg-card/50 p-6", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <button
          onClick={copyImport}
          className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground hover:bg-muted/80 transition-colors"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          <code>{importPath.split("/").pop()}</code>
        </button>
      </div>
      <div className="flex items-center justify-center min-h-[100px]">{children}</div>
    </div>
  );
}

function ColorSwatch({ name, variable, className }: { name: string; variable: string; className: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("h-10 w-10 rounded-lg border border-border", className)} />
      <div>
        <p className="text-sm font-medium text-foreground">{name}</p>
        <code className="text-xs text-muted-foreground">{variable}</code>
      </div>
    </div>
  );
}

function HexColorSwatch({ name, hex, description }: { name: string; hex: string; description?: string }) {
  const [copied, setCopied] = useState(false);

  const copyHex = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={copyHex}
        className="relative h-12 w-12 rounded-lg border border-border shrink-0 transition-transform hover:scale-105"
        style={{ backgroundColor: hex }}
        title={`Click to copy ${hex}`}
      >
        {copied && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
      </button>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{name}</p>
        <code className="text-xs text-muted-foreground block">{hex}</code>
        {description && <p className="text-xs text-muted-foreground/70 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  const [sliderValue, setSliderValue] = useState([50]);

  return (
    <div>
        <MobileBackButton />
            <div className="mb-12 text-center lg:text-left">
              <h1 className="text-4xl font-bold text-foreground mb-4">Design System</h1>
              <p className="text-muted-foreground max-w-2xl lg:mx-0 mx-auto">
                Component library and design tokens. Click component names to copy import paths.
              </p>
            </div>

            {/* Favicon */}
            <section id="favicon" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Favicon</h2>
              <p className="text-muted-foreground mb-6 text-sm">
                App favicon with JG logo on black background. Generated via <code>app/icon.tsx</code> and <code>app/apple-icon.tsx</code>.
              </p>
              <div className="flex flex-col gap-6 rounded-xl border border-border bg-card/50 p-8">
                <div className="flex flex-wrap items-center gap-8">
                  {/* Favicon preview */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-muted-foreground">Favicon (32x32)</span>
                    <div className="h-8 w-8 bg-black rounded flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 174 174"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.501 132.5V95.2568H21.501V132.5C21.501 146.031 32.47 157 46.001 157C59.5317 157 70.501 146.031 70.501 132.5V64.4727C70.5008 37.3964 45.5465 17 13.499 17V9H78.501V132.5C78.501 150.449 63.95 165 46.001 165C28.0517 165 13.501 150.449 13.501 132.5Z"
                          fill="#34d399"
                        />
                        <path
                          d="M107.501 132.5V41.5C107.501 27.969 118.47 17 132.001 17C145.532 17 156.501 27.969 156.501 41.5V59.4727H164.501V41.5C164.501 23.5507 149.95 9 132.001 9C114.052 9 99.501 23.5507 99.501 41.5V132.5C99.501 150.481 114.26 165 132.177 165C149.624 165 164.044 151.083 164.49 133.681L164.501 132.85V95.2568H118.791V103.257C130.272 103.257 139.759 106.164 146.276 111.21C152.684 116.17 156.501 123.393 156.501 132.85L156.493 133.472C156.158 146.492 145.338 157 132.177 157C118.614 157 107.501 145.999 107.501 132.5Z"
                          fill="#34d399"
                        />
                      </svg>
                    </div>
                  </div>
                  {/* Apple touch icon preview */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-muted-foreground">Apple Touch Icon (180x180)</span>
                    <div className="h-[45px] w-[45px] bg-black rounded-xl flex items-center justify-center">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 174 174"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.501 132.5V95.2568H21.501V132.5C21.501 146.031 32.47 157 46.001 157C59.5317 157 70.501 146.031 70.501 132.5V64.4727C70.5008 37.3964 45.5465 17 13.499 17V9H78.501V132.5C78.501 150.449 63.95 165 46.001 165C28.0517 165 13.501 150.449 13.501 132.5Z"
                          fill="#34d399"
                        />
                        <path
                          d="M107.501 132.5V41.5C107.501 27.969 118.47 17 132.001 17C145.532 17 156.501 27.969 156.501 41.5V59.4727H164.501V41.5C164.501 23.5507 149.95 9 132.001 9C114.052 9 99.501 23.5507 99.501 41.5V132.5C99.501 150.481 114.26 165 132.177 165C149.624 165 164.044 151.083 164.49 133.681L164.501 132.85V95.2568H118.791V103.257C130.272 103.257 139.759 106.164 146.276 111.21C152.684 116.17 156.501 123.393 156.501 132.85L156.493 133.472C156.158 146.492 145.338 157 132.177 157C118.614 157 107.501 145.999 107.501 132.5Z"
                          fill="#34d399"
                        />
                      </svg>
                    </div>
                  </div>
                  {/* Large preview */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-muted-foreground">Preview (128x128)</span>
                    <div className="h-32 w-32 bg-black rounded-xl flex items-center justify-center">
                      <svg
                        width="112"
                        height="112"
                        viewBox="0 0 174 174"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.501 132.5V95.2568H21.501V132.5C21.501 146.031 32.47 157 46.001 157C59.5317 157 70.501 146.031 70.501 132.5V64.4727C70.5008 37.3964 45.5465 17 13.499 17V9H78.501V132.5C78.501 150.449 63.95 165 46.001 165C28.0517 165 13.501 150.449 13.501 132.5Z"
                          fill="#34d399"
                        />
                        <path
                          d="M107.501 132.5V41.5C107.501 27.969 118.47 17 132.001 17C145.532 17 156.501 27.969 156.501 41.5V59.4727H164.501V41.5C164.501 23.5507 149.95 9 132.001 9C114.052 9 99.501 23.5507 99.501 41.5V132.5C99.501 150.481 114.26 165 132.177 165C149.624 165 164.044 151.083 164.49 133.681L164.501 132.85V95.2568H118.791V103.257C130.272 103.257 139.759 106.164 146.276 111.21C152.684 116.17 156.501 123.393 156.501 132.85L156.493 133.472C156.158 146.492 145.338 157 132.177 157C118.614 157 107.501 145.999 107.501 132.5Z"
                          fill="#34d399"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    <strong>Colors:</strong> Background <code className="bg-muted px-1 rounded">#000000</code>, Logo <code className="bg-muted px-1 rounded">#34d399</code> (emerald-400)
                  </p>
                </div>
              </div>
            </section>

          {/* 3D Grid Logo - Static (Header Version) */}
            <section id="static-logo" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Static Logo (Header Version)</h2>
              <p className="text-muted-foreground mb-6 text-sm">
                Flat CSS/SVG logo for headers - square border with JG inside. Lightweight (no 3D/Canvas).
                Size <code>sm</code> = 32x32px (h-8 w-8) is used in the dashboard header.
              </p>
              <div className="flex flex-col gap-6 rounded-xl border border-border bg-card/50 p-8">
                {/* Actual header size */}
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-muted-foreground">sm (header)</span>
                    <Logo3DStatic size="sm" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-muted-foreground">md</span>
                    <Logo3DStatic size="md" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-muted-foreground">lg</span>
                    <Logo3DStatic size="lg" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-muted-foreground">xl</span>
                    <Logo3DStatic size="xl" />
                  </div>
                </div>
                {/* Large preview */}
                <div className="flex justify-center items-center pt-6 border-t border-border">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-muted-foreground">qa (preview size)</span>
                    <Logo3DStatic size="qa" />
                  </div>
                </div>
              </div>
            </section>

          {/* 3D Grid Logo - Rotating (Hero Version) */}
            <section id="rotating-logo" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">3D Grid Logo - Rotating (Hero Version)</h2>
              <p className="text-muted-foreground mb-6 text-sm">
                Rotating version with wireframe cube edges and grid texture on logo letters.
                Features crossfade effect to always show JG correctly (never reversed).
                Used as background with <code>opacity-20 dark:opacity-15</code>.
              </p>
              <div className="flex justify-center items-center rounded-xl border border-border bg-card/50 p-8 min-h-[500px]">
                <div className="opacity-20 dark:opacity-15">
                  <Logo3DRotatingDynamic size="qa" />
                </div>
              </div>
            </section>

          {/* Archived: 3D Glassy Logo (Collapsible) */}
            <section id="archived-glassy-logo" className="mb-16">
              <details className="group">
                <summary className="flex items-center gap-2 cursor-pointer list-none">
                  <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180" />
                  <h2 className="text-2xl font-bold text-foreground">Archived: 3D Glassy Logo</h2>
                  <Badge variant="secondary" className="ml-2">Archived</Badge>
                </summary>

                <div className="mt-6 space-y-8 pl-7">
                  <p className="text-muted-foreground text-sm">
                    Previous glass/transmission material version with rounded corners. Replaced by grid-style logo.
                    Component preserved in <code>components/logo-3d-glassy.tsx</code>.
                  </p>

                  {/* Glassy Logo Preview */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Static Version</h3>
                      <div className="flex justify-center items-center rounded-xl border border-border bg-card/50 p-8 min-h-[450px]">
                        <Logo3DGlassy size="qa" static />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Rotating Version</h3>
                      <div className="flex justify-center items-center rounded-xl border border-border bg-card/50 p-8 min-h-[450px]">
                        <Logo3DGlassy size="qa" />
                      </div>
                    </div>
                  </div>

                  {/* Glassy Logo Color Configuration */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Color Configuration</h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Colors defined in <code>lib/logo-colors.ts</code>. Click swatches to copy values.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Light Mode Colors */}
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-yellow-400" />
                          Light Mode
                        </h4>

                        <div className="space-y-6">
                          {/* Fill Colors */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">Fill (Glass Cube)</h5>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className="relative h-12 w-12 rounded-lg border border-gray-300 shrink-0"
                                  style={{ backgroundColor: LOGO_3D_COLORS.light.fill.base }}
                                >
                                  <div className="absolute inset-0 bg-[repeating-conic-gradient(#e5e7eb_0_90deg,#fff_90deg_180deg)] bg-[length:8px_8px] rounded-lg -z-10" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900">Base</p>
                                  <code className="text-xs text-gray-600 block">{LOGO_3D_COLORS.light.fill.base}</code>
                                  <p className="text-xs text-gray-500 mt-0.5">Cube base color</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div
                                  className="relative h-12 w-12 rounded-lg border border-gray-300 shrink-0"
                                  style={{ backgroundColor: LOGO_3D_COLORS.light.fill.attenuation }}
                                >
                                  <div className="absolute inset-0 bg-[repeating-conic-gradient(#e5e7eb_0_90deg,#fff_90deg_180deg)] bg-[length:8px_8px] rounded-lg -z-10" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900">Attenuation</p>
                                  <code className="text-xs text-gray-600 block">{LOGO_3D_COLORS.light.fill.attenuation}</code>
                                  <p className="text-xs text-gray-500 mt-0.5">Light attenuation through glass</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Logo Colors */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">Logo (JG Letters)</h5>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className="relative h-12 w-12 rounded-lg border border-gray-300 shrink-0"
                                  style={{ backgroundColor: LOGO_3D_COLORS.light.logo.color }}
                                >
                                  <div className="absolute inset-0 bg-[repeating-conic-gradient(#e5e7eb_0_90deg,#fff_90deg_180deg)] bg-[length:8px_8px] rounded-lg -z-10" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900">Color</p>
                                  <code className="text-xs text-gray-600 block">{LOGO_3D_COLORS.light.logo.color}</code>
                                  <p className="text-xs text-gray-500 mt-0.5">Main logo color</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div
                                  className="relative h-12 w-12 rounded-lg border border-gray-300 shrink-0"
                                  style={{ backgroundColor: LOGO_3D_COLORS.light.logo.emissive }}
                                >
                                  <div className="absolute inset-0 bg-[repeating-conic-gradient(#e5e7eb_0_90deg,#fff_90deg_180deg)] bg-[length:8px_8px] rounded-lg -z-10" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900">Emissive</p>
                                  <code className="text-xs text-gray-600 block">{LOGO_3D_COLORS.light.logo.emissive}</code>
                                  <p className="text-xs text-gray-500 mt-0.5">Glow (intensity: {LOGO_3D_COLORS.light.logo.emissiveIntensity})</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dark Mode Colors */}
                      <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
                        <h4 className="font-semibold text-gray-100 mb-4 flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-blue-400" />
                          Dark Mode
                        </h4>

                        <div className="space-y-6">
                          {/* Fill Colors */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">Fill (Glass Cube)</h5>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className="relative h-12 w-12 rounded-lg border border-gray-700 shrink-0"
                                  style={{ backgroundColor: LOGO_3D_COLORS.dark.fill.base }}
                                >
                                  <div className="absolute inset-0 bg-[repeating-conic-gradient(#374151_0_90deg,#1f2937_90deg_180deg)] bg-[length:8px_8px] rounded-lg -z-10" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-100">Base</p>
                                  <code className="text-xs text-gray-400 block">{LOGO_3D_COLORS.dark.fill.base}</code>
                                  <p className="text-xs text-gray-500 mt-0.5">Cube base color</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div
                                  className="relative h-12 w-12 rounded-lg border border-gray-700 shrink-0"
                                  style={{ backgroundColor: LOGO_3D_COLORS.dark.fill.attenuation }}
                                >
                                  <div className="absolute inset-0 bg-[repeating-conic-gradient(#374151_0_90deg,#1f2937_90deg_180deg)] bg-[length:8px_8px] rounded-lg -z-10" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-100">Attenuation</p>
                                  <code className="text-xs text-gray-400 block">{LOGO_3D_COLORS.dark.fill.attenuation}</code>
                                  <p className="text-xs text-gray-500 mt-0.5">Light attenuation through glass</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Logo Colors */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">Logo (JG Letters)</h5>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className="relative h-12 w-12 rounded-lg border border-gray-700 shrink-0"
                                  style={{ backgroundColor: LOGO_3D_COLORS.dark.logo.color }}
                                >
                                  <div className="absolute inset-0 bg-[repeating-conic-gradient(#374151_0_90deg,#1f2937_90deg_180deg)] bg-[length:8px_8px] rounded-lg -z-10" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-100">Color</p>
                                  <code className="text-xs text-gray-400 block">{LOGO_3D_COLORS.dark.logo.color}</code>
                                  <p className="text-xs text-gray-500 mt-0.5">Main logo color</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div
                                  className="relative h-12 w-12 rounded-lg border border-gray-700 shrink-0"
                                  style={{ backgroundColor: LOGO_3D_COLORS.dark.logo.emissive }}
                                >
                                  <div className="absolute inset-0 bg-[repeating-conic-gradient(#374151_0_90deg,#1f2937_90deg_180deg)] bg-[length:8px_8px] rounded-lg -z-10" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-100">Emissive</p>
                                  <code className="text-xs text-gray-400 block">{LOGO_3D_COLORS.dark.logo.emissive}</code>
                                  <p className="text-xs text-gray-500 mt-0.5">Glow (intensity: {LOGO_3D_COLORS.dark.logo.emissiveIntensity})</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            </section>

          {/* Colors Section */}
            <section id="colors" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Colors</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-xl border border-border bg-card/50">
                <ColorSwatch name="Background" variable="bg-background" className="bg-background" />
                <ColorSwatch name="Foreground" variable="text-foreground" className="bg-foreground" />
                <ColorSwatch name="Primary" variable="bg-primary" className="bg-primary" />
                <ColorSwatch name="Secondary" variable="bg-secondary" className="bg-secondary" />
                <ColorSwatch name="Muted" variable="bg-muted" className="bg-muted" />
                <ColorSwatch name="Accent" variable="bg-accent" className="bg-accent" />
                <ColorSwatch name="Card" variable="bg-card" className="bg-card" />
                <ColorSwatch name="Border" variable="border-border" className="bg-border" />
              </div>
            </section>

          {/* Buttons Section */}
            <section id="buttons" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Buttons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Primary Green Buttons - Most Common */}
                <ComponentCard title="Primary Green (CTA)" importPath="@/components/ui/button" className="md:col-span-2 lg:col-span-3 border-emerald-500/30">
                  <div className="flex flex-col gap-4 w-full">
                    <p className="text-xs text-muted-foreground text-center">
                      Our main CTA style: <code className="bg-muted px-1 rounded">bg-emerald-600 hover:bg-emerald-700</code>
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        Default
                      </Button>
                      <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                        <ArrowRightIcon className="h-4 w-4" />
                        Large with Icon
                      </Button>
                      <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 gap-2 px-8 py-6 text-base font-semibold">
                        Start Your Project
                        <ArrowRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </ComponentCard>

                {/* Standard shadcn variants */}
                <ComponentCard title="Button Variants" importPath="@/components/ui/button">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                      <Button>Default</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="destructive">Destructive</Button>
                      <Button variant="outline-destructive">Outline Destructive</Button>
                      <Button variant="ghost-destructive">Ghost Destructive</Button>
                    </div>
                  </div>
                </ComponentCard>

                <ComponentCard title="ShimmerButton" importPath="@/components/ui/shimmer-button">
                  <ShimmerButton>Shimmer</ShimmerButton>
                </ComponentCard>

                <ComponentCard title="PulsatingButton" importPath="@/components/ui/pulsating-button">
                  <PulsatingButton>Pulsating</PulsatingButton>
                </ComponentCard>

                <ComponentCard title="InteractiveHoverButton" importPath="@/components/ui/interactive-hover-button">
                  <InteractiveHoverButton>Hover Me</InteractiveHoverButton>
                </ComponentCard>
              </div>
            </section>

          {/* Typography Section */}
            <section id="typography" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Typography</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ComponentCard title="AnimatedGradientText" importPath="@/components/ui/animated-gradient-text">
                  <AnimatedGradientText>Gradient Text</AnimatedGradientText>
                </ComponentCard>

                <ComponentCard title="SparklesText" importPath="@/components/ui/sparkles-text">
                  <SparklesText className="text-2xl">Sparkles</SparklesText>
                </ComponentCard>
              </div>
            </section>

          {/* Form Controls Section */}
            <section id="form-controls" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Form Controls</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ComponentCard title="Switch" importPath="@/components/ui/switch">
                  <Switch />
                </ComponentCard>

                <ComponentCard title="Checkbox" importPath="@/components/ui/checkbox">
                  <div className="flex gap-3">
                    <Checkbox />
                    <Checkbox defaultChecked />
                  </div>
                </ComponentCard>

                <ComponentCard title="Slider" importPath="@/components/ui/slider">
                  <Slider
                    value={sliderValue}
                    onValueChange={setSliderValue}
                    max={100}
                    step={1}
                    className="w-32"
                  />
                </ComponentCard>

                <ComponentCard title="Badge" importPath="@/components/ui/badge">
                  <div className="flex gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                </ComponentCard>
              </div>
            </section>

          {/* Dropdowns & Popovers Section */}
            <section id="dropdowns-popovers" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Dropdowns & Popovers</h2>
              <p className="text-muted-foreground mb-6 text-sm">
                Glassmorphic dropdowns with <code>backdrop-blur-xl</code> and solid dark background in dark mode.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ComponentCard title="DropdownMenu" importPath="@/components/ui/dropdown-menu">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">Open Menu</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                      <DropdownMenuItem>Billing</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </ComponentCard>

                <ComponentCard title="Select" importPath="@/components/ui/select">
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                      <SelectItem value="option4">Option 4</SelectItem>
                    </SelectContent>
                  </Select>
                </ComponentCard>

                <ComponentCard title="Popover Style" importPath="globals.css" className="lg:col-span-1">
                  <div className="text-center text-sm text-muted-foreground">
                    <p className="mb-2">Dark mode popover:</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded block">
                      --popover: oklch(0.15 0 0 / 95%)
                    </code>
                    <p className="mt-2 text-xs">+ backdrop-blur-xl</p>
                  </div>
                </ComponentCard>
              </div>
            </section>

          {/* Accordion Section */}
            <section id="accordion" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Accordion</h2>
              <p className="text-muted-foreground mb-6 text-sm">
                Collapsible FAQ-style component with smooth expand/collapse animations. Uses Radix UI primitives.
              </p>
              <div className="grid grid-cols-1 gap-6">
                <ComponentCard title="Accordion" importPath="@/components/ui/accordion" className="col-span-full">
                  <div className="w-full max-w-lg">
                    <div className="rounded-xl border border-border bg-card/50">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="px-4 border-b border-border">
                          <AccordionTrigger className="text-foreground font-semibold text-left hover:no-underline">
                            Is this component animated?
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground text-sm">
                            Yes! The accordion uses CSS animations for smooth expand/collapse transitions.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="px-4 border-b border-border">
                          <AccordionTrigger className="text-foreground font-semibold text-left hover:no-underline">
                            Can multiple items be open?
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground text-sm">
                            Use <code className="bg-muted px-1 rounded">type=&quot;multiple&quot;</code> to allow multiple open items, or <code className="bg-muted px-1 rounded">type=&quot;single&quot; collapsible</code> for single item behavior.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className="px-4 border-b-0">
                          <AccordionTrigger className="text-foreground font-semibold text-left hover:no-underline">
                            Where is this used?
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground text-sm">
                            Used on the landing page FAQ section and the dedicated FAQ page for collapsible Q&A.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                </ComponentCard>
              </div>
            </section>

          {/* Media Components Section */}
            <section id="media-components" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Media Components</h2>
              <div className="grid grid-cols-1 gap-6">
                <ComponentCard title="BeforeAfterSlider" importPath="@/components/before-after-slider" className="col-span-full">
                  <div className="w-full max-w-2xl">
                    <p className="text-xs text-muted-foreground text-center mb-4">
                      Hover to control slider position. Images use <code>object-contain</code> to show full images without cropping.
                    </p>
                    <BeforeAfterSlider
                      beforeImage="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop"
                      afterImage="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=450&fit=crop"
                      beforeLabel="Before"
                      afterLabel="After"
                    />
                  </div>
                </ComponentCard>
              </div>
            </section>

          {/* Animation Components Section */}
            <section id="animation-components" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Animation Components</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ComponentCard title="Marquee" importPath="@/components/ui/marquee">
                  <div className="w-full overflow-hidden">
                    <Marquee className="[--duration:10s]">
                      {["Item 1", "Item 2", "Item 3", "Item 4"].map((item) => (
                        <div key={item} className="mx-4 px-4 py-2 rounded-lg bg-muted text-sm">
                          {item}
                        </div>
                      ))}
                    </Marquee>
                  </div>
                </ComponentCard>

                <ComponentCard title="Ripple" importPath="@/components/ui/ripple">
                  <div className="relative h-24 w-full">
                    <Ripple />
                  </div>
                </ComponentCard>
              </div>
            </section>

          {/* Background Patterns Section */}
            <section id="background-patterns" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Background Patterns</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ComponentCard title="DotPattern" importPath="@/components/ui/dot-pattern">
                  <div className="relative h-32 w-full overflow-hidden rounded-lg">
                    <DotPattern className="opacity-50" />
                  </div>
                </ComponentCard>

                <ComponentCard title="GridPattern" importPath="@/components/ui/grid-pattern">
                  <div className="relative h-32 w-full overflow-hidden rounded-lg">
                    <GridPattern className="opacity-30" />
                  </div>
                </ComponentCard>
              </div>
            </section>

          {/* BlurFade Section */}
            <section id="blur-fade" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">BlurFade</h2>
              <ComponentCard title="BlurFade" importPath="@/components/ui/blur-fade" className="col-span-full">
                <p className="text-muted-foreground text-sm mb-4">
                  Wraps content with fade-in + blur animation. Used on the landing page for staggered entrance animations.
                  Scroll down in this preview area to trigger the animation.
                </p>
                <div className="border rounded-lg p-4 bg-muted/30 max-h-48 overflow-y-auto">
                  <div className="space-y-4">
                    <BlurFade delay={0.1} inView>
                      <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <p className="text-sm font-medium">First Element (delay: 0.1s)</p>
                        <p className="text-xs text-muted-foreground">Fades in with blur effect</p>
                      </div>
                    </BlurFade>
                    <BlurFade delay={0.2} inView>
                      <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <p className="text-sm font-medium">Second Element (delay: 0.2s)</p>
                        <p className="text-xs text-muted-foreground">Staggered entrance animation</p>
                      </div>
                    </BlurFade>
                    <BlurFade delay={0.3} inView>
                      <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <p className="text-sm font-medium">Third Element (delay: 0.3s)</p>
                        <p className="text-xs text-muted-foreground">Creates a cascading effect</p>
                      </div>
                    </BlurFade>
                  </div>
                </div>
              </ComponentCard>
            </section>

          {/* Layout Components Section */}
            <section id="layout-components" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Layout Components</h2>
              <ComponentCard title="BentoGrid + BentoCard" importPath="@/components/ui/bento-grid" className="col-span-full">
                <div className="w-full">
                  <BentoGrid className="grid-cols-2 gap-4">
                    <BentoCard
                      name="Card 1"
                      description="Description text"
                      className="col-span-1"
                      background={<div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent" />}
                      Icon={() => <ZapIcon className="h-6 w-6" />}
                      href="#"
                      cta="Learn more"
                    />
                    <BentoCard
                      name="Card 2"
                      description="Another card"
                      className="col-span-1"
                      background={<div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent" />}
                      Icon={() => <HeartIcon className="h-6 w-6" />}
                      href="#"
                      cta="Explore"
                    />
                  </BentoGrid>
                </div>
              </ComponentCard>
            </section>

          {/* Animated Icons Section */}
            <section id="animated-icons" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Animated Icons (Lucide Animated)</h2>
              <p className="text-muted-foreground mb-6 text-sm">
                Hover over icons to trigger animations. Use refs to control: <code>iconRef.current?.startAnimation()</code>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {[
                  { name: "BellIcon", Icon: BellIcon, path: "@/components/ui/bell" },
                  { name: "HeartIcon", Icon: HeartIcon, path: "@/components/ui/heart" },
                  { name: "ZapIcon", Icon: ZapIcon, path: "@/components/ui/zap" },
                  { name: "RefreshCWIcon", Icon: RefreshCWIcon, path: "@/components/ui/refresh-cw" },
                  { name: "CogIcon", Icon: CogIcon, path: "@/components/ui/cog" },
                  { name: "WifiIcon", Icon: WifiIcon, path: "@/components/ui/wifi" },
                  { name: "MoonIcon", Icon: MoonIcon, path: "@/components/ui/moon" },
                  { name: "DownloadIcon", Icon: DownloadIcon, path: "@/components/ui/download" },
                  { name: "CheckIcon", Icon: CheckIcon, path: "@/components/ui/check" },
                  { name: "VolumeIcon", Icon: VolumeIcon, path: "@/components/ui/volume" },
                  { name: "UserIcon", Icon: UserIcon, path: "@/components/ui/user" },
                  { name: "ArrowRightIcon", Icon: ArrowRightIcon, path: "@/components/ui/arrow-right" },
                  { name: "LockIcon", Icon: LockIcon, path: "@/components/ui/lock" },
                  { name: "LockOpenIcon", Icon: LockOpenIcon, path: "@/components/ui/lock-open" },
                ].map(({ name, Icon, path }) => (
                  <div
                    key={name}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors group"
                  >
                    <Icon className="h-6 w-6 text-foreground" />
                    <span className="text-xs text-muted-foreground text-center">{name}</span>
                  </div>
                ))}
              </div>
            </section>

          {/* Custom Components Section */}
            <section id="custom-components" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Custom Components</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ComponentCard title="CursorGrid" importPath="@/components/cursor-grid">
                  <p className="text-muted-foreground text-sm text-center">
                    Full-screen grid background with cursor-following spotlight, twinkling dots, and animated pulses.
                  </p>
                </ComponentCard>

                <ComponentCard title="ExperienceTimeline" importPath="@/components/experience-timeline">
                  <p className="text-muted-foreground text-sm text-center">
                    Vertical alternating timeline with glow effects. Uses EXPERIENCE from constants.
                  </p>
                </ComponentCard>

                <ComponentCard title="TimeMachine" importPath="@/components/time-machine">
                  <p className="text-muted-foreground text-sm text-center">
                    macOS Time Machine-style 3D card stack. Experimental - see /playground.
                  </p>
                </ComponentCard>

                <ComponentCard title="UIShowcase" importPath="@/components/ui-showcase">
                  <p className="text-muted-foreground text-sm text-center">
                    Two-row marquee of interactive UI demo cards with auto-animations.
                  </p>
                </ComponentCard>
              </div>
            </section>

          {/* Usage Notes */}
            <section id="usage-notes" className="mb-16 rounded-xl border border-border bg-card/50 p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Usage Notes</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• All UI components are in <code>components/ui/</code></li>
                <li>• Custom page components are in <code>components/</code></li>
                <li>• Colors use OKLCH format in <code>globals.css</code></li>
                <li>• Use semantic tokens: <code>bg-background</code>, <code>text-foreground</code>, <code>border-border</code></li>
                <li>• Accent color is green: <code>hsl(145, 80%, 45%)</code> or <code>text-emerald-500</code></li>
                <li>• Glow effects via <code>@codaworks/react-glow</code></li>
                <li>• Number animations via <code>@number-flow/react</code></li>
              </ul>
            </section>
      </div>
  );
}
