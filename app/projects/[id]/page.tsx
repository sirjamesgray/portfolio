import { notFound } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { LandingButton } from "@/components/ui/landing-button"
import { SiteHeader } from "@/components/site-header"
import { CursorGrid } from "@/components/cursor-grid"
import { formatProjectType, CTA_CONFIG } from "@/lib/constants"
import { CMSContentRenderer } from "@/components/cms-content-renderer"
import { isCustomerDashboardEnabled } from "@/lib/feature-flags"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PublicProjectPage({ params }: PageProps) {
  const { id } = await params
  const dashboardEnabled = await isCustomerDashboardEnabled()
  const cta = dashboardEnabled ? CTA_CONFIG.dashboardEnabled : CTA_CONFIG.dashboardDisabled

  // Use admin client to bypass RLS - this is a public page for featured projects
  const supabase = createAdminClient()

  // Fetch the project (only if shown on landing page)
  const { data: project, error } = await supabase
    .from("projects")
    .select(`
      id,
      title,
      public_title,
      public_description,
      public_industry,
      public_content_html,
      project_type,
      show_on_landing_page
    `)
    .eq("id", id)
    .eq("show_on_landing_page", true)
    .single()

  // Project not found or not enabled for landing page
  if (error || !project) {
    notFound()
  }

  const displayTitle = project.public_title || project.title || "Project"
  const displayDescription = project.public_description || ""
  const displayIndustry = project.public_industry || formatProjectType(project.project_type)

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-blue-950/20 dark:to-blue-950/30">
      <CursorGrid />
      <SiteHeader variant="back" backHref="/#projects" backLabel="Back to Landing Page" customerDashboardEnabled={dashboardEnabled} />

      <main className="relative z-10 px-6 pt-24 pb-12">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <BlurFade delay={0.15}>
            <div className="mb-8">
              <p className="text-sm font-medium text-primary mb-2">{displayIndustry}</p>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
                {displayTitle}
              </h1>
              {displayDescription && (
                <p className="text-lg text-muted-foreground max-w-2xl">
                  {displayDescription}
                </p>
              )}
            </div>
          </BlurFade>

          {/* Rich HTML Content */}
          {project.public_content_html && (
            <BlurFade delay={0.3}>
              <CMSContentRenderer
                html={project.public_content_html}
                className="prose prose-sm dark:prose-invert max-w-none
                  [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-8 first:[&_h1]:mt-0
                  [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-6 first:[&_h2]:mt-0
                  [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-muted-foreground
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:text-muted-foreground
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:text-muted-foreground
                  [&_li]:mb-1
                  [&_img]:rounded-xl [&_img]:my-6 [&_img]:border [&_img]:border-white/10"
              />
            </BlurFade>
          )}

          {/* Empty State */}
          {!project.public_content_html && (
            <BlurFade delay={0.3}>
              <div className="text-center py-16 rounded-2xl border border-white/10 bg-card/40">
                <p className="text-muted-foreground">
                  More details about this project coming soon.
                </p>
              </div>
            </BlurFade>
          )}

          {/* CTA */}
          <BlurFade delay={0.5}>
            <div className="mt-16 rounded-2xl border border-white/10 bg-card/40 backdrop-blur-sm p-8 md:p-12 text-center">
              <h3 className="text-2xl font-bold tracking-tight text-foreground mb-3">
                Interested in a similar project?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Tell me about your vision and I'll bring it to life.
              </p>
              <Link href={cta.href}>
                <LandingButton variant="primary" size="lg" className="gap-2">
                  {cta.text}
                  <ArrowRight className="h-4 w-4" />
                </LandingButton>
              </Link>
            </div>
          </BlurFade>
        </div>
      </main>
    </div>
  )
}
