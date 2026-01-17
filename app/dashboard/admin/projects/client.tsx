"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
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
import { DashboardButton } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, FolderKanban, Plus, Shield, MoreHorizontal, Eye, User, Trash2, X, Megaphone } from "lucide-react"
import { ProjectCard } from "@/components/dashboard/project-card"
import { PageHeader } from "@/components/dashboard/page-header"

type Contact = {
  name: string
  email: string
}

type Quote = {
  id: string
  status: string
}

type Invoice = {
  id: string
  status: string
}

type UserInfo = {
  email: string
  name: string
  isAdmin: boolean
}

type Project = {
  id: string
  title: string | null
  description: string | null
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
  vercel_url: string | null
  github_url: string | null
  show_on_landing_page: boolean | null
  customer_opted_out_of_landing_page: boolean | null
  icon_url: string | null
  quotes: Quote[]
  invoices: Invoice[]
}

type Customer = {
  id: string
  email: string
  name: string
}

interface AdminProjectsClientProps {
  projects: Project[]
  stats: {
    totalProjects: number
    consultation: number
    development: number
    delivered: number
  }
  customers: Customer[]
}

function getContact(contacts: Contact | Contact[] | null | undefined): Contact | null {
  if (!contacts) return null
  if (Array.isArray(contacts)) return contacts[0] || null
  return contacts
}

