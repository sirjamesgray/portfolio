import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { AtAGlance, HireCta } from "@/components/hire-cta";
import { SectionHead } from "@/components/section-head";
import { RESUME_PROOF } from "@/lib/resume-data";
import styles from "@/components/career-system.module.css";

export default function ForRecruitersPage() {
  return (
    <div className="min-h-screen bg-black text-foreground">
      <SiteHeader landingPage="career" customerDashboardEnabled={false} />
      <main className="mx-auto w-full max-w-3xl px-4 pb-12 pt-24 sm:px-6">
        <SectionHead index="01" title="For recruiters" as="h1" />
        <p className={`${styles.body} mt-4 max-w-xl text-foreground`}>
          Full Stack Developer, previously a Product Designer. I design in code and ship with AI agents.
        </p>
        <div className="mt-4">
          <AtAGlance />
        </div>
        <ul className="mt-6 space-y-2">
          {RESUME_PROOF.map((line) => (
            <li key={line} className={styles.proof}>
              {line}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <HireCta />
        </div>
      </main>
      <Footer />
    </div>
  );
}
