"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"

// Simple hook to detect mobile viewport
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [breakpoint])

  return isMobile
}

interface ResponsiveModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  /** Max width class for desktop dialog (e.g., "max-w-lg", "max-w-2xl") */
  maxWidth?: string
  /** Whether the content should scroll on desktop */
  scrollable?: boolean
}

export function ResponsiveModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  maxWidth = "max-w-lg",
  scrollable = true,
}: ResponsiveModalProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(title || description) && (
            <DrawerHeader>
              {title && <DrawerTitle>{title}</DrawerTitle>}
              {description && <DrawerDescription>{description}</DrawerDescription>}
            </DrawerHeader>
          )}
          <div className={cn(
            "px-4 pb-4",
            scrollable && "overflow-y-auto max-h-[60vh]"
          )}>
            {children}
          </div>
          {footer && <DrawerFooter>{footer}</DrawerFooter>}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(maxWidth, scrollable && "max-h-[85vh] overflow-y-auto")}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}

// Export the hook for external use
export { useIsMobile }
