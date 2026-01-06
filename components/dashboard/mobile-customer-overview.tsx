"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProjectCard, ProjectCardData } from "./project-card"

interface MobileCustomerOverviewProps {
  userName: string
  projects: ProjectCardData[]
}

function NewProjectCard() {
  return (
    <Link href="/start-project">
      <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-muted-foreground/40 hover:bg-muted/30 transition-colors cursor-pointer">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
          <Plus className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">Start a new project</p>
      </div>
    </Link>
  )
}

export function MobileCustomerOverview({ userName, projects }: MobileCustomerOverviewProps) {
  return (
    <div className="space-y-4">
      {/* Welcome Message with New Button (only show button if there are projects) */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Welcome back{userName ? `, ${userName}` : ""}!
        </h2>
        {projects.length > 0 && (
          <Link href="/start-project">
            <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4" />
              New
            </Button>
          </Link>
        )}
      </div>

      {/* Projects Stack */}
      <div className="space-y-3">
        {projects.length === 0 ? (
          <Card className="bg-card">
            <div className="p-6 text-center">
              <p className="text-muted-foreground mb-4">No projects yet</p>
              <Link href="/start-project">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Start Your First Project
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {/* New Project Card at the bottom */}
            <NewProjectCard />
          </>
        )}
      </div>
    </div>
  )
}
