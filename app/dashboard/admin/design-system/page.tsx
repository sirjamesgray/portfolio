"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Copy, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileBackButton } from "@/components/dashboard/mobile-back-button";
import { LandingButton } from "@/components/ui/landing-button";
import { PulsatingButton } from "@/components/ui/pulsating-button";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
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

  // BeforeAfterSlider editor state
  const [baMode, setBaMode] = useState<"fill" | "fit">("fill");
  const [baBgColor, setBaBgColor] = useState("#1a1a1a");
  const [baBeforeImage, setBaBeforeImage] = useState("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop");
  const [baAfterImage, setBaAfterImage] = useState("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=450&fit=crop");
  const [baBeforeLabel, setBaBeforeLabel] = useState("Before");
  const [baAfterLabel, setBaAfterLabel] = useState("After");

  return (
    <div>
        <MobileBackButton />
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-4xl font-bold text-foreground mb-4">Design System</h1>
              <p className="text-muted-foreground max-w-2xl lg:mx-0 mx-auto">
                Component library and design tokens. Click component names to copy import paths.
              </p>
            </div>

            {/* Component Sources */}
            <section id="sources" className="mb-12">
              <div className="rounded-xl border border-border bg-gradient-to-br from-emerald-500/5 to-blue-500/5 p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Component Sources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="space-y-1">
                    <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-emerald-500 transition-colors">
                      shadcn/ui →
                    </a>
                    <p className="text-muted-foreground text-xs">
                      Base components built on Radix UI primitives. Button, Dialog, Select, Accordion, etc.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <a href="https://magicui.design" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-emerald-500 transition-colors">
                      Magic UI →
                    </a>
                    <p className="text-muted-foreground text-xs">
                      Animated components. Marquee, Ripple, BlurFade, BentoGrid, AnimatedGradientText, etc.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-emerald-500 transition-colors">
                      Lucide Icons →
                    </a>
                    <p className="text-muted-foreground text-xs">
                      Icon library with 1000+ icons. Some wrapped with animation via custom components.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium text-foreground">Custom</span>
                    <p className="text-muted-foreground text-xs">
                      CursorGrid, BeforeAfterSlider, Logo3D, ExperienceTimeline, LandingButton, etc.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
                  <span><strong>Styling:</strong> Tailwind CSS v4</span>
                  <span><strong>Animation:</strong> Framer Motion</span>
                  <span><strong>3D:</strong> React Three Fiber + Drei</span>
                  <span><strong>Numbers:</strong> @number-flow/react</span>
                  <span><strong>Glow:</strong> @codaworks/react-glow</span>
                </div>
              </div>
            </section>

            {/* Typography */}
            <section id="typography" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-2">Typography</h2>
              <p className="text-muted-foreground mb-6 text-sm">
                Font stack using Geist Sans and Geist Mono from Vercel. Defined in <code>app/layout.tsx</code>.
              </p>

              {/* Font Families */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="rounded-xl border border-border bg-card/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Geist Sans</h3>
                    <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">font-sans</code>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">Primary typeface for all UI text.</p>
                  <div className="space-y-2 font-sans">
                    <p className="text-2xl font-bold">The quick brown fox</p>
                    <p className="text-lg font-medium">The quick brown fox jumps over</p>
                    <p className="text-base">The quick brown fox jumps over the lazy dog</p>
                    <p className="text-sm text-muted-foreground">ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789</p>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Geist Mono</h3>
                    <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">font-mono</code>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">Monospace for code, data, and technical content.</p>
                  <div className="space-y-2 font-mono">
                    <p className="text-2xl font-bold">The quick brown fox</p>
                    <p className="text-lg font-medium">The quick brown fox jumps over</p>
                    <p className="text-base">The quick brown fox jumps over the lazy dog</p>
                    <p className="text-sm text-muted-foreground">ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789</p>
                  </div>
                </div>
              </div>

              {/* Type Scale */}
              <div className="rounded-xl border border-border bg-card/50 p-6">
                <h3 className="font-semibold text-foreground mb-4">Type Scale & Hierarchy</h3>
                <div className="space-y-6">
                  <div className="flex items-baseline gap-4 pb-4 border-b border-border">
                    <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded w-24 shrink-0 text-center">text-5xl</code>
                    <span className="text-5xl font-bold tracking-tight">Page Title</span>
                  </div>
                  <div className="flex items-baseline gap-4 pb-4 border-b border-border">
                    <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded w-24 shrink-0 text-center">text-4xl</code>
                    <span className="text-4xl font-bold tracking-tight">Section Header</span>
                  </div>
                  <div className="flex items-baseline gap-4 pb-4 border-b border-border">
                    <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded w-24 shrink-0 text-center">text-2xl</code>
                    <span className="text-2xl font-bold">Card Title</span>
                  </div>
                  <div className="flex items-baseline gap-4 pb-4 border-b border-border">
                    <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded w-24 shrink-0 text-center">text-xl</code>
                    <span className="text-xl font-semibold">Subsection Title</span>
                  </div>
                  <div className="flex items-baseline gap-4 pb-4 border-b border-border">
                    <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded w-24 shrink-0 text-center">text-lg</code>
                    <span className="text-lg font-medium">Lead Paragraph</span>
                  </div>
                  <div className="flex items-baseline gap-4 pb-4 border-b border-border">
                    <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded w-24 shrink-0 text-center">text-base</code>
                    <span className="text-base">Body text - default size for paragraphs and UI elements</span>
                  </div>
                  <div className="flex items-baseline gap-4 pb-4 border-b border-border">
                    <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded w-24 shrink-0 text-center">text-sm</code>
                    <span className="text-sm text-muted-foreground">Secondary text, captions, and metadata</span>
                  </div>
                  <div className="flex items-baseline gap-4">
                    <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded w-24 shrink-0 text-center">text-xs</code>
                    <span className="text-xs text-muted-foreground">Labels, badges, and fine print</span>
                  </div>
                </div>
              </div>

              {/* Font Weights */}
              <div className="mt-6 p-4 rounded-lg border border-border bg-muted/30">
                <h4 className="text-sm font-medium text-foreground mb-3">Font Weights</h4>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="font-normal">Regular (400)</span>
                  <span className="font-medium">Medium (500)</span>
                  <span className="font-semibold">Semibold (600)</span>
                  <span className="font-bold">Bold (700)</span>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Use <code>tracking-tight</code> (-0.025em) for large headlines. Default tracking for body text.
                </p>
              </div>
            </section>

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
              <p className="text-muted-foreground mb-6 text-sm">
                Uses <strong>OKLCH</strong> color space for perceptual uniformity. Defined in <code>globals.css</code> with light/dark mode variants.
                Many colors use alpha values (e.g., <code>oklch(0 0 0 / 90%)</code>).
              </p>

              {/* Core Colors */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Core</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl border border-border bg-card/50">
                    <ColorSwatch name="Background" variable="bg-background" className="bg-background" />
                    <ColorSwatch name="Foreground" variable="text-foreground" className="bg-foreground" />
                    <ColorSwatch name="Card" variable="bg-card" className="bg-card" />
                    <ColorSwatch name="Border" variable="border-border" className="bg-border" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Brand & Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl border border-border bg-card/50">
                    <ColorSwatch name="Brand" variable="bg-brand" className="bg-brand" />
                    <ColorSwatch name="Primary" variable="bg-primary" className="bg-primary" />
                    <ColorSwatch name="Secondary" variable="bg-secondary" className="bg-secondary" />
                    <ColorSwatch name="Destructive" variable="bg-destructive" className="bg-destructive" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">UI States</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl border border-border bg-card/50">
                    <ColorSwatch name="Muted" variable="bg-muted" className="bg-muted" />
                    <ColorSwatch name="Accent" variable="bg-accent" className="bg-accent" />
                    <ColorSwatch name="Popover" variable="bg-popover" className="bg-popover" />
                    <ColorSwatch name="Ring" variable="ring-ring" className="bg-ring" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Chart Colors</h3>
                  <div className="grid grid-cols-5 gap-4 p-4 rounded-xl border border-border bg-card/50">
                    <ColorSwatch name="Chart 1" variable="--chart-1" className="bg-chart-1" />
                    <ColorSwatch name="Chart 2" variable="--chart-2" className="bg-chart-2" />
                    <ColorSwatch name="Chart 3" variable="--chart-3" className="bg-chart-3" />
                    <ColorSwatch name="Chart 4" variable="--chart-4" className="bg-chart-4" />
                    <ColorSwatch name="Chart 5" variable="--chart-5" className="bg-chart-5" />
                  </div>
                </div>

                {/* Emerald Scale - Our Accent */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Emerald Scale (Accent)</h3>
                  <p className="text-xs text-muted-foreground mb-3">Primary accent color used for CTAs, links, and highlights.</p>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2 p-4 rounded-xl border border-border bg-card/50">
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-8 w-8 rounded-md bg-emerald-50" />
                      <span className="text-[10px] text-muted-foreground">50</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-8 w-8 rounded-md bg-emerald-100" />
                      <span className="text-[10px] text-muted-foreground">100</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-8 w-8 rounded-md bg-emerald-200" />
                      <span className="text-[10px] text-muted-foreground">200</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-8 w-8 rounded-md bg-emerald-300" />
                      <span className="text-[10px] text-muted-foreground">300</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-8 w-8 rounded-md bg-emerald-400" />
                      <span className="text-[10px] text-muted-foreground">400</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-8 w-8 rounded-md bg-emerald-500" />
                      <span className="text-[10px] text-muted-foreground">500</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-8 w-8 rounded-md bg-emerald-600" />
                      <span className="text-[10px] text-muted-foreground">600</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-8 w-8 rounded-md bg-emerald-700" />
                      <span className="text-[10px] text-muted-foreground">700</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-8 w-8 rounded-md bg-emerald-800" />
                      <span className="text-[10px] text-muted-foreground">800</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-8 w-8 rounded-md bg-emerald-900" />
                      <span className="text-[10px] text-muted-foreground">900</span>
                    </div>
                  </div>
                </div>
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

                <ComponentCard title="LandingButton" importPath="@/components/ui/landing-button" className="md:col-span-2 lg:col-span-3">
                  <div className="flex flex-col gap-4 w-full">
                    <p className="text-xs text-muted-foreground text-center">
                      Landing page CTA button with shimmer animation. Variants: <code className="bg-muted px-1 rounded">default</code> (black), <code className="bg-muted px-1 rounded">primary</code> (green), <code className="bg-muted px-1 rounded">secondary</code> (white/zinc).
                    </p>
                    <div className="flex flex-col gap-4">
                      {/* Default variant (black) */}
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <span className="text-xs text-muted-foreground w-20">default</span>
                        <LandingButton size="sm">Small</LandingButton>
                        <LandingButton>Default</LandingButton>
                        <LandingButton size="lg">Large</LandingButton>
                      </div>
                      {/* Primary variant (green) */}
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <span className="text-xs text-muted-foreground w-20">primary</span>
                        <LandingButton variant="primary" size="sm">Small</LandingButton>
                        <LandingButton variant="primary">Default</LandingButton>
                        <LandingButton variant="primary" size="lg">Large</LandingButton>
                      </div>
                      {/* Secondary variant (white in light, zinc in dark) */}
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <span className="text-xs text-muted-foreground w-20">secondary</span>
                        <LandingButton variant="secondary" size="sm">Small</LandingButton>
                        <LandingButton variant="secondary">Default</LandingButton>
                        <LandingButton variant="secondary" size="lg">Large</LandingButton>
                      </div>
                    </div>
                  </div>
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
              </div>
            </section>

          {/* Form Controls Section */}
            <section id="form-controls" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Form Controls</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ComponentCard title="Input" importPath="@/components/ui/input">
                  <Input placeholder="Enter text..." className="w-full max-w-[200px]" />
                </ComponentCard>

                <ComponentCard title="Textarea" importPath="@/components/ui/textarea">
                  <Textarea placeholder="Enter longer text..." className="w-full max-w-[200px] h-20" />
                </ComponentCard>

                <ComponentCard title="Label" importPath="@/components/ui/label">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="demo-input">Form Label</Label>
                    <Input id="demo-input" placeholder="With label" className="w-full max-w-[160px]" />
                  </div>
                </ComponentCard>

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
                  <div className="flex gap-2 flex-wrap">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                </ComponentCard>

                <ComponentCard title="StatusBadge" importPath="@/components/ui/status-badge">
                  <div className="flex gap-2 flex-wrap">
                    <StatusBadge status="lead" />
                    <StatusBadge status="in_progress" />
                    <StatusBadge status="completed" />
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

          {/* Modals & Dialogs Section */}
            <section id="modals-dialogs" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Modals & Dialogs</h2>
              <p className="text-muted-foreground mb-6 text-sm">
                Overlay components for user interactions, confirmations, and forms.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ComponentCard title="Dialog" importPath="@/components/ui/dialog">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Dialog Title</DialogTitle>
                        <DialogDescription>
                          This is a modal dialog for displaying content or forms.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-sm text-muted-foreground">Dialog content goes here.</p>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button>Confirm</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </ComponentCard>

                <ComponentCard title="AlertDialog" importPath="@/components/ui/alert-dialog">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">Open Alert</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </ComponentCard>

                <ComponentCard title="Drawer" importPath="@/components/ui/drawer">
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="outline">Open Drawer</Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Drawer Title</DrawerTitle>
                        <DrawerDescription>Slides up from the bottom on mobile.</DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4">
                        <p className="text-sm text-muted-foreground">Drawer content goes here.</p>
                      </div>
                      <DrawerFooter>
                        <Button>Submit</Button>
                        <DrawerClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </ComponentCard>
              </div>
            </section>

          {/* Data Display Section */}
            <section id="data-display" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Data Display</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ComponentCard title="Card" importPath="@/components/ui/card">
                  <Card className="w-full max-w-[280px]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Card Title</CardTitle>
                      <CardDescription>Card description text</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Card content goes here.</p>
                    </CardContent>
                    <CardFooter>
                      <Button size="sm" className="w-full">Action</Button>
                    </CardFooter>
                  </Card>
                </ComponentCard>

                <ComponentCard title="Table" importPath="@/components/ui/table">
                  <div className="w-full max-w-md">
                    <Table>
                      <TableCaption>Sample data table</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Project A</TableCell>
                          <TableCell>Active</TableCell>
                          <TableCell className="text-right">$250</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Project B</TableCell>
                          <TableCell>Pending</TableCell>
                          <TableCell className="text-right">$150</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </ComponentCard>
              </div>
            </section>

          {/* Media Components Section */}
            <section id="media-components" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Media Components</h2>
              <div className="grid grid-cols-1 gap-6">
                <div className="rounded-xl border border-border bg-card/50 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">BeforeAfterSlider</h3>
                    <button
                      onClick={() => navigator.clipboard.writeText("@/components/before-after-slider")}
                      className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground hover:bg-muted/80 transition-colors"
                    >
                      <Copy className="h-3 w-3" />
                      <code>before-after-slider</code>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Editor Controls */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-foreground">Editor Controls</h4>

                      {/* Mode Toggle */}
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Mode</Label>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={baMode === "fill" ? "default" : "outline"}
                            onClick={() => setBaMode("fill")}
                          >
                            Fill
                          </Button>
                          <Button
                            size="sm"
                            variant={baMode === "fit" ? "default" : "outline"}
                            onClick={() => setBaMode("fit")}
                          >
                            Fit
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {baMode === "fill" ? "Images cover the container (may crop)" : "Images fit inside with padding (no crop)"}
                        </p>
                      </div>

                      {/* Background Color (only visible in fit mode) */}
                      {baMode === "fit" && (
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Background Color</Label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={baBgColor}
                              onChange={(e) => setBaBgColor(e.target.value)}
                              className="h-8 w-12 rounded border border-border cursor-pointer"
                            />
                            <Input
                              value={baBgColor}
                              onChange={(e) => setBaBgColor(e.target.value)}
                              className="w-28 h-8 text-xs"
                              placeholder="#1a1a1a"
                            />
                          </div>
                        </div>
                      )}

                      {/* Labels */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Before Label</Label>
                          <Input
                            value={baBeforeLabel}
                            onChange={(e) => setBaBeforeLabel(e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">After Label</Label>
                          <Input
                            value={baAfterLabel}
                            onChange={(e) => setBaAfterLabel(e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>

                      {/* Image URLs */}
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Before Image URL</Label>
                        <Input
                          value={baBeforeImage}
                          onChange={(e) => setBaBeforeImage(e.target.value)}
                          className="h-8 text-xs"
                          placeholder="https://..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">After Image URL</Label>
                        <Input
                          value={baAfterImage}
                          onChange={(e) => setBaAfterImage(e.target.value)}
                          className="h-8 text-xs"
                          placeholder="https://..."
                        />
                      </div>

                      {/* Reset Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setBaMode("fill");
                          setBaBgColor("#1a1a1a");
                          setBaBeforeImage("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop");
                          setBaAfterImage("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=450&fit=crop");
                          setBaBeforeLabel("Before");
                          setBaAfterLabel("After");
                        }}
                        className="w-full"
                      >
                        Reset to Defaults
                      </Button>
                    </div>

                    {/* Preview */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-foreground">Preview</h4>
                      <p className="text-xs text-muted-foreground">
                        Hover to control slider. Click/tap to go fullscreen.
                      </p>
                      <BeforeAfterSlider
                        beforeImage={baBeforeImage}
                        afterImage={baAfterImage}
                        beforeLabel={baBeforeLabel}
                        afterLabel={baAfterLabel}
                        mode={baMode}
                        backgroundColor={baBgColor}
                      />
                    </div>
                  </div>
                </div>
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

              {/* Alpha/Transparency Note */}
              <div className="mb-6 p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
                <h4 className="text-sm font-medium text-foreground mb-2">Transparency Note</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Stroke-based SVG icons (like Lucide) can show overlapping artifacts when using alpha transparency
                  in the color value. This occurs where strokes intersect.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-medium text-destructive mb-1">❌ Avoid</p>
                    <code className="block bg-muted/50 p-2 rounded text-muted-foreground">
                      className=&quot;text-foreground/50&quot;
                    </code>
                    <p className="text-muted-foreground/70 mt-1">Alpha in color causes stroke overlap</p>
                  </div>
                  <div>
                    <p className="font-medium text-emerald-500 mb-1">✓ Use instead</p>
                    <code className="block bg-muted/50 p-2 rounded text-muted-foreground">
                      className=&quot;text-foreground opacity-50&quot;
                    </code>
                    <p className="text-muted-foreground/70 mt-1">CSS opacity on parent preserves clean strokes</p>
                  </div>
                </div>
              </div>
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

          {/* OpenGraph Images */}
            <section id="og-images" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-2">OpenGraph Images</h2>
              <p className="text-muted-foreground mb-6 text-sm">
                Dynamic OG images generated with Next.js ImageResponse. Preview at <code>/opengraph-image</code> routes.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Home OG Image */}
                <div className="rounded-xl border border-border bg-card/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">Home Page</h3>
                    <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">app/opengraph-image.tsx</code>
                  </div>
                  <div className="relative aspect-[1200/630] rounded-lg overflow-hidden border border-border bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/opengraph-image"
                      alt="Home page OpenGraph preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="px-2 py-0.5 rounded bg-muted">1200×630</span>
                    <span className="px-2 py-0.5 rounded bg-muted">PNG</span>
                    <a
                      href="/opengraph-image"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-emerald-500 hover:underline"
                    >
                      Open full size →
                    </a>
                  </div>
                </div>

                {/* Pricing OG Image */}
                <div className="rounded-xl border border-border bg-card/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">Pricing Page</h3>
                    <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">app/pricing/opengraph-image.tsx</code>
                  </div>
                  <div className="relative aspect-[1200/630] rounded-lg overflow-hidden border border-border bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/pricing/opengraph-image"
                      alt="Pricing page OpenGraph preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="px-2 py-0.5 rounded bg-muted">1200×630</span>
                    <span className="px-2 py-0.5 rounded bg-muted">PNG</span>
                    <a
                      href="/pricing/opengraph-image"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-emerald-500 hover:underline"
                    >
                      Open full size →
                    </a>
                  </div>
                </div>
              </div>

              {/* OG Image Guidelines */}
              <div className="mt-6 p-4 rounded-lg border border-border bg-muted/30">
                <h4 className="text-sm font-medium text-foreground mb-2">Guidelines</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Standard size: 1200×630px (1.91:1 aspect ratio)</li>
                  <li>• Keep important content in the center safe zone (avoid edges)</li>
                  <li>• Use dark background with emerald accent to match brand</li>
                  <li>• Include JG logo for brand recognition</li>
                  <li>• Test with <a href="https://www.opengraph.xyz" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">opengraph.xyz</a> or social media debug tools</li>
                </ul>
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
                <li>• <strong>Icon transparency:</strong> Use <code>opacity-50</code> not <code>text-foreground/50</code> to avoid stroke overlap</li>
              </ul>
            </section>
      </div>
  );
}
