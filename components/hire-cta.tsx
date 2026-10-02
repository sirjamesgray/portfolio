import { Download, Linkedin, Mail } from "lucide-react";
import { CareerButton } from "@/components/career-button";
import { RESUME_PATH, SITE_CONFIG, SOCIALS } from "@/lib/constants";
import { RESUME_CORE_STACK, RESUME_YEARS } from "@/lib/resume-data";
import styles from "./career-system.module.css";

/** Facts a hiring manager can read in one pass. Years and stack come from resume v32. */
export function AtAGlance() {
  return (
    <dl className={styles.glance}>
      <div>
        <dt className={styles.kicker}>Role sought</dt>
        <dd className={styles.small}>Senior Full-Stack / Product Engineer</dd>
      </div>
      <div>
        <dt className={styles.kicker}>Location</dt>
        <dd className={styles.small}>Fort Worth, remote or DFW</dd>
      </div>
      <div>
        <dt className={styles.kicker}>Years</dt>
        <dd className={styles.small}>{RESUME_YEARS}</dd>
      </div>
      <div>
        <dt className={styles.kicker}>Availability</dt>
        <dd className={styles.small}>Open to new roles</dd>
      </div>
      <div className={styles.stackWide}>
        <dt className={styles.kicker}>Core stack</dt>
        <dd className={styles.tags}>
          {RESUME_CORE_STACK.map((tool) => (
            <span key={tool} className={styles.tag}>
              {tool}
            </span>
          ))}
        </dd>
      </div>
    </dl>
  );
}

/** Download is primary. Email and LinkedIn share one secondary style. */
export function HireCta() {
  return (
    <div className={styles.row}>
      <CareerButton variant="primary" icon={Download} href={RESUME_PATH}>
        Download resume
      </CareerButton>
      <CareerButton variant="secondary" icon={Mail} href={`mailto:${SITE_CONFIG.email}`}>
        Email
      </CareerButton>
      <CareerButton variant="secondary" icon={Linkedin} href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer">
        LinkedIn
      </CareerButton>
    </div>
  );
}
