"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BlurFade } from "@/components/ui/blur-fade"
import { FolderKanban, Clock, MessageCircle, Plus } from "lucide-react"
import Link from "next/link"

type Project = {
  id: string
  project_type: string | null
  status: string
  created_at: string
  description: string | null
}

interface DashboardOverviewClientProps {
  userName: string
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

export function DashboardOverviewClient({ userName, projects }: DashboardOverviewClientProps) {
  const activeProjects = projects.filter((p) => p.status === "in_progress").length
  const totalProjects = projects.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <BlurFade delay={0.1}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back{userName ? `, ${userName}` : ""}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your projects and activity.
          </p>
        </div>
      </BlurFade>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <BlurFade delay={0.15}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
            </CardContent>
          </Card>
        </BlurFade>

        <BlurFade delay={0.2}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Clock className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects}</div>
            </CardContent>
          </Card>
        </BlurFade>

        <BlurFade delay={0.25}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Chat coming soon</p>
            </CardContent>
          </Card>
        </BlurFade>
      </div>

      {/* Recent Projects */}
      <BlurFade delay={0.3}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Projects</CardTitle>
            <Link href="/start-project">
              <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You don&apos;t have any projects yet.</p>
                <Link href="/start-project">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Start Your First Project
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {formatProjectType(project.project_type)}
                      </p>
                      {project.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(project.status)}>
                        {formatStatus(project.status)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </BlurFade>

      {/* Quick Actions */}
      <BlurFade delay={0.35}>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
            <Link href="/dashboard/chat">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-blue-500/10 p-3">
                  <MessageCircle className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Chat with Jamie</h3>
                  <p className="text-sm text-muted-foreground">
                    Ask questions or discuss your project
                  </p>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
            <Link href="/dashboard/projects">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-emerald-500/10 p-3">
                  <FolderKanban className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold">View All Projects</h3>
                  <p className="text-sm text-muted-foreground">
                    See detailed status of your projects
                  </p>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
      </BlurFade>
    </div>
  )
}
