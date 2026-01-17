"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FolderKanban, Search, MoreHorizontal, Eye, User, Users, UserPlus, Mail, Loader2, Check, MailCheck, MailX } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"

type Project = {
  id: string
  project_type: string | null
  status: string
  created_at: string
}

type Customer = {
  id: string
  email: string
  name: string
  created_at: string
  last_sign_in: string | null
  email_verified: boolean
  projects: Project[]
}

interface CustomersClientProps {
  customers: Customer[]
  stats: {
    totalCustomers: number
    totalProjects: number
    activeProjects: number
    customersWithProjects: number
  }
}

function getStatusBadgeColor(status: string) {
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

export function CustomersClient({ customers, stats }: CustomersClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteName, setInviteName] = useState("")
  const [inviting, setInviting] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState(false)
  const [inviteError, setInviteError] = useState("")

  async function handleInviteCustomer() {
    if (!inviteEmail.trim()) return

    setInviting(true)
    setInviteError("")

    try {
      const response = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          name: inviteName.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setInviteSuccess(true)
        setTimeout(() => {
          setInviteDialogOpen(false)
          setInviteEmail("")
          setInviteName("")
          setInviteSuccess(false)
          router.refresh()
        }, 2000)
      } else {
        setInviteError(data.error || "Failed to send invitation")
      }
    } catch (error) {
      setInviteError("An error occurred")
    } finally {
      setInviting(false)
    }
  }

  const filteredCustomers = searchQuery
    ? customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : customers

  async function mirrorAsUser(userId: string) {
    try {
      const response = await fetch("/api/admin/mirror", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          returnUrl: "/dashboard/admin/customers",
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
      <PageHeader
        title="Customers"
        description="Manage customers and view their projects"
      >
        <Dialog open={inviteDialogOpen} onOpenChange={(open) => {
            setInviteDialogOpen(open)
            if (!open) {
              setInviteEmail("")
              setInviteName("")
              setInviteError("")
              setInviteSuccess(false)
            }
          }}>
            <DialogTrigger asChild>
              <DashboardButton className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <UserPlus className="h-4 w-4" />
                Invite Customer
              </DashboardButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Invite Customer
                </DialogTitle>
                <DialogDescription>
                  Send an invitation email to a new customer. They'll receive a link to create their account.
                </DialogDescription>
              </DialogHeader>
              {inviteSuccess ? (
                <div className="py-8 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                    <Check className="h-6 w-6 text-emerald-500" />
                  </div>
                  <p className="font-medium">Invitation sent!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {inviteEmail} will receive an email with a signup link.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="invite-email">Email Address</Label>
                      <Input
                        id="invite-email"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="customer@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invite-name">Name (optional)</Label>
                      <Input
                        id="invite-name"
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    {inviteError && (
                      <p className="text-sm text-red-500">{inviteError}</p>
                    )}
                  </div>
                  <DialogFooter>
                    <DashboardButton
                      variant="outline"
                      onClick={() => setInviteDialogOpen(false)}
                      disabled={inviting}
                    >
                      Cancel
                    </DashboardButton>
                    <DashboardButton
                      onClick={handleInviteCustomer}
                      disabled={!inviteEmail.trim() || inviting}
                      className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                    >
                      {inviting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Mail className="h-4 w-4" />
                      )}
                      {inviting ? "Sending..." : "Send Invitation"}
                    </DashboardButton>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
      </PageHeader>

      {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

      {/* Mobile Cards View */}
        <div className="md:hidden space-y-3">
          <p className="text-sm text-muted-foreground">
            {filteredCustomers.length} Customer{filteredCustomers.length !== 1 ? "s" : ""}
          </p>
          {filteredCustomers.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No customers found</p>
              </CardContent>
            </Card>
          ) : (
            filteredCustomers.map((customer) => {
              const latestProject = customer.projects[0]
              return (
                <Card
                  key={customer.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => router.push(`/dashboard/admin/customers/${customer.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{customer.name}</p>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm text-muted-foreground truncate">{customer.email}</p>
                            {customer.email_verified ? (
                              <span title="Invite accepted"><MailCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" /></span>
                            ) : (
                              <span title="Invite pending"><MailX className="h-3.5 w-3.5 text-amber-500 shrink-0" /></span>
                            )}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <DashboardButton
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </DashboardButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => mirrorAsUser(customer.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View as Customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      {customer.projects.length > 0 ? (
                        <Badge variant="secondary" className="gap-1">
                          <FolderKanban className="h-3 w-3" />
                          {customer.projects.length} project{customer.projects.length !== 1 ? "s" : ""}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">No projects</span>
                      )}
                      {latestProject && (
                        <Badge className={getStatusBadgeColor(latestProject.status)}>
                          {latestProject.status.replace("_", " ")}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Joined {new Date(customer.created_at).toLocaleDateString()}</span>
                      <span>
                        Last active:{" "}
                        {customer.last_sign_in
                          ? new Date(customer.last_sign_in).toLocaleDateString()
                          : "Never"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

      {/* Desktop Table View */}
        <Card className="hidden md:block">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {filteredCustomers.length} Customer{filteredCustomers.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Latest Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Sign In</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">No customers found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => {
                    const latestProject = customer.projects[0]
                    return (
                      <TableRow
                        key={customer.id}
                        className="cursor-pointer"
                        onClick={() => router.push(`/dashboard/admin/customers/${customer.id}`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                              <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              <div className="flex items-center gap-1.5">
                                <p className="text-sm text-muted-foreground">{customer.email}</p>
                                {customer.email_verified ? (
                                  <span title="Invite accepted"><MailCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" /></span>
                                ) : (
                                  <span title="Invite pending"><MailX className="h-3.5 w-3.5 text-amber-500 shrink-0" /></span>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {customer.projects.length > 0 ? (
                            <Badge variant="secondary" className="gap-1">
                              <FolderKanban className="h-3 w-3" />
                              {customer.projects.length}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {latestProject ? (
                            <Badge className={getStatusBadgeColor(latestProject.status)}>
                              {latestProject.status.replace("_", " ")}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(customer.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {customer.last_sign_in
                            ? new Date(customer.last_sign_in).toLocaleDateString()
                            : "Never"}
                        </TableCell>
                        <TableCell>
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
                              <DropdownMenuItem onClick={() => mirrorAsUser(customer.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View as Customer
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
    </div>
  )
}
