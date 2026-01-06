"use client"

import { X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface MirrorBannerProps {
  userName: string
  userEmail: string
}

export function MirrorBanner({ userName, userEmail }: MirrorBannerProps) {
  const router = useRouter()

  const exitMirror = async () => {
    // Call API to clear the httpOnly cookie and get the return URL
    const response = await fetch("/api/admin/mirror", { method: "DELETE" })
    const data = await response.json()
    router.push(data.returnUrl || "/dashboard")
    router.refresh()
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-amber-950">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span className="text-sm font-medium">
            Mirroring as <strong>{userName}</strong> ({userEmail})
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={exitMirror}
          className="h-7 px-2 text-amber-950 hover:bg-amber-600 hover:text-amber-950"
        >
          <X className="h-4 w-4 mr-1" />
          Exit Mirror
        </Button>
      </div>
    </div>
  )
}
