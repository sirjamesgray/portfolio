"use client"

import Link from "next/link"
import { ChevronLeft, ArrowLeft } from "lucide-react"
import { DashboardButton } from "@/components/ui/button"
import { BlurFade } from "@/components/ui/blur-fade"

interface PageHeaderProps {
  title: string
  description?: string
  backHref?: string
  backLabel?: string
  children?: React.ReactNode
  delay?: number
}

/**
 * Centralized page header component for dashboard pages.
 * Handles both mobile and desktop back navigation consistently.
 *
 * Usage:
 * ```tsx
 * <PageHeader
 *   title="All Projects"
 *   description="Manage and track all customer projects"
 *   backHref="/dashboard"
 *   backLabel="Back"
 * >
 *   <Button>Action</Button>
 * </PageHeader>
 * ```
 */
export function PageHeader({
  title,
  description,
  backHref = "/dashboard",
  backLabel = "Back",
  children,
  delay = 0.1,
}: PageHeaderProps) {
  return (
    <>
      {/* Mobile Back Button - shown above header */}
      <div className="md:hidden mb-4">
        <Link href={backHref}>
          <DashboardButton
            variant="ghost"
            size="sm"
            className="h-8 px-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            {backLabel}
          </DashboardButton>
        </Link>
      </div>

      {/* Header with optional desktop back button */}
      <BlurFade delay={delay}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Desktop Back Button - inline with title */}
            <Link href={backHref} className="hidden md:block">
              <DashboardButton variant="ghost" size="icon" className="shrink-0 mt-1">
                <ArrowLeft className="h-4 w-4" />
              </DashboardButton>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          {children && (
            <div className="flex items-center gap-2 shrink-0">
              {children}
            </div>
          )}
        </div>
      </BlurFade>
    </>
  )
}

/**
 * Simpler header variant without back button.
 * Used for top-level pages like /dashboard overview.
 */
export function PageHeaderSimple({
  title,
  description,
  children,
  delay = 0.1,
}: Omit<PageHeaderProps, 'backHref' | 'backLabel'>) {
  return (
    <BlurFade delay={delay}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-2 shrink-0">
            {children}
          </div>
        )}
      </div>
    </BlurFade>
  )
}
