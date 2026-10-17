import { CareerShell } from "@/components/career-shell";
import { AtAGlance, HireCta } from "@/components/hire-cta";
import { SectionHead } from "@/components/section-head";
import { RESUME_PROOF } from "@/lib/resume-data";
import styles from "@/components/career-system.module.css";

export default function ForRecruitersPage() {
  return (
    <CareerShell width="max-w-3xl">
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
    </CareerShell>
  );
}
