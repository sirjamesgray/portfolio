import { cookies } from "next/headers";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { CareerTimeline } from "@/components/career-timeline";
import { CareerBackdrop } from "@/components/career-backdrop";
import { SectionHead } from "@/components/section-head";
import { CareerButton } from "@/components/career-button";
import { Download, Mail } from "lucide-react";
import { RESUME_DATA } from "@/lib/resume-data";
import { RECRUITER_PROJECTS } from "@/lib/recruiter-projects";
import { RESUME_PATH, SITE_CONFIG } from "@/lib/constants";
import { RECRUITER_COOKIE, verifySessionToken, isRecruiterConfigured } from "@/lib/recruiter-auth";
import { RecruiterGate, RecruiterLock } from "./gate";
import styles from "@/components/career-system.module.css";

// The page reads the cookie, so it is never cached or prerendered.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// Fail closed. Any error, or a missing secret, returns null and the page shows the lock.
async function getSession() {
  try {
    if (!isRecruiterConfigured()) return null;
    const token = (await cookies()).get(RECRUITER_COOKIE)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export default async function RecruitersPage() {
  const session = await getSession();
  const configured = isRecruiterConfigured();

  return (
    <div className="relative min-h-screen bg-black text-foreground">
      <CareerBackdrop />
      <SiteHeader landingPage="career" customerDashboardEnabled={false} />
      <main className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-16 pt-24 sm:px-6">
        <SectionHead index="R" title="Recruiters" as="h1" />
        {!session ? (
          <>
            <p className={`${styles.body} mt-4 max-w-xl`}>
              Fuller work history and project notes. Enter the password I sent you.
            </p>
            <RecruiterGate configured={configured} />
          </>
        ) : (
          <Unlocked name={session.visitor_name} />
        )}
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

function Unlocked({ name }: { name: string }) {
  return (
    <>
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className={`${styles.body} max-w-xl`}>
          Hi {name}. Open to the right opportunity. This page has the fuller detail.
        </p>
        <RecruiterLock />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <CareerButton variant="primary" icon={Download} href={RESUME_PATH} aria-label="Download resume">
          Download resume (v32)
        </CareerButton>
        <CareerButton variant="secondary" icon={Mail} href={`mailto:${SITE_CONFIG.email}`}>
          Email
        </CareerButton>
      </div>
      <dl className={`${styles.glance} mt-6`}>
        <div>
          <dt className={styles.kicker}>Phone</dt>
          <dd className={styles.small}>{RESUME_DATA.basics.phone}</dd>
        </div>
        <div>
          <dt className={styles.kicker}>Location</dt>
          <dd className={styles.small}>{RESUME_DATA.basics.location}</dd>
        </div>
        <div>
          <dt className={styles.kicker}>Compensation</dt>
          <dd className={styles.small}>TODO: Jamie to confirm</dd>
        </div>
        <div>
          <dt className={styles.kicker}>Notice period / start date</dt>
          <dd className={styles.small}>TODO: Jamie to confirm</dd>
        </div>
      </dl>

      <section className="mt-12">
        <SectionHead index="01" title="Summary" />
        <p className={`${styles.small} mt-3 max-w-prose text-foreground`}>{RESUME_DATA.basics.summary}</p>
      </section>

      <section className="mt-12">
        <SectionHead index="02" title="Full work history" />
        <CareerTimeline
          jobs={RESUME_DATA.experience}
          detailed
          extra={() => (
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">Reference contact: TODO (Jamie to confirm)</p>
          )}
        />
      </section>

      <section className="mt-12">
        <SectionHead index="03" title="Project detail" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {RECRUITER_PROJECTS.map((p) => (
            <article key={p.id} className={styles.card}>
              <h3 className="text-base font-medium text-foreground">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.subtitle}</p>
              <p className="font-mono text-xs text-blue">
                {p.timeline} · {p.role}
              </p>
              <p className="text-sm leading-relaxed text-foreground">{p.description}</p>
              <p className={styles.kicker}>Challenges</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {p.challenges.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <p className={styles.kicker}>Architecture</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {p.architecture.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <p className="text-sm text-foreground">{p.impact}</p>
              <div className={styles.tags}>
                {p.tags.map((t) => (
                  <span key={t} className={styles.tag}>
                    {t}
                  </span>
                ))}
              </div>
              {p.links.live ? (
                <a href={p.links.live} target="_blank" rel="noopener noreferrer" className="text-sm text-brand underline underline-offset-4">
                  {p.links.live.replace("https://", "")}
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionHead index="04" title="Skills and tools" />
        <div className={`${styles.tags} mt-4`}>
          {[...RESUME_DATA.skills, ...RESUME_DATA.tools].map((t) => (
            <span key={t} className={styles.tag}>
              {t}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
