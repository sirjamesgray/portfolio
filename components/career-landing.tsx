import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { FloatingSectionNav } from "@/components/ui/floating-section-nav";
import { CareerHeroStage } from "@/components/career-hero";
import { BoardLightbox } from "@/components/board-lightbox";
import { LaptopFrame, PhoneFrame } from "@/components/device-frame";
import { EXPERIENCE, RESUME_PATH, SITE_CONFIG, SOCIALS } from "@/lib/constants";
import { RESUME_DATA } from "@/lib/resume-data";
import {
  DESIGN_STUDIES,
  PARKHUB_NOTE,
  PUBLIC_PRODUCTS,
  TURBO,
  type PublicProduct,
} from "@/lib/public-work";
import styles from "./career-landing.module.css";

const SOFT_CTA =
  "Open to senior product & design engineering conversations — remote or DFW";

const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "turbo", label: "Turbo" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

function logoFor(company: string) {
  const match = EXPERIENCE.find((item) => company.startsWith(item.company) && item.logo);
  return match?.logo ?? "";
}

function CtaRow({ primary = false }: { primary?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild size={primary ? "lg" : "default"}>
        <a href={RESUME_PATH}>Download resume</a>
      </Button>
      <Button asChild variant="outline" size={primary ? "lg" : "default"}>
        <a href={`mailto:${SITE_CONFIG.email}`}>Email</a>
      </Button>
      <Button asChild variant="ghost" size={primary ? "lg" : "default"}>
        <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </Button>
    </div>
  );
}

