import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardButton } from "@/components/ui/button"
import { MessageCircle, FolderKanban } from "lucide-react"
import Link from "next/link"
import { MobileBackButton } from "@/components/dashboard/mobile-back-button"

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Check for mirror mode
  const cookieStore = await cookies()
  const mirrorUserId = cookieStore.get("mirror_user_id")?.value
  const effectiveUserId = (mirrorUserId && isAdmin(user.email)) ? mirrorUserId : user.id

  // Fetch projects for the user
  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, project_type, status")
    .eq("user_id", effectiveUserId)
    .order("created_at", { ascending: false })

  const formatProjectType = (type: string | null) => {
    if (!type) return "Project"
    const labels: Record<string, string> = {
      website: "Website",
      webapp: "Web App",
      ecommerce: "E-commerce",
      other: "Other",
    }
    return labels[type] || type
  }

  return (
    <div className="space-y-6">
      <MobileBackButton />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chat</h1>
          <p className="text-muted-foreground">
            Message Jamie directly within your projects
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Project Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!projects || projects.length === 0 ? (
              <div className="flex flex-col items-center text-center py-8">
                <div className="rounded-full bg-blue-500/10 p-4 mb-4">
                  <FolderKanban className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2">No Projects Yet</h3>
                <p className="text-sm text-muted-foreground max-w-md mb-4">
                  Start a project to chat directly with Jamie about your requirements, progress, and deliverables.
                </p>
                <Link href="/start-project">
                  <DashboardButton className="bg-emerald-600 hover:bg-emerald-700">
                    Start a Project
                  </DashboardButton>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Select a project to view the conversation:
                </p>
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/dashboard/projects/${project.id}`}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {project.title || `${formatProjectType(project.project_type)} Project`}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {project.status.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                    <DashboardButton variant="ghost" size="sm">
                      Open Chat
                    </DashboardButton>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  )
}
