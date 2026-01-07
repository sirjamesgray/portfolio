"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { ChevronRight, Calendar, FileText, Check, CreditCard, Code, Rocket, X, FolderKanban } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatProjectType } from "@/lib/constants"

type Quote = {
  id: string
  status: string
}

type Invoice = {
  id: string
  status: string
}

export type ProjectCardData = {
  id: string
  title: string | null
  project_type: string | null
  status: string
  created_at: string
  description: string | null
  quotes?: Quote[]
  invoices?: Invoice[]
  vercel_url?: string | null
  github_url?: string | null
  icon_url?: string | null
}

interface ProjectCardProps {
  project: ProjectCardData
  href?: string
  className?: string
}

// Progress steps
type Step = {
  id: string
  label: string
  icon: React.ReactNode
}

const steps: Step[] = [
  { id: "booked", label: "Consultation", icon: <Calendar className="h-3.5 w-3.5" /> },
  { id: "quote", label: "Quote Sent", icon: <FileText className="h-3.5 w-3.5" /> },
  { id: "accepted", label: "Accepted", icon: <Check className="h-3.5 w-3.5" /> },
  { id: "paid", label: "Payment", icon: <CreditCard className="h-3.5 w-3.5" /> },
  { id: "development", label: "Development", icon: <Code className="h-3.5 w-3.5" /> },
  { id: "delivered", label: "Delivered", icon: <Rocket className="h-3.5 w-3.5" /> },
]

// Map status to step ID
const statusToStep: Record<string, string> = {
  consultation: "booked",
  quote_sent: "quote",
  quote_accepted: "accepted",
  payment: "paid",
  development: "development",
  delivered: "delivered",
  canceled: "canceled",
}

const stepOrder = ["booked", "quote", "accepted", "paid", "development", "delivered"]

function getProjectProgress(project: ProjectCardData): { currentStep: string; completedSteps: Set<string>; isCanceled: boolean } {
  const completed = new Set<string>()
  const status = project.status
  const quoteRejected = project.quotes?.some(q => q.status === "rejected") ?? false

  const currentStepId = statusToStep[status] || "booked"
  const currentIndex = stepOrder.indexOf(currentStepId)

  // All steps before the current one are completed
  for (let i = 0; i < currentIndex; i++) {
    completed.add(stepOrder[i])
  }

  // If delivered, mark all steps as completed
  if (status === "delivered") {
    stepOrder.forEach(step => completed.add(step))
  }

  return {
    currentStep: status === "canceled" || quoteRejected ? "canceled" : currentStepId,
    completedSteps: completed,
    isCanceled: status === "canceled" || quoteRejected,
  }
}

function getCurrentStepLabel(currentStep: string): string {
  const step = steps.find(s => s.id === currentStep)
  if (!step) return "In Progress"

  switch (currentStep) {
    case "booked": return "Awaiting consultation"
    case "quote": return "Quote pending"
    case "accepted": return "Awaiting acceptance"
    case "paid": return "Awaiting payment"
    case "development": return "In development"
    case "delivered": return "Complete"
    default: return step.label
  }
}

function MiniProgressBar({ project }: { project: ProjectCardData }) {
  const { currentStep, completedSteps, isCanceled } = getProjectProgress(project)

  if (isCanceled) {
    return (
      <div className="flex items-center gap-2 text-red-500">
        <X className="h-4 w-4" />
        <span className="text-sm">Canceled</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Progress dots */}
      <div className="flex items-center gap-1">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id)
          const isCurrent = currentStep === step.id

          return (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  isCompleted && "bg-emerald-500",
                  isCurrent && "bg-emerald-500 ring-2 ring-emerald-500/30",
                  !isCompleted && !isCurrent && "bg-muted-foreground/20"
                )}
              />
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-3",
                    isCompleted && completedSteps.has(steps[index + 1].id) ? "bg-emerald-500" : "bg-muted-foreground/20"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
      {/* Current step label */}
      <p className="text-xs text-muted-foreground">{getCurrentStepLabel(currentStep)}</p>
    </div>
  )
}

export function ProjectCard({ project, href, className }: ProjectCardProps) {
  const router = useRouter()
  const { isCanceled } = getProjectProgress(project)
  const projectHref = href || `/dashboard/projects/${project.id}`

  return (
    <Card
      className={cn(
        "bg-card cursor-pointer hover:bg-accent/50 active:bg-muted/50 transition-colors",
        isCanceled && "opacity-60",
        className
      )}
      onClick={() => router.push(projectHref)}
    >
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
              {project.icon_url ? (
                <Image
                  src={project.icon_url}
                  alt={project.title || "Project"}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              ) : (
                <FolderKanban className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base">
                {project.title || formatProjectType(project.project_type)}
              </h3>
              {project.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {project.description}
                </p>
              )}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground/50 flex-shrink-0 ml-2" />
        </div>

        {/* Progress */}
        <MiniProgressBar project={project} />

        {/* Date */}
        <p className="text-xs text-muted-foreground/70">
          Started {new Date(project.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </div>
    </Card>
  )
}

// Re-export utilities for external use
export { getProjectProgress }
