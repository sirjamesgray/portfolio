"use client"

import { useState } from "react"
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
  Menu,
  X,
  Shield,
  Mail,
  GitBranch,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogoutButton } from "@/components/dashboard/logout-button"

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

interface DashboardMobileNavProps {
  userEmail: string
  isAdmin: boolean
}

export function DashboardMobileNav({ userEmail, isAdmin }: DashboardMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="md:hidden"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open menu</span>
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-card border-l transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <span className="text-lg font-semibold">Menu</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {userNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                >
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

            {/* Admin Tools Section - Only visible to admins */}
            {isAdmin && (
              <div className="pt-4 mt-4 border-t">
                <p className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Admin Tools
                </p>
                {adminNavItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                    >
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
              <p className="text-sm text-muted-foreground truncate">
                {userEmail}
              </p>
              <ThemeToggle />
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>
    </>
  )
}
