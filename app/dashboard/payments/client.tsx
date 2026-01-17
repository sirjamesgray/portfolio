"use client"

import { Card, CardContent } from "@/components/ui/card"
import { DashboardButton } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Receipt, ExternalLink, Download, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { MobileBackButton } from "@/components/dashboard/mobile-back-button"

type Invoice = {
  id: string
  project_id: string
  amount: number
  status: string
  due_date: string | null
  invoice_url: string | null
  invoice_pdf: string | null
  created_at: string
  project_title: string | null
}

interface PaymentsClientProps {
  invoices: Invoice[]
}

function getStatusInfo(status: string) {
  switch (status) {
    case "paid":
      return {
        label: "Paid",
        variant: "default" as const,
        icon: CheckCircle2,
        color: "text-emerald-500",
      }
    case "sent":
      return {
        label: "Awaiting Payment",
        variant: "secondary" as const,
        icon: Clock,
        color: "text-yellow-500",
      }
    case "overdue":
      return {
        label: "Overdue",
        variant: "destructive" as const,
        icon: AlertCircle,
        color: "text-red-500",
      }
    case "draft":
      return {
        label: "Draft",
        variant: "outline" as const,
        icon: Receipt,
        color: "text-muted-foreground",
      }
    case "canceled":
      return {
        label: "Canceled",
        variant: "outline" as const,
        icon: Receipt,
        color: "text-muted-foreground",
      }
    default:
      return {
        label: status,
        variant: "outline" as const,
        icon: Receipt,
        color: "text-muted-foreground",
      }
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const statusInfo = getStatusInfo(invoice.status)
  const StatusIcon = statusInfo.icon
  const isPending = invoice.status === "sent" || invoice.status === "overdue"

  return (
      <Card className={cn(
        "bg-card",
        invoice.status === "canceled" && "opacity-60"
      )}>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Left side - Invoice info */}
            <div className="flex items-start gap-3">
              <div className={cn("rounded-lg p-2 bg-muted", statusInfo.color)}>
                <StatusIcon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">
                    {formatCurrency(invoice.amount)}
                  </span>
                  <Badge variant={statusInfo.variant}>
                    {statusInfo.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {invoice.project_title || "Project"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {invoice.due_date
                    ? `Due ${formatDate(invoice.due_date)}`
                    : `Created ${formatDate(invoice.created_at)}`}
                </p>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-2 sm:flex-shrink-0">
              {isPending && invoice.invoice_url && (
                <DashboardButton
                  asChild
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <a href={invoice.invoice_url} target="_blank" rel="noopener noreferrer">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Now
                  </a>
                </DashboardButton>
              )}
              {invoice.invoice_url && (
                <DashboardButton variant="outline" size="icon" asChild>
                  <a href={invoice.invoice_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </DashboardButton>
              )}
              {invoice.invoice_pdf && (
                <DashboardButton variant="outline" size="icon" asChild>
                  <a href={invoice.invoice_pdf} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" />
                  </a>
                </DashboardButton>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
  )
}

export function PaymentsClient({ invoices }: PaymentsClientProps) {
  const pendingInvoices = invoices.filter(i => i.status === "sent" || i.status === "overdue")
  const paidInvoices = invoices.filter(i => i.status === "paid")
  const otherInvoices = invoices.filter(i => !["sent", "overdue", "paid"].includes(i.status))

  const totalPending = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0)
  const totalPaid = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0)

  if (invoices.length === 0) {
    return (
      <div className="space-y-6">
        <MobileBackButton />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
            <p className="text-muted-foreground">
              View your invoices and payment history
            </p>
          </div>

          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <Receipt className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No Invoices Yet</h2>
                <p className="text-muted-foreground max-w-md">
                  Once you accept a quote, your invoice will appear here. You&apos;ll be able to pay securely online and download receipts.
                </p>
              </div>
            </CardContent>
          </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <MobileBackButton />
      {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">
            View your invoices and payment history
          </p>
        </div>

      {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg p-2 bg-yellow-500/10 text-yellow-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalPending)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg p-2 bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paid</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalPaid)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Pending Invoices */}
      {pendingInvoices.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Action Required</h2>
          {pendingInvoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      )}

      {/* Paid Invoices */}
      {paidInvoices.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Payment History</h2>
          {paidInvoices.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
            />
          ))}
        </div>
      )}

      {/* Other Invoices (draft, canceled) */}
      {otherInvoices.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-muted-foreground">Other</h2>
          {otherInvoices.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
            />
          ))}
        </div>
      )}
    </div>
  )
}
