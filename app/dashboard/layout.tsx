import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/constants"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FolderKanban,
  CreditCard,
  MessageCircle,
  Users,
  FlaskConical,
  Palette,
  Shield,
  Mail,
  GitBranch,
} from "lucide-react"
import { DashboardMobileNav } from "@/components/dashboard/mobile-nav"
import { MirrorBanner } from "@/components/dashboard/mirror-banner"
import { LogoutButton } from "@/components/dashboard/logout-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { DashboardLogo, DashboardLogoSmall } from "@/components/dashboard/logo"
import { SITE_CONFIG } from "@/lib/constants"

// User navigation items
const userNavItems = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Projects",
    href: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    name: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    name: "Chat",
    href: "/dashboard/chat",
    icon: MessageCircle,
  },
]

// Admin-only navigation items
const adminNavItems = [
  {
    name: "All Projects",
    href: "/dashboard/admin/projects",
    icon: FolderKanban,
  },
  {
    name: "All Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    name: "Email Templates",
    href: "/dashboard/admin/emails",
    icon: Mail,
  },
  {
    name: "Workflow",
    href: "/dashboard/admin/workflow",
    icon: GitBranch,
  },
  {
    name: "Experiments",
    href: "/dashboard/admin/experiments",
    icon: FlaskConical,
  },
  {
    name: "Design System",
    href: "/dashboard/admin/design-system",
    icon: Palette,
  },
]

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const userIsAdmin = isAdmin(user.email)

  // Check for mirror mode
  const cookieStore = await cookies()
  const mirrorUserId = cookieStore.get("mirror_user_id")?.value
  let mirroredUser: { id: string; email: string; name: string } | null = null

  if (mirrorUserId && userIsAdmin) {
    // Look up the mirrored user
    const adminSupabase = createAdminClient()
    const { data } = await adminSupabase.auth.admin.getUserById(mirrorUserId)
    if (data?.user) {
      mirroredUser = {
        id: data.user.id,
        email: data.user.email || "",
        name: data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "Unknown",
      }
    }
  }

  // When mirroring, hide admin tools to show what the user actually sees
  const displayEmail = mirroredUser ? mirroredUser.email : user.email
  const showAdminTools = userIsAdmin && !mirroredUser

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mirror Banner */}
      {mirroredUser && (
        <MirrorBanner userName={mirroredUser.name} userEmail={mirroredUser.email} />
      )}

      {/* Desktop Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 hidden w-64 border-r bg-card md:block ${mirroredUser ? "top-10" : ""}`}>
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div className="flex h-16 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2">
              <DashboardLogo />
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-tight">{SITE_CONFIG.name}</span>
                <span className="text-xs text-muted-foreground leading-tight">Web Development</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {userNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-foreground"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}

            {/* Admin Tools Section - Only visible to admins when not mirroring */}
            {showAdminTools && (
              <div className="pt-4 mt-4 border-t">
                <p className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Admin Tools
                </p>
                {adminNavItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-muted-foreground hover:text-foreground"
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Button>
                    </Link>
                  )
                })}
              </div>
            )}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <p className="text-sm text-muted-foreground truncate">{displayEmail}</p>
              <ThemeToggle />
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className={`fixed inset-x-0 z-50 flex h-16 items-center justify-between border-b bg-card px-4 md:hidden ${mirroredUser ? "top-10" : "top-0"}`}>
        <Link href="/" className="flex items-center gap-2">
          <DashboardLogoSmall />
          <span className="text-sm font-semibold">{SITE_CONFIG.name}</span>
        </Link>
        <DashboardMobileNav userEmail={displayEmail || ""} isAdmin={showAdminTools} />
      </div>

      {/* Main Content */}
      <main className={`flex-1 md:pl-64 ${mirroredUser ? "pt-26 md:pt-10" : "pt-16 md:pt-0"}`}>
        <div className="container mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
