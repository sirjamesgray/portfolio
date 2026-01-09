"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import { LandingButton } from "@/components/ui/landing-button";
import { BlurFade } from "@/components/ui/blur-fade";
import { CursorGrid } from "@/components/cursor-grid";
import { Logo3DStatic } from "@/components/logo-3d";

// Dynamically import 3D logo to avoid SSR issues
const Logo3D = dynamic(
  () => import("@/components/logo-3d").then((mod) => mod.Logo3D),
  { ssr: false }
);

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-blue-950/20 dark:to-blue-950/30 flex flex-col overflow-hidden">
      <CursorGrid />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 md:p-6">
        <Link href="/" className="flex items-center h-8 w-8">
          <Logo3DStatic size="sm" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        {/* Large 3D Logo Background */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20 dark:opacity-15">
          <Logo3D size="hero" />
        </div>

        <div className="relative z-10 text-center max-w-lg">
          <BlurFade delay={0.1}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                Page not found
              </span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.2}>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Looks like this page went on vacation. Let&apos;s get you back to familiar territory.
            </p>
          </BlurFade>

          <BlurFade delay={0.3}>
            <Link href="/">
              <LandingButton variant="primary" size="lg" className="gap-2">
                <ArrowLeft className="h-5 w-5" />
                Go back to home
              </LandingButton>
            </Link>
          </BlurFade>
        </div>
      </main>
    </div>
  );
}
