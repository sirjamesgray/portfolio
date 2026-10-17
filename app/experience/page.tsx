import { CareerShell } from "@/components/career-shell";
import { CareerButton } from "@/components/career-button";
import { CareerTimeline } from "@/components/career-timeline";
import { AtAGlance, HireCta } from "@/components/hire-cta";
import { SectionHead } from "@/components/section-head";
import { Reveal } from "@/components/reveal";
import { EXPERIENCE } from "@/lib/constants";
import { RESUME_DATA } from "@/lib/resume-data";
import { TURBO } from "@/lib/public-work";
import { ArrowLeft } from "lucide-react";
import styles from "@/components/career-system.module.css";

function logoFor(company: string) {
  const match = EXPERIENCE.find((item) => company.startsWith(item.company) && item.logo);
  return match?.logo ?? "";
}

export default function ExperiencePage() {
  return (
    <CareerShell width="max-w-4xl">
      <CareerButton variant="ghost" icon={ArrowLeft} href="/">
        Back to home
      </CareerButton>
      <div className="mt-6">
        <SectionHead index="04" title="Experience" as="h1" />
      </div>
      <p className={`${styles.body} mt-4 max-w-2xl text-foreground`}>
        8+ years across startups, agencies, and enterprise. Product engineering and design, remote or DFW.
      </p>
      <div className="mt-6">
        <AtAGlance />
      </div>
      <CareerTimeline
        jobs={RESUME_DATA.experience}
        detailed
        logoFor={logoFor}
        extra={(job) =>
          job.company.startsWith("Turbo") ? (
            <ul className="mt-4 space-y-3 border-l border-border pl-4">
              {TURBO.clients.map((client) => (
                <li key={client.id}>
                  <p className="text-sm font-medium text-foreground">{client.label}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{client.dates}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{client.summary}</p>
                </li>
              ))}
            </ul>
          ) : null
        }
      />
      <Reveal className="mt-12 border border-[rgb(61_214_140/0.4)] bg-black p-4">
        <p className="text-[length:var(--type-4)] font-semibold tracking-[-0.02em] text-foreground">
          Full Stack Developer, previously a Product Designer.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">Download the resume, or send a note. I read every message.</p>
        <div className="mt-4">
          <HireCta />
        </div>
      </Reveal>
    </CareerShell>
  );
}
