"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BlurFade } from "@/components/ui/blur-fade"
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Clock,
  FolderKanban,
  Eye,
} from "lucide-react"
import { ProjectCard } from "@/components/dashboard/project-card"

type Quote = {
  id: string
  status: string
  amount: number
  created_at: string
}

type Invoice = {
  id: string
  status: string
  amount: number
  created_at: string
}

type Project = {
  id: string
  title: string | null
  project_type: string | null
  status: string
  created_at: string
  description: string | null
  price: number | null
  amount_paid: number | null
  vercel_url: string | null
  github_url: string | null
  quotes: Quote[]
  invoices: Invoice[]
}

type Customer = {
  id: string
  email: string
  name: string
  created_at: string
  last_sign_in: string | null
  phone: string | null
}

interface CustomerDetailClientProps {
  customer: Customer
  projects: Project[]
  stats: {
    totalProjects: number
    activeProjects: number
    deliveredProjects: number
    totalRevenue: number
  }
}

function formatCurrency(amount: number | null) {
  if (amount === null || amount === undefined) return "$0"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function CustomerDetailClient({
  customer,
  projects,
  stats,
}: CustomerDetailClientProps) {
  const router = useRouter()

  async function mirrorAsUser() {
    try {
      const response = await fetch("/api/admin/mirror", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: customer.id,
          returnUrl: `/dashboard/admin/customers/${customer.id}`,
        }),
      })

      if (response.ok) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      console.error("Error mirroring user:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <BlurFade delay={0.1}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Back button - navigates to customers list, not browser back */}
            <Link href="/dashboard/admin/customers">
              <Button variant="ghost" size="icon" className="shrink-0 hidden md:flex">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{customer.name}</h1>
                <p className="text-muted-foreground">{customer.email}</p>
              </div>
            </div>
          </div>
          <Button onClick={mirrorAsUser} variant="outline" className="gap-2 shrink-0">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">View as Customer</span>
          </Button>
        </div>
      </BlurFade>

      {/* Stats */}
      <BlurFade delay={0.15}>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProjects}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.deliveredProjects}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(stats.totalRevenue)}
              </div>
            </CardContent>
          </Card>
        </div>
      </BlurFade>

      <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
        {/* Main Column - Projects */}
        <div className="space-y-6">
          <BlurFade delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderKanban className="h-5 w-5" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No projects yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        href={`/dashboard/admin/projects/${project.id}`}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </BlurFade>
        </div>

        {/* Right Sidebar - Customer Info */}
        <div className="space-y-6 order-first lg:order-last">
          <BlurFade delay={0.15}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Customer Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{customer.email}</p>
                  </div>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{customer.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="text-sm font-medium">
                      {new Date(customer.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Last Sign In</p>
                    <p className="text-sm font-medium">
                      {customer.last_sign_in
                        ? new Date(customer.last_sign_in).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Never"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </BlurFade>

          {/* Quick Actions */}
          <BlurFade delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={mirrorAsUser}
                >
                  <Eye className="h-4 w-4" />
                  View as Customer
                </Button>
                <Link href={`mailto:${customer.email}`} className="block">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Mail className="h-4 w-4" />
                    Send Email
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </BlurFade>
        </div>
      </div>
    </div>
  )
}