function ProductChapter({ product, priority = false }: { product: PublicProduct; priority?: boolean }) {
  if (!product.desktop) return null;

  return (
    <article
      id={product.id}
      className={`${styles.band} scroll-mt-28 py-16 sm:py-24`}
      style={{ ["--chapter" as string]: product.accent }}
    >
      <div className="mx-auto grid w-full max-w-6xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-12">
        <div className={`${styles.rise} lg:sticky lg:top-28`}>
          <p className="font-mono text-xs tracking-[0.16em] text-muted-foreground">{product.index}</p>
          <h2 className={`${styles.chapter} mt-3 font-semibold text-foreground`}>{product.name}</h2>
          <p className="mt-3 text-sm text-foreground">{product.role}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {product.place} · {product.dates}
          </p>
          <p className="mt-5 max-w-prose text-base leading-relaxed text-muted-foreground">{product.summary}</p>
          <ul className="mt-5 max-w-prose space-y-2 text-sm leading-relaxed text-foreground">
            {product.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          {product.href && (
            <a
              href={product.href}
              className="mt-5 inline-block text-sm font-medium text-foreground underline decoration-foreground/30 underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              {product.hrefLabel}
            </a>
          )}
        </div>
        <div className={`${styles.rise} ${styles.d2} relative pb-4 lg:pb-16`}>
          <div className="w-full lg:w-[65%]">
            <LaptopFrame shot={product.desktop} priority={priority} />
          </div>
          {product.mobile && (
            <div className="mx-auto mt-6 w-[42%] max-w-[200px] lg:absolute lg:bottom-0 lg:left-[58%] lg:mx-0 lg:mt-0 lg:w-[27%]">
              <PhoneFrame shot={product.mobile} priority={priority} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function WorxChapter() {
  const product = PUBLIC_PRODUCTS.find((item) => item.id === "worx4u");
  if (!product) return null;
  const labels = ["Product", "API platform", "APEX to React", "Backend Mirror", "SSO and local dev"];

  return (
    <article id={product.id} className="scroll-mt-28 bg-[#101114] py-16 text-zinc-100 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <p className="font-mono text-xs tracking-[0.16em] text-zinc-400">{product.index} · text only</p>
        <h2 className={`${styles.chapter} mt-3 font-semibold`}>{product.name}</h2>
        <ul className="mt-3 space-y-1 text-sm text-zinc-300">
          {product.titles?.map((title) => (
            <li key={title}>{title}</li>
          ))}
        </ul>
        <p className="mt-1 text-sm text-zinc-400">{product.place}</p>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-zinc-300">{product.summary}</p>
        <ol className="mt-10 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
          {product.points.map((point, index) => (
            <li key={point} className="bg-[#101114] p-4">
              <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">0{index + 1}</p>
              <p className="mt-2 text-sm font-medium text-zinc-50">{labels[index]}</p>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">{point}</p>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

function TurboChapter() {
  const pictured = TURBO.clients.filter((client) => client.board);
  const precision = TURBO.clients.find((client) => client.id === "precision-ai");

  return (
    <section id="turbo" className="scroll-mt-28 border-y border-border py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Image src={TURBO.logo} alt="" width={36} height={36} className="size-9 rounded-md bg-white object-contain p-1" />
          <p className="font-mono text-xs tracking-[0.16em] text-muted-foreground">Agency</p>
        </div>
        <h2 className={`${styles.chapter} mt-4 font-semibold text-foreground`}>{TURBO.name}</h2>
        <p className="mt-3 text-sm text-foreground">
          {TURBO.role} · {TURBO.place} · {TURBO.dates}
        </p>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">{TURBO.intro}</p>
        <p className="mt-3 font-mono text-xs text-muted-foreground">{TURBO.tools}</p>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-8">
          {pictured.map((client) => (
            <article key={client.id} id={client.id} className="min-w-0">
              <div className="flex items-center gap-3">
                <Image
                  src={client.logo}
                  alt=""
                  width={32}
                  height={32}
                  className="size-8 rounded-md bg-white object-contain p-0.5"
                />
                <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">{client.label}</h3>
              </div>
              <p className="mt-3 text-sm text-foreground">{client.title}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{client.dates}</p>
              <p className="mt-4 text-sm leading-relaxed text-foreground">{client.summary}</p>
              <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                {client.supporting.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              {client.board && (
                <div className="mt-5">
                  <BoardLightbox board={client.board}>
                    <Image
                      src={client.board.src}
                      alt={client.board.alt}
                      width={client.board.width}
                      height={client.board.height}
                      sizes="(min-width: 1024px) 560px, 100vw"
                      className="h-auto w-full rounded-lg border border-border"
                    />
                  </BoardLightbox>
                  <p className="mt-2 text-xs text-muted-foreground">Open the board</p>
                </div>
              )}
            </article>
          ))}
        </div>

        {precision && (
          <p className="mt-10 border-t border-border pt-6 text-sm text-foreground">
            <span className="font-medium">{precision.label}.</span> {precision.summary}
          </p>
        )}

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {DESIGN_STUDIES.map((study) => (
            <article key={study.id} className="min-w-0">
              <h3 className="text-lg font-semibold tracking-[-0.02em]">{study.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{study.meta}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{study.summary}</p>
              {study.image && (
                <div className="mt-4">
                  <BoardLightbox board={study.image}>
                    <Image
                      src={study.image.src}
                      alt={study.image.alt}
                      width={study.image.width}
                      height={study.image.height}
                      sizes="(min-width: 1024px) 560px, 100vw"
                      className="h-auto w-full rounded-lg border border-border"
                    />
                  </BoardLightbox>
                </div>
              )}
            </article>
          ))}
        </div>

        <article className="mt-10 border-t border-border pt-6">
          <h3 className="text-lg font-semibold tracking-[-0.02em]">{PARKHUB_NOTE.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{PARKHUB_NOTE.meta}</p>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">{PARKHUB_NOTE.summary}</p>
        </article>
      </div>
    </section>
  );
}

export function WorkAndDesign() {
  const pictured = PUBLIC_PRODUCTS.filter((product) => product.desktop);

  return (
    <div id="work" className="scroll-mt-28">
      {pictured.map((product, index) => (
        <ProductChapter key={product.id} product={product} priority={index === 0} />
      ))}
      <WorxChapter />
      <TurboChapter />
    </div>
  );
}

export function CareerLanding() {
  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHeader landingPage="career" customerDashboardEnabled={false} />
      <main>
        <section className={`${styles.hero} relative flex items-center overflow-hidden pt-24`}>
          <div className={`${styles.glow} pointer-events-none absolute inset-0`} aria-hidden />
          <div className={styles.grain} aria-hidden />
          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:py-16">
            <div>
              <p className={`${styles.rise} font-mono text-xs tracking-[0.16em] text-muted-foreground`}>
                Fort Worth
              </p>
              <h1 className={`${styles.name} ${styles.rise} ${styles.d1} mt-4 font-semibold text-foreground`}>
                Jamie Gray
              </h1>
              <p className={`${styles.rise} ${styles.d2} mt-5 max-w-md text-lg leading-snug text-foreground sm:text-xl`}>
                I design in code and ship real products with AI agents.
              </p>
              <p className={`${styles.rise} ${styles.d3} mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base`}>
                8+ years across startups, agencies, and enterprise. Based in Fort Worth. Working remote or DFW.
              </p>
              <div className={`${styles.rise} ${styles.d4} mt-8`}>
                <CtaRow primary />
              </div>
              <p className={`${styles.rise} ${styles.d5} mt-6 max-w-md border-l-2 border-brand pl-4 text-sm leading-relaxed text-foreground`}>
                {SOFT_CTA}
              </p>
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

        <div className="sticky top-14 z-30 border-b border-border/70 bg-background/85 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
            <FloatingSectionNav sections={SECTIONS} />
          </div>
        </div>

        <WorkAndDesign />

        <section id="experience" className="scroll-mt-28 py-16 sm:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-sm font-medium tracking-[0.14em] text-muted-foreground uppercase">Experience</h2>
              <Link href="/experience" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                Full timeline
              </Link>
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
                        <Image src={logo} alt="" width={36} height={36} className="size-9 shrink-0 rounded-md bg-white object-contain p-1" />
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

        <section id="contact" className="scroll-mt-28 border-t border-border py-16 sm:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <h2 className="max-w-xl text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{SOFT_CTA}</h2>
            <div className="mt-6">
              <CtaRow />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
