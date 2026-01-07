"use client"

import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface MobileBackButtonProps {
  href?: string
  label?: string
}

export function MobileBackButton({ href = "/dashboard", label = "Back" }: MobileBackButtonProps) {
  return (
    <div className="md:hidden mb-4">
      <Link href={href}>
        <Button variant="ghost" size="sm" className="h-8 px-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="mr-1 h-4 w-4" />
          {label}
        </Button>
      </Link>
    </div>
  )
}
