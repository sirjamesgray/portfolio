"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectProgress } from "@/components/dashboard/project-progress"
import { RichTextEditor } from "@/components/dashboard/rich-text-editor"
import { LandingPageStatusCard } from "@/components/dashboard/landing-page-status-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Calendar,
  CalendarDays,
  Mail,
  Phone,
  User,
  Clock,
  Building,
  Copy,
  Check,
  X,
  Github,
  ExternalLink,
  Timer,
  FileText,
  Eye,
  Shield,
  History,
  Pencil,
  Loader2,
  RotateCcw,
  Send,
  Plus,
  Receipt,
  Trash2,
  ArchiveRestore,
  Users,
  Crown,
  UserPlus,
  Globe,
  Image as ImageIcon,
  Link2,
  Upload,
  FileImage,
  FolderKanban,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

type Contact = {
  name: string
  email: string
  phone?: string
  company?: string
}

type Project = {
  id: string
  title: string | null
  status: string
  project_type: string | null
  price: number | null
  amount_paid: number | null
  end_date: string | null
  github_url: string | null
  vercel_url: string | null
  meeting_time: string | null
  notes: string | null
  requirements: string | null
  requirements_updated_at: string | null
  requirements_updated_by: string | null
  cancellation_reason: string | null
  created_at: string
  updated_at: string
  user_id: string | null
  contacts: Contact | Contact[] | null
  // Landing page controls
  customer_opted_out_of_landing_page: boolean | null
  show_on_landing_page: boolean | null
  public_title: string | null
  public_description: string | null
  public_hero_image: string | null
  public_industry: string | null
  icon_url: string | null
}

type ActivityLog = {
  id: string
  action: string
  details: string | null
  created_at: string
}

type Quote = {
  id: string
  status: string
  title: string
  description: string | null
  amount: number
  valid_until: string | null
  sent_at: string | null
  responded_at: string | null
  created_at: string
}

type Invoice = {
  id: string
  status: string
  amount: number
  invoice_url: string | null
  paid_at: string | null
  created_at: string
}

type RequirementsVersion = {
  id: string
  content: string
  updated_by_name: string | null
  created_at: string
}

type MemberUser = {
  id: string
  email: string
  name: string
}

type ProjectMember = {
  id: string
  user_id: string
  role: "owner" | "viewer"
  created_at: string
  user: MemberUser
}

type ProjectAsset = {
  id: string
  project_id: string
  type: "previous_site" | "reference_link" | "screenshot" | "image" | "document"
  title: string | null
  url: string | null
  storage_path: string | null
  thumbnail_url: string | null
  description: string | null
  display_order: number
  created_at: string
}

function getStatusColor(status: string) {
  switch (status) {
    case "consultation":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "quote_sent":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    case "quote_accepted":
      return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
    case "payment":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20"
    case "development":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    case "delivered":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "canceled":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20"
  }
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function getContact(contacts: Contact | Contact[] | null | undefined): Contact | null {
  if (!contacts) return null
  if (Array.isArray(contacts)) return contacts[0] || null
  return contacts
}

function formatCurrency(amount: number | null) {
  if (amount === null || amount === undefined) return "—"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDuration(startDate: string, endDate: string | null) {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""}`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? "s" : ""}`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) !== 1 ? "s" : ""}`
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) !== 1 ? "s" : ""}`
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) return "just now"
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
  return date.toLocaleDateString()
}

