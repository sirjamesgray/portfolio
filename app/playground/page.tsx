import { TimeMachine } from "@/components/time-machine";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-950/20 dark:to-blue-950/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="pt-20">
        <div className="px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Playground
          </h1>
          <p className="text-muted-foreground">
            Experimental UI components and features
          </p>
        </div>

        {/* Time Machine Component */}
        <TimeMachine />
      </main>
    </div>
  );
}
