"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BlurFade } from "@/components/ui/blur-fade"
import { Plus } from "lucide-react"
import { ProjectCard, ProjectCardData } from "@/components/dashboard/project-card"

interface DashboardOverviewClientProps {
  userName: string
  projects: ProjectCardData[]
}

function NewProjectCard() {
  return (
    <BlurFade delay={0.3}>
      <Link href="/start-project">
        <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-muted-foreground/40 hover:bg-muted/30 transition-colors cursor-pointer h-full min-h-[180px]">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <Plus className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">Start a new project</p>
        </div>
      </Link>
    </BlurFade>
  )
}

export function DashboardOverviewClient({ userName, projects }: DashboardOverviewClientProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <BlurFade delay={0.05}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            Welcome back{userName ? `, ${userName}` : ""}!
          </h1>
          {projects.length > 0 && (
            <Link href="/start-project">
              <Button className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </Link>
          )}
        </div>
      </BlurFade>

      {/* Projects Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <BlurFade delay={0.1}>
            <Card className="bg-card sm:col-span-2 lg:col-span-3">
              <div className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No projects yet</p>
                <Link href="/start-project">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Start Your First Project
                  </Button>
                </Link>
              </div>
            </Card>
          </BlurFade>
        ) : (
          <>
            {projects.map((project, index) => (
              <BlurFade key={project.id} delay={0.1 + index * 0.05}>
                <ProjectCard project={project} />
              </BlurFade>
            ))}
            {/* New Project Card at the end */}
            <NewProjectCard />
          </>
        )}
      </div>
    </div>
  )
}
