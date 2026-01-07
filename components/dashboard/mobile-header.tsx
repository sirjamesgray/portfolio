"use client"

import { LogOut, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { DashboardLogoSmall } from "@/components/dashboard/logo"
import { SITE_CONFIG } from "@/lib/constants"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MobileHeaderProps {
  userEmail: string
}

export function MobileHeader({ userEmail }: MobileHeaderProps) {
  const { theme, setTheme } = useTheme()

  const handleLogout = async () => {
    window.location.href = "/auth/signout"
  }

  // Always show the logo - back buttons are in the body content area
  return (
    <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <DashboardLogoSmall />
        <div>
          <h1 className="text-lg font-semibold">{SITE_CONFIG.name}</h1>
          <p className="text-xs text-muted-foreground">Web Development</p>
        </div>
      </div>

      {/* Avatar Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors flex-shrink-0">
            <span className="text-sm font-medium">
              {userEmail ? userEmail[0].toUpperCase() : "?"}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium truncate">{userEmail || "Not signed in"}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
