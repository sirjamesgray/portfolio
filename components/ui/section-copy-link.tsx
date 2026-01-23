"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionCopyLinkProps {
  sectionId: string;
  className?: string;
}

export function SectionCopyLink({ sectionId, className }: SectionCopyLinkProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <>
      <button
        onClick={copyLink}
        className={cn(
          "hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs",
          "text-muted-foreground/60 hover:text-muted-foreground",
          "hover:bg-muted/50 transition-all",
          "opacity-0 group-hover:opacity-100 group-hover/section:opacity-100",
          className
        )}
        title="Copy link to section"
      >
        <Link2 className="h-3 w-3" />
        <span className="sr-only">Copy link</span>
      </button>

      {/* Toast notification */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] md:bottom-8"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500 text-white text-sm font-medium shadow-lg">
              <Check className="h-4 w-4" />
              Link to section copied
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
