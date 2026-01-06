"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { getNavItems } from "@/lib/dashboard-nav"
import { Card } from "@/components/ui/card"

interface MobileMenuProps {
  isAdmin: boolean
}

export function MobileMenu({ isAdmin }: MobileMenuProps) {
  const pathname = usePathname()
  const navItems = getNavItems(isAdmin)

  return (
    <Card className="bg-card">
      {navItems.map((item, index) => {
        const Icon = item.icon
        const isActive = pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href))
        const isLast = index === navItems.length - 1

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center justify-between px-4 py-3.5 transition-colors",
              !isLast && "border-b border-border",
              isActive
                ? "bg-muted/50 text-foreground"
                : "text-foreground active:bg-muted/50"
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-base font-medium">{item.name}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground/50" />
          </Link>
        )
      })}
    </Card>
  )
}
