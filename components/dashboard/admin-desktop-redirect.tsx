"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function AdminDesktopRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Only redirect on desktop (md breakpoint = 768px)
    if (window.innerWidth >= 768) {
      router.replace("/dashboard/admin/projects")
    }
  }, [router])

  // Show nothing while redirecting
  return null
}
