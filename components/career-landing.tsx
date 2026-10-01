import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { FloatingSectionNav } from "@/components/ui/floating-section-nav";
import { CareerHeroStage } from "@/components/career-hero";
import { BootSequence, HeroAtmosphere, ScrambleName } from "@/components/career-intro";
import { CareerCommand } from "@/components/career-command";
import { HoverScramble } from "@/components/hover-scramble";
import { BuilderLab } from "@/components/builder-lab";
import { BoardLightbox } from "@/components/board-lightbox";
import { LaptopFrame, PhoneFrame } from "@/components/device-frame";
import { EXPERIENCE, RESUME_PATH, SITE_CONFIG, SOCIALS } from "@/lib/constants";
import { RESUME_DATA } from "@/lib/resume-data";
import {
  DESIGN_STUDIES,
  PARKHUB_NOTE,
  PUBLIC_PRODUCTS,
  TURBO,
  type BoardShot,
  type PublicProduct,
} from "@/lib/public-work";
import styles from "./career-landing.module.css";

const SOFT_CTA =
  "Open to senior product & design engineering conversations — remote or DFW";

const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "turbo", label: "Turbo" },
  { id: "lab", label: "Lab" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

function SectionHead({
  file,
  title,
  titleClass,
  onDark = false,
}: {
  file: string;
  title: string;
  titleClass: string;
  onDark?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <ol
        className={`w-6 shrink-0 pt-1 text-right font-mono text-[10px] leading-5 ${onDark ? "text-zinc-400" : "text-muted-foreground"}`}
        aria-hidden
      >
        <li>01</li>
        <li>02</li>
        <li>03</li>
      </ol>
      <div className="min-w-0 flex-1">
        <FileTab file={file} onDark={onDark} />
        <h2 className={titleClass}>
          <HoverScramble text={title} />
        </h2>
      </div>
    </div>
  );
}

function FileTab({ file, onDark = false }: { file: string; onDark?: boolean }) {
  return (
    <div className="mb-3 flex items-end gap-2">
      <span
        className={
          onDark
            ? "rounded-t-md border border-b-0 border-[rgb(112_184_255/0.4)] bg-black px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
            : "rounded-t-md border border-b-0 border-border bg-black px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
        }
      >
        {file}
      </span>
      <span className={`mb-px h-px flex-1 ${onDark ? "bg-[rgb(112_184_255/0.4)]" : "bg-border"}`} />
    </div>
  );
}

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
      <Button asChild variant="outline" size={primary ? "lg" : "default"} className="border-[rgb(61_214_140/0.45)] bg-black text-foreground shadow-none hover:bg-black hover:text-foreground hover:shadow-[0_0_18px_rgb(61_214_140/0.28)]">
        <a href={`mailto:${SITE_CONFIG.email}`}>Email</a>
      </Button>
      <Button asChild variant="ghost" size={primary ? "lg" : "default"} className="bg-transparent text-foreground hover:bg-transparent hover:text-blue hover:shadow-[0_0_18px_rgb(112_184_255/0.28)]">
        <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </Button>
    </div>
  );
}

