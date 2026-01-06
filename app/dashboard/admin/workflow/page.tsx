"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BlurFade } from "@/components/ui/blur-fade"
import {
  Calendar,
  FileText,
  Check,
  X,
  CreditCard,
  MessageCircle,
  Send,
  Code,
  Rocket,
  ArrowRight,
  ArrowDown,
  Clock,
  Mail,
  DollarSign,
  AlertCircle,
} from "lucide-react"

type WorkflowStep = {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  status: "trigger" | "action" | "decision" | "end"
  triggers?: string[]
  actions?: string[]
}

type WorkflowBranch = {
  condition: string
  steps: string[]
}

const workflowSteps: WorkflowStep[] = [
  {
    id: "calendly_booking",
    title: "Calendly Booking",
    description: "Customer books a consultation call via Calendly widget",
    icon: <Calendar className="h-5 w-5" />,
    status: "trigger",
    triggers: ["Calendly webhook fires", "Project created with status: lead"],
    actions: ["Create contact record", "Create project record", "Log activity"],
  },
  {
    id: "consultation_call",
    title: "Consultation Call",
    description: "Discovery call to understand project requirements",
    icon: <MessageCircle className="h-5 w-5" />,
    status: "action",
    actions: ["Discuss requirements", "Assess timeline", "Estimate scope"],
  },
  {
    id: "send_quote",
    title: "Send Quote",
    description: "Create and send a detailed project quote",
    icon: <FileText className="h-5 w-5" />,
    status: "action",
    triggers: ["Admin creates quote in dashboard"],
    actions: [
      "Create quote with line items",
      "Set expiration date",
      "Email quote to customer",
      "Update project status: contacted",
      "Log activity: quote_sent",
    ],
  },
  {
    id: "quote_decision",
    title: "Customer Decision",
    description: "Customer reviews and responds to quote",
    icon: <Clock className="h-5 w-5" />,
    status: "decision",
  },
  {
    id: "quote_accepted",
    title: "Quote Accepted",
    description: "Customer accepts the quote",
    icon: <Check className="h-5 w-5" />,
    status: "action",
    triggers: ["Customer clicks Accept button"],
    actions: [
      "Update quote status: accepted",
      "Set project price from quote",
      "Create Stripe invoice",
      "Email invoice to customer",
      "Update project status: in_progress",
      "Log activity: quote_accepted",
    ],
  },
  {
    id: "quote_rejected",
    title: "Quote Rejected",
    description: "Customer declines the quote",
    icon: <X className="h-5 w-5" />,
    status: "end",
    triggers: ["Customer clicks Reject button"],
    actions: [
      "Update quote status: rejected",
      "Update project status: canceled",
      "Log activity: quote_rejected",
      "Optional: Send follow-up email",
    ],
  },
  {
    id: "invoice_payment",
    title: "Invoice Payment",
    description: "Customer pays the invoice via Stripe",
    icon: <CreditCard className="h-5 w-5" />,
    status: "action",
    triggers: ["Stripe webhook: invoice.paid"],
    actions: [
      "Update invoice status: paid",
      "Update project amount_paid",
      "Log activity: payment_received",
      "Send payment confirmation email",
    ],
  },
  {
    id: "project_work",
    title: "Project Development",
    description: "Active development on the project",
    icon: <Code className="h-5 w-5" />,
    status: "action",
    actions: [
      "Regular progress updates via chat",
      "Push to GitHub repository",
      "Deploy previews to Vercel",
      "Update deliverables section",
    ],
  },
  {
    id: "project_complete",
    title: "Project Delivered",
    description: "Final delivery and handoff",
    icon: <Rocket className="h-5 w-5" />,
    status: "end",
    triggers: ["Admin marks project complete"],
    actions: [
      "Update project status: completed",
      "Set project end_date",
      "Send completion email",
      "Request testimonial",
      "Log activity: project_completed",
    ],
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case "trigger":
      return "bg-blue-500/10 text-blue-500 border-blue-500/30"
    case "action":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
    case "decision":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
    case "end":
      return "bg-purple-500/10 text-purple-500 border-purple-500/30"
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/30"
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "trigger":
      return "Trigger"
    case "action":
      return "Action"
    case "decision":
      return "Decision Point"
    case "end":
      return "End State"
    default:
      return status
  }
}

