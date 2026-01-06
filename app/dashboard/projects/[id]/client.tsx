"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BlurFade } from "@/components/ui/blur-fade"
import { ProjectChat } from "@/components/dashboard/project-chat"
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Clock,
  ExternalLink,
  Github,
  Check,
  X,
  FileText,
  CreditCard,
} from "lucide-react"

type Quote = {
  id: string
  title: string
  description: string | null
  amount: number
  status: string
  valid_until: string | null
  line_items: any[]
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
}

interface ProjectDetailClientProps {
  project: Project
  quotes: Quote[]
  invoices: Invoice[]
  currentUserId: string
  isAdmin: boolean
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

function getQuoteStatusColor(status: string) {
  switch (status) {
    case "draft":
      return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    case "sent":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    case "accepted":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
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

function formatProjectType(type: string | null) {
  if (!type) return "Project"
  const labels: Record<string, string> = {
    website: "Website",
    webapp: "Web App",
    ecommerce: "E-commerce",
    other: "Other",
  }
  return labels[type] || type
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

export function ProjectDetailClient({
  project,
  quotes,
  invoices,
  currentUserId,
  isAdmin,
}: ProjectDetailClientProps) {
  const router = useRouter()
  const [respondingQuoteId, setRespondingQuoteId] = useState<string | null>(null)
  const price = project.price || 0
  const paid = project.amount_paid || 0
  const owed = price - paid
  const projectName = project.title || `${formatProjectType(project.project_type)} Project`

  // Get pending quotes that need action
  const pendingQuotes = quotes.filter((q) => q.status === "sent")

  async function handleQuoteResponse(quoteId: string, action: "accept" | "reject") {
    setRespondingQuoteId(quoteId)
    try {
      const response = await fetch(`/api/quotes/${quoteId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to respond to quote")
      }
    } catch (error) {
      alert("An error occurred. Please try again.")
    } finally {
      setRespondingQuoteId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <BlurFade delay={0.1}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{projectName}</h1>
              <p className="text-muted-foreground">
                Started {new Date(project.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Badge className={`${getStatusColor(project.status)} shrink-0`}>
            {formatStatus(project.status)}
          </Badge>
        </div>
      </BlurFade>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Project Info */}
        <div className="space-y-6">
          {/* Project Overview */}
          <BlurFade delay={0.15}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Project Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.description && (
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{formatProjectType(project.project_type)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={getStatusColor(project.status)} variant="outline">
                      {formatStatus(project.status)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </BlurFade>

          {/* Pricing & Payments */}
          <BlurFade delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Pricing & Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="text-xl font-bold">{formatCurrency(price)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount Paid</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(paid)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount Owed</p>
                    <p className={`text-xl font-bold ${owed > 0 ? "text-orange-600 dark:text-orange-400" : "text-muted-foreground"}`}>
                      {formatCurrency(owed)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </BlurFade>

          {/* Pending Quotes - Action Required */}
          {pendingQuotes.length > 0 && (
            <BlurFade delay={0.25}>
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
                          onClick={() => handleQuoteResponse(quote.id, "reject")}
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

          {/* Deliverables */}
          {(project.github_url || project.vercel_url) && (
            <BlurFade delay={0.3}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Deliverables</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.github_url && (
                    <Link
                      href={project.github_url}
                      target="_blank"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span className="truncate">{project.github_url}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </Link>
                  )}
                  {project.vercel_url && (
                    <Link
                      href={project.vercel_url}
                      target="_blank"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="truncate">{project.vercel_url}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </Link>
                  )}
                </CardContent>
              </Card>
            </BlurFade>
          )}

          {/* Invoices */}
          {invoices.length > 0 && (
            <BlurFade delay={0.35}>
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
                            <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(invoice.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {invoice.invoice_url && invoice.status !== "paid" && (
                          <Link href={invoice.invoice_url} target="_blank">
                            <Button size="sm" variant="outline">
                              Pay Now
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

        {/* Right Column - Chat */}
        <BlurFade delay={0.2}>
          <ProjectChat
            projectId={project.id}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
          />
        </BlurFade>
      </div>
    </div>
  )
}
