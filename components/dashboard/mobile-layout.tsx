"use client"

import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ReactNode, useEffect, useRef, useState } from "react"
import { MobileHeader } from "./mobile-header"

interface MobileLayoutProps {
  children: ReactNode
  hasMirror: boolean
  userEmail: string
}

export function MobileLayout({ children, hasMirror, userEmail }: MobileLayoutProps) {
  const pathname = usePathname()
  const [direction, setDirection] = useState<1 | -1>(1)
  const prevPathRef = useRef(pathname)

  // Determine if we're at the dashboard root (menu page)
  const isAtRoot = pathname === "/dashboard"

  useEffect(() => {
    const prevPath = prevPathRef.current
    const prevDepth = prevPath.split("/").filter(Boolean).length
    const currDepth = pathname.split("/").filter(Boolean).length

    // Determine direction: 1 = forward (slide from right), -1 = back (slide from left)
    if (prevPath === "/dashboard" && pathname !== "/dashboard") {
      setDirection(1)
    } else if (prevPath !== "/dashboard" && pathname === "/dashboard") {
      setDirection(-1)
    } else if (currDepth > prevDepth) {
      setDirection(1)
    } else if (currDepth < prevDepth) {
      setDirection(-1)
    }

    prevPathRef.current = pathname
  }, [pathname])

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
    }),
    center: {
      x: 0,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
    }),
  }

  return (
    <div className="md:hidden fixed inset-0 flex flex-col overflow-hidden bg-background">
      {/* Spacer for mirror banner */}
      {hasMirror && <div className="flex-shrink-0 h-10" />}

      {/* Persistent Header - stays fixed above sliding content */}
      <MobileHeader
        userEmail={userEmail}
        showBack={!isAtRoot}
      />

      {/* Content with slide animation */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={pathname}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 35,
            }}
            className="absolute inset-0 overflow-y-auto"
          >
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
