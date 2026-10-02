import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { CareerHeroStage } from "@/components/career-hero";
import { BootSequence, ScrambleName } from "@/components/career-intro";
import { BuilderLab } from "@/components/builder-lab";
import { PhoneFrame } from "@/components/device-frame";
import { WorkFocusRestore } from "@/components/work-modal";
import { WorkGrid, WorkLink } from "@/components/work-card";
import { AtAGlance, HireCta } from "@/components/hire-cta";
import { SectionHead } from "@/components/section-head";
import { CareerButton } from "@/components/career-button";
import { EXPERIENCE } from "@/lib/constants";
import { RESUME_DATA } from "@/lib/resume-data";
import { PUBLIC_PRODUCTS, TURBO } from "@/lib/public-work";
import { workIn } from "@/lib/work-catalog";
import styles from "./career-landing.module.css";

function logoFor(company: string) {
  const match = EXPERIENCE.find((item) => company.startsWith(item.company) && item.logo);
  return match?.logo ?? "";
}

export function WorkAndDesign() {
  return (
    <>
      <div id="work" className="scroll-mt-28 border-t border-border bg-black py-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <SectionHead index="01" title="Work" />
          <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground">
            A pattern across my work: tools that let people own and earn from what they make.
          </p>
          <WorkGrid entries={workIn("work")} />
        </div>
      </div>
      <section id="turbo" className="scroll-mt-28 border-t border-border bg-black py-12">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="mb-4 flex items-center gap-3">
            <Image src={TURBO.logo} alt="" width={36} height={36} className="size-9 border border-border bg-black object-contain p-1" />
          </div>
          <SectionHead index="02" title={TURBO.name} />
          <p className="mt-3 text-sm text-foreground">
            {TURBO.role} · {TURBO.place} · {TURBO.dates}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">{TURBO.intro}</p>
          <p className="mt-3 font-mono text-xs text-muted-foreground">{TURBO.tools}</p>
          <WorkGrid entries={workIn("turbo")} />
        </div>
      </section>
    </>
  );
}

export function CareerLanding() {
  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHeader landingPage="career" customerDashboardEnabled={false} />
      <WorkFocusRestore />
      <main>
        <section className={`${styles.hero} relative flex items-start overflow-hidden bg-black pt-20 sm:pt-24`}>
          <div className={`${styles.grid} pointer-events-none absolute inset-0`} aria-hidden />
          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-6 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="min-w-0">
              <ScrambleName className={`${styles.name} text-foreground`} />
              <p className="mt-4 max-w-md text-base leading-snug text-foreground">
                I build software that lets people earn from their own work: writers on{" "}
                <WorkLink slug="wewrite" className="text-brand underline decoration-brand/40 underline-offset-4">
                  WeWrite
                </WorkLink>
                , a local business on{" "}
                <WorkLink slug="lucent-wash" className="text-blue underline decoration-blue/40 underline-offset-4">
                  Lucent Wash
                </WorkLink>
                .
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Full Stack Developer, previously a Product Designer. I design in code and ship with AI agents.
              </p>
              <div className="mt-4">
                <HireCta hero />
              </div>
              <div className="mt-4">
                <AtAGlance />
              </div>
              <BootSequence />
            </div>
            <div className="hidden lg:block">
              <CareerHeroStage />
            </div>
            <div className="mx-auto w-[46%] max-w-[190px] lg:hidden">
              <PhoneFrame
                shot={PUBLIC_PRODUCTS[1].mobile!}
                priority
                sizes="190px"
              />
            </div>
          </div>
        </section>

        <WorkAndDesign />

        <section id="lab" className="scroll-mt-28 border-t border-border bg-black py-12">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHead index="03" title="Builder log" />
            <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted-foreground">
              Small tools from the same work: toggles, a quiet ASCII field, the WeWrite type migration, and the path from prompt to ship. Draft notes stay marked TODO.
            </p>
            <BuilderLab />
          </div>
        </section>

        <section id="experience" className="scroll-mt-28 border-t border-border bg-black py-12">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="flex items-end justify-between gap-4">
              <SectionHead index="04" title="Experience" />
              <CareerButton variant="ghost" icon={ArrowRight} href="/experience">
                Full timeline
              </CareerButton>
            </div>
            <ol className="relative mt-10 space-y-8 border-l border-border pl-6">
              {RESUME_DATA.experience.map((job) => {
                const positions = "positions" in job ? job.positions : undefined;
                const logo = logoFor(job.company);
                return (
                  <li key={job.company} className="relative">
                    <span className="absolute -left-[1.7rem] top-1.5 size-2.5 rounded-full bg-brand" aria-hidden />
                    <div className="flex items-start gap-3">
                      {logo ? (
                        <Image src={logo} alt="" width={36} height={36} className="size-9 shrink-0 border border-border bg-black object-contain p-1" />
                      ) : null}
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">
                          {job.company}
                          {job.context ? <span className="font-normal text-muted-foreground"> · {job.context}</span> : null}
                        </p>
                        {positions && positions.length > 0 ? (
                          <ul className="mt-1 space-y-1">
                            {positions.map((position) => (
                              <li key={position.title} className="text-sm text-muted-foreground">
                                {position.title}
                                <span className="text-foreground/70"> · {position.startDate}–{position.endDate}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">{job.role}</p>
                        )}
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                          {job.startDate} – {job.endDate}
                        </p>
                        {job.company.startsWith("Turbo") && (
                          <ul className="mt-4 space-y-3 border-l border-border pl-4">
                            {TURBO.clients.map((client) => (
                              <li key={client.id}>
                                <p className="text-sm font-medium text-foreground">{client.label}</p>
                                <p className="font-mono text-[11px] text-muted-foreground">{client.dates}</p>
                                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{client.summary}</p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section id="contact" className="scroll-mt-28 border-t border-border bg-black py-12">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHead index="05" title="Contact" />
            <div className="mt-4">
              <HireCta />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
