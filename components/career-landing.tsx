import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { LaptopFrame, PhoneFrame, StudyFrame } from "@/components/device-frame";
import { RESUME_PATH, SITE_CONFIG, SOCIALS } from "@/lib/constants";
import { RESUME_DATA } from "@/lib/resume-data";
import {
  DESIGN_STUDIES,
  PARKHUB_NOTE,
  PUBLIC_PRODUCTS,
  type PublicProduct,
} from "@/lib/public-work";
import styles from "./career-landing.module.css";

const SOFT_CTA =
  "Open to senior product & design engineering conversations — remote or DFW";

function ProductBlock({ product, priority = false }: { product: PublicProduct; priority?: boolean }) {
  const hasShots = Boolean(product.desktop || product.mobile);

  return (
    <article id={product.id} className="scroll-mt-24 border-t border-border py-14 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
        <div>
          <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground">
            {product.index}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
            {product.name}
          </h2>
          <p className="mt-2 text-sm text-foreground">{product.role}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {product.place} · {product.dates}
          </p>
          <p className="mt-5 max-w-prose text-base leading-relaxed text-muted-foreground">
            {product.summary}
          </p>
          <ul className="mt-5 max-w-prose space-y-2.5 text-sm leading-relaxed text-foreground">
            {product.points.map((point) => (
              <li key={point} className="border-l border-brand pl-3">
                {point}
              </li>
            ))}
          </ul>
          {product.href && product.hrefLabel && (
            <a
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex text-sm font-medium text-foreground underline decoration-brand decoration-2 underline-offset-4"
            >
              {product.hrefLabel}
            </a>
          )}
        </div>

        {hasShots && (
          <div className="grid items-end gap-6 sm:grid-cols-[minmax(0,1fr)_168px] sm:gap-5">
            <div className="min-w-0 space-y-6">
              {product.desktop && <LaptopFrame shot={product.desktop} priority={priority} />}
              {product.fullPage && <LaptopFrame shot={product.fullPage} scroll />}
            </div>
            {product.mobile && (
              <div className="min-w-0 sm:pb-6">
                <PhoneFrame shot={product.mobile} priority={priority} />
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function WorkAndDesign({ heading = "h2" }: { heading?: "h1" | "h2" }) {
  const Heading = heading;

  return (
    <>
      <section id="work" className="scroll-mt-24">
        <Heading className="text-sm font-medium tracking-[0.14em] text-muted-foreground uppercase">
          Selected work
        </Heading>
        {PUBLIC_PRODUCTS.map((product, index) => (
          <ProductBlock key={product.id} product={product} priority={index === 0} />
        ))}
      </section>

      <section id="design" className="scroll-mt-24 border-t border-border py-14 sm:py-20">
        <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground">04</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          Design history
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Before I shipped in code full time, I designed product at agencies and startups. These boards are from that work.
        </p>
        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          {DESIGN_STUDIES.map((study) => (
            <article key={study.id} className="min-w-0">
              {study.image && <StudyFrame shot={study.image} />}
              <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em]">{study.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{study.meta}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{study.summary}</p>
            </article>
          ))}
        </div>
        <article className="mt-10 border-t border-border pt-8">
          <h3 className="text-lg font-semibold tracking-[-0.02em]">{PARKHUB_NOTE.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{PARKHUB_NOTE.meta}</p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {PARKHUB_NOTE.summary}
          </p>
        </article>
      </section>
    </>
  );
}

export function CareerLanding() {
  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHeader landingPage="career" customerDashboardEnabled={false} />

      <main className="mx-auto w-full max-w-6xl px-4 pb-8 pt-20 sm:px-6 sm:pt-24">
        <section className="pb-14 pt-6 sm:pb-20 sm:pt-10">
          <p className={`${styles.rise} font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase`}>
            Product Engineer / Design Engineer
          </p>
          <h1
            className={`${styles.rise} ${styles.d1} mt-4 max-w-4xl text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground min-[380px]:text-4xl sm:text-6xl`}
          >
            Jamie Gray
          </h1>
          <p
            className={`${styles.rise} ${styles.d2} mt-5 max-w-xl text-lg leading-snug tracking-[-0.02em] text-foreground sm:text-2xl`}
          >
            I design in code and ship real products with AI agents.
          </p>
          <p className={`${styles.rise} ${styles.d3} mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base`}>
            8+ years across startups, agencies, and enterprise. Based in Fort Worth. Working remote or DFW.
          </p>
          <p
            className={`${styles.rise} ${styles.d4} mt-8 max-w-xl border-l-2 border-brand pl-4 text-sm leading-relaxed text-foreground sm:text-base`}
          >
            {SOFT_CTA}
          </p>
          <div className={`${styles.rise} ${styles.d5} mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium`}>
            <a
              href={RESUME_PATH}
              className="underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
            >
              Download resume
            </a>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
            >
              Email {SITE_CONFIG.email}
            </a>
            <a
              href={SOCIALS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
            >
              LinkedIn
            </a>
          </div>
        </section>

        <WorkAndDesign />

        <section id="experience" className="scroll-mt-24 border-t border-border py-14 sm:py-20">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-sm font-medium tracking-[0.14em] text-muted-foreground uppercase">
              Experience
            </h2>
            <Link href="/experience" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              Full timeline
            </Link>
          </div>
          <ol className="mt-8 divide-y divide-border border-y border-border">
            {RESUME_DATA.experience.map((job) => {
              const positions = "positions" in job ? job.positions : undefined;
              return (
              <li key={job.company} className="grid gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-8">
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
                </div>
                <p className="font-mono text-xs text-muted-foreground sm:text-right">
                  {job.startDate} – {job.endDate}
                </p>
              </li>
              );
            })}
          </ol>
        </section>

        <section id="contact" className="scroll-mt-24 border-t border-border py-14 sm:py-20">
          <h2 className="max-w-xl text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
            {SOFT_CTA}
          </h2>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium">
            <a href={RESUME_PATH} className="underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground">
              Download resume
            </a>
            <a href={`mailto:${SITE_CONFIG.email}`} className="underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground">
              Email {SITE_CONFIG.email}
            </a>
            <a
              href={SOCIALS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
            >
              LinkedIn
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