function WorkflowCard({ step, delay }: { step: WorkflowStep; delay: number }) {
  return (
    <BlurFade delay={delay}>
      <Card className={`border-2 ${getStatusColor(step.status)}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getStatusColor(step.status)}`}>
                {step.icon}
              </div>
              <div>
                <CardTitle className="text-base">{step.title}</CardTitle>
                <Badge variant="outline" className={`mt-1 text-xs ${getStatusColor(step.status)}`}>
                  {getStatusLabel(step.status)}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{step.description}</p>

          {step.triggers && step.triggers.length > 0 && (
            <div>
              <p className="text-xs font-medium text-blue-500 mb-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Triggers
              </p>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {step.triggers.map((trigger, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-blue-500 mt-0.5">-</span>
                    {trigger}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step.actions && step.actions.length > 0 && (
            <div>
              <p className="text-xs font-medium text-emerald-500 mb-1 flex items-center gap-1">
                <ArrowRight className="h-3 w-3" /> Actions
              </p>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {step.actions.map((action, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 mt-0.5">-</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </BlurFade>
  )
}

export default function WorkflowPage() {
  return (
    <div className="space-y-8">
      <BlurFade delay={0.1}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Workflow</h1>
          <p className="text-muted-foreground">
            Customer journey from booking to project delivery
          </p>
        </div>
      </BlurFade>

      {/* Legend */}
      <BlurFade delay={0.15}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded ${getStatusColor("trigger").split(" ")[0]}`} />
                <span className="text-sm text-muted-foreground">Trigger (External Event)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded ${getStatusColor("action").split(" ")[0]}`} />
                <span className="text-sm text-muted-foreground">Action (System/Manual)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded ${getStatusColor("decision").split(" ")[0]}`} />
                <span className="text-sm text-muted-foreground">Decision Point</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded ${getStatusColor("end").split(" ")[0]}`} />
                <span className="text-sm text-muted-foreground">End State</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      {/* Main Flow */}
      <div className="space-y-6">
        <BlurFade delay={0.2}>
          <h2 className="text-lg font-semibold">Main Flow</h2>
        </BlurFade>

        <div className="grid gap-4">
          {/* Step 1: Calendly Booking */}
          <WorkflowCard step={workflowSteps[0]} delay={0.25} />

          <div className="flex justify-center">
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* Step 2: Consultation Call */}
          <WorkflowCard step={workflowSteps[1]} delay={0.3} />

          <div className="flex justify-center">
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* Step 3: Send Quote */}
          <WorkflowCard step={workflowSteps[2]} delay={0.35} />

          <div className="flex justify-center">
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* Step 4: Decision Point */}
          <WorkflowCard step={workflowSteps[3]} delay={0.4} />

          {/* Decision Branches */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 justify-center">
                <Check className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-emerald-500 font-medium">Accept</span>
              </div>
              <WorkflowCard step={workflowSteps[4]} delay={0.45} />

              <div className="flex justify-center">
                <ArrowDown className="h-6 w-6 text-muted-foreground" />
              </div>

              <WorkflowCard step={workflowSteps[6]} delay={0.5} />

              <div className="flex justify-center">
                <ArrowDown className="h-6 w-6 text-muted-foreground" />
              </div>

              <WorkflowCard step={workflowSteps[7]} delay={0.55} />

              <div className="flex justify-center">
                <ArrowDown className="h-6 w-6 text-muted-foreground" />
              </div>

              <WorkflowCard step={workflowSteps[8]} delay={0.6} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 justify-center">
                <X className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-500 font-medium">Reject</span>
              </div>
              <WorkflowCard step={workflowSteps[5]} delay={0.45} />
            </div>
          </div>
        </div>
      </div>

      {/* Integration Notes */}
      <BlurFade delay={0.65}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Integration Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-sm">Calendly</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>- Webhook: invitee.created</li>
                  <li>- Webhook: invitee.canceled</li>
                  <li>- API for event details</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-purple-500" />
                  <span className="font-medium text-sm">Stripe</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>- Create customer</li>
                  <li>- Create invoice</li>
                  <li>- Webhook: invoice.paid</li>
                  <li>- Webhook: invoice.payment_failed</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium text-sm">Email (Resend)</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>- Quote notification</li>
                  <li>- Invoice notification</li>
                  <li>- Payment confirmation</li>
                  <li>- Project updates</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </BlurFade>
    </div>
  )
}
