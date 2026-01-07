"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BlurFade } from "@/components/ui/blur-fade"
import { ProjectProgress } from "@/components/dashboard/project-progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  ExternalLink,
  Github,
  Check,
  X,
  FileText,
  CreditCard,
  Pencil,
  Loader2,
  Mail,
  RotateCcw,
  Globe,
  Circle,
  AlertCircle,
  Lock,
} from "lucide-react"
import { SITE_CONFIG, formatProjectType } from "@/lib/constants"

type Quote = {
  id: string
  title: string
  description: string | null
  amount: number
  status: string
  valid_until: string | null
  line_items: unknown[]
  created_at: string
}

type Invoice = {
  id: string
  amount: number
  amount_paid: number
  status: string
  due_date: string | null
  invoice_url: string | null
  created_at: string
}

type Project = {
  id: string
  title: string | null
  description: string | null
  project_type: string | null
  status: string
  price: number | null
  amount_paid: number | null
  budget: string | null
  timeline: string | null
  github_url: string | null
  vercel_url: string | null
  created_at: string
  end_date: string | null
  user_id: string | null
  requirements: string | null
  requirements_updated_at: string | null
  cancellation_reason: string | null
}

interface ProjectDetailClientProps {
  project: Project
  quotes: Quote[]
  invoices: Invoice[]
}

