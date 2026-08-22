import {
  LayoutDashboard,
  FolderKanban,
  CreditCard,
  Users,
  UserCircle,
  Mail,
  GitBranch,
  Flag,
  FileStack,
  Video,
  LucideIcon,
} from "lucide-react"

export type NavItem = {
  name: string
  href: string
  icon: LucideIcon
}

// User navigation items (for customers only)
// Note: On mobile, customers see MobileCustomerOverview which shows projects directly
// These nav items are used for desktop sidebar
export const userNavItems: NavItem[] = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
]

// Admin-only navigation items
export const adminNavItems: NavItem[] = [
  {
    name: "All Projects",
    href: "/dashboard/admin/projects",
    icon: FolderKanban,
  },
  {
    name: "Customers",
    href: "/dashboard/admin/customers",
    icon: Users,
  },
  {
    name: "Admins",
    href: "/dashboard/admin/admins",
    icon: UserCircle,
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
    name: "Landing Pages",
    href: "/dashboard/admin/landing-pages",
    icon: FileStack,
  },
  {
    name: "Videos",
    href: "/dashboard/admin/videos",
    icon: Video,
  },
  {
    name: "Feature Flags",
    href: "/dashboard/admin/feature-flags",
    icon: Flag,
  },
  {
    name: "Recruiters",
    href: "/dashboard/admin/protected-content",
    icon: UserCircle,
  },
]

// Get nav items based on user type
export function getNavItems(isAdmin: boolean): NavItem[] {
  return isAdmin ? adminNavItems : userNavItems
}