function ProductChapter({ product, priority = false }: { product: PublicProduct; priority?: boolean }) {
  if (!product.desktop) return null;

  const blue = product.id === "lucent-wash";

  return (
    <article
      id={product.id}
      className={`scroll-mt-28 border-y bg-black py-16 transition-shadow sm:py-24 ${blue ? "border-[rgb(112_184_255/0.4)] hover:shadow-[inset_0_0_48px_rgb(112_184_255/0.12)]" : "border-border hover:shadow-[inset_0_0_48px_rgb(61_214_140/0.12)]"}`}
    >
      <div className="mx-auto grid w-full max-w-6xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-12">
        <div className={`${styles.rise} lg:sticky lg:top-28`}>
          <p className="font-mono text-xs tracking-[0.16em] text-muted-foreground">{product.index}</p>
          <SectionHead
            file={`${product.id}.tsx`}
            title={product.name}
            titleClass={`${styles.chapter} ${styles.glitch} font-semibold text-foreground`}
          />
          <p className="mt-3 text-sm text-foreground">{product.role}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {product.place} · {product.dates}
          </p>
          {product.earns ? (
            <p className="mt-4 max-w-prose text-sm leading-relaxed text-foreground">
              <span className={`font-mono text-xs ${blue ? "text-blue" : "text-brand"}`}>Who earns · </span>
              {product.earns}
            </p>
          ) : null}
          <p className="mt-5 max-w-prose text-base leading-relaxed text-muted-foreground">{product.summary}</p>
          <ul className="mt-5 max-w-prose space-y-2 text-sm leading-relaxed text-foreground">
            {product.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          {product.href && (
            <a
              href={product.href}
              className={`mt-5 inline-block text-sm font-medium underline underline-offset-4 ${blue ? "text-blue decoration-blue/40" : "text-brand decoration-brand/40"}`}
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
    <article id={product.id} className="scroll-mt-28 border-y border-border bg-black py-16 text-foreground transition-shadow hover:shadow-[inset_0_0_48px_rgb(61_214_140/0.12)] sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHead
          file="worx4u.ts"
          title={product.name}
          titleClass={`${styles.chapter} ${styles.glitch} font-semibold text-foreground`}
        />
        <p className="mt-3 font-mono text-xs tracking-[0.16em] text-muted-foreground">{product.index} · text only</p>
        <ul className="mt-3 space-y-1 text-sm text-foreground">
          {product.titles?.map((title) => (
            <li key={title}>{title}</li>
          ))}
        </ul>
        <p className="mt-1 text-sm text-muted-foreground">{product.place}</p>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-foreground">{product.summary}</p>
        <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {product.points.map((point, index) => (
            <li key={point} className="rounded-lg border border-border bg-black p-4 transition-shadow hover:shadow-[0_0_24px_rgb(61_214_140/0.28)]">
              <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground">0{index + 1}</p>
              <p className="mt-2 text-sm font-medium text-foreground">{labels[index]}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{point}</p>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

/** Desktop Ramp preview is cropped. The lightbox still shows the full board. */
function ClientBoard({ board, cap = false, tone = "green" }: { board: BoardShot; cap?: boolean; tone?: "green" | "blue" }) {
  const frame =
    tone === "blue"
      ? "rounded-lg border border-[rgb(112_184_255/0.4)] bg-black p-2 transition-shadow hover:shadow-[0_0_28px_rgb(112_184_255/0.28)]"
      : "rounded-lg border border-border bg-black p-2 transition-shadow hover:shadow-[0_0_28px_rgb(61_214_140/0.28)]";
  const chip =
    tone === "blue"
      ? "border border-[rgb(112_184_255/0.45)]"
      : "border border-[rgb(61_214_140/0.45)]";

  return (
    <div className="mt-5">
      <BoardLightbox board={board}>
        <div className={frame}>
          <div className={cap ? "relative lg:h-[600px] lg:overflow-hidden" : undefined}>
            <Image
              src={board.src}
              alt={board.alt}
              width={board.width}
              height={board.height}
              sizes="(min-width: 1024px) 560px, 100vw"
              className={
                cap
                  ? "h-auto w-full rounded-md lg:!h-[600px] lg:!w-full lg:!object-cover lg:!object-top"
                  : "h-auto w-full rounded-md"
              }
            />
            {cap ? (
              <>
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-32 bg-gradient-to-t from-black to-transparent lg:block"
                  aria-hidden
                />
                <span className={`absolute bottom-3 left-3 hidden rounded-md bg-black px-2.5 py-1 font-mono text-xs text-[#e6e6e6] lg:inline ${chip}`}>
                  View full board
                </span>
              </>
            ) : null}
          </div>
        </div>
      </BoardLightbox>
      <p className={`mt-2 text-xs text-muted-foreground ${cap ? "lg:hidden" : ""}`}>Open the board</p>
    </div>
  );
}

function TurboChapter() {
  const pictured = TURBO.clients.filter((client) => client.board);
  const precision = TURBO.clients.find((client) => client.id === "precision-ai");

  return (
    <section id="turbo" className="scroll-mt-28 border-y border-[rgb(112_184_255/0.4)] bg-black py-16 transition-shadow hover:shadow-[inset_0_0_48px_rgb(112_184_255/0.1)] sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Image src={TURBO.logo} alt="" width={36} height={36} className="size-9 rounded-md bg-white object-contain p-1" />
          <p className="font-mono text-xs tracking-[0.16em] text-muted-foreground">Agency</p>
        </div>
        <SectionHead
          file="turbo.tsx"
          title={TURBO.name}
          titleClass={`${styles.chapter} ${styles.glitch} font-semibold text-foreground`}
        />
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
              {client.board && <ClientBoard board={client.board} cap={client.id === "ramp"} tone={client.id === "vondy" ? "blue" : "green"} />}
            </article>
          ))}
        </div>

        {precision && (
          <p className="mt-10 border-t border-border pt-6 text-sm text-foreground">
            <span className="font-medium">{precision.label}.</span> {precision.summary}
          </p>
        )}

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {DESIGN_STUDIES.map((study, index) => (
            <article key={study.id} className="min-w-0">
              <h3 className="text-lg font-semibold tracking-[-0.02em]">{study.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{study.meta}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{study.summary}</p>
              {study.image && (
                <div className="mt-4">
                  <BoardLightbox board={study.image}>
                    <div className={index % 2 === 0 ? "rounded-lg border border-border bg-black p-2 transition-shadow hover:shadow-[0_0_28px_rgb(61_214_140/0.28)]" : "rounded-lg border border-[rgb(112_184_255/0.4)] bg-black p-2 transition-shadow hover:shadow-[0_0_28px_rgb(112_184_255/0.28)]"}>
                      <Image
                        src={study.image.src}
                        alt={study.image.alt}
                        width={study.image.width}
                        height={study.image.height}
                        sizes="(min-width: 1024px) 560px, 100vw"
                        className="h-auto w-full rounded-md"
                      />
                    </div>
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
    <>
      <div id="work" className="scroll-mt-28">
        <div className="mx-auto w-full max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
          <p className="max-w-xl text-sm leading-relaxed text-foreground sm:text-base">
            A pattern across my work: tools that let people own and earn from what they make.
          </p>
        </div>
        {pictured.map((product, index) => (
          <ProductChapter key={product.id} product={product} priority={index === 0} />
        ))}
        <WorxChapter />
      </div>
      <TurboChapter />
    </>
  );
}

export function CareerLanding() {
  return (
    <div className="min-h-screen overflow-x-clip bg-background pb-0 text-foreground md:pb-[calc(2.25rem+env(safe-area-inset-bottom))]">
      <SiteHeader landingPage="career" customerDashboardEnabled={false} />
      <main>
        <section className={`${styles.hero} ${styles.crt} relative flex items-start overflow-hidden pt-20 sm:items-center sm:pt-24`}>
          <div className={`${styles.grid} pointer-events-none absolute inset-0`} aria-hidden />
          <div className={`${styles.glow} pointer-events-none absolute inset-0`} aria-hidden />
          <HeroAtmosphere />
          <div className={styles.vignette} aria-hidden />
          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-6 px-4 py-2 sm:gap-10 sm:px-6 sm:py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:py-16">
            <div className="min-w-0">
              <p className={`${styles.rise} font-mono text-xs tracking-[0.16em] text-muted-foreground`}>
                Fort Worth
              </p>
              <BootSequence />
              <ScrambleName className={`${styles.name} ${styles.rise} ${styles.d1} mt-2 font-semibold text-foreground sm:mt-4`} />
              <p className={`${styles.rise} ${styles.d2} mt-3 max-w-md text-base leading-snug text-foreground sm:mt-5 sm:text-lg`}>
                I build software that lets people earn from their own work: writers on{" "}
                <a href="#wewrite" className="text-brand underline decoration-brand/40 underline-offset-4">
                  WeWrite
                </a>
                , a local business on{" "}
                <a href="#lucent-wash" className="text-blue underline decoration-blue/40 underline-offset-4">
                  Lucent Wash
                </a>
                .
              </p>
              <div className={`${styles.rise} ${styles.d3} mt-3 sm:mt-5`}>
                <CtaRow primary />
              </div>
              <p className={`${styles.rise} ${styles.d4} mt-3 max-w-md text-sm leading-relaxed text-muted-foreground`}>
                Product + design engineer. I design in code and ship with AI agents.
              </p>
              <p className={`${styles.rise} ${styles.d4} mt-2 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base`}>
                8+ years across startups, agencies, and enterprise. Based in Fort Worth. Working remote or DFW.
              </p>
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

        <div className="sticky top-14 z-30 border-b border-border bg-black">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 sm:px-6">
            <div className="min-w-0 flex-1">
              <FloatingSectionNav sections={SECTIONS} />
            </div>
            <CareerCommand />
          </div>
        </div>

        <WorkAndDesign />

        <section id="lab" className="scroll-mt-28 border-y border-border bg-black py-16 sm:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHead
              file="builder-log.tsx"
              title="Builder log"
              titleClass={`${styles.chapter} ${styles.glitch} font-semibold text-foreground`}
            />
            <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted-foreground">
              Small tools from the same work: toggles, a quiet ASCII field, the WeWrite type migration, and the path from prompt to ship. Draft notes stay marked TODO.
            </p>
            <BuilderLab />
          </div>
        </section>

        <section id="experience" className="scroll-mt-28 border-y border-[rgb(112_184_255/0.4)] bg-black py-16 sm:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="flex items-end justify-between gap-4">
              <SectionHead
                file="experience.ts"
                title="Experience"
                titleClass={`${styles.glitch} text-sm font-medium tracking-[0.14em] text-muted-foreground uppercase`}
              />
              <Link href="/experience" className="text-sm text-brand underline-offset-4 hover:underline">
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
            <SectionHead
              file="contact.md"
              title={SOFT_CTA}
              titleClass={`${styles.glitch} max-w-xl text-2xl font-semibold tracking-[-0.03em] sm:text-3xl`}
            />
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
