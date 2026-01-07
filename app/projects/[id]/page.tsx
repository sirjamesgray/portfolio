import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Globe } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { CursorGrid } from "@/components/cursor-grid"
import { formatProjectType } from "@/lib/constants"

interface PageProps {
  params: Promise<{ id: string }>
}

type ContentBlock = {
  id: string
  type: "header" | "text" | "image"
  content: string
  image_alt: string | null
  display_order: number
}

export default async function PublicProjectPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch the project (only if shown on landing page and customer hasn't opted out)
  const { data: project, error } = await supabase
    .from("projects")
    .select(`
      id,
      title,
      public_title,
      public_description,
      public_hero_image,
      public_industry,
      project_type,
      vercel_url,
      github_url,
      show_on_landing_page,
      customer_opted_out_of_landing_page
    `)
    .eq("id", id)
    .eq("show_on_landing_page", true)
    .single()

  // Also check that customer hasn't opted out
  if (project?.customer_opted_out_of_landing_page) {
    notFound()
  }

  if (error || !project) {
    notFound()
  }

  // Fetch content blocks
  const { data: contentBlocks } = await supabase
    .from("project_content_blocks")
    .select("*")
    .eq("project_id", id)
    .order("display_order", { ascending: true })

  const displayTitle = project.public_title || project.title || "Project"
  const displayDescription = project.public_description || ""
  const displayIndustry = project.public_industry || formatProjectType(project.project_type)

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-blue-950/20 dark:to-blue-950/30">
      <CursorGrid />
      <SiteHeader />

      <main className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          {/* Back Link */}
          <BlurFade delay={0.1}>
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Link>
          </BlurFade>

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

          {/* Action Buttons */}
          {(project.vercel_url || project.github_url) && (
            <BlurFade delay={0.2}>
              <div className="flex flex-wrap gap-3 mb-12">
                {project.vercel_url && (
                  <Link href={project.vercel_url} target="_blank">
                    <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                      <Globe className="h-4 w-4" />
                      Visit Live Site
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                )}
              </div>
            </BlurFade>
          )}

          {/* Hero Image */}
          {project.public_hero_image && (
            <BlurFade delay={0.25}>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 bg-card/40 border border-white/10">
                <Image
                  src={project.public_hero_image}
                  alt={displayTitle}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </BlurFade>
          )}

          {/* Content Blocks */}
          {contentBlocks && contentBlocks.length > 0 && (
            <div className="space-y-8">
              {(contentBlocks as ContentBlock[]).map((block, idx) => (
                <BlurFade key={block.id} delay={0.3 + idx * 0.05}>
                  {block.type === "header" && (
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                      {block.content}
                    </h2>
                  )}
                  {block.type === "text" && (
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {block.content}
                    </p>
                  )}
                  {block.type === "image" && (
                    <div className="relative w-full rounded-xl overflow-hidden bg-card/40 border border-white/10">
                      <Image
                        src={block.content}
                        alt={block.image_alt || "Project image"}
                        width={800}
                        height={450}
                        className="w-full h-auto"
                      />
                      {block.image_alt && (
                        <p className="text-xs text-muted-foreground mt-2 text-center italic">
                          {block.image_alt}
                        </p>
                      )}
                    </div>
                  )}
                </BlurFade>
              ))}
            </div>
          )}

          {/* Empty State */}
          {(!contentBlocks || contentBlocks.length === 0) && !project.public_hero_image && (
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
            <div className="mt-16 text-center">
              <p className="text-muted-foreground mb-4">
                Interested in a similar project?
              </p>
              <Link href="/start-project">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Start Your Project
                </Button>
              </Link>
            </div>
          </BlurFade>
        </div>
      </main>
    </div>
  )
}
