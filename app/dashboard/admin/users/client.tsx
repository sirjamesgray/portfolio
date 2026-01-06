"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { FolderKanban, Search, MoreHorizontal, Eye, User, Shield } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"

type Project = {
  id: string
  project_type: string | null
  status: string
  created_at: string
}

type UserWithProjects = {
  id: string
  email: string
  name: string
  created_at: string
  last_sign_in: string | null
  isAdmin: boolean
  projects: Project[]
}

interface AdminUsersClientProps {
  users: UserWithProjects[]
  stats: {
    totalUsers: number
    totalProjects: number
    newLeads: number
    usersWithProjects: number
  }
}

function getStatusBadgeColor(status: string) {
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

export function AdminUsersClient({ users, stats }: AdminUsersClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = searchQuery
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users

  async function mirrorAsUser(userId: string) {
    try {
      const response = await fetch("/api/admin/mirror", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Users</h1>
          <p className="text-muted-foreground">
            Manage users and view as any user
          </p>
        </div>
      </BlurFade>

      {/* Stats */}
      <BlurFade delay={0.15}>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
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
              <div className="text-2xl font-bold">{stats.newLeads}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Users with Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.usersWithProjects}</div>
            </CardContent>
          </Card>
        </div>
      </BlurFade>

      {/* Search */}
      <BlurFade delay={0.2}>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </BlurFade>

      {/* Users Table */}
      <BlurFade delay={0.25}>
        <Card>
          <CardHeader>
            <CardTitle>
              {filteredUsers.length} User{filteredUsers.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Latest Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Sign In</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">No users found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const latestProject = user.projects[0]
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                              <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{user.name}</p>
                                {user.isAdmin && (
                                  <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 gap-1">
                                    <Shield className="h-3 w-3" />
                                    Admin
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.projects.length > 0 ? (
                            <Badge variant="secondary" className="gap-1">
                              <FolderKanban className="h-3 w-3" />
                              {user.projects.length}
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
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.last_sign_in
                            ? new Date(user.last_sign_in).toLocaleDateString()
                            : "Never"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => mirrorAsUser(user.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View as User
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
      </BlurFade>
    </div>
  )
}
