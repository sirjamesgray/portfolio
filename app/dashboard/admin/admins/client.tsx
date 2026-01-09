"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Shield, UserCircle } from "lucide-react"
import { MobileBackButton } from "@/components/dashboard/mobile-back-button"

type Admin = {
  id: string
  email: string
  name: string
  created_at: string
  last_sign_in: string | null
}

interface AdminsClientProps {
  admins: Admin[]
  currentUserId: string
}

export function AdminsClient({ admins, currentUserId }: AdminsClientProps) {
  return (
    <div className="space-y-6">
      <MobileBackButton />
      {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admins</h1>
          <p className="text-muted-foreground">
            Users with administrative access
          </p>
        </div>

      {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 max-w-md">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{admins.length}</div>
            </CardContent>
          </Card>
        </div>

      {/* Mobile Cards View */}
        <div className="md:hidden space-y-3">
          <p className="text-sm text-muted-foreground">
            {admins.length} Admin{admins.length !== 1 ? "s" : ""}
          </p>
          {admins.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No admins found</p>
              </CardContent>
            </Card>
          ) : (
            admins.map((admin) => (
              <Card key={admin.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                      <Shield className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold truncate">{admin.name}</p>
                        {admin.id === currentUserId && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{admin.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Joined {new Date(admin.created_at).toLocaleDateString()}</span>
                    <span>
                      Last active:{" "}
                      {admin.last_sign_in
                        ? new Date(admin.last_sign_in).toLocaleDateString()
                        : "Never"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

      {/* Desktop Table View */}
        <Card className="hidden md:block">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              {admins.length} Admin{admins.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Sign In</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <p className="text-muted-foreground">No admins found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <Shield className="h-4 w-4 text-purple-500" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{admin.name}</p>
                              {admin.id === currentUserId && (
                                <Badge variant="outline" className="text-xs">You</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{admin.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(admin.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {admin.last_sign_in
                          ? new Date(admin.last_sign_in).toLocaleDateString()
                          : "Never"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  )
}
