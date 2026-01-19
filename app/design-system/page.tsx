"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Copy, Check, ChevronDown, ArrowLeft, Calendar, Mail, MessageSquare, Linkedin, Zap, Heart } from "lucide-react";
import { ActionLinkCard } from "@/components/ui/action-link-card";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { CrossedCornersCard } from "@/components/ui/crossed-corners-card";
import { CursorGlow, GLOW_COLORS } from "@/components/ui/cursor-glow";
import { SparkleProvider, useSparkles } from "@/lib/sparkle-context";
import { getCard, CARD_COLORS, CARD_INTERACTIVE_SOLID, CARD_FEATURED, CARD_CTA, CARD_DESTRUCTIVE, CARD_WARNING } from "@/lib/cards";
import { TwinklingSparkles } from "@/components/twinkling-sparkles";

const sections = [
  { id: "accordion", label: "Accordion" },
  { id: "action-link-cards", label: "Action Link Cards" },
  { id: "animated-icons", label: "Animated Icons" },
  { id: "animation-components", label: "Animation" },
  { id: "backgrounds", label: "Backgrounds" },
  { id: "blur-fade", label: "BlurFade" },
  { id: "buttons", label: "DashboardButton" },
  { id: "cards", label: "Cards & Glow" },
  { id: "colors", label: "Colors" },
  { id: "data-display", label: "Data Display" },
  { id: "dropdowns-popovers", label: "Dropdowns & Popovers" },
  { id: "favicon", label: "Favicon" },
  { id: "form-controls", label: "Form Controls" },
  { id: "hero-section", label: "Hero Section" },
  { id: "image-upload", label: "Image Upload" },
  { id: "layout-components", label: "Layout Components" },
  { id: "logo-rotating", label: "Logo (Rotating)" },
  { id: "logo-static", label: "Logo (Static)" },
  { id: "media-components", label: "Media Components" },
  { id: "modals-dialogs", label: "Modals & Dialogs" },
  { id: "og-images", label: "OpenGraph Images" },
  { id: "section-header", label: "Section Header" },
  { id: "shadows", label: "Shadows" },
  { id: "sources", label: "Sources" },
  { id: "typography", label: "Typography" },
  { id: "typography-components", label: "Typography Components" },
  { id: "usage-notes", label: "Usage Notes" },
];
import { DashboardButton } from "@/components/ui/button";
import { LandingButton } from "@/components/ui/landing-button";
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
import { ImageUpload } from "@/components/ui/image-upload";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import { BlurFade } from "@/components/ui/blur-fade";
import { FlipWords } from "@/components/ui/flip-words";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { Footer } from "@/components/footer";
import { LandingBackground } from "@/components/landing-background";
import { CursorGrid } from "@/components/cursor-grid";
import { SectionHeader, IconStyle, IconVariant } from "@/components/ui/section-header";
import { RotatingCubeIcon } from "@/components/ui/rotating-cube-icon";

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

function ShadowSwatch({ name, variable, className, usage, code, isGlow = false }: {
  name: string;
  variable: string;
  className: string;
  usage: string;
  code: string;
  isGlow?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "h-20 w-full rounded-xl border transition-all",
          isGlow ? "border-transparent" : "border-border bg-card",
          className
        )}
      />
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{name}</p>
        <code className="text-xs text-muted-foreground block">{variable}</code>
        <p className="text-xs text-muted-foreground/70">{usage}</p>
      </div>
      <button
        onClick={copyCode}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        {copied ? "Copied!" : "Copy class"}
      </button>
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

function SparkleToggle() {
  const { sparklesEnabled, toggleSparkles } = useSparkles();
  return (
    <div className="flex items-center gap-2">
      <Switch
        id="sparkle-toggle"
        checked={sparklesEnabled}
        onCheckedChange={toggleSparkles}
      />
      <Label htmlFor="sparkle-toggle" className="text-xs text-muted-foreground cursor-pointer">
        Sparkles {sparklesEnabled ? "On" : "Off"}
      </Label>
    </div>
  );
}

