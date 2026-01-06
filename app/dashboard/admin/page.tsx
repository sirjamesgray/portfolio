import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BlurFade } from "@/components/ui/blur-fade"
import { FolderKanban, CheckCircle2, Clock, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"

async function getStats() {
  const supabase = await createClient()

  // Fetch projects with counts by status
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, status")

  if (error) {
    console.error("Error fetching projects:", error)
    return {
      total: 0,
      active: 0,
      completed: 0,
    }
  }

  const total = projects?.length || 0
  const active = projects?.filter((p) => p.status === "in_progress").length || 0
  const completed = projects?.filter((p) => p.status === "completed").length || 0

  return { total, active, completed }
}

async function getRecentActivity() {
  const supabase = await createClient()

  // Fetch recent projects
  const { data: projects, error } = await supabase
    .from("projects")
    .select(`
      id,
      status,
      created_at,
      contacts (
        name,
        email
      )
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error fetching recent activity:", error)
    return []
  }

  return projects || []
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

export default async function AdminDashboard() {
  const stats = await getStats()
  const recentActivity = await getRecentActivity()

  const statCards = [
    {
      title: "Total Projects",
      value: stats.total,
      icon: FolderKanban,
      color: "text-blue-500",
    },
    {
      title: "Active Projects",
      value: stats.active,
      icon: Clock,
      color: "text-emerald-500",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      title: "Revenue",
      value: "$0",
      icon: DollarSign,
      color: "text-yellow-500",
      subtitle: "Coming soon",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of all portfolio projects and activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <BlurFade key={stat.title} delay={0.1 * index}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {stat.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.subtitle}
                    </p>
                  )}
                </CardContent>
              </Card>
            </BlurFade>
          )
        })}
      </div>

      {/* Recent Activity */}
      <BlurFade delay={0.4}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No recent activity
                </p>
              ) : (
                recentActivity.map((project: any) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {project.contacts?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {project.contacts?.email || "No email"}
                      </p>
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
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </BlurFade>
    </div>
  )
}