function getInvoiceStatusColor(status: string) {
  switch (status) {
    case "draft":
      return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    case "pending":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "paid":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    case "overdue":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    case "canceled":
      return "bg-gray-500/10 text-gray-500 border-gray-500/20"
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

function formatCurrency(amount: number | null) {
  if (amount === null || amount === undefined) return "$0"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatBudget(budget: string | null) {
  if (!budget) return "Not specified"
  const budgetMap: Record<string, string> = {
    "under-5k": "Under $5,000",
    "5k-10k": "$5,000 - $10,000",
    "10k-25k": "$10,000 - $25,000",
    "25k-plus": "$25,000+",
    "not-sure": "To be determined",
  }
  return budgetMap[budget] || budget
}

function formatTimeline(timeline: string | null) {
  if (!timeline) return "Not specified"
  const timelineMap: Record<string, string> = {
    "asap": "ASAP",
    "1-month": "1 Month",
    "2-3-months": "2-3 Months",
    "flexible": "Flexible",
  }
  return timelineMap[timeline] || timeline
}

export function ProjectDetailClient({
  project,
  quotes,
  invoices,
}: ProjectDetailClientProps) {
  const router = useRouter()
  const [respondingQuoteId, setRespondingQuoteId] = useState<string | null>(null)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectingQuote, setRejectingQuote] = useState<Quote | null>(null)
  const [rejectMessage, setRejectMessage] = useState("")

  // Editable title state
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(project.title || "")
  const [originalTitle, setOriginalTitle] = useState(project.title || "")
  const [isSavingTitle, setIsSavingTitle] = useState(false)

  // Editable requirements state
  const [isEditingRequirements, setIsEditingRequirements] = useState(false)
  const [requirementsValue, setRequirementsValue] = useState(project.requirements || "")
  const [originalRequirements, setOriginalRequirements] = useState(project.requirements || "")
  const [isSavingRequirements, setIsSavingRequirements] = useState(false)

  const price = project.price || 0
  const paid = project.amount_paid || 0
  const owed = price - paid
  const projectName = project.title || `${formatProjectType(project.project_type)} Project`

  // Get pending quotes that need action
  const pendingQuotes = quotes.filter((q) => q.status === "sent")

  // Calculate progress state
  const hasQuote = quotes.length > 0
  const quoteAccepted = quotes.some((q) => q.status === "accepted")
  const quoteRejected = quotes.some((q) => q.status === "rejected")
  const hasPaid = paid > 0 || invoices.some((i) => i.status === "paid")
  const hasDeliverables = Boolean(project.github_url || project.vercel_url)

  // Project stage for progressive disclosure
  const isEarlyStage = !hasQuote && (project.status === "lead" || project.status === "contacted")
  const isAwaitingQuoteResponse = pendingQuotes.length > 0
  const isActiveProject = quoteAccepted || project.status === "in_progress"
  const showPayments = quoteAccepted || hasPaid || invoices.length > 0
  const showDeliverables = isActiveProject || hasDeliverables

  const hasTitleChanges = titleValue !== originalTitle
  const hasRequirementsChanges = requirementsValue !== originalRequirements

  async function handleQuoteResponse(quoteId: string, action: "accept" | "reject", message?: string) {
    setRespondingQuoteId(quoteId)
    try {
      const response = await fetch(`/api/quotes/${quoteId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, message }),
      })

      if (response.ok) {
        setRejectDialogOpen(false)
        setRejectingQuote(null)
        setRejectMessage("")
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to respond to quote")
      }
    } catch {
      alert("An error occurred. Please try again.")
    } finally {
      setRespondingQuoteId(null)
    }
  }

  function openRejectDialog(quote: Quote) {
    setRejectingQuote(quote)
    setRejectMessage("")
    setRejectDialogOpen(true)
  }

  async function handleConfirmReject() {
    if (!rejectingQuote) return
    await handleQuoteResponse(rejectingQuote.id, "reject", rejectMessage)
  }

  async function handleSaveTitle() {
    if (!hasTitleChanges) return
    setIsSavingTitle(true)
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: titleValue }),
      })

      if (response.ok) {
        setOriginalTitle(titleValue)
        setIsEditingTitle(false)
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to save changes")
      }
    } catch {
      alert("An error occurred. Please try again.")
    } finally {
      setIsSavingTitle(false)
    }
  }

  function handleRevertTitle() {
    setTitleValue(originalTitle)
    setIsEditingTitle(false)
  }

  async function handleSaveRequirements() {
    if (!hasRequirementsChanges) return
    setIsSavingRequirements(true)
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirements: requirementsValue }),
      })

      if (response.ok) {
        setOriginalRequirements(requirementsValue)
        setIsEditingRequirements(false)
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to save changes")
      }
    } catch {
      alert("An error occurred. Please try again.")
    } finally {
      setIsSavingRequirements(false)
    }
  }

  function handleRevertRequirements() {
    setRequirementsValue(originalRequirements)
    setIsEditingRequirements(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <BlurFade delay={0.1}>
        <div className="flex items-start gap-4">
          {/* Back button - hidden on mobile since MobileLayout provides one */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="shrink-0 hidden md:flex mt-6"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1 flex-1">
            {/* Project Name Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Project name
              </label>
              {isEditingTitle ? (
                <div className="space-y-2">
                  <Input
                    value={titleValue}
                    onChange={(e) => setTitleValue(e.target.value)}
                    placeholder="Enter project name"
                    className="text-xl font-bold h-10 px-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveTitle}
                      disabled={!hasTitleChanges || isSavingTitle}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {isSavingTitle ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      <span className="ml-1">Save</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRevertTitle}
                      disabled={isSavingTitle}
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span className="ml-1">Cancel</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <h1 className="text-2xl font-bold tracking-tight">{projectName}</h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setIsEditingTitle(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <p className="text-muted-foreground">
              Started {new Date(project.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </BlurFade>

      {/* Progress Tracker */}
      <BlurFade delay={0.12}>
        <Card>
          <CardContent className="pt-6">
            <ProjectProgress
              status={project.status}
              hasQuote={hasQuote}
              quoteAccepted={quoteAccepted}
              quoteRejected={quoteRejected}
              hasPaid={hasPaid}
              hasDeliverables={hasDeliverables}
            />
          </CardContent>
        </Card>
      </BlurFade>

      {/* Canceled Project Notice */}
      {project.status === "canceled" && project.cancellation_reason && (
        <BlurFade delay={0.13}>
          <Card className="border-red-500/50 bg-red-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-medium text-red-600 dark:text-red-400">
                    Project Canceled
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.cancellation_reason}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    If you have questions, please{" "}
                    <a
                      href={`mailto:${SITE_CONFIG.email}`}
                      className="text-primary hover:underline"
                    >
                      contact {SITE_CONFIG.name}
                    </a>
                    .
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </BlurFade>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
        {/* Main Column */}
        <div className="space-y-6">
          {/* Pending Quotes - Action Required (Priority) */}
          {pendingQuotes.length > 0 && (
            <BlurFade delay={0.15}>
              <Card className="border-yellow-500/50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                    <FileText className="h-4 w-4" />
                    Quote Pending Your Response
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingQuotes.map((quote) => (
                    <div key={quote.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{quote.title}</h4>
                          {quote.description && (
                            <p className="text-sm text-muted-foreground mt-1">{quote.description}</p>
                          )}
                        </div>
                        <p className="text-lg font-bold">{formatCurrency(quote.amount)}</p>
                      </div>
                      {quote.valid_until && (
                        <p className="text-xs text-muted-foreground">
                          Valid until {new Date(quote.valid_until).toLocaleDateString()}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                          size="sm"
                          disabled={respondingQuoteId === quote.id}
                          onClick={() => handleQuoteResponse(quote.id, "accept")}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {respondingQuoteId === quote.id ? "Processing..." : "Accept Quote"}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 text-red-600 hover:text-red-700"
                          size="sm"
                          disabled={respondingQuoteId === quote.id}
                          onClick={() => openRejectDialog(quote)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </BlurFade>
          )}

          {/* Deliverables - Only show for active projects or when deliverables exist */}
          {showDeliverables && (
            <BlurFade delay={0.18}>
              <Card className={!hasPaid ? "border-amber-500/30 bg-amber-500/5" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      {!hasPaid && <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
                      Deliverables
                    </CardTitle>
                    {!hasPaid && (
                      <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                        Locked
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!hasPaid ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Deliverables will be unlocked after your first payment is received.
                      </p>
                      <div className="space-y-2 opacity-50">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Github className="h-4 w-4" />
                          <span>GitHub repository</span>
                          <Lock className="h-3 w-3 ml-auto" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Globe className="h-4 w-4" />
                          <span>Live site URL</span>
                          <Lock className="h-3 w-3 ml-auto" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* GitHub Repository */}
                      {project.github_url ? (
                        <Link
                          href={project.github_url}
                          target="_blank"
                          className="flex items-center gap-2 text-sm text-foreground hover:text-emerald-600 transition-colors"
                        >
                          <Github className="h-4 w-4" />
                          <span className="truncate">{project.github_url}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </Link>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Circle className="h-4 w-4" />
                          <span>GitHub repository</span>
                          <span className="text-xs text-muted-foreground/60 ml-auto">Coming soon</span>
                        </div>
                      )}

                      {/* Live Site */}
                      {project.vercel_url ? (
                        <Link
                          href={project.vercel_url}
                          target="_blank"
                          className="flex items-center gap-2 text-sm text-foreground hover:text-emerald-600 transition-colors"
                        >
                          <Globe className="h-4 w-4" />
                          <span className="truncate">{project.vercel_url}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </Link>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Circle className="h-4 w-4" />
                          <span>Live site URL</span>
                          <span className="text-xs text-muted-foreground/60 ml-auto">Coming soon</span>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </BlurFade>
          )}

          {/* Project Requirements - Editable */}
          <BlurFade delay={0.2}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Project Requirements</CardTitle>
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
              <CardContent>
                {isEditingRequirements ? (
                  <div className="space-y-3">
                    <Textarea
                      value={requirementsValue}
                      onChange={(e) => setRequirementsValue(e.target.value)}
                      placeholder="Describe the project requirements, goals, and any specific features needed..."
                      className="min-h-[200px] px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveRequirements}
                        disabled={!hasRequirementsChanges || isSavingRequirements}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {isSavingRequirements ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        <span className="ml-1">Save</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleRevertRequirements}
                        disabled={isSavingRequirements}
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span className="ml-1">Cancel</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {requirementsValue ? (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{requirementsValue}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No requirements added yet. Click Edit to add project requirements.
                      </p>
                    )}
                    {project.requirements_updated_at && (
                      <p className="text-xs text-muted-foreground/70 mt-3">
                        Last updated {new Date(project.requirements_updated_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </BlurFade>

          {/* Contact Jamie */}
          <BlurFade delay={0.25}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact {SITE_CONFIG.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <a href={`mailto:${SITE_CONFIG.email}`}>
                    <Button variant="outline" className="gap-2">
                      <Mail className="h-4 w-4" />
                      Email {SITE_CONFIG.name.split(" ")[0]}
                    </Button>
                  </a>
                  {/* Only show schedule button if not already shown in Next Steps */}
                  {!isEarlyStage && (
                    <a href={SITE_CONFIG.calendly} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Schedule a call
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        </div>

        {/* Right Sidebar - Project Info */}
        <div className="space-y-6 order-first lg:order-last">
          {/* Next Steps - Early Stage Projects (Priority CTA) */}
          {isEarlyStage && (
            <BlurFade delay={0.14}>
              <Card className="border-emerald-500/50 bg-emerald-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Next Step
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Schedule a consultation to discuss your project and receive a quote.
                  </p>
                  <a href={SITE_CONFIG.calendly} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700" size="sm">
                      <Calendar className="h-4 w-4" />
                      Schedule Consultation
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </BlurFade>
          )}

          {/* Project Details */}
          <BlurFade delay={0.15}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">{formatProjectType(project.project_type)}</span>
                </div>
                {project.budget && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium">{formatBudget(project.budget)}</span>
                  </div>
                )}
                {project.timeline && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Timeline</span>
                    <span className="font-medium">{formatTimeline(project.timeline)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </BlurFade>

          {/* Pricing & Payments - Only show after quote accepted or payment made */}
          {showPayments ? (
            <BlurFade delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Total Price</p>
                      <p className="font-bold">{formatCurrency(price)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Amount Paid</p>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(paid)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Amount Owed</p>
                      <p className={`font-bold ${owed > 0 ? "text-orange-600 dark:text-orange-400" : "text-muted-foreground"}`}>
                        {formatCurrency(owed)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </BlurFade>
          ) : (
            <BlurFade delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {isAwaitingQuoteResponse
                      ? "Review and accept the quote above to see payment details."
                      : "Schedule a consultation to discuss your project and receive a quote."}
                  </p>
                </CardContent>
              </Card>
            </BlurFade>
          )}

          {/* Invoices */}
          {invoices.length > 0 && (
            <BlurFade delay={0.25}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Invoices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {invoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Badge className={getInvoiceStatusColor(invoice.status)}>
                            {formatStatus(invoice.status)}
                          </Badge>
                          <div>
                            <p className="font-medium text-sm">{formatCurrency(invoice.amount)}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(invoice.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {invoice.invoice_url && invoice.status !== "paid" && (
                          <Link href={invoice.invoice_url} target="_blank">
                            <Button size="sm" variant="outline">
                              Pay
                            </Button>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </BlurFade>
          )}
        </div>
      </div>

      {/* Reject Quote Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Quote</DialogTitle>
            <DialogDescription>
              Are you sure you want to decline this quote for {rejectingQuote && formatCurrency(rejectingQuote.amount)}?
              You can optionally provide feedback.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Optional: Let us know why you're declining or what changes would make this quote work for you..."
              value={rejectMessage}
              onChange={(e) => setRejectMessage(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={respondingQuoteId !== null}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={respondingQuoteId !== null}
            >
              {respondingQuoteId !== null ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Declining...
                </>
              ) : (
                "Decline Quote"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