export default function DesignSystemPage() {
  const [sliderValue, setSliderValue] = useState([50]);
  const [activeSection, setActiveSection] = useState("sources");

  // BeforeAfterSlider editor state
  const [baMode, setBaMode] = useState<"fill" | "fit">("fill");
  const [baBgColor, setBaBgColor] = useState("#1a1a1a");
  const [baBeforeImage, setBaBeforeImage] = useState("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop");
  const [baAfterImage, setBaAfterImage] = useState("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=450&fit=crop");
  const [baBeforeLabel, setBaBeforeLabel] = useState("Before");
  const [baAfterLabel, setBaAfterLabel] = useState("After");

  // Track active section based on scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <SparkleProvider>
    <div className="min-h-screen bg-background">
      {/* Fixed Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-56 border-r border-border bg-background/95 backdrop-blur-sm z-40">
        <nav className="h-full overflow-y-auto py-8 px-4">
          {/* Back link and theme toggle */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
            <ThemeToggle />
          </div>

          <ul className="space-y-1">
            {sections.map(({ id, label }) => (
              <li key={id}>
                <button
                  onClick={() => scrollToSection(id)}
                  className={cn(
                    "w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors",
                    activeSection === id
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile Sticky Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        {/* Back link and theme toggle */}
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <span className="text-sm font-medium text-foreground">Design System</span>
          <ThemeToggle />
        </div>
        {/* Horizontal scrollable sections */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 px-4 pb-3">
            {sections.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={cn(
                  "shrink-0 px-3 py-1.5 text-sm rounded-full transition-colors whitespace-nowrap",
                  activeSection === id
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination Dots - Fixed on right side */}
      <div className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-1.5">
        {sections.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className={cn(
              "h-2 rounded-full transition-all duration-200",
              activeSection === id
                ? "w-4 bg-emerald-500"
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            aria-label={`Jump to ${label}`}
            title={label}
          />
        ))}
      </div>

      {/* Main Content - offset by sidebar width on lg screens */}
      <main className="lg:ml-56 pt-24 lg:pt-0">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Design System</h1>
            <p className="text-muted-foreground max-w-2xl">
              Component library and design tokens. Click component names to copy import paths.
            </p>
          </div>

        {/* Component Sources */}
        
        <section id="accordion" className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Accordion</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Collapsible FAQ-style component with smooth expand/collapse animations. Uses Radix UI primitives.
            Each item has a subtle hover highlight in dark mode. Wrap in <code>CursorGlow</code> for interactive glow effects.
          </p>
          <div className="grid grid-cols-1 gap-6">
            <ComponentCard title="Accordion" importPath="@/components/ui/accordion" className="col-span-full">
              <div className="w-full max-w-lg">
                <CursorGlow>
                  <div className="rounded-2xl border border-white/10 bg-card/50 backdrop-blur-xl shadow-[var(--shadow-elevation-sm)] dark:shadow-[0_0_20px_rgba(16,185,129,0.08)] transition-all duration-300 cursor-pointer hover:border-primary/50 hover:shadow-[var(--shadow-elevation-md)] hover:bg-white/80 dark:hover:bg-card/80 dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1" className="px-5 border-b border-border">
                        <AccordionTrigger className="text-foreground font-semibold text-left hover:no-underline">
                          Is this component animated?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                          Yes! The accordion uses CSS animations for smooth expand/collapse transitions.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2" className="px-5 border-b border-border">
                        <AccordionTrigger className="text-foreground font-semibold text-left hover:no-underline">
                          Can multiple items be open?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                          Use <code className="bg-muted px-1 rounded">type=&quot;multiple&quot;</code> to allow multiple open items, or <code className="bg-muted px-1 rounded">type=&quot;single&quot; collapsible</code> for single item behavior.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3" className="px-5 border-b-0">
                        <AccordionTrigger className="text-foreground font-semibold text-left hover:no-underline">
                          Where is this used?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                          Used on the landing page FAQ section and the dedicated FAQ page for collapsible Q&A.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </CursorGlow>
              </div>
            </ComponentCard>
          </div>
        </section>

        <section id="action-link-cards" className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Action Link Cards</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Clickable cards for contact actions, navigation links, and CTAs. Primary variant has emerald background with white sparkles.
            Secondary variant uses card background with emerald icon accent.
          </p>

          <div className="space-y-8">
            {/* Primary vs Secondary */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Primary vs Secondary</h3>
              <div className="grid gap-4 max-w-xl">
                <ActionLinkCard
                  title="Schedule a call"
                  description="Book a free 30-minute consultation"
                  icon={Calendar}
                  href="#"
                  primary
                />
                <ActionLinkCard
                  title="Email me"
                  description="I'll get back to you within 24 hours"
                  icon={Mail}
                  href="#"
                />
              </div>
            </div>

            {/* With/Without Description */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">With/Without Description</h3>
              <div className="grid gap-4 max-w-xl">
                <ActionLinkCard
                  title="Email me"
                  icon={Mail}
                  href="#"
                  primary
                />
                <ActionLinkCard
                  title="Connect on LinkedIn"
                  icon={Linkedin}
                  href="#"
                  external
                />
              </div>
            </div>

            {/* External Links */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">External Links</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Use <code className="bg-muted px-1 rounded">external</code> prop for links that open in new tabs (adds target=&quot;_blank&quot; rel=&quot;noopener noreferrer&quot;).
              </p>
              <div className="grid gap-4 max-w-xl">
                <ActionLinkCard
                  title="View on GitHub"
                  description="Opens in a new tab"
                  icon={MessageSquare}
                  href="#"
                  external
                />
              </div>
            </div>

            {/* Usage Notes */}
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h4 className="text-sm font-medium text-foreground mb-3">Usage</h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p><strong>Import:</strong> <code className="bg-muted px-1 rounded">import {"{"} ActionLinkCard {"}"} from &quot;@/components/ui/action-link-card&quot;</code></p>
                <p><strong>Primary:</strong> Use for the main CTA (e.g., &quot;Schedule a call&quot;). Has white sparkles.</p>
                <p><strong>Secondary:</strong> Use for alternative actions. No sparkles, emerald icon accent.</p>
                <p><strong>External:</strong> Set <code className="bg-muted px-1 rounded">external=true</code> for links opening in new tabs.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="animated-icons" className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Animated Icons (Lucide Animated)</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Hover over icons to trigger animations. Use refs to control: <code>iconRef.current?.startAnimation()</code>
          </p>

          {/* Alpha/Transparency Note */}
          <div className="mb-6 p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
            <h4 className="text-sm font-medium text-foreground mb-2">SVG Stroke Overlap Fix</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Stroke-based SVG icons can show overlapping artifacts when using alpha transparency in colors.
              We&apos;ve fixed this by using solid colors for <code className="bg-muted/50 px-1 rounded">--muted-foreground</code> in globals.css.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-medium text-destructive mb-1">Avoid for icons</p>
                <code className="block bg-muted/50 p-2 rounded text-muted-foreground">
                  className=&quot;text-foreground/50&quot;
                </code>
                <p className="text-muted-foreground mt-1">Alpha in color causes stroke overlap</p>
              </div>
              <div>
                <p className="font-medium text-emerald-500 mb-1">Safe to use</p>
                <code className="block bg-muted/50 p-2 rounded text-muted-foreground">
                  className=&quot;text-muted-foreground&quot;
                </code>
                <p className="text-muted-foreground mt-1">Uses solid color (oklch 0.556)</p>
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
                <Icon className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground text-center">{name}</span>
              </div>
            ))}
          </div>
        </section>

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

        <section id="backgrounds" className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Backgrounds</h2>
          <p className="text-muted-foreground mb-6">
            The unified background system used across landing pages. Combines gradients, animated grids, and decorative patterns.
          </p>

          {/* LandingBackground - Main Component */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Landing Background</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ComponentCard title="LandingBackground" importPath="@/components/landing-background" className="md:col-span-2">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    The primary wrapper component for all landing pages. Includes a subtle blue gradient and the interactive CursorGrid overlay.
                  </p>
                  <div className="relative h-48 rounded-lg overflow-hidden border border-border">
                    <LandingBackground className="h-full w-full">
                      <div className="flex items-center justify-center h-full">
                        <span className="text-sm text-muted-foreground">Hover to see cursor spotlight + watch for blinking dots</span>
                      </div>
                    </LandingBackground>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg font-mono">
                    {`<LandingBackground className="flex flex-col">`}<br />
                    {`  <SiteHeader />`}<br />
                    {`  <main>...</main>`}<br />
                    {`  <Footer />`}<br />
                    {`</LandingBackground>`}
                  </div>
                </div>
              </ComponentCard>
            </div>
          </div>

          {/* CursorGrid - Interactive Grid System */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Cursor Grid (Interactive)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ComponentCard title="CursorGrid" importPath="@/components/cursor-grid" className="md:col-span-2 lg:col-span-2">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    The animated dot grid component with cursor-following spotlight, pulsing lines, and random blinking dots.
                  </p>
                  <div className="relative h-40 rounded-lg overflow-hidden border border-border bg-background">
                    <CursorGrid />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">Move cursor here &bull; Watch for emerald blinks</span>
                    </div>
                  </div>
                </div>
              </ComponentCard>

              <ComponentCard title="CursorGrid Features" importPath="@/components/cursor-grid">
                <div className="space-y-3 text-sm">
                  <div className="flex gap-2 items-start">
                    <span className="text-emerald-500 shrink-0 mt-0.5">●</span>
                    <div>
                      <span className="font-medium text-foreground">Cursor Spotlight</span>
                      <p className="text-xs text-muted-foreground">300px radius glow follows mouse</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="text-emerald-500 shrink-0 mt-0.5">●</span>
                    <div>
                      <span className="font-medium text-foreground">Pulsing Lines</span>
                      <p className="text-xs text-muted-foreground">Emerald lines travel along grid paths</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="text-emerald-500 shrink-0 mt-0.5">●</span>
                    <div>
                      <span className="font-medium text-foreground">Blinking Dots</span>
                      <p className="text-xs text-muted-foreground">Random dots flash emerald every ~800ms</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="text-muted-foreground shrink-0 mt-0.5">○</span>
                    <div>
                      <span className="font-medium text-foreground">Grid Lines</span>
                      <p className="text-xs text-muted-foreground">40px spacing, visible near cursor</p>
                    </div>
                  </div>
                </div>
              </ComponentCard>
            </div>

            {/* Blinking Dots Animation Details */}
            <div className="mt-6 p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Blinking Dots Animation
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground mb-1">Animation Phases:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li><strong>Flash</strong> (150ms) - Dot expands with emerald color</li>
                    <li><strong>Settle</strong> (300ms) - Bounces down to hold size</li>
                    <li><strong>Hold</strong> (800ms) - Stays emerald at 1.3x scale</li>
                    <li><strong>Deflate</strong> (600ms) - Fades back to grey</li>
                  </ol>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Behavior:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>3-8 random dots triggered every ~800ms</li>
                    <li>Each dot has random intensity (0.3-1.0)</li>
                    <li>Sparse rendering - only active dots update</li>
                    <li>Throttled to ~30fps for performance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Patterns */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Decorative Patterns</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Static background patterns for cards, sections, or decorative use. Not used on landing pages (use LandingBackground instead).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ComponentCard title="DotPattern" importPath="@/components/ui/dot-pattern">
                <div className="relative h-32 w-full overflow-hidden rounded-lg border border-border">
                  <DotPattern className="opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">Static dot grid</span>
                  </div>
                </div>
              </ComponentCard>

              <ComponentCard title="GridPattern" importPath="@/components/ui/grid-pattern">
                <div className="relative h-32 w-full overflow-hidden rounded-lg border border-border">
                  <GridPattern className="opacity-30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">Static line grid</span>
                  </div>
                </div>
              </ComponentCard>
            </div>
          </div>

          {/* Usage Guidelines */}
          <div className="p-4 rounded-lg border border-border bg-card/50">
            <h4 className="text-sm font-semibold text-foreground mb-3">Usage Guidelines</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 shrink-0">✓</span>
                  <span className="text-muted-foreground"><strong>LandingBackground:</strong> Home, Pricing, Projects, Experience, Contact, FAQ</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 shrink-0">✓</span>
                  <span className="text-muted-foreground"><strong>DotPattern/GridPattern:</strong> Card backgrounds, empty states</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="text-red-500 dark:text-red-400 shrink-0">✗</span>
                  <span className="text-muted-foreground"><strong>Don&apos;t:</strong> Use LandingBackground on dashboard pages</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-500 dark:text-red-400 shrink-0">✗</span>
                  <span className="text-muted-foreground"><strong>Don&apos;t:</strong> Stack multiple animated backgrounds</span>
                </div>
              </div>
            </div>
          </div>
        </section>

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

        <section id="buttons" className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">DashboardButton</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            <code>DashboardButton</code> is for dashboard/admin contexts. For landing pages, use <code>LandingButton</code> instead.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Primary Green Buttons - Most Common */}
            <ComponentCard title="Primary Green (CTA)" importPath="@/components/ui/button" className="md:col-span-2 lg:col-span-3 border-emerald-500/30">
              <div className="flex flex-col gap-4 w-full">
                <p className="text-xs text-muted-foreground text-center">
                  Our main CTA style: <code className="bg-muted px-1 rounded">bg-emerald-600 hover:bg-emerald-700</code>
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <DashboardButton className="bg-emerald-600 hover:bg-emerald-700">
                    Default
                  </DashboardButton>
                  <DashboardButton size="lg" className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                    <ArrowRightIcon className="h-4 w-4" />
                    Large with Icon
                  </DashboardButton>
                  <DashboardButton size="lg" className="bg-emerald-600 hover:bg-emerald-700 gap-2 px-8 py-6 text-base font-semibold">
                    Start Your Project
                    <ArrowRightIcon className="h-4 w-4" />
                  </DashboardButton>
                </div>
              </div>
            </ComponentCard>

            {/* Standard shadcn variants */}
            <ComponentCard title="DashboardButton Variants" importPath="@/components/ui/button">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  <DashboardButton>Default</DashboardButton>
                  <DashboardButton variant="secondary">Secondary</DashboardButton>
                  <DashboardButton variant="outline">Outline</DashboardButton>
                  <DashboardButton variant="ghost">Ghost</DashboardButton>
                </div>
                <div className="flex flex-wrap gap-2">
                  <DashboardButton variant="destructive">Destructive</DashboardButton>
                  <DashboardButton variant="outline-destructive">Outline Destructive</DashboardButton>
                  <DashboardButton variant="ghost-destructive">Ghost Destructive</DashboardButton>
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

            <ComponentCard title="InteractiveHoverButton" importPath="@/components/ui/interactive-hover-button">
              <InteractiveHoverButton>Hover Me</InteractiveHoverButton>
            </ComponentCard>
          </div>
        </section>

        <section id="cards" className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Cards & Cursor Glow</h2>
            <SparkleToggle />
          </div>
          <p className="text-muted-foreground mb-6 text-sm">
            Centralized card system for consistent styling across the application. Defined in <code>lib/cards.ts</code>.
            Shadow behavior: sm (default) → md (hover). Dark mode includes subtle emerald glow.
            Wrap cards in <code>&lt;CursorGlow&gt;</code> for interactive cursor-following glow effects.
            Use <code>sparkle</code> prop with <code>SparkleProvider</code> to enable twinkling sparkles.
          </p>

          {/* Unified Card Color System */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Unified Card Color System</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Each card variant has a single accent color that defines its border, shadow, CursorGlow, and sparkle colors.
                Use <code className="bg-muted px-1 rounded">getCard(variant)</code> to get all colors and classes at once.
                <strong className="text-foreground"> CARD_CTA is the only variant with white sparkles.</strong>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 rounded-xl border border-border bg-gradient-to-br from-emerald-500/5 to-blue-500/5">
                {/* Interactive Solid - Emerald */}
                <div className="space-y-3">
                  <CursorGlow color={getCard("interactive").cursorGlow}>
                    <div className={`${CARD_INTERACTIVE_SOLID.full} p-6 relative overflow-hidden`}>
                      <TwinklingSparkles color={getCard("interactive").sparkle} forceShow />
                      <p className="font-medium text-foreground relative z-20">Interactive</p>
                      <p className="text-sm text-muted-foreground relative z-20">Emerald sparkles</p>
                    </div>
                  </CursorGlow>
                  <code className="text-xs text-muted-foreground block">color: emerald</code>
                </div>

                {/* Featured - Emerald */}
                <div className="space-y-3">
                  <CursorGlow color={getCard("featured").cursorGlow}>
                    <div className={`${CARD_FEATURED.full} p-6 relative overflow-hidden`}>
                      <TwinklingSparkles color={getCard("featured").sparkle} forceShow />
                      <p className="font-medium text-foreground relative z-20">Featured</p>
                      <p className="text-sm text-muted-foreground relative z-20">Emerald sparkles</p>
                    </div>
                  </CursorGlow>
                  <code className="text-xs text-muted-foreground block">color: emerald</code>
                </div>

                {/* CTA - White sparkles (ONLY exception) */}
                <div className="space-y-3">
                  <CursorGlow brighten>
                    <div className={`${CARD_CTA.full} p-6 relative overflow-hidden`}>
                      <TwinklingSparkles color={getCard("cta").sparkle} forceShow />
                      <p className="font-medium relative z-20">CTA</p>
                      <p className="text-sm text-white/80 relative z-20">White sparkles only</p>
                    </div>
                  </CursorGlow>
                  <code className="text-xs text-muted-foreground block">color: white (exception)</code>
                </div>

                {/* Crossed Corners - Emerald */}
                <div className="space-y-3">
                  <CursorGlow color={getCard("crossed-corners").cursorGlow}>
                    <CrossedCornersCard className="p-6 relative overflow-hidden">
                      <TwinklingSparkles color={getCard("crossed-corners").sparkle} forceShow />
                      <p className="font-medium text-foreground relative z-20">Crossed Corners</p>
                      <p className="text-sm text-muted-foreground relative z-20">Emerald sparkles</p>
                    </CrossedCornersCard>
                  </CursorGlow>
                  <code className="text-xs text-muted-foreground block">color: emerald</code>
                </div>

                {/* Warning - Yellow */}
                <div className="space-y-3">
                  <CursorGlow color={getCard("warning").cursorGlow}>
                    <div className={`${CARD_WARNING.full} p-6 relative overflow-hidden`}>
                      <TwinklingSparkles color={getCard("warning").sparkle} forceShow />
                      <p className="font-medium text-foreground relative z-20">Warning</p>
                      <p className="text-sm text-muted-foreground relative z-20">Yellow sparkles</p>
                    </div>
                  </CursorGlow>
                  <code className="text-xs text-muted-foreground block">color: yellow</code>
                </div>

                {/* Destructive - Red */}
                <div className="space-y-3">
                  <CursorGlow color={getCard("destructive").cursorGlow}>
                    <div className={`${CARD_DESTRUCTIVE.full} p-6 relative overflow-hidden`}>
                      <TwinklingSparkles color={getCard("destructive").sparkle} forceShow />
                      <p className="font-medium text-foreground relative z-20">Destructive</p>
                      <p className="text-sm text-muted-foreground relative z-20">Red sparkles</p>
                    </div>
                  </CursorGlow>
                  <code className="text-xs text-muted-foreground block">color: red</code>
                </div>
              </div>
            </div>

            {/* Card Color Reference */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Card Color Reference</h3>
              <div className="p-4 rounded-xl border border-border bg-card/50">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium text-foreground">Variant</th>
                      <th className="text-left py-2 font-medium text-foreground">Color</th>
                      <th className="text-left py-2 font-medium text-foreground">Sparkle</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="py-2">interactive, featured, crossed-corners</td>
                      <td className="py-2"><span className="text-emerald-500">emerald</span></td>
                      <td className="py-2">rgba(16, 185, 129, 0.9)</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2">cta</td>
                      <td className="py-2"><span className="text-white bg-emerald-600 px-1 rounded">white</span></td>
                      <td className="py-2">white (only exception)</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2">warning</td>
                      <td className="py-2"><span className="text-yellow-500">yellow</span></td>
                      <td className="py-2">rgba(234, 179, 8, 0.9)</td>
                    </tr>
                    <tr>
                      <td className="py-2">destructive</td>
                      <td className="py-2"><span className="text-red-500">red</span></td>
                      <td className="py-2">rgba(239, 68, 68, 0.9)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cursor Glow Colors */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Cursor Glow Colors</h3>
              <p className="text-xs text-muted-foreground mb-4">
                The <code className="bg-muted px-1 rounded">GLOW_COLORS</code> constant provides a preset palette. Pass any HSL value for custom colors.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-6 rounded-xl border border-border bg-card/50">
                <CursorGlow color={GLOW_COLORS.emerald}>
                  <div className="p-4 rounded-xl border border-border bg-card/50 text-center">
                    <p className="text-xs font-medium text-foreground">Emerald</p>
                    <code className="text-[10px] text-muted-foreground">GLOW_COLORS.emerald</code>
                  </div>
                </CursorGlow>
                <CursorGlow color={GLOW_COLORS.red}>
                  <div className="p-4 rounded-xl border border-border bg-card/50 text-center">
                    <p className="text-xs font-medium text-foreground">Red</p>
                    <code className="text-[10px] text-muted-foreground">GLOW_COLORS.red</code>
                  </div>
                </CursorGlow>
                <CursorGlow color={GLOW_COLORS.orange}>
                  <div className="p-4 rounded-xl border border-border bg-card/50 text-center">
                    <p className="text-xs font-medium text-foreground">Orange</p>
                    <code className="text-[10px] text-muted-foreground">GLOW_COLORS.orange</code>
                  </div>
                </CursorGlow>
                <CursorGlow color={GLOW_COLORS.cyan}>
                  <div className="p-4 rounded-xl border border-border bg-card/50 text-center">
                    <p className="text-xs font-medium text-foreground">Cyan</p>
                    <code className="text-[10px] text-muted-foreground">GLOW_COLORS.cyan</code>
                  </div>
                </CursorGlow>
                <CursorGlow color={GLOW_COLORS.purple}>
                  <div className="p-4 rounded-xl border border-border bg-card/50 text-center">
                    <p className="text-xs font-medium text-foreground">Purple</p>
                    <code className="text-[10px] text-muted-foreground">GLOW_COLORS.purple</code>
                  </div>
                </CursorGlow>
                <CursorGlow color={GLOW_COLORS.pink}>
                  <div className="p-4 rounded-xl border border-border bg-card/50 text-center">
                    <p className="text-xs font-medium text-foreground">Pink</p>
                    <code className="text-[10px] text-muted-foreground">GLOW_COLORS.pink</code>
                  </div>
                </CursorGlow>
                <CursorGlow color={GLOW_COLORS.amber}>
                  <div className="p-4 rounded-xl border border-border bg-card/50 text-center">
                    <p className="text-xs font-medium text-foreground">Amber</p>
                    <code className="text-[10px] text-muted-foreground">GLOW_COLORS.amber</code>
                  </div>
                </CursorGlow>
                <CursorGlow color={GLOW_COLORS.rose}>
                  <div className="p-4 rounded-xl border border-border bg-card/50 text-center">
                    <p className="text-xs font-medium text-foreground">Rose</p>
                    <code className="text-[10px] text-muted-foreground">GLOW_COLORS.rose</code>
                  </div>
                </CursorGlow>
                <CursorGlow color={GLOW_COLORS.blue}>
                  <div className="p-4 rounded-xl border border-border bg-card/50 text-center">
                    <p className="text-xs font-medium text-foreground">Blue</p>
                    <code className="text-[10px] text-muted-foreground">GLOW_COLORS.blue</code>
                  </div>
                </CursorGlow>
              </div>
            </div>

            {/* CursorGlow Props */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">CursorGlow Props</h3>
              <div className="p-6 rounded-xl border border-border bg-card/50">
                <div className="grid gap-3 text-sm">
                  <div className="flex gap-3">
                    <code className="text-emerald-600 dark:text-emerald-400 shrink-0 font-mono text-xs">color</code>
                    <span className="text-xs text-muted-foreground">CSS color value or <code className="bg-muted px-1 rounded">GLOW_COLORS.*</code>. Default: emerald</span>
                  </div>
                  <div className="flex gap-3">
                    <code className="text-emerald-600 dark:text-emerald-400 shrink-0 font-mono text-xs">size</code>
                    <span className="text-xs text-muted-foreground">Glow radius in pixels. Default: <code className="bg-muted px-1 rounded">500</code></span>
                  </div>
                  <div className="flex gap-3">
                    <code className="text-emerald-600 dark:text-emerald-400 shrink-0 font-mono text-xs">opacity</code>
                    <span className="text-xs text-muted-foreground">Background glow opacity (0-1). Default: <code className="bg-muted px-1 rounded">0.06</code></span>
                  </div>
                  <div className="flex gap-3">
                    <code className="text-emerald-600 dark:text-emerald-400 shrink-0 font-mono text-xs">proximityDistance</code>
                    <span className="text-xs text-muted-foreground">Distance to start glowing. Default: <code className="bg-muted px-1 rounded">100</code>px</span>
                  </div>
                  <div className="flex gap-3">
                    <code className="text-emerald-600 dark:text-emerald-400 shrink-0 font-mono text-xs">disabled</code>
                    <span className="text-xs text-muted-foreground">Disable the glow effect completely. Default: <code className="bg-muted px-1 rounded">false</code></span>
                  </div>
                  <div className="flex gap-3">
                    <code className="text-emerald-600 dark:text-emerald-400 shrink-0 font-mono text-xs">disabledInLightMode</code>
                    <span className="text-xs text-muted-foreground">Disable glow in light mode only (dark mode still glows). Default: <code className="bg-muted px-1 rounded">true</code></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Guidelines */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Usage Guidelines</h3>
              <div className="p-6 rounded-xl border border-border bg-card/50 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs font-medium text-foreground mb-2">Shadow Behavior</p>
                    <p className="text-[10px] text-muted-foreground">
                      Cards use sm shadow by default, intensify to md on hover. Dark mode adds subtle emerald glow.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs font-medium text-foreground mb-2">Glass vs Solid</p>
                    <p className="text-[10px] text-muted-foreground">
                      Use glass cards on landing pages. Use solid cards in dashboard/admin contexts.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs font-medium text-foreground mb-2">Matching Glow Colors</p>
                    <p className="text-[10px] text-muted-foreground">
                      Match <code className="bg-muted px-1 rounded">CursorGlow</code> color to card's gradient background for cohesive feel.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs font-medium text-foreground mb-2">Hover Opacity</p>
                    <p className="text-[10px] text-muted-foreground">
                      Glass cards become more opaque on hover: white in light mode, brighter grey in dark mode.
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border space-y-2">
                  <p className="text-xs text-muted-foreground">
                    <strong>Cards:</strong> <code className="bg-muted px-1 rounded">import {"{"} CARD_INTERACTIVE_SOLID {"}"} from &quot;@/lib/cards&quot;</code>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Glow:</strong> <code className="bg-muted px-1 rounded">import {"{"} CursorGlow, GLOW_COLORS {"}"} from &quot;@/components/ui/cursor-glow&quot;</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

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
                  <DashboardButton size="sm" className="w-full">Action</DashboardButton>
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

        <section id="dropdowns-popovers" className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Dropdowns & Popovers</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Glassmorphic dropdowns with <code>backdrop-blur-xl</code> and solid dark background in dark mode.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ComponentCard title="DropdownMenu" importPath="@/components/ui/dropdown-menu">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <DashboardButton variant="outline">Open Menu</DashboardButton>
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

        <section id="logo-rotating" className="mb-16">
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

        <section id="logo-static" className="mb-16">
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
                      <DashboardButton
                        size="sm"
                        variant={baMode === "fill" ? "default" : "outline"}
                        onClick={() => setBaMode("fill")}
                      >
                        Fill
                      </DashboardButton>
                      <DashboardButton
                        size="sm"
                        variant={baMode === "fit" ? "default" : "outline"}
                        onClick={() => setBaMode("fit")}
                      >
                        Fit
                      </DashboardButton>
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
                  <DashboardButton
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
                  </DashboardButton>
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

        <section id="modals-dialogs" className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Modals & Dialogs</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Overlay components for user interactions, confirmations, and forms.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ComponentCard title="Dialog" importPath="@/components/ui/dialog">
              <Dialog>
                <DialogTrigger asChild>
                  <DashboardButton variant="outline">Open Dialog</DashboardButton>
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
                      <DashboardButton variant="outline">Cancel</DashboardButton>
                    </DialogClose>
                    <DashboardButton>Confirm</DashboardButton>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </ComponentCard>

            <ComponentCard title="AlertDialog" importPath="@/components/ui/alert-dialog">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DashboardButton variant="outline">Open Alert</DashboardButton>
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
                  <DashboardButton variant="outline">Open Drawer</DashboardButton>
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
                    <DashboardButton>Submit</DashboardButton>
                    <DrawerClose asChild>
                      <DashboardButton variant="outline">Cancel</DashboardButton>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </ComponentCard>
          </div>
        </section>

        <section id="og-images" className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-2">OpenGraph Images</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Dynamic OG images generated with Next.js ImageResponse. Each landing page has its own OG image.
          </p>

          {/* Active Landing Page - Product Engineer */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-xs">Active</span>
              Product Engineer Landing Page
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Home OG Image (Product Engineer) */}
              <div className="rounded-xl border border-emerald-500/30 bg-card/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">Home Page (Root)</h4>
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
                  <span className="px-2 py-0.5 rounded bg-muted">1200x630</span>
                  <span className="px-2 py-0.5 rounded bg-muted">PNG</span>
                  <a
                    href="/opengraph-image"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-emerald-500 hover:underline"
                  >
                    Open full size
                  </a>
                </div>
              </div>

              {/* Product Engineer Variant OG Image */}
              <div className="rounded-xl border border-border bg-card/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">Product Engineer Variant</h4>
                  <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">landing-variants/product-engineer/</code>
                </div>
                <div className="relative aspect-[1200/630] rounded-lg overflow-hidden border border-border bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/landing-variants/product-engineer/opengraph-image"
                    alt="Product Engineer variant OpenGraph preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="px-2 py-0.5 rounded bg-muted">1200x630</span>
                  <span className="px-2 py-0.5 rounded bg-muted">PNG</span>
                  <a
                    href="/landing-variants/product-engineer/opengraph-image"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-emerald-500 hover:underline"
                  >
                    Open full size
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Inactive Landing Pages - Collapsed */}
          <details className="group mb-6">
            <summary className="flex items-center gap-2 cursor-pointer list-none text-muted-foreground hover:text-foreground transition-colors">
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              <span className="text-sm font-medium">Inactive Landing Pages</span>
              <span className="text-xs text-muted-foreground">(Book a Project, Pricing)</span>
            </summary>
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Book a Project OG Image */}
              <div className="rounded-xl border border-border bg-card/50 p-4 opacity-75">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">Book a Project</h4>
                  <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">landing-variants/book-a-project/</code>
                </div>
                <div className="relative aspect-[1200/630] rounded-lg overflow-hidden border border-border bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/landing-variants/book-a-project/opengraph-image"
                    alt="Book a Project OpenGraph preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="px-2 py-0.5 rounded bg-muted">1200x630</span>
                  <span className="px-2 py-0.5 rounded bg-muted">PNG</span>
                  <a
                    href="/landing-variants/book-a-project/opengraph-image"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-emerald-500 hover:underline"
                  >
                    Open full size
                  </a>
                </div>
              </div>

              {/* Pricing OG Image */}
              <div className="rounded-xl border border-border bg-card/50 p-4 opacity-75">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">Pricing Page</h4>
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
                  <span className="px-2 py-0.5 rounded bg-muted">1200x630</span>
                  <span className="px-2 py-0.5 rounded bg-muted">PNG</span>
                  <a
                    href="/pricing/opengraph-image"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-emerald-500 hover:underline"
                  >
                    Open full size
                  </a>
                </div>
              </div>
            </div>
          </details>

          {/* Social Platform Validators */}
          <div className="mt-6 p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
            <h4 className="text-sm font-medium text-foreground mb-3">Test Your OG Images</h4>
            <p className="text-xs text-muted-foreground mb-4">
              Each platform caches images differently. Use these validators to debug and refresh cached previews.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <a
                href="https://developers.facebook.com/tools/debug/?q=https%3A%2F%2Fwww.jamiegray.net"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card/50 hover:border-emerald-500/50 transition-colors"
              >
                <div className="w-8 h-8 rounded bg-[#1877F2] flex items-center justify-center text-white text-xs font-bold">f</div>
                <div>
                  <p className="text-sm font-medium text-foreground">Facebook</p>
                  <p className="text-xs text-muted-foreground">Sharing Debugger</p>
                </div>
              </a>
              <a
                href="https://cards-dev.twitter.com/validator"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card/50 hover:border-emerald-500/50 transition-colors"
              >
                <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-white text-xs font-bold">𝕏</div>
                <div>
                  <p className="text-sm font-medium text-foreground">Twitter/X</p>
                  <p className="text-xs text-muted-foreground">Card Validator</p>
                </div>
              </a>
              <a
                href="https://www.linkedin.com/post-inspector/inspect/https%3A%2F%2Fwww.jamiegray.net"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card/50 hover:border-emerald-500/50 transition-colors"
              >
                <div className="w-8 h-8 rounded bg-[#0A66C2] flex items-center justify-center text-white text-xs font-bold">in</div>
                <div>
                  <p className="text-sm font-medium text-foreground">LinkedIn</p>
                  <p className="text-xs text-muted-foreground">Post Inspector</p>
                </div>
              </a>
              <a
                href="https://www.opengraph.xyz/url/https%3A%2F%2Fwww.jamiegray.net"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card/50 hover:border-emerald-500/50 transition-colors"
              >
                <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">OG</div>
                <div>
                  <p className="text-sm font-medium text-foreground">OpenGraph.xyz</p>
                  <p className="text-xs text-muted-foreground">Universal Preview</p>
                </div>
              </a>
              <a
                href="https://metatags.io/?url=https%3A%2F%2Fwww.jamiegray.net"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card/50 hover:border-emerald-500/50 transition-colors"
              >
                <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">&lt;/&gt;</div>
                <div>
                  <p className="text-sm font-medium text-foreground">Metatags.io</p>
                  <p className="text-xs text-muted-foreground">Multi-platform Preview</p>
                </div>
              </a>
              <a
                href="https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.jamiegray.net"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card/50 hover:border-emerald-500/50 transition-colors"
              >
                <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
                  <span className="text-lg">🔍</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Google</p>
                  <p className="text-xs text-muted-foreground">Rich Results Test</p>
                </div>
              </a>
            </div>
          </div>

          {/* OG Image Guidelines */}
          <div className="mt-6 p-4 rounded-lg border border-border bg-muted/30">
            <h4 className="text-sm font-medium text-foreground mb-2">Guidelines</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li><strong>Size:</strong> 1200x630px (1.91:1 aspect ratio) - optimal for all platforms</li>
              <li><strong>Safe zone:</strong> Keep text/logos away from edges (Facebook crops differently than Twitter)</li>
              <li><strong>Brand:</strong> Dark background with emerald accent, include JG logo</li>
              <li><strong>Cache:</strong> Social platforms cache aggressively - use validators above to force refresh</li>
              <li><strong>Facebook tip:</strong> Click &quot;Scrape Again&quot; in the debugger to refresh cached images</li>
            </ul>
          </div>
        </section>

        <section id="section-header" className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Section Header</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Reusable section header component for landing pages. Supports two icon styles:
            <code className="mx-1">cube</code> (rotating 3D outline) and <code className="mx-1">app</code> (solid background).
            Five color variants available: emerald, red, yellow, blue, and muted.
          </p>

          <div className="space-y-8">
            {/* Icon Styles Comparison */}
            <div className="rounded-xl border border-border bg-card/50 p-6">
              <h3 className="font-semibold text-foreground mb-4">Icon Styles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-4">Cube Style (default)</p>
                  <SectionHeader
                    icon={Zap}
                    iconStyle="cube"
                    iconVariant="emerald"
                    title="Rotating Cube"
                    subtitle="3D rotating outline cube with icon centered inside"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-4">App Style</p>
                  <SectionHeader
                    icon={Zap}
                    iconStyle="app"
                    iconVariant="emerald"
                    title="App Icon"
                    subtitle="Solid background with ring border"
                  />
                </div>
              </div>
            </div>

            {/* Color Variants - Cube */}
            <div className="rounded-xl border border-border bg-card/50 p-6">
              <h3 className="font-semibold text-foreground mb-4">Color Variants (Cube Style)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {(["emerald", "red", "yellow", "blue", "muted"] as IconVariant[]).map((variant) => (
                  <div key={variant} className="flex flex-col items-center gap-2">
                    <RotatingCubeIcon icon={Zap} variant={variant} size="md" />
                    <span className="text-xs text-muted-foreground capitalize">{variant}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Size Variants */}
            <div className="rounded-xl border border-border bg-card/50 p-6">
              <h3 className="font-semibold text-foreground mb-4">Rotating Cube Icon Sizes</h3>
              <div className="flex items-end justify-center gap-8">
                {(["sm", "md", "lg"] as const).map((size) => (
                  <div key={size} className="flex flex-col items-center gap-2">
                    <RotatingCubeIcon icon={Zap} variant="emerald" size={size} />
                    <span className="text-xs text-muted-foreground">{size}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Usage Example */}
            <ComponentCard title="SectionHeader" importPath="@/components/ui/section-header" className="col-span-full">
              <div className="w-full">
                <SectionHeader
                  icon={Heart}
                  iconStyle="cube"
                  iconVariant="red"
                  title="Example Section"
                  subtitle="This is a subtitle that describes the section content"
                />
              </div>
            </ComponentCard>
          </div>
        </section>

        <section id="shadows" className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Shadows</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Centralized shadow system for consistent elevation and glow effects. Defined in <code>globals.css</code> as CSS custom properties
            and exported from <code>lib/shadows.ts</code> for programmatic use.
          </p>

          {/* Elevation Shadows */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Elevation</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Used for floating/elevated UI elements like cards, headers, popovers. Darker in dark mode.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl border border-border bg-card/50">
                <ShadowSwatch
                  name="Small"
                  variable="--shadow-elevation-sm"
                  className="shadow-[var(--shadow-elevation-sm)]"
                  usage="Cards, containers"
                  code="shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
                />
                <ShadowSwatch
                  name="Medium"
                  variable="--shadow-elevation-md"
                  className="shadow-[var(--shadow-elevation-md)]"
                  usage="Headers, toggles, project cards"
                  code="shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                />
                <ShadowSwatch
                  name="Large"
                  variable="--shadow-elevation-lg"
                  className="shadow-[var(--shadow-elevation-lg)]"
                  usage="Modals, dialogs, hover states"
                  code="shadow-[0_12px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                />
              </div>
            </div>

            {/* Glow Shadows */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Glow Effects</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Used for CTAs and accent elements. Creates a colored glow effect around the element.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl border border-border bg-card/50">
                <ShadowSwatch
                  name="Emerald Glow"
                  variable="--shadow-glow-emerald"
                  className="shadow-[var(--shadow-glow-emerald)] bg-emerald-600"
                  isGlow
                  usage="Primary CTAs (Contact, Live Site)"
                  code="shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                />
                <ShadowSwatch
                  name="Emerald Glow (Hover)"
                  variable="--shadow-glow-emerald-hover"
                  className="shadow-[var(--shadow-glow-emerald-hover)] bg-emerald-600"
                  isGlow
                  usage="Hover state for primary CTAs"
                  code="shadow-[0_0_40px_rgba(16,185,129,0.4)]"
                />
              </div>
            </div>

            {/* Usage Examples */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Usage Examples</h3>
              <div className="p-6 rounded-xl border border-border bg-card/50 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs font-medium text-foreground mb-2">Glass Container (Header/Toggle)</p>
                    <code className="text-[10px] text-muted-foreground break-all">
                      shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                    </code>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs font-medium text-foreground mb-2">Project Card (Default)</p>
                    <code className="text-[10px] text-muted-foreground break-all">
                      shadow-[var(--shadow-elevation-md)]
                    </code>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs font-medium text-foreground mb-2">Project Card (Hover)</p>
                    <code className="text-[10px] text-muted-foreground break-all">
                      shadow-[var(--shadow-elevation-lg)]
                    </code>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs font-medium text-foreground mb-2">Primary CTA Button</p>
                    <code className="text-[10px] text-muted-foreground break-all">
                      shadow-[var(--shadow-glow-emerald)] hover:shadow-[var(--shadow-glow-emerald-hover)]
                    </code>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    <strong>Import:</strong> <code className="bg-muted px-1 rounded">import {"{"} shadowClasses {"}"} from &quot;@/lib/shadows&quot;</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

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
              <span><strong>Glow:</strong> CursorGlow (custom)</span>
            </div>
          </div>
        </section>

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

        <section id="hero-section" className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Hero Section</h2>
          <p className="text-muted-foreground mb-6">
            Animated text components for the hero headline. Cycles through rotating words with smooth transitions.
            Inspired by{" "}
            <a href="https://ui.aceternity.com/components/container-text-flip" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">
              Aceternity UI
            </a>.
          </p>

          {/* Word List */}
          <div className="rounded-xl border border-border bg-card/50 p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Rotating Words</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Words cycle in this order (defined in <code>home-client.tsx</code>):
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li><span className="font-semibold text-emerald-500">new</span> — Fresh start, new beginnings</li>
              <li><span className="font-semibold text-emerald-500">fast</span> — Speed & performance</li>
              <li><span className="font-semibold text-emerald-500">beautiful</span> — Visual design & aesthetics</li>
              <li><span className="font-semibold text-emerald-500">modern</span> — Current tech & trends</li>
              <li><span className="font-semibold text-emerald-500">custom</span> — Tailored solutions</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-4">
              Interval: 2500ms between transitions
            </p>
          </div>

          <div className="space-y-8">
            {/* Current Implementation - ContainerTextFlip */}
            <ComponentCard title="ContainerTextFlip (Current)" importPath="@/components/ui/container-text-flip">
              <div className="text-center py-8">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  Need a{" "}
                  <ContainerTextFlip
                    words={["new", "fast", "beautiful", "modern", "custom"]}
                    interval={2500}
                    textClassName="font-bold"
                  />
                  {" "}website?
                </h1>
              </div>
            </ComponentCard>

            {/* Old Implementation - FlipWords */}
            <ComponentCard title="FlipWords (Previous)" importPath="@/components/ui/flip-words">
              <div className="text-center py-8">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  Need a{" "}
                  <FlipWords
                    words={["new", "fast", "beautiful", "modern", "custom"]}
                    duration={2500}
                    className="text-emerald-500 dark:text-emerald-400"
                  />
                  {" "}website?
                </h1>
              </div>
            </ComponentCard>

            {/* Props Documentation - ContainerTextFlip */}
            <div className="rounded-xl border border-border bg-card/50 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">ContainerTextFlip Props</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 font-medium text-foreground">Prop</th>
                      <th className="text-left py-2 pr-4 font-medium text-foreground">Type</th>
                      <th className="text-left py-2 pr-4 font-medium text-foreground">Default</th>
                      <th className="text-left py-2 font-medium text-foreground">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="py-2 pr-4"><code>words</code></td>
                      <td className="py-2 pr-4"><code>string[]</code></td>
                      <td className="py-2 pr-4">[&quot;better&quot;, ...]</td>
                      <td className="py-2">Array of words to cycle through</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 pr-4"><code>interval</code></td>
                      <td className="py-2 pr-4"><code>number</code></td>
                      <td className="py-2 pr-4">3000</td>
                      <td className="py-2">Time in ms between transitions</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 pr-4"><code>className</code></td>
                      <td className="py-2 pr-4"><code>string</code></td>
                      <td className="py-2 pr-4">-</td>
                      <td className="py-2">CSS classes for the container</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 pr-4"><code>textClassName</code></td>
                      <td className="py-2 pr-4"><code>string</code></td>
                      <td className="py-2 pr-4">-</td>
                      <td className="py-2">CSS classes for the text</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4"><code>animationDuration</code></td>
                      <td className="py-2 pr-4"><code>number</code></td>
                      <td className="py-2 pr-4">700</td>
                      <td className="py-2">Animation duration in ms</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Code Example */}
            <div className="rounded-xl border border-border bg-card/50 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Code Example</h3>
              <pre className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4 overflow-x-auto">
{`<h1 className="text-4xl font-bold">
  Need a{" "}
  <ContainerTextFlip
    words={["new", "fast", "beautiful", "modern", "custom"]}
    interval={2500}
    textClassName="font-bold"
  />
  {" "}website?
</h1>`}
              </pre>
            </div>
          </div>
        </section>

        <section id="image-upload" className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Image Upload</h2>
          <p className="text-muted-foreground mb-6">
            A polished image upload component with drag-and-drop, file picker, and URL input modes.
            Features preview with remove button, loading states, and error handling.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ComponentCard title="ImageUpload (Empty)" importPath="@/components/ui/image-upload" className="col-span-1">
              <div className="w-full max-w-sm">
                <ImageUpload
                  value={null}
                  onChange={(url) => console.log("Image changed:", url)}
                  label="Upload Image"
                  helperText="Supports PNG, JPG, GIF up to 5MB"
                  allowUrl={true}
                />
              </div>
            </ComponentCard>

            <ComponentCard title="ImageUpload (With Image)" importPath="@/components/ui/image-upload" className="col-span-1">
              <div className="w-full max-w-sm">
                <ImageUpload
                  value="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"
                  onChange={(url) => console.log("Image changed:", url)}
                  label="Design System Screenshot"
                  helperText="Hover to reveal remove button"
                />
              </div>
            </ComponentCard>
          </div>

          {/* Props Documentation */}
          <div className="rounded-xl border border-border bg-card/50 p-6 mt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">ImageUpload Props</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-medium text-foreground">Prop</th>
                    <th className="text-left py-2 pr-4 font-medium text-foreground">Type</th>
                    <th className="text-left py-2 pr-4 font-medium text-foreground">Default</th>
                    <th className="text-left py-2 font-medium text-foreground">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4"><code>value</code></td>
                    <td className="py-2 pr-4"><code>string | null</code></td>
                    <td className="py-2 pr-4">-</td>
                    <td className="py-2">Current image URL</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4"><code>onChange</code></td>
                    <td className="py-2 pr-4"><code>(url: string | null) =&gt; void</code></td>
                    <td className="py-2 pr-4">-</td>
                    <td className="py-2">Called when image changes</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4"><code>uploadEndpoint</code></td>
                    <td className="py-2 pr-4"><code>string</code></td>
                    <td className="py-2 pr-4">/api/upload</td>
                    <td className="py-2">API endpoint for file uploads</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4"><code>storagePath</code></td>
                    <td className="py-2 pr-4"><code>string</code></td>
                    <td className="py-2 pr-4">images</td>
                    <td className="py-2">Folder path in storage bucket</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4"><code>aspectRatio</code></td>
                    <td className="py-2 pr-4"><code>string</code></td>
                    <td className="py-2 pr-4">16/10</td>
                    <td className="py-2">Preview aspect ratio</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4"><code>maxSize</code></td>
                    <td className="py-2 pr-4"><code>number</code></td>
                    <td className="py-2 pr-4">5MB</td>
                    <td className="py-2">Max file size in bytes</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4"><code>allowUrl</code></td>
                    <td className="py-2 pr-4"><code>boolean</code></td>
                    <td className="py-2 pr-4">true</td>
                    <td className="py-2">Show URL input tab</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4"><code>label</code></td>
                    <td className="py-2 pr-4"><code>string</code></td>
                    <td className="py-2 pr-4">-</td>
                    <td className="py-2">Label text above upload area</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="typography-components" className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Typography Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ComponentCard title="AnimatedGradientText" importPath="@/components/ui/animated-gradient-text">
              <AnimatedGradientText>Gradient Text</AnimatedGradientText>
            </ComponentCard>
          </div>
        </section>

        <section id="usage-notes" className="mb-16 rounded-xl border border-border bg-card/50 p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Usage Notes</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>All UI components are in <code>components/ui/</code></li>
            <li>Custom page components are in <code>components/</code></li>
            <li>Colors use OKLCH format in <code>globals.css</code></li>
            <li>Use semantic tokens: <code>bg-background</code>, <code>text-foreground</code>, <code>border-border</code></li>
            <li>Accent color is green: <code>hsl(145, 80%, 45%)</code> or <code>text-emerald-500</code></li>
            <li>Glow effects via <code>CursorGlow</code> component</li>
            <li>Number animations via <code>@number-flow/react</code></li>
            <li><strong>Icon transparency:</strong> Use <code>opacity-50</code> not <code>text-foreground/50</code> to avoid stroke overlap</li>
          </ul>
        </section>

        </div>

        <Footer />
      </main>
    </div>
    </SparkleProvider>
  );
}
