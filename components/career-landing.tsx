import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Beaker, Briefcase, FileText, FlaskConical, History, Lock, Mail, PenLine } from "lucide-react";
import { HashRedirect } from "@/components/hash-redirect";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { CareerHeroStage } from "@/components/career-hero";
import { BootSequence, ScrambleName } from "@/components/career-intro";
import { BuilderLab } from "@/components/builder-lab";
import { PhoneFrame } from "@/components/device-frame";
import { WorkGrid, WorkLink } from "@/components/work-card";
import { AtAGlance, HireCta } from "@/components/hire-cta";
import { SectionHead } from "@/components/section-head";
import { PUBLIC_PRODUCTS, TURBO } from "@/lib/public-work";
import { workIn } from "@/lib/work-catalog";
import { Reveal } from "@/components/reveal";
import { CareerBackdrop } from "@/components/career-backdrop";
import styles from "./career-landing.module.css";

export function WorkAndDesign({ page = false }: { page?: boolean }) {
  return (
    <>
      <Reveal id="work" className="scroll-mt-28 border-t border-border py-12 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <SectionHead index="01" title="Work" as={page ? "h1" : undefined} />
          <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground">
            A pattern across my work: tools that let people own and earn from what they make.
          </p>
          <WorkGrid entries={workIn("work")} />
        </div>
      </Reveal>
      <Reveal as="section" id="turbo" className="scroll-mt-28 border-t border-border py-12 md:py-20">
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
      </Reveal>
    </>
  );
}

export function LabSection() {
  return (
    <Reveal as="section" id="lab" className="scroll-mt-28 border-t border-border py-12 md:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHead index="03" title="Builder log" as="h1" />
        <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted-foreground">
          Small tools from the same work: toggles, a quiet ASCII field, the WeWrite type migration, and the path from prompt to ship. Draft notes stay marked TODO.
        </p>
        <BuilderLab />
      </div>
    </Reveal>
  );
}

const OVERVIEW = [
  { href: "/work", index: "01", title: "Work", body: "WeWrite, Lucent Wash, and client work from Turbo.", icon: Briefcase },
  { href: "/lab", index: "02", title: "Lab", body: "Builder log: small tools, migrations, and notes.", icon: FlaskConical },
  { href: "/experiments", index: "03", title: "Experiments", body: "Interactive pieces made to test an idea.", icon: Beaker },
  { href: "/about", index: "04", title: "About", body: "8+ years across startups, agencies, and enterprise.", icon: History },
  { href: "/blog", index: "05", title: "Blog", body: "Notes on building, design in code, and shipping.", icon: PenLine },
  { href: "/resume", index: "06", title: "Resume", body: "One page, printable, with a PDF download.", icon: FileText },
  { href: "/contact", index: "07", title: "Contact", body: "Email or LinkedIn. I read every message.", icon: Mail },
  { href: "/for-recruiters", index: "08", title: "Recruiters", body: "A short brief for hiring teams.", icon: Lock },
] as const;

function Overview() {
  return (
    <section aria-labelledby="overview-title" className="border-t border-border py-12 md:py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <h2 id="overview-title" className="sr-only">
          Pages
        </h2>
        <ul className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {OVERVIEW.map((item) => (
            <li key={item.href} className="bg-black">
              <Link href={item.href} className={`${styles.overviewCard} group flex h-full min-h-[44px] flex-col gap-2 p-5`}>
                <span className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                  <span>{item.index}</span>
                  <item.icon aria-hidden className="size-4" />
                </span>
                <span className="flex items-center gap-2 text-lg font-semibold tracking-[-0.02em] text-foreground">
                  {item.title}
                  <ArrowRight aria-hidden className={`${styles.overviewArrow} size-4`} />
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">{item.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function CareerLanding() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-black text-foreground">
      <CareerBackdrop />
      <SiteHeader landingPage="career" customerDashboardEnabled={false} />
      <HashRedirect />
      <main className="relative z-10">
        <section className={`${styles.hero} relative flex items-start overflow-hidden pt-20 sm:pt-24`}>
          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-6 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="min-w-0">
              <p className={styles.eyebrow}>
                <span className={styles.dot} aria-hidden />
                Open to the right opportunity · Fort Worth
              </p>
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

        <Overview />
      </main>
      <div className="relative z-10"><Footer /></div>
    </div>
  );
}
