"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BlurFade } from "@/components/ui/blur-fade"
import { Plus, Calendar, DollarSign, Clock, ChevronRight, MessageCircle } from "lucide-react"
import Link from "next/link"

type Project = {
  id: string
  project_type: string | null
  budget: string | null
  timeline: string | null
  status: string
  created_at: string
  description: string | null
}

interface MyProjectsClientProps {
  projects: Project[]
}

function getStatusColor(status: string) {
  switch (status) {
    case "lead":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "contacted":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    case "in_progress":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    case "completed":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "canceled":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20"
  }
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function formatProjectType(type: string | null) {
  if (!type) return "Project"
  const labels: Record<string, string> = {
    website: "Website",
    webapp: "Web App",
    ecommerce: "E-commerce",
    other: "Other",
  }
  return labels[type] || type
}

function formatBudget(budget: string | null) {
  if (!budget) return "Not specified"
  const labels: Record<string, string> = {
    "under-5k": "Under $5,000",
    "5k-10k": "$5,000 - $10,000",
    "10k-25k": "$10,000 - $25,000",
    "25k-plus": "$25,000+",
    "not-sure": "Not sure",
  }
  return labels[budget] || budget
}

function formatTimeline(timeline: string | null) {
  if (!timeline) return "Not specified"
  const labels: Record<string, string> = {
    asap: "ASAP",
    "1-month": "1 Month",
    "2-3-months": "2-3 Months",
    flexible: "Flexible",
  }
  return labels[timeline] || timeline
}

export function MyProjectsClient({ projects }: MyProjectsClientProps) {
  const router = useRouter()

  return (
    <div className="space-y-6">
      {/* Header */}
      <BlurFade delay={0.1}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
            <p className="text-muted-foreground">
              View and track all your project requests
            </p>
          </div>
          <Link href="/start-project">
            <Button className="gap-1 bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>
      </BlurFade>

      {/* Projects List */}
      <BlurFade delay={0.2}>
        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                You haven&apos;t submitted any project requests yet.
              </p>
              <Link href="/start-project">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Start Your First Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {projects.map((project, index) => (
              <BlurFade key={project.id} delay={0.1 + index * 0.05}>
                <Card
                  className="cursor-pointer hover:bg-accent/50 transition-colors group"
                  onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {formatProjectType(project.project_type)}
                          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Submitted {new Date(project.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(project.status)}>
                          {formatStatus(project.status)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatBudget(project.budget)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formatTimeline(project.timeline)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MessageCircle className="h-4 w-4" />
                        <span>Chat with Jamie</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
            ))}
          </div>
        )}
      </BlurFade>
    </div>
  )
}
