"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectProgress } from "@/components/dashboard/project-progress"
import { RichTextEditor } from "@/components/dashboard/rich-text-editor"
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
  Github,
  ExternalLink,
  DollarSign,
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

function getStatusColor(status: string) {
  switch (status) {
    case "lead":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "contacted":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    case "in_progress":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    case "completed":
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
  const [price, setPrice] = useState("")
  const [amountPaid, setAmountPaid] = useState("")
  const [endDate, setEndDate] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [vercelUrl, setVercelUrl] = useState("")

  // Track original values for contextual save
  const [originalTitle, setOriginalTitle] = useState("")
  const [originalRequirements, setOriginalRequirements] = useState("")
  const [originalStatus, setOriginalStatus] = useState("")
  const [originalPrice, setOriginalPrice] = useState("")
  const [originalAmountPaid, setOriginalAmountPaid] = useState("")
  const [originalEndDate, setOriginalEndDate] = useState("")
  const [originalGithubUrl, setOriginalGithubUrl] = useState("")
  const [originalVercelUrl, setOriginalVercelUrl] = useState("")

  // Edit modes
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingRequirements, setIsEditingRequirements] = useState(false)

  // Saving states
  const [savingTitle, setSavingTitle] = useState(false)
  const [savingRequirements, setSavingRequirements] = useState(false)

  // Change detection
  const titleChanged = title !== originalTitle
  const requirementsChanged = requirements !== originalRequirements
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

  useEffect(() => {
    fetchProject()
    fetchActivityLog()
    fetchCurrentUser()
    fetchQuotesAndInvoices()
  }, [projectId])

  async function fetchCurrentUser() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setCurrentUserId(user.id)
      setCurrentUserName(user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin")
    }
  }

  async function fetchProject() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        id,
        title,
        status,
        project_type,
        price,
        amount_paid,
        end_date,
        github_url,
        vercel_url,
        meeting_time,
        notes,
        requirements,
        requirements_updated_at,
        requirements_updated_by,
        cancellation_reason,
        created_at,
        updated_at,
        user_id,
        contacts (
          name,
          email,
          phone,
          company
        )
      `
      )
      .eq("id", projectId)
      .single()

    if (error) {
      console.error("Error fetching project:", error)
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
    const priceVal = data.price?.toString() || ""
    setPrice(priceVal)
    setOriginalPrice(priceVal)
    const amountPaidVal = data.amount_paid?.toString() || ""
    setAmountPaid(amountPaidVal)
    setOriginalAmountPaid(amountPaidVal)
    const endDateVal = data.end_date ? data.end_date.split("T")[0] : ""
    setEndDate(endDateVal)
    setOriginalEndDate(endDateVal)
    const githubVal = data.github_url || ""
    setGithubUrl(githubVal)
    setOriginalGithubUrl(githubVal)
    const vercelVal = data.vercel_url || ""
    setVercelUrl(vercelVal)
    setOriginalVercelUrl(vercelVal)
    setLoading(false)
  }

  async function fetchActivityLog() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("activity_log")
      .select("id, action, details, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching activity log:", error)
      return
    }

    setActivityLog(data || [])
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
    const supabase = createClient()
    const { data, error } = await supabase
      .from("requirements_versions")
      .select("id, content, updated_by_name, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(20)

    if (!error && data) {
      setRequirementsVersions(data)
    }
  }

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
    const supabase = createClient()
    const now = new Date().toISOString()

    const { error } = await supabase
      .from("projects")
      .update({ title: title || null, updated_at: now })
      .eq("id", projectId)

    if (error) {
      console.error("Error saving title:", error)
      setSavingTitle(false)
      return
    }

    setOriginalTitle(title)
    setIsEditingTitle(false)
    setProject({ ...project, title: title || null })
    setSavingTitle(false)
  }

  async function handleSaveRequirements() {
    if (!project || !requirementsChanged) return
    setSavingRequirements(true)
    const supabase = createClient()
    const now = new Date().toISOString()

    const { error } = await supabase
      .from("projects")
      .update({
        requirements,
        requirements_updated_at: now,
        requirements_updated_by: currentUserId,
        updated_at: now,
      })
      .eq("id", projectId)

    if (error) {
      console.error("Error saving requirements:", error)
      setSavingRequirements(false)
      return
    }

    // Save requirements version history
    if (requirements) {
      await supabase.from("requirements_versions").insert({
        project_id: projectId,
        content: requirements,
        updated_by: currentUserId,
        updated_by_name: currentUserName,
      })

      await supabase.from("activity_log").insert({
        project_id: projectId,
        action: "requirements_updated",
        details: `Requirements updated by ${currentUserName}`,
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
    setSavingRequirements(false)
  }

  async function handleViewAsCustomer() {
    if (!project?.user_id) {
      alert("This project has no assigned customer to mirror")
      return
    }

    setMirrorLoading(true)
    try {
      const response = await fetch("/api/admin/mirror", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: project.user_id,
          returnUrl: `/dashboard/admin/projects/${projectId}`,
        }),
      })

      if (response.ok) {
        router.push(`/dashboard/projects/${projectId}`)
        router.refresh()
      } else {
        alert("Failed to enter mirror mode")
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
        setStatus("lead")
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
  const priceNum = price ? parseFloat(price) : 0
  const paidNum = amountPaid ? parseFloat(amountPaid) : 0
  const owed = priceNum - paidNum

  // Progress state calculations
  const hasQuote = quotes.length > 0
  const quoteAccepted = quotes.some((q) => q.status === "accepted")
  const quoteRejected = quotes.some((q) => q.status === "rejected")
  const hasPaid = paidNum > 0 || invoices.some((i) => i.status === "paid")
  const hasDeliverables = Boolean(githubUrl || vercelUrl)

  return (
    <div className="space-y-6">
      {/* Header with Admin Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/admin/projects">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1">
            <Shield className="h-3 w-3" />
            Admin View
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewAsCustomer}
          disabled={mirrorLoading || !project?.user_id}
        >
          <Eye className="mr-2 h-4 w-4" />
          {mirrorLoading ? "Loading..." : "View as Customer"}
        </Button>
      </div>

      {/* Progress Tracker */}
      <Card>
        <CardContent className="pt-6">
          <ProjectProgress
            status={status}
            hasQuote={hasQuote}
            quoteAccepted={quoteAccepted}
            quoteRejected={quoteRejected}
            hasPaid={hasPaid}
            hasDeliverables={hasDeliverables}
          />
        </CardContent>
      </Card>

      {/* Project Title */}
      <div className="space-y-2">
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
            <a href={`mailto:${contact?.email || "contact@jamiegray.net"}`}>
              <Button variant="outline" className="gap-2">
                <Mail className="h-4 w-4" />
                Email {contact?.name || "Customer"}
              </Button>
            </a>
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
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
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
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
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

        {/* 6. Pricing Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Total Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  className="pl-7"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Amount Paid</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  placeholder="0"
                  className="pl-7"
                />
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Amount Owed</span>
                <span className={`text-lg font-bold ${owed > 0 ? "text-orange-600 dark:text-orange-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                  {formatCurrency(owed)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
    </div>
  )
}