function getStatusColor(status: string) {
  switch (status) {
    case "consultation":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "quote_sent":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    case "quote_accepted":
      return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
    case "payment":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20"
    case "development":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    case "delivered":
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

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return "Just now"
  if (diffMins === 1) return "1 min ago"
  if (diffMins < 60) return `${diffMins} mins ago`
  if (diffHours === 1) return "1 hour ago"
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return date.toLocaleDateString()
}

function getProjectName(project: Project): string {
  if (project.title) return project.title
  const contact = getContact(project.contacts)
  if (contact?.name) return `${contact.name}'s Project`
  if (project.user?.name) return `${project.user.name}'s Project`
  return "Untitled Project"
}

type InvoiceStatus = "no_quote" | "quote_pending" | "invoice_draft" | "invoice_sent" | "invoice_paid"

function getInvoiceStatus(project: Project): InvoiceStatus {
  // Check if any invoice is paid
  if (project.invoices?.some((i) => i.status === "paid")) {
    return "invoice_paid"
  }
  // Check if any invoice is sent/pending
  if (project.invoices?.some((i) => i.status === "sent" || i.status === "pending")) {
    return "invoice_sent"
  }
  // Check if any invoice is draft
  if (project.invoices?.some((i) => i.status === "draft")) {
    return "invoice_draft"
  }
  // Check if there's a quote (but no invoice)
  if (project.quotes?.length > 0) {
    return "quote_pending"
  }
  return "no_quote"
}

function getInvoiceStatusDisplay(status: InvoiceStatus): { label: string; color: string } {
  switch (status) {
    case "invoice_paid":
      return { label: "Paid", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" }
    case "invoice_sent":
      return { label: "Sent", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" }
    case "invoice_draft":
      return { label: "Draft", color: "bg-gray-500/10 text-gray-500 border-gray-500/20" }
    case "quote_pending":
      return { label: "Quote", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" }
    case "no_quote":
      return { label: "—", color: "text-muted-foreground" }
  }
}

function getDeliverablesStatus(project: Project): { count: number; total: number; color: string } {
  let count = 0
  if (project.github_url) count++
  if (project.vercel_url) count++
  const total = 2

  if (count === total) {
    return { count, total, color: "text-emerald-500" }
  } else if (count > 0) {
    return { count, total, color: "text-yellow-500" }
  } else {
    return { count, total, color: "text-red-500" }
  }
}

export function AdminProjectsClient({ projects, stats, customers }: AdminProjectsClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("-status:canceled")
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newProject, setNewProject] = useState({
    title: "",
    project_type: "website",
    user_id: "",
  })
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Parse search query for filters like "status:value" or "-status:value"
  const parseSearchQuery = (query: string) => {
    const filters: { include: Record<string, string[]>; exclude: Record<string, string[]> } = {
      include: {},
      exclude: {},
    }

    // Match filters like "status:value" or "-status:value"
    const filterRegex = /(-?)(\w+):(\w+)/g
    let textQuery = query
    let match

    while ((match = filterRegex.exec(query)) !== null) {
      const [fullMatch, isExclude, key, value] = match
      const target = isExclude ? filters.exclude : filters.include
      if (!target[key]) target[key] = []
      target[key].push(value.toLowerCase())
      textQuery = textQuery.replace(fullMatch, "")
    }

    return {
      filters,
      textQuery: textQuery.trim().toLowerCase(),
    }
  }

  const { filters, textQuery } = parseSearchQuery(searchQuery)

  const filteredProjects = projects.filter((project) => {
    // Apply status filters from search query
    if (filters.include.status?.length) {
      if (!filters.include.status.includes(project.status.toLowerCase())) {
        return false
      }
    }
    if (filters.exclude.status?.length) {
      if (filters.exclude.status.includes(project.status.toLowerCase())) {
        return false
      }
    }

    // Apply type filters from search query
    if (filters.include.type?.length) {
      const projectType = (project.project_type || "").toLowerCase()
      if (!filters.include.type.includes(projectType)) {
        return false
      }
    }
    if (filters.exclude.type?.length) {
      const projectType = (project.project_type || "").toLowerCase()
      if (filters.exclude.type.includes(projectType)) {
        return false
      }
    }

    // Text search filter
    if (textQuery) {
      const contact = getContact(project.contacts)
      const projectName = getProjectName(project).toLowerCase()
      const matchesProject = projectName.includes(textQuery)
      const matchesContact =
        contact?.name?.toLowerCase().includes(textQuery) ||
        contact?.email?.toLowerCase().includes(textQuery)
      const matchesUser =
        project.user?.name?.toLowerCase().includes(textQuery) ||
        project.user?.email?.toLowerCase().includes(textQuery)
      return matchesProject || matchesContact || matchesUser
    }

    return true
  })

  async function handleCreateProject() {
    if (!newProject.title.trim()) return

    setCreating(true)
    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newProject.title.trim(),
          project_type: newProject.project_type,
          user_id: newProject.user_id || null,
          status: "consultation",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsNewProjectOpen(false)
        setNewProject({
          title: "",
          project_type: "website",
          user_id: "",
        })
        router.refresh()
        router.push(`/dashboard/admin/projects/${data.id}`)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create project")
      }
    } catch (error) {
      alert("An error occurred. Please try again.")
    } finally {
      setCreating(false)
    }
  }

  async function handleDeleteProject() {
    if (!deleteProjectId) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/projects/${deleteProjectId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setDeleteProjectId(null)
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to delete project")
      }
    } catch (error) {
      alert("An error occurred. Please try again.")
    } finally {
      setDeleting(false)
    }
  }

  const projectToDelete = deleteProjectId ? projects.find(p => p.id === deleteProjectId) : null

  return (
    <div className="space-y-6 min-w-0">
      {/* Header */}
      <PageHeader
        title="All Projects"
        description="Manage and track all customer projects"
      >
        <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
          <DialogTrigger asChild>
            <DashboardButton className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4" />
              New Project
            </DashboardButton>
          </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Create a new project and optionally assign it to a customer.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter project title..."
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project_type">Project Type</Label>
                  <Select
                    value={newProject.project_type}
                    onValueChange={(value) => setNewProject({ ...newProject, project_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="webapp">Web App</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customer">Assign Customer (Optional)</Label>
                  <Select
                    value={newProject.user_id || "none"}
                    onValueChange={(value) => setNewProject({ ...newProject, user_id: value === "none" ? "" : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No customer assigned</SelectItem>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} ({customer.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    You can assign a customer later from the project details page.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <DashboardButton
                  variant="outline"
                  onClick={() => setIsNewProjectOpen(false)}
                  disabled={creating}
                >
                  Cancel
                </DashboardButton>
                <DashboardButton
                  onClick={handleCreateProject}
                  disabled={!newProject.title.trim() || creating}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {creating ? "Creating..." : "Create Project"}
                </DashboardButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
      </PageHeader>

      {/* Filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search... (use status:development or -status:canceled)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 font-mono text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground items-center">
            <span>Filters:</span>
            {[
              "status:consultation",
              "status:development",
              "status:delivered",
              "-status:canceled",
              "type:website",
              "type:webapp",
            ].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  const currentQuery = searchQuery.trim()
                  if (currentQuery.includes(filter)) {
                    // Remove filter if already present
                    setSearchQuery(currentQuery.replace(filter, "").replace(/\s+/g, " ").trim())
                  } else {
                    // Add filter
                    setSearchQuery(currentQuery ? `${currentQuery} ${filter}` : filter)
                  }
                }}
                className={`px-1.5 py-0.5 rounded font-mono transition-colors ${
                  searchQuery.includes(filter)
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : "bg-muted hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

      {/* Mobile Cards View */}
        <div className="md:hidden space-y-3">
          <p className="text-sm text-muted-foreground">
            {filteredProjects.length} Project{filteredProjects.length !== 1 ? "s" : ""}
          </p>
          {filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No projects found</p>
              </CardContent>
            </Card>
          ) : (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                href={`/dashboard/admin/projects/${project.id}`}
              />
            ))
          )}
        </div>

      {/* Desktop Table View */}
        <Card className="hidden md:block overflow-hidden">
          <CardHeader>
            <CardTitle>
              {filteredProjects.length} Project{filteredProjects.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Project</TableHead>
                    <TableHead className="min-w-[120px]">User Name</TableHead>
                    <TableHead className="min-w-[180px]">Email</TableHead>
                    <TableHead className="min-w-[120px]">Type</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[80px]">Featured</TableHead>
                    <TableHead className="min-w-[80px]">Invoice</TableHead>
                    <TableHead className="min-w-[80px]">Deliver</TableHead>
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
                      <TableCell colSpan={13} className="text-center py-8">
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
                              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                                {project.icon_url ? (
                                  <Image
                                    src={project.icon_url}
                                    alt={getProjectName(project)}
                                    width={36}
                                    height={36}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <FolderKanban className="h-4 w-4 text-muted-foreground" />
                                )}
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
                            {project.show_on_landing_page && !project.customer_opted_out_of_landing_page ? (
                              <Megaphone className="h-4 w-4 text-emerald-500" />
                            ) : project.show_on_landing_page && project.customer_opted_out_of_landing_page ? (
                              <span title="Customer opted out">
                                <Megaphone className="h-4 w-4 text-amber-500" />
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const invoiceStatus = getInvoiceStatus(project)
                              const display = getInvoiceStatusDisplay(invoiceStatus)
                              if (invoiceStatus === "no_quote") {
                                return <span className={display.color}>{display.label}</span>
                              }
                              return (
                                <Badge className={display.color}>
                                  {display.label}
                                </Badge>
                              )
                            })()}
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const deliverables = getDeliverablesStatus(project)
                              return (
                                <span className={`text-sm font-medium ${deliverables.color}`}>
                                  {deliverables.count}/{deliverables.total}
                                </span>
                              )
                            })()}
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
                            {formatRelativeTime(project.created_at)}
                          </TableCell>
                          <TableCell className="sticky right-0 bg-card">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <DashboardButton
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </DashboardButton>
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
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setDeleteProjectId(project.id)
                                  }}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Project
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
          </CardContent>
        </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteProjectId} onOpenChange={(open) => !open && setDeleteProjectId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Project
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the project
              and all associated data including quotes, invoices, activity logs, and requirements.
            </DialogDescription>
          </DialogHeader>
          {projectToDelete && (
            <div className="py-4">
              <div className="bg-muted rounded-lg p-4">
                <p className="font-medium">{getProjectName(projectToDelete)}</p>
                <p className="text-sm text-muted-foreground">
                  {projectToDelete.user?.email || getContact(projectToDelete.contacts)?.email || "No email"}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <DashboardButton
              variant="outline"
              onClick={() => setDeleteProjectId(null)}
              disabled={deleting}
            >
              Cancel
            </DashboardButton>
            <DashboardButton
              variant="destructive"
              onClick={handleDeleteProject}
              disabled={deleting}
              className="gap-2"
            >
              {deleting ? "Deleting..." : "Delete Project"}
            </DashboardButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