function CopyableField({ value, children }: { value: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false)
  const [hovering, setHovering] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="group flex items-center gap-2 cursor-pointer"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={handleCopy}
    >
      {children}
      <button
        className={`h-4 w-4 text-muted-foreground hover:text-foreground transition-opacity ${
          hovering ? "opacity-100" : "opacity-0"
        }`}
      >
        {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
      </button>
    </div>
  )
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Editable fields
  const [title, setTitle] = useState("")
  const [requirements, setRequirements] = useState("")
  const [status, setStatus] = useState("")
  const [endDate, setEndDate] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [vercelUrl, setVercelUrl] = useState("")

  // Track original values for contextual save
  const [originalTitle, setOriginalTitle] = useState("")
  const [originalRequirements, setOriginalRequirements] = useState("")
  const [originalStatus, setOriginalStatus] = useState("")
  const [originalEndDate, setOriginalEndDate] = useState("")
  const [originalGithubUrl, setOriginalGithubUrl] = useState("")
  const [originalVercelUrl, setOriginalVercelUrl] = useState("")

  // Edit modes
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingRequirements, setIsEditingRequirements] = useState(false)

  // Saving states
  const [savingTitle, setSavingTitle] = useState(false)
  const [savingRequirements, setSavingRequirements] = useState(false)
  const [savingDeliverables, setSavingDeliverables] = useState(false)

  // Change detection
  const titleChanged = title !== originalTitle
  const requirementsChanged = requirements !== originalRequirements
  const deliverablesChanged = githubUrl !== originalGithubUrl || vercelUrl !== originalVercelUrl
  const [mirrorLoading, setMirrorLoading] = useState(false)
  const [requirementsVersions, setRequirementsVersions] = useState<RequirementsVersion[]>([])
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [currentUserName, setCurrentUserName] = useState("")

  // Quote creation state
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false)
  const [quoteTitle, setQuoteTitle] = useState("Web Development Services")
  const [quoteDescription, setQuoteDescription] = useState("Professional web development services by Jamie Gray, including design, development, testing, and deployment.")
  const [quoteAmount, setQuoteAmount] = useState("")
  const [creatingQuote, setCreatingQuote] = useState(false)

  // Invoice creation state
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false)
  const [invoiceAmount, setInvoiceAmount] = useState("")
  const [invoiceDescription, setInvoiceDescription] = useState("")
  const [creatingInvoice, setCreatingInvoice] = useState(false)

  // Archive/delete state
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)
  const [archiveReason, setArchiveReason] = useState("")
  const [archiving, setArchiving] = useState(false)

  // Email preview state
  const [emailPreviewOpen, setEmailPreviewOpen] = useState(false)
  const [previewQuote, setPreviewQuote] = useState<Quote | null>(null)

  // Project members state
  const [members, setMembers] = useState<ProjectMember[]>([])
  const [assignedAdmin, setAssignedAdmin] = useState<MemberUser | null>(null)
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberRole, setNewMemberRole] = useState<"owner" | "viewer">("viewer")
  const [addingMember, setAddingMember] = useState(false)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteName, setInviteName] = useState("")
  const [inviting, setInviting] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState(false)
  const [inviteError, setInviteError] = useState("")

  // Project assets state
  const [assets, setAssets] = useState<ProjectAsset[]>([])
  const [previousSiteUrl, setPreviousSiteUrl] = useState("")
  const [originalPreviousSiteUrl, setOriginalPreviousSiteUrl] = useState("")
  const [savingPreviousSite, setSavingPreviousSite] = useState(false)
  const [addLinkDialogOpen, setAddLinkDialogOpen] = useState(false)
  const [newLinkUrl, setNewLinkUrl] = useState("")
  const [newLinkTitle, setNewLinkTitle] = useState("")
  const [addingLink, setAddingLink] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Icon upload state
  const [iconUrl, setIconUrl] = useState("")
  const [uploadingIcon, setUploadingIcon] = useState(false)

  useEffect(() => {
    fetchProject()
    fetchActivityLog()
    fetchCurrentUser()
    fetchQuotesAndInvoices()
    fetchMembers()
    fetchAssets()
  }, [projectId])

  const [currentUserEmail, setCurrentUserEmail] = useState("")

  async function fetchCurrentUser() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setCurrentUserId(user.id)
      setCurrentUserEmail(user.email || "")
      setCurrentUserName(user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin")
    }
  }

  async function fetchProject() {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`)
      if (!response.ok) {
        console.error("Error fetching project:", response.status)
        setLoading(false)
        return
      }
      const { project: data } = await response.json()

      if (!data) {
        setLoading(false)
        return
      }

      setProject(data)
      const titleVal = data.title || ""
      setTitle(titleVal)
      setOriginalTitle(titleVal)
      // Use requirements if available, otherwise fall back to notes (for migration)
      const reqContent = data.requirements || data.notes || ""
      setRequirements(reqContent)
      setOriginalRequirements(reqContent)
      const statusVal = data.status
      setStatus(statusVal)
      setOriginalStatus(statusVal)
      const endDateVal = data.end_date ? data.end_date.split("T")[0] : ""
      setEndDate(endDateVal)
      setOriginalEndDate(endDateVal)
      const githubVal = data.github_url || ""
      setGithubUrl(githubVal)
      setOriginalGithubUrl(githubVal)
      const vercelVal = data.vercel_url || ""
      setVercelUrl(vercelVal)
      setOriginalVercelUrl(vercelVal)
      setIconUrl(data.icon_url || "")
      setLoading(false)
    } catch (error) {
      console.error("Error fetching project:", error)
      setLoading(false)
    }
  }

  async function fetchActivityLog() {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/activity`)
      if (response.ok) {
        const data = await response.json()
        setActivityLog(data.activityLog || [])
      }
    } catch (error) {
      console.error("Error fetching activity log:", error)
    }
  }

  async function fetchQuotesAndInvoices() {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/quotes-invoices`)
      if (response.ok) {
        const data = await response.json()
        setQuotes(data.quotes || [])
        setInvoices(data.invoices || [])
      }
    } catch (error) {
      console.error("Error fetching quotes/invoices:", error)
    }
  }

  async function fetchRequirementsVersions() {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/requirements-versions`)
      if (response.ok) {
        const data = await response.json()
        setRequirementsVersions(data.versions || [])
      }
    } catch (error) {
      console.error("Error fetching requirements versions:", error)
    }
  }

  async function fetchMembers() {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/members`)
      if (response.ok) {
        const data = await response.json()
        setMembers(data.members || [])
        setAssignedAdmin(data.assignedAdmin || null)
      }
    } catch (error) {
      console.error("Error fetching members:", error)
    }
  }

  async function handleAddMember() {
    if (!newMemberEmail.trim()) return

    setAddingMember(true)
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newMemberEmail.trim(),
          role: newMemberRole,
        }),
      })

      if (response.ok) {
        setNewMemberEmail("")
        setNewMemberRole("viewer")
        setAddMemberDialogOpen(false)
        fetchMembers()
        if (newMemberRole === "owner") {
          fetchProject() // Refresh project to get new user_id
        }
      } else {
        const error = await response.json()
        alert(error.error || "Failed to add member")
      }
    } catch (error) {
      alert("An error occurred")
    } finally {
      setAddingMember(false)
    }
  }

  async function handleRemoveMember(userId: string, role: string) {
    if (!confirm("Are you sure you want to remove this member?")) return

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      })

      if (response.ok) {
        fetchMembers()
        if (role === "owner") {
          fetchProject()
        }
      } else {
        const error = await response.json()
        alert(error.error || "Failed to remove member")
      }
    } catch (error) {
      alert("An error occurred")
    }
  }

  async function handleAssignAdmin(email: string) {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role: "admin",
        }),
      })

      if (response.ok) {
        fetchMembers()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to assign admin")
      }
    } catch (error) {
      alert("An error occurred")
    }
  }

  async function handleInviteCustomer() {
    if (!inviteEmail.trim()) return

    setInviting(true)
    setInviteError("")
    setInviteSuccess(false)

    try {
      const response = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          name: inviteName.trim() || undefined,
          projectId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setInviteSuccess(true)
        // Refresh members list
        fetchMembers()
        fetchProject()
        // Reset form after a delay
        setTimeout(() => {
          setInviteDialogOpen(false)
          setInviteEmail("")
          setInviteName("")
          setInviteSuccess(false)
        }, 2000)
      } else {
        setInviteError(data.error || "Failed to send invitation")
      }
    } catch (error) {
      setInviteError("An error occurred")
    } finally {
      setInviting(false)
    }
  }

  async function fetchAssets() {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/assets`)
      if (response.ok) {
        const data = await response.json()
        setAssets(data.assets || [])
        setPreviousSiteUrl(data.previousSiteUrl || "")
        setOriginalPreviousSiteUrl(data.previousSiteUrl || "")
      }
    } catch (error) {
      console.error("Error fetching assets:", error)
    }
  }

  async function handleSavePreviousSite() {
    setSavingPreviousSite(true)
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/assets`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previousSiteUrl }),
      })

      if (response.ok) {
        setOriginalPreviousSiteUrl(previousSiteUrl)
      } else {
        alert("Failed to save")
      }
    } catch (error) {
      alert("An error occurred")
    } finally {
      setSavingPreviousSite(false)
    }
  }

  async function handleAddLink() {
    if (!newLinkUrl.trim()) return

    setAddingLink(true)
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/assets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "reference_link",
          url: newLinkUrl.trim(),
          title: newLinkTitle.trim() || newLinkUrl.trim(),
        }),
      })

      if (response.ok) {
        setNewLinkUrl("")
        setNewLinkTitle("")
        setAddLinkDialogOpen(false)
        fetchAssets()
      } else {
        alert("Failed to add link")
      }
    } catch (error) {
      alert("An error occurred")
    } finally {
      setAddingLink(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "screenshot")
      formData.append("title", file.name)

      const response = await fetch(`/api/admin/projects/${projectId}/assets/upload`, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        fetchAssets()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to upload image")
      }
    } catch (error) {
      alert("An error occurred")
    } finally {
      setUploadingImage(false)
      // Reset the input
      e.target.value = ""
    }
  }

  async function handleDeleteAsset(assetId: string) {
    if (!confirm("Delete this item?")) return

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/assets`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId }),
      })

      if (response.ok) {
        fetchAssets()
      } else {
        alert("Failed to delete")
      }
    } catch (error) {
      alert("An error occurred")
    }
  }

  async function handleIconUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Icon must be less than 5MB")
      return
    }

    setUploadingIcon(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "image")
      formData.append("title", "Project Icon")

      const response = await fetch(`/api/admin/projects/${projectId}/assets/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const { asset } = await response.json()

      // Save the icon_url to the project
      const saveResponse = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ icon_url: asset.url }),
      })

      if (saveResponse.ok) {
        setIconUrl(asset.url)
      }
    } catch (error) {
      console.error("Failed to upload icon:", error)
      alert("Failed to upload icon. Please try again.")
    } finally {
      setUploadingIcon(false)
      e.target.value = ""
    }
  }

  async function handleRemoveIcon() {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ icon_url: null }),
      })

      if (response.ok) {
        setIconUrl("")
      }
    } catch (error) {
      console.error("Failed to remove icon:", error)
    }
  }

  const previousSiteChanged = previousSiteUrl !== originalPreviousSiteUrl

  function revertTitle() {
    setTitle(originalTitle)
    setIsEditingTitle(false)
  }

  function revertRequirements() {
    setRequirements(originalRequirements)
    setIsEditingRequirements(false)
  }

  async function handleSaveTitle() {
    if (!project || !titleChanged) return
    setSavingTitle(true)

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title || null }),
      })

      if (!response.ok) {
        console.error("Error saving title:", response.status)
        setSavingTitle(false)
        return
      }

      setOriginalTitle(title)
      setIsEditingTitle(false)
      setProject({ ...project, title: title || null })
    } catch (error) {
      console.error("Error saving title:", error)
    } finally {
      setSavingTitle(false)
    }
  }

  async function handleSaveRequirements() {
    if (!project || !requirementsChanged) return
    setSavingRequirements(true)
    const now = new Date().toISOString()

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requirements,
          requirements_updated_at: now,
          requirements_updated_by: currentUserId,
        }),
      })

      if (!response.ok) {
        console.error("Error saving requirements:", response.status)
        setSavingRequirements(false)
        return
      }

      // Save requirements version history and activity log via API
      if (requirements) {
        await fetch(`/api/admin/projects/${projectId}/requirements-versions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: requirements,
            updated_by_name: currentUserName,
          }),
        })

        await fetch(`/api/admin/projects/${projectId}/activity`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "requirements_updated",
            details: `Requirements updated by ${currentUserName}`,
          }),
        })
      }

      setOriginalRequirements(requirements)
      setIsEditingRequirements(false)
      setProject({
        ...project,
        requirements,
        requirements_updated_at: now,
        requirements_updated_by: currentUserId,
      })
      fetchActivityLog()
    } catch (error) {
      console.error("Error saving requirements:", error)
    } finally {
      setSavingRequirements(false)
    }
  }

  function revertDeliverables() {
    setGithubUrl(originalGithubUrl)
    setVercelUrl(originalVercelUrl)
  }

  async function handleSaveDeliverables() {
    if (!project || !deliverablesChanged) return
    setSavingDeliverables(true)

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          github_url: githubUrl || null,
          vercel_url: vercelUrl || null,
        }),
      })

      if (!response.ok) {
        console.error("Error saving deliverables:", response.status)
        setSavingDeliverables(false)
        return
      }

      setOriginalGithubUrl(githubUrl)
      setOriginalVercelUrl(vercelUrl)
      setProject({
        ...project,
        github_url: githubUrl || null,
        vercel_url: vercelUrl || null,
      })

      // Log activity via API
      await fetch(`/api/admin/projects/${projectId}/activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "deliverables_updated",
          details: `Deliverables updated by ${currentUserName}`,
        }),
      })

      fetchActivityLog()
    } catch (error) {
      console.error("Error saving deliverables:", error)
    } finally {
      setSavingDeliverables(false)
    }
  }

  async function handleViewAsCustomer() {
    setMirrorLoading(true)
    try {
      // Use project-based preview (works for projects with or without assigned customers)
      const response = await fetch("/api/admin/mirror", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: projectId,
          returnUrl: `/dashboard/admin/projects/${projectId}`,
        }),
      })

      if (response.ok) {
        router.push(`/dashboard/projects/${projectId}`)
        router.refresh()
      } else {
        alert("Failed to enter preview mode")
      }
    } catch (error) {
      alert("An error occurred")
    } finally {
      setMirrorLoading(false)
    }
  }

  async function handleCreateQuote(sendImmediately: boolean) {
    if (!quoteTitle.trim() || !quoteAmount) return

    setCreatingQuote(true)
    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          title: quoteTitle.trim(),
          description: quoteDescription.trim() || null,
          amount: parseFloat(quoteAmount),
          sendImmediately,
        }),
      })

      if (response.ok) {
        // Reset form and close dialog
        setQuoteTitle("")
        setQuoteDescription("")
        setQuoteAmount("")
        setQuoteDialogOpen(false)
        // Refresh data
        fetchQuotesAndInvoices()
        fetchActivityLog()
        if (sendImmediately) {
          fetchProject() // Status may have changed
        }
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create quote")
      }
    } catch (error) {
      alert("An error occurred")
    } finally {
      setCreatingQuote(false)
    }
  }

  function getQuoteStatusColor(status: string) {
    switch (status) {
      case "draft":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      case "sent":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "accepted":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "expired":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  function getInvoiceStatusColor(status: string) {
    switch (status) {
      case "draft":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      case "pending":
      case "sent":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "paid":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "overdue":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "canceled":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  async function handleCreateInvoice(sendImmediately: boolean) {
    if (!invoiceAmount) return

    setCreatingInvoice(true)
    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          amount: parseFloat(invoiceAmount),
          description: invoiceDescription.trim() || null,
          sendImmediately,
        }),
      })

      if (response.ok) {
        // Reset form and close dialog
        setInvoiceAmount("")
        setInvoiceDescription("")
        setInvoiceDialogOpen(false)
        // Refresh data
        fetchQuotesAndInvoices()
        fetchActivityLog()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create invoice")
      }
    } catch (error) {
      alert("An error occurred")
    } finally {
      setCreatingInvoice(false)
    }
  }

  async function handleArchiveProject() {
    if (!archiveReason.trim()) {
      alert("Please provide a reason for archiving")
      return
    }

    setArchiving(true)
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/archive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: archiveReason }),
      })

      if (response.ok) {
        setArchiveDialogOpen(false)
        setArchiveReason("")
        // Redirect back to projects list
        router.push("/dashboard/admin/projects")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to archive project")
      }
    } catch (error) {
      alert("An error occurred")
    } finally {
      setArchiving(false)
    }
  }

  async function handleRestoreProject() {
    setArchiving(true)
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/archive`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Refresh the page to show restored state
        router.refresh()
        // Also update local state
        setStatus("consultation")
        fetchProject()
        fetchActivityLog()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to restore project")
      }
    } catch (error) {
      alert("An error occurred")
    } finally {
      setArchiving(false)
    }
  }

  function handleActivityClick(activity: ActivityLog) {
    // Check if this is a quote_sent or quote_created action
    if (activity.action === "quote_sent" || activity.action === "quote_created") {
      // Find the matching quote from the details (which contains the quote title)
      const quoteMatch = activity.details?.match(/Quote "([^"]+)"/)
      if (quoteMatch) {
        const quoteTitle = quoteMatch[1]
        const matchingQuote = quotes.find((q) => q.title === quoteTitle)
        if (matchingQuote) {
          setPreviewQuote(matchingQuote)
          setEmailPreviewOpen(true)
        }
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/admin/projects">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Project not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const contact = getContact(project.contacts)

  // Progress state calculations
  const hasQuote = quotes.length > 0
  const quoteAccepted = quotes.some((q) => q.status === "accepted")
  const quoteRejected = quotes.some((q) => q.status === "rejected")
  const hasPaid = invoices.some((i) => i.status === "paid")
  const hasDeliverables = Boolean(githubUrl || vercelUrl)

  return (
    <div className="space-y-6">
      {/* Header with Admin Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link href="/dashboard/admin/projects">
            <Button variant="ghost" size="sm" className="h-8 px-2 sm:px-3">
              <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Back to Projects</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1 text-xs">
            <Shield className="h-3 w-3" />
            <span className="hidden sm:inline">Admin View</span>
            <span className="sm:hidden">Admin</span>
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewAsCustomer}
          disabled={mirrorLoading}
          className="h-8 text-xs sm:text-sm"
        >
          <Eye className="mr-1 sm:mr-2 h-4 w-4" />
          {mirrorLoading ? "..." : <><span className="hidden sm:inline">Preview as Customer</span><span className="sm:hidden">Preview</span></>}
        </Button>
      </div>

      {/* Progress Tracker */}
      <Card>
        <CardContent className="pt-6">
          <ProjectProgress status={status} />
        </CardContent>
      </Card>

      {/* Project Title with Icon */}
      <div className="flex items-start gap-4">
        {/* Project Icon */}
        <div className="relative group/icon shrink-0">
          <input
            type="file"
            accept="image/*"
            onChange={handleIconUpload}
            className="hidden"
            id="icon-upload"
          />
          <label
            htmlFor="icon-upload"
            className="block cursor-pointer"
          >
            <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-primary/50 transition-colors">
              {uploadingIcon ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : iconUrl ? (
                <Image
                  src={iconUrl}
                  alt="Project icon"
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              ) : (
                <FolderKanban className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          </label>
          {iconUrl && (
            <button
              onClick={(e) => {
                e.preventDefault()
                handleRemoveIcon()
              }}
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover/icon:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          <p className="text-[10px] text-muted-foreground text-center mt-1 opacity-0 group-hover/icon:opacity-100 transition-opacity">
            {iconUrl ? "Change" : "Add icon"}
          </p>
        </div>

        {/* Title */}
        <div className="flex-1 space-y-2">
          {isEditingTitle ? (
            <div className="space-y-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Project Title"
                className="text-2xl font-bold h-12 px-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveTitle}
                  disabled={!titleChanged || savingTitle}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                >
                  {savingTitle ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <span className="ml-1">Save</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={revertTitle}
                  disabled={savingTitle}
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="ml-1">Cancel</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <h1 className="text-3xl font-bold tracking-tight">
                {title || (contact?.name ? `${contact.name}'s Project` : "Untitled Project")}
              </h1>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsEditingTitle(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 1. Project Requirements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Project Requirements
              </CardTitle>
              {project.requirements_updated_at && (
                <button
                  onClick={() => {
                    fetchRequirementsVersions()
                    setShowVersionHistory(!showVersionHistory)
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mt-1"
                >
                  <History className="h-3 w-3" />
                  Last edited {formatRelativeTime(project.requirements_updated_at)}
                </button>
              )}
            </div>
            {!isEditingRequirements && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingRequirements(true)}
                className="gap-1"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Version History Modal */}
          {showVersionHistory && requirementsVersions.length > 0 && (
            <div className="border rounded-lg p-4 bg-muted/50 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Version History</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVersionHistory(false)}
                >
                  Close
                </Button>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {requirementsVersions.map((version) => (
                  <button
                    key={version.id}
                    onClick={() => {
                      setRequirements(version.content)
                      setShowVersionHistory(false)
                      setIsEditingRequirements(true)
                    }}
                    className="w-full text-left p-2 rounded hover:bg-muted text-sm"
                  >
                    <span className="font-medium">
                      {formatRelativeTime(version.created_at)}
                    </span>
                    {version.updated_by_name && (
                      <span className="text-muted-foreground"> by {version.updated_by_name}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          {isEditingRequirements ? (
            <div className="space-y-3">
              <RichTextEditor
                content={requirements}
                onChange={setRequirements}
                placeholder="Enter project requirements..."
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveRequirements}
                  disabled={!requirementsChanged || savingRequirements}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                >
                  {savingRequirements ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <span className="ml-1">Save</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={revertRequirements}
                  disabled={savingRequirements}
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="ml-1">Cancel</span>
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {requirements ? (
                <div
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: requirements }}
                />
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No requirements added yet. Click Edit to add project requirements.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Contact Customer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Customer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {contact?.email ? (
              <a href={`mailto:${contact.email}`}>
                <Button variant="outline" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Email {contact?.name || "Customer"}
                </Button>
              </a>
            ) : (
              <Button
                variant="outline"
                className="gap-2"
                disabled
                title="No email address available for this customer"
              >
                <Mail className="h-4 w-4" />
                Email Customer
              </Button>
            )}
            <a href="https://cal.com/jamiegray/30min" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <CalendarDays className="h-4 w-4" />
                Schedule a Call
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* 3. Quotes & Invoices */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Quotes & Invoices
            </CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => setInvoiceDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Create Invoice
              </Button>
              <Dialog open={quoteDialogOpen} onOpenChange={setQuoteDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4" />
                    Create Quote
                  </Button>
                </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create Quote</DialogTitle>
                  <DialogDescription>
                    Create a new quote for this project. You can save it as a draft or send it immediately.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title *</label>
                    <Input
                      value={quoteTitle}
                      onChange={(e) => setQuoteTitle(e.target.value)}
                      placeholder="e.g., Website Development"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Amount *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        type="number"
                        value={quoteAmount}
                        onChange={(e) => setQuoteAmount(e.target.value)}
                        placeholder="0"
                        className="pl-7"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description (optional)</label>
                    <Textarea
                      value={quoteDescription}
                      onChange={(e) => setQuoteDescription(e.target.value)}
                      placeholder="Describe what's included in this quote..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    variant="outline"
                    onClick={() => handleCreateQuote(false)}
                    disabled={!quoteTitle.trim() || !quoteAmount || creatingQuote}
                  >
                    {creatingQuote ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Save as Draft
                  </Button>
                  <Button
                    onClick={() => handleCreateQuote(true)}
                    disabled={!quoteTitle.trim() || !quoteAmount || creatingQuote || !contact?.email}
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400"
                    title={!contact?.email ? "No email address available for this customer" : undefined}
                  >
                    {creatingQuote ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {!contact?.email ? "Requires Email" : "Send Quote"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quotes Section */}
          <div>
            <h4 className="text-sm font-medium mb-3">Quotes</h4>
            {quotes.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No quotes yet</p>
            ) : (
              <div className="space-y-2">
                {quotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{quote.title}</span>
                        <Badge className={getQuoteStatusColor(quote.status)}>
                          {formatStatus(quote.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(quote.amount)}
                        {quote.valid_until && (
                          <span className="ml-2">
                            · Valid until {new Date(quote.valid_until).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Invoices Section */}
          <div>
            <h4 className="text-sm font-medium mb-3">Invoices</h4>
            {invoices.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No invoices yet</p>
            ) : (
              <div className="space-y-2">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {formatCurrency(invoice.amount)}
                        </span>
                        <Badge className={getInvoiceStatusColor(invoice.status)}>
                          {formatStatus(invoice.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(invoice.created_at).toLocaleDateString()}
                        {invoice.paid_at && (
                          <span className="ml-2">
                            · Paid {new Date(invoice.paid_at).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    </div>
                    {invoice.invoice_url && (
                      <a
                        href={invoice.invoice_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm" className="gap-2">
                          <ExternalLink className="h-3 w-3" />
                          View
                        </Button>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 4. Deliverables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Deliverables
            <span className="text-sm font-normal text-muted-foreground ml-auto">
              {githubUrl && vercelUrl ? (
                <span className="text-emerald-500">2/2</span>
              ) : githubUrl || vercelUrl ? (
                <span className="text-yellow-500">1/2</span>
              ) : (
                <span className="text-red-500">0/2</span>
              )}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              {githubUrl ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
              <Github className="h-4 w-4" />
              GitHub Repository
            </label>
            <Input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
            />
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
              >
                Open repository <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              {vercelUrl ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
              <ExternalLink className="h-4 w-4" />
              Vercel Preview
            </label>
            <Input
              type="url"
              value={vercelUrl}
              onChange={(e) => setVercelUrl(e.target.value)}
              placeholder="https://your-project.vercel.app"
            />
            {vercelUrl && (
              <a
                href={vercelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
              >
                Open preview <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          {/* Save/Revert buttons */}
          {deliverablesChanged && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <Button
                size="sm"
                onClick={handleSaveDeliverables}
                disabled={savingDeliverables}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
              >
                {savingDeliverables ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                <span className="ml-1">Save</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={revertDeliverables}
                disabled={savingDeliverables}
              >
                <RotateCcw className="h-4 w-4" />
                <span className="ml-1">Revert</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Previous Website & References */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Previous Website & References
            </CardTitle>
            <div className="flex gap-2">
              <Dialog open={addLinkDialogOpen} onOpenChange={setAddLinkDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Link2 className="h-4 w-4" />
                    Add Link
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Reference Link</DialogTitle>
                    <DialogDescription>
                      Add a reference link, competitor site, or inspiration.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">URL</label>
                      <Input
                        type="url"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Title (optional)</label>
                      <Input
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                        placeholder="Competitor site, Inspiration, etc."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddLinkDialogOpen(false)} disabled={addingLink}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddLink} disabled={!newLinkUrl.trim() || addingLink}>
                      {addingLink ? "Adding..." : "Add Link"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button size="sm" variant="outline" className="gap-2" asChild>
                <label className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                  {uploadingImage ? "Uploading..." : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Previous Site URL */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              Previous Website URL
            </label>
            <div className="flex gap-2">
              <Input
                type="url"
                value={previousSiteUrl}
                onChange={(e) => setPreviousSiteUrl(e.target.value)}
                placeholder="https://old-site.com"
                className="flex-1"
              />
              {previousSiteUrl && (
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => window.open(previousSiteUrl, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
            {previousSiteChanged && (
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  size="sm"
                  onClick={handleSavePreviousSite}
                  disabled={savingPreviousSite}
                >
                  {savingPreviousSite ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPreviousSiteUrl(originalPreviousSiteUrl)}
                  disabled={savingPreviousSite}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Reference Links */}
          {assets.filter(a => a.type === "reference_link").length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                Reference Links
              </h4>
              <div className="space-y-2">
                {assets.filter(a => a.type === "reference_link").map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{asset.title || "Link"}</p>
                        <a
                          href={asset.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline truncate block"
                        >
                          {asset.url}
                        </a>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => window.open(asset.url || "", "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-red-600"
                        onClick={() => handleDeleteAsset(asset.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reference Screenshots */}
          {assets.filter(a => a.type === "screenshot").length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <FileImage className="h-4 w-4 text-muted-foreground" />
                Reference Screenshots
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {assets.filter(a => a.type === "screenshot").map((asset) => (
                  <div
                    key={asset.id}
                    className="group relative aspect-video rounded-lg overflow-hidden border bg-muted"
                  >
                    {asset.url ? (
                      <img
                        src={asset.url}
                        alt={asset.title || "Screenshot"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => window.open(asset.url || "", "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8"
                        onClick={() => handleDeleteAsset(asset.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {asset.title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-xs text-white truncate">{asset.title}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!previousSiteUrl && assets.filter(a => ["reference_link", "screenshot"].includes(a.type)).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No previous website or references added yet</p>
              <p className="text-xs mt-1">Add the client's current website URL, reference links, or upload screenshots of their existing site</p>
            </div>
          )}
        </CardContent>
      </Card>


      <div className="grid gap-6 lg:grid-cols-2">
        {/* 4. Project Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="quote_sent">Quote Sent</SelectItem>
                  <SelectItem value="quote_accepted">Quote Accepted</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-start gap-3">
              <Timer className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">
                  {formatDuration(project.created_at, endDate || null)}
                  {!endDate && (
                    <span className="text-emerald-600 dark:text-emerald-400 ml-1">(ongoing)</span>
                  )}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Meeting Time</p>
                <p className="text-sm text-muted-foreground">
                  {project.meeting_time
                    ? new Date(project.meeting_time).toLocaleString()
                    : "Not scheduled"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(project.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Archive/Restore button */}
            <div className="pt-4 border-t">
              {status === "canceled" ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  onClick={handleRestoreProject}
                  disabled={archiving}
                >
                  {archiving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArchiveRestore className="h-4 w-4" />
                  )}
                  Restore Project
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setArchiveDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Archive Project
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 5. Contact Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Name</p>
                <CopyableField value={contact?.name || ""}>
                  <p className="text-sm text-muted-foreground">
                    {contact?.name || "N/A"}
                  </p>
                </CopyableField>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Email</p>
                <CopyableField value={contact?.email || ""}>
                  {contact?.email ? (
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {contact.email}
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">N/A</p>
                  )}
                </CopyableField>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Phone</p>
                <CopyableField value={contact?.phone || ""}>
                  <p className="text-sm text-muted-foreground">
                    {contact?.phone || "N/A"}
                  </p>
                </CopyableField>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Company</p>
                <CopyableField value={contact?.company || ""}>
                  <p className="text-sm text-muted-foreground">
                    {contact?.company || "N/A"}
                  </p>
                </CopyableField>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Team */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Project Team
            </CardTitle>
            <div className="flex gap-2">
              <Dialog open={inviteDialogOpen} onOpenChange={(open) => {
                setInviteDialogOpen(open)
                if (!open) {
                  setInviteEmail("")
                  setInviteName("")
                  setInviteError("")
                  setInviteSuccess(false)
                }
              }}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Send className="h-4 w-4" />
                    Invite Customer
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Invite Customer to Project</DialogTitle>
                    <DialogDescription>
                      Send an invitation email to a new customer. They will be added to this project once they accept.
                    </DialogDescription>
                  </DialogHeader>
                  {inviteSuccess ? (
                    <div className="py-8 text-center">
                      <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                        <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <p className="text-lg font-medium">Invitation Sent!</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {inviteEmail} will receive an email invitation
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 py-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Email Address *</label>
                          <Input
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="customer@example.com"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Name (optional)</label>
                          <Input
                            value={inviteName}
                            onChange={(e) => setInviteName(e.target.value)}
                            placeholder="Customer name"
                          />
                        </div>
                        {inviteError && (
                          <p className="text-sm text-red-500">{inviteError}</p>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setInviteDialogOpen(false)} disabled={inviting}>
                          Cancel
                        </Button>
                        <Button onClick={handleInviteCustomer} disabled={!inviteEmail.trim() || inviting} className="gap-2">
                          {inviting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          {inviting ? "Sending..." : "Send Invitation"}
                        </Button>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>
              <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add Member
                  </Button>
                </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Team Member</DialogTitle>
                  <DialogDescription>
                    Add a customer or viewer to this project. They must have an existing account.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email Address</label>
                    <Input
                      type="email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      placeholder="user@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Role</label>
                    <Select value={newMemberRole} onValueChange={(v) => setNewMemberRole(v as "owner" | "viewer")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">Customer (Owner)</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {newMemberRole === "owner"
                        ? "The main customer who can view and respond to quotes"
                        : "Additional users who can view the project"}
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddMemberDialogOpen(false)} disabled={addingMember}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddMember} disabled={!newMemberEmail.trim() || addingMember}>
                    {addingMember ? "Adding..." : "Add Member"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Assigned Admin */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-amber-500" />
              Assigned Admin
            </h4>
            {assignedAdmin ? (
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{assignedAdmin.name}</p>
                    <p className="text-xs text-muted-foreground">{assignedAdmin.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMember(assignedAdmin.id, "admin")}
                  className="text-muted-foreground hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => currentUserEmail && handleAssignAdmin(currentUserEmail)}
                disabled={!currentUserEmail}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Assign myself
              </Button>
            )}
          </div>

          {/* Customer (Owner) */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Crown className="h-4 w-4 text-emerald-500" />
              Customer (Owner)
            </h4>
            {members.filter(m => m.role === "owner").length > 0 ? (
              <div className="space-y-2">
                {members.filter(m => m.role === "owner").map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Crown className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member.user.name}</p>
                        <p className="text-xs text-muted-foreground">{member.user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.user_id, "owner")}
                      className="text-muted-foreground hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No customer assigned</p>
            )}
          </div>

          {/* Viewers */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-500" />
              Viewers
            </h4>
            {members.filter(m => m.role === "viewer").length > 0 ? (
              <div className="space-y-2">
                {members.filter(m => m.role === "viewer").map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member.user.name}</p>
                        <p className="text-xs text-muted-foreground">{member.user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.user_id, "viewer")}
                      className="text-muted-foreground hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No viewers added</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {activityLog.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No activity yet
            </p>
          ) : (
            <div className="space-y-4">
              {activityLog.map((activity, index) => {
                const isClickable = activity.action === "quote_sent" || activity.action === "quote_created"
                return (
                  <div
                    key={activity.id}
                    className={`flex gap-4 ${
                      index !== activityLog.length - 1 ? "pb-4 border-b" : ""
                    } ${isClickable ? "cursor-pointer hover:bg-muted/50 rounded-lg -mx-2 px-2 py-1 transition-colors" : ""}`}
                    onClick={isClickable ? () => handleActivityClick(activity) : undefined}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`h-2 w-2 rounded-full mt-2 ${
                        activity.action === "notes_updated" || activity.action === "requirements_updated"
                          ? "bg-blue-500"
                          : activity.action === "status_changed"
                          ? "bg-yellow-500"
                          : activity.action === "quote_sent" || activity.action === "quote_created"
                          ? "bg-emerald-500"
                          : activity.action === "invoice_paid"
                          ? "bg-green-500"
                          : "bg-primary"
                      }`} />
                      {index !== activityLog.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1 pt-0.5">
                      <p className="text-sm font-medium flex items-center gap-2">
                        {activity.action === "notes_updated" || activity.action === "requirements_updated" ? "Requirements Updated" :
                         activity.action === "status_changed" ? "Status Changed" :
                         activity.action === "quote_sent" ? "Quote Sent" :
                         activity.action === "quote_created" ? "Quote Created" :
                         activity.action === "invoice_paid" ? "Invoice Paid" :
                         activity.action}
                        {isClickable && (
                          <span className="text-xs text-muted-foreground">(click to preview)</span>
                        )}
                      </p>
                      {activity.details && (
                        <p className="text-sm text-muted-foreground">
                          {typeof activity.details === 'string'
                            ? activity.details
                            : JSON.stringify(activity.details)}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Preview Dialog */}
      <Dialog open={emailPreviewOpen} onOpenChange={setEmailPreviewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Quote Email Preview
            </DialogTitle>
            <DialogDescription>
              This is how the quote email would appear to the customer.
            </DialogDescription>
          </DialogHeader>
          {previewQuote && (
            <div className="border rounded-lg p-6 bg-white dark:bg-zinc-900 space-y-4">
              <div className="border-b pb-4">
                <p className="text-sm text-muted-foreground">To: {contact?.email || "No email"}</p>
                <p className="text-sm text-muted-foreground">From: jamie@jamiegray.net</p>
                <p className="text-sm font-medium mt-2">Subject: Quote for {previewQuote.title}</p>
              </div>
              <div className="space-y-4">
                <p>Hi {contact?.name || "there"},</p>
                <p>Thank you for your interest in my web development services. Please find your quote details below:</p>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="font-semibold text-lg">{previewQuote.title}</p>
                  {previewQuote.description && (
                    <p className="text-sm text-muted-foreground">{previewQuote.description}</p>
                  )}
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(previewQuote.amount)}
                  </p>
                  {previewQuote.valid_until && (
                    <p className="text-sm text-muted-foreground">
                      Valid until: {new Date(previewQuote.valid_until).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <p>If you have any questions or would like to proceed, please don&apos;t hesitate to reach out.</p>
                <p>Best regards,<br />Jamie Gray</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailPreviewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice Creation Dialog */}
      <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription>
              Create an invoice for this project. You can save it as a draft or send it immediately via Stripe.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Amount *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(e.target.value)}
                  placeholder="0"
                  className="pl-7"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description (optional)</label>
              <Textarea
                value={invoiceDescription}
                onChange={(e) => setInvoiceDescription(e.target.value)}
                placeholder="e.g., Website development - Phase 1"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => handleCreateInvoice(false)}
              disabled={!invoiceAmount || creatingInvoice}
            >
              {creatingInvoice ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Save as Draft
            </Button>
            <Button
              onClick={() => handleCreateInvoice(true)}
              disabled={!invoiceAmount || creatingInvoice || !contact?.email}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400"
              title={!contact?.email ? "No email address available for this customer" : undefined}
            >
              {creatingInvoice ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {!contact?.email ? "Requires Email" : "Send Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Project Dialog */}
      <Dialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Archive Project
            </DialogTitle>
            <DialogDescription>
              This will cancel the project and hide it from the main list. The client will see the project as canceled with your reason. You can restore it later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Reason for archiving <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={archiveReason}
                onChange={(e) => setArchiveReason(e.target.value)}
                placeholder="e.g., Client unresponsive, Project scope changed, Budget constraints..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                This reason will be visible to the client
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setArchiveDialogOpen(false)
                setArchiveReason("")
              }}
              disabled={archiving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleArchiveProject}
              disabled={archiving || !archiveReason.trim()}
              className="gap-2"
            >
              {archiving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Archive Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Landing Page Status */}
      <LandingPageStatusCard
        projectId={projectId}
        metadata={{
          show_on_landing_page: project.show_on_landing_page,
          customer_opted_out_of_landing_page: project.customer_opted_out_of_landing_page,
        }}
        onToggle={async (enabled) => {
          const response = await fetch(`/api/admin/projects/${projectId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ show_on_landing_page: enabled }),
          })
          if (response.ok) {
            fetchProject()
          }
        }}
      />
    </div>
  )
}
