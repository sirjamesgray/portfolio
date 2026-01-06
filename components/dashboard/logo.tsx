"use client"

import dynamic from "next/dynamic"
import { LogoSVG } from "@/components/logo"

// Dynamically import 3D logo to avoid SSR issues
const Logo3D = dynamic(
  () => import("@/components/logo-3d").then((mod) => mod.Logo3D),
  {
    ssr: false,
    loading: () => <LogoSVG size="md" />,
  }
)

export function DashboardLogo() {
  return <Logo3D size="md" static />
}

export function DashboardLogoSmall() {
  return <Logo3D size="sm" static />
}
