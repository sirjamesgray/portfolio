"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, ArrowRight } from "lucide-react";
import { DashboardButton } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "saving" | "success" | "no-project">("loading");
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    async function init() {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      setUser({
        email: user.email || "",
        name: user.user_metadata?.full_name || user.email?.split("@")[0] || "",
      });

      // Check for questionnaire data in sessionStorage
      const questionnaireData = sessionStorage.getItem("projectQuestionnaire");

      if (questionnaireData) {
        setStatus("saving");

        try {
          const data = JSON.parse(questionnaireData);

          // First create or get contact
          const { data: existingContact } = await supabase
            .from("contacts")
            .select("id")
            .eq("email", user.email)
            .single();

          let contactId = existingContact?.id;

          if (!contactId) {
            const { data: newContact, error: contactError } = await supabase
              .from("contacts")
              .insert({
                email: user.email,
                name: user.user_metadata?.full_name || user.email?.split("@")[0],
                user_id: user.id,
              })
              .select("id")
              .single();

            if (contactError) throw contactError;
            contactId = newContact.id;
          }

          // Create the project
          const { error: projectError } = await supabase
            .from("projects")
            .insert({
              contact_id: contactId,
              user_id: user.id,
              project_type: data.projectType,
              budget: data.budget,
              timeline: data.timeline,
              description: data.description,
              status: "lead",
            });

          if (projectError) throw projectError;

          // Clear the stored data
          sessionStorage.removeItem("projectQuestionnaire");
          setStatus("success");
        } catch (error) {
          console.error("Error saving project:", error);
          // Still mark as success so user isn't stuck
          setStatus("success");
        }
      } else {
        setStatus("no-project");
      }
    }

    init();
  }, [router]);

  if (status === "loading" || status === "saving") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-blue-950/20 dark:to-blue-950/30">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {status === "saving" ? "Saving your project..." : "Loading..."}
            </p>
          </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-blue-950/20 dark:to-blue-950/30 px-6">
        <div className="max-w-md w-full text-center">
          {status === "success" ? (
            <>
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                You&apos;re all set, {user?.name}!
              </h1>
              <p className="text-muted-foreground mb-8">
                I&apos;ve received your project details and will get back to you within 24 hours. Keep an eye on your inbox!
              </p>
              <div className="space-y-3">
                <Link href="/">
                  <DashboardButton className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700">
                    Back to Home
                    <ArrowRight className="h-4 w-4" />
                  </DashboardButton>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-muted-foreground mb-8">
                You&apos;re signed in. Ready to start a new project?
              </p>
              <div className="space-y-3">
                <Link href="/start-project">
                  <DashboardButton className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700">
                    Start a Project
                    <ArrowRight className="h-4 w-4" />
                  </DashboardButton>
                </Link>
                <Link href="/">
                  <DashboardButton variant="ghost" className="w-full">
                    Back to Home
                  </DashboardButton>
                </Link>
              </div>
            </>
          )}
        </div>
    </div>
  );
}
