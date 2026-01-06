import {
  LayoutDashboard,
  FolderKanban,
  CreditCard,
  Users,
  UserCircle,
  FlaskConical,
  Palette,
  Mail,
  GitBranch,
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

// Get nav items based on user type
export function getNavItems(isAdmin: boolean): NavItem[] {
  return isAdmin ? adminNavItems : userNavItems
}
