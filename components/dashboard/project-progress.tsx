"use client"

import React, { useState } from "react"
import { Check, Calendar, FileText, CreditCard, Code, Rocket, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

type ProjectStatus = "consultation" | "quote_sent" | "quote_accepted" | "payment" | "development" | "delivered" | "canceled"

interface ProjectProgressProps {
  status: ProjectStatus | string
  quoteRejected?: boolean // Keep for backward compat - project may have rejected quote
  className?: string
}

type Step = {
  id: string
  label: string
  icon: React.ReactNode
  description: string
}

const steps: Step[] = [
  {
    id: "booked",
    label: "Consultation",
    icon: <Calendar className="h-4 w-4" />,
    description: "Discovery call scheduled",
  },
  {
    id: "quote",
    label: "Quote Sent",
    icon: <FileText className="h-4 w-4" />,
    description: "Proposal received",
  },
  {
    id: "accepted",
    label: "Quote Accepted",
    icon: <Check className="h-4 w-4" />,
    description: "Project approved",
  },
  {
    id: "paid",
    label: "Payment",
    icon: <CreditCard className="h-4 w-4" />,
    description: "Invoice paid",
  },
  {
    id: "development",
    label: "Development",
    icon: <Code className="h-4 w-4" />,
    description: "Work in progress",
  },
  {
    id: "delivered",
    label: "Delivered",
    icon: <Rocket className="h-4 w-4" />,
    description: "Project complete",
  },
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

// Order of steps for comparison
const stepOrder = ["booked", "quote", "accepted", "paid", "development", "delivered"]

function getCompletedSteps(status: string): Set<string> {
  const completed = new Set<string>()
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

  return completed
}

function getCurrentStep(status: string): string {
  if (status === "canceled") return "canceled"
  return statusToStep[status] || "booked"
}

export function ProjectProgress({
  status,
  quoteRejected = false,
  className,
}: ProjectProgressProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const completedSteps = getCompletedSteps(status)
  const currentStep = getCurrentStep(status)
  const isCanceled = status === "canceled" || quoteRejected

  // Find the next step after current
  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)
  const nextStep = currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : null

  if (isCanceled) {
    return (
      <div className={cn("p-4 rounded-lg border border-red-500/20 bg-red-500/5", className)}>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10">
            <X className="h-4 w-4 text-red-500" />
          </div>
          <div>
            <p className="font-medium text-red-500">Project Canceled</p>
            <p className="text-sm text-muted-foreground">
              {quoteRejected ? "Quote was declined" : "This project has been canceled"}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Desktop Progress bar */}
      <div className="hidden sm:block">
        {/* Node row - nodes only */}
        <div className="relative flex justify-between">
          {/* Background lines layer - inset to align with node centers */}
          <div
            className="absolute top-4 flex items-center -translate-y-1/2"
            style={{
              left: `${100 / steps.length / 2}%`,
              right: `${100 / steps.length / 2}%`
            }}
          >
            {steps.slice(0, -1).map((step, index) => {
              const isCompleted = completedSteps.has(step.id)
              const nextStep = steps[index + 1]
              const nextIsCompletedOrCurrent = completedSteps.has(nextStep.id) || currentStep === nextStep.id
              // Line is green only if current step has passed this segment
              const segmentIsGreen = isCompleted && nextIsCompletedOrCurrent

              return (
                <div
                  key={`line-${step.id}`}
                  className={cn(
                    "flex-1 h-0.5 transition-colors duration-500",
                    segmentIsGreen ? "bg-emerald-500" : "bg-border"
                  )}
                />
              )
            })}
          </div>

          {/* Nodes layer */}
          {steps.map((step) => {
            const isCompleted = completedSteps.has(step.id)
            const isCurrent = currentStep === step.id
            const isPending = !isCompleted && !isCurrent

            return (
              <div key={step.id} className="flex flex-col items-center z-10" style={{ width: `${100 / steps.length}%` }}>
                {/* Icon circle */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 bg-background",
                    isCompleted && "border-emerald-500 bg-emerald-500 text-white",
                    isCurrent && "border-emerald-500 bg-background text-emerald-500 ring-4 ring-emerald-500/20",
                    isPending && "border-muted bg-background text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Label */}
                <p
                  className={cn(
                    "mt-2 text-xs font-medium text-center",
                    isCompleted && "text-emerald-600 dark:text-emerald-400",
                    isCurrent && "text-foreground",
                    isPending && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Progress - Collapsed/Expandable */}
      <div className="sm:hidden">
        {/* Collapsed View - Clickable header with progress bar */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left"
        >
          {/* Mini progress bar */}
          <div className="mb-3">
            <div className="relative flex justify-between">
              {/* Background lines layer - inset to align with node centers */}
              <div
                className="absolute top-4 flex items-center -translate-y-1/2"
                style={{
                  left: `${100 / steps.length / 2}%`,
                  right: `${100 / steps.length / 2}%`
                }}
              >
                {steps.slice(0, -1).map((step, index) => {
                  const isCompleted = completedSteps.has(step.id)
                  const nextStep = steps[index + 1]
                  const nextIsCompletedOrCurrent = completedSteps.has(nextStep.id) || currentStep === nextStep.id
                  const segmentIsGreen = isCompleted && nextIsCompletedOrCurrent

                  return (
                    <div
                      key={`line-${step.id}`}
                      className={cn(
                        "flex-1 h-0.5 transition-colors duration-500",
                        segmentIsGreen ? "bg-emerald-500" : "bg-border"
                      )}
                    />
                  )
                })}
              </div>

              {/* Nodes layer */}
              {steps.map((step) => {
                const isCompleted = completedSteps.has(step.id)
                const isCurrent = currentStep === step.id
                const isPending = !isCompleted && !isCurrent

                return (
                  <div key={step.id} className="flex items-center justify-center z-10" style={{ width: `${100 / steps.length}%` }}>
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 bg-background",
                        isCompleted && "border-emerald-500 bg-emerald-500 text-white",
                        isCurrent && "border-emerald-500 bg-background text-emerald-500 ring-4 ring-emerald-500/20",
                        isPending && "border-muted bg-background text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        step.icon
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Current step info with expand indicator */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {steps.find((s) => s.id === currentStep)?.label}
              </p>
              {nextStep && (
                <p className="text-xs text-muted-foreground">
                  Next: {nextStep.label}
                </p>
              )}
              {currentStep === "delivered" && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Project complete!
                </p>
              )}
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            </motion.div>
          </div>
        </button>

        {/* Expanded List View */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3 border-t pt-4">
                {steps.map((step, index) => {
                  const isCompleted = completedSteps.has(step.id)
                  const isCurrent = currentStep === step.id
                  const isPending = !isCompleted && !isCurrent

                  return (
                    <div
                      key={step.id}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-lg transition-colors",
                        isCurrent && "bg-emerald-500/10"
                      )}
                    >
                      {/* Step indicator */}
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                          isCompleted && "border-emerald-500 bg-emerald-500 text-white",
                          isCurrent && "border-emerald-500 bg-background text-emerald-500",
                          isPending && "border-muted bg-background text-muted-foreground"
                        )}
                      >
                        {isCompleted ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          step.icon
                        )}
                      </div>

                      {/* Step info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            isCompleted && "text-emerald-600 dark:text-emerald-400",
                            isCurrent && "text-foreground",
                            isPending && "text-muted-foreground"
                          )}
                        >
                          {step.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {step.description}
                        </p>
                      </div>

                      {/* Status badge */}
                      {isCompleted && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          Done
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          Current
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
