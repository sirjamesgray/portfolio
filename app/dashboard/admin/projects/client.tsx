"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, Eye, User, Shield, FolderKanban, DollarSign } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"

type Contact = {
  name: string
  email: string
}

type UserInfo = {
  email: string
  name: string
  isAdmin: boolean
}

type Project = {
  id: string
  title: string | null
  status: string
  project_type: string | null
  price: number | null
  amount_paid: number | null
  end_date: string | null
  meeting_time: string | null
  created_at: string
  user_id: string | null
  contacts: Contact | Contact[] | null
  user: UserInfo | null
}

interface AdminProjectsClientProps {
  projects: Project[]
  stats: {
    totalProjects: number
    leads: number
    inProgress: number
    completed: number
  }
}

function getContact(contacts: Contact | Contact[] | null | undefined): Contact | null {
  if (!contacts) return null
  if (Array.isArray(contacts)) return contacts[0] || null
  return contacts
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
  if (!type) return "Not specified"
  return type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function formatCurrency(amount: number | null) {
  if (amount === null || amount === undefined) return "—"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDuration(startDate: string, endDate: string | null) {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 7) return `${diffDays}d`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo`
  return `${Math.floor(diffDays / 365)}y`
}

function getProjectName(project: Project): string {
  if (project.title) return project.title
  const contact = getContact(project.contacts)
  if (contact?.name) return `${contact.name}'s Project`
  if (project.user?.name) return `${project.user.name}'s Project`
  return "Untitled Project"
}

export function AdminProjectsClient({ projects, stats }: AdminProjectsClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredProjects = projects.filter((project) => {
    // Status filter
    if (statusFilter !== "all" && project.status !== statusFilter) {
      return false
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const contact = getContact(project.contacts)
      const projectName = getProjectName(project).toLowerCase()
      const matchesProject = projectName.includes(query)
      const matchesContact =
        contact?.name?.toLowerCase().includes(query) ||
        contact?.email?.toLowerCase().includes(query)
      const matchesUser =
        project.user?.name?.toLowerCase().includes(query) ||
        project.user?.email?.toLowerCase().includes(query)
      return matchesProject || matchesContact || matchesUser
    }

    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <BlurFade delay={0.1}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Projects</h1>
          <p className="text-muted-foreground">
            Manage and track all customer projects
          </p>
        </div>
      </BlurFade>

      {/* Stats */}
      <BlurFade delay={0.15}>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.leads}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>
      </BlurFade>

      {/* Filters */}
      <BlurFade delay={0.2}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </BlurFade>

      {/* Table */}
      <BlurFade delay={0.25}>
        <Card>
          <CardHeader>
            <CardTitle>
              {filteredProjects.length} Project{filteredProjects.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Project</TableHead>
                    <TableHead className="min-w-[120px]">User Name</TableHead>
                    <TableHead className="min-w-[180px]">Email</TableHead>
                    <TableHead className="min-w-[120px]">Type</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[100px]">Price</TableHead>
                    <TableHead className="min-w-[140px]">Paid / Owed</TableHead>
                    <TableHead className="min-w-[100px]">Duration</TableHead>
                    <TableHead className="min-w-[100px]">Created</TableHead>
                    <TableHead className="w-[70px] sticky right-0 bg-card"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">
                        <p className="text-muted-foreground">No projects found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProjects.map((project) => {
                      const contact = getContact(project.contacts)
                      const price = project.price || 0
                      const paid = project.amount_paid || 0
                      const owed = price - paid
                      const customerName = project.user?.name || contact?.name || "—"
                      const customerEmail = project.user?.email || contact?.email || "—"

                      return (
                        <TableRow
                          key={project.id}
                          className="cursor-pointer"
                          onClick={() => router.push(`/dashboard/admin/projects/${project.id}`)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                <FolderKanban className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium whitespace-nowrap">
                                  {getProjectName(project)}
                                </p>
                                {project.user?.isAdmin && (
                                  <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 gap-1 text-xs shrink-0">
                                    <Shield className="h-2.5 w-2.5" />
                                    Admin
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm whitespace-nowrap">
                              {customerName}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              {customerEmail}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm whitespace-nowrap">
                              {formatProjectType(project.project_type)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(project.status)}>
                              {formatStatus(project.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium whitespace-nowrap">
                              {formatCurrency(project.price)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                              <span className="text-sm text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(paid)}
                              </span>
                              <span className="text-muted-foreground">/</span>
                              <span className={`text-sm ${owed > 0 ? "text-orange-600 dark:text-orange-400" : "text-muted-foreground"}`}>
                                {formatCurrency(owed)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm whitespace-nowrap">
                              <span className="font-medium">
                                {formatDuration(project.created_at, project.end_date)}
                              </span>
                              {project.end_date ? (
                                <span className="text-muted-foreground ml-1">
                                  (ended)
                                </span>
                              ) : (
                                <span className="text-emerald-600 dark:text-emerald-400 ml-1">
                                  (ongoing)
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                            {new Date(project.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="sticky right-0 bg-card">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/dashboard/admin/projects/${project.id}`)
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/dashboard/projects?id=${project.id}`)
                                  }}
                                >
                                  <User className="mr-2 h-4 w-4" />
                                  Customer View
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </BlurFade>
    </div>
  )
}
