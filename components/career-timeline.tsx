import Image from "next/image";
import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import styles from "./career-timeline.module.css";

type Job = {
  company: string;
  role: string;
  context?: string;
  location?: string;
  startDate: string;
  endDate: string;
  highlights?: readonly string[];
  positions?: readonly { title: string; startDate: string; endDate: string }[];
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// "Present" counts as this month. The scale starts at the first job.
const NOW = 2026 * 12 + 9;

function monthIndex(label: string): number {
  if (label === "Present") return NOW;
  const [month, year] = label.split(" ");
  return Number(year) * 12 + MONTHS.indexOf(month);
}

/**
 * Vertical career timeline. Each role has a flat span bar scaled to the whole career.
 * The current role pulses. Reduced motion stops the pulse.
 */
export function CareerTimeline({
  jobs,
  detailed = false,
  logoFor,
  extra,
}: {
  jobs: readonly Job[];
  detailed?: boolean;
  logoFor?: (company: string) => string;
  extra?: (job: Job) => ReactNode;
}) {
  const start = Math.min(...jobs.map((job) => monthIndex(job.startDate)));
  const total = NOW - start || 1;

  return (
    <ol className={styles.rail}>
      {jobs.map((job, index) => {
        const current = job.endDate === "Present";
        const from = ((monthIndex(job.startDate) - start) / total) * 100;
        const width = Math.max(((monthIndex(job.endDate) - monthIndex(job.startDate)) / total) * 100, 1.5);
        const logo = logoFor?.(job.company);
        return (
          <Reveal as="li" key={job.company} delay={index * 60} className={styles.item} data-current={current ? "true" : "false"}>
            <span className={styles.node} aria-hidden />
            <div className={styles.head}>
              {logo ? (
                <Image src={logo} alt="" width={36} height={36} className={styles.logo} />
              ) : null}
              <div className="min-w-0">
                <p className={styles.company}>
                  {job.company}
                  {job.context ? <span className={styles.context}> · {job.context}</span> : null}
                  {current ? <span className={styles.now}>NOW</span> : null}
                </p>
                {job.positions && job.positions.length > 0 ? (
                  <ul className={styles.positions}>
                    {job.positions.map((position) => (
                      <li key={position.title}>
                        {position.title}
                        <span> · {position.startDate}–{position.endDate}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.role}>
                    {job.role}
                    {detailed && job.location ? ` · ${job.location}` : ""}
                  </p>
                )}
                <p className={styles.dates}>
                  {job.startDate} – {job.endDate}
                </p>
                <div
                  className={styles.track}
                  role="img"
                  aria-label={`${job.startDate} to ${job.endDate} on the career span`}
                >
                  <span className={styles.fill} style={{ left: `${from}%`, width: `${width}%` }} />
                </div>
              </div>
            </div>
            {detailed && job.highlights ? (
              <ul className={styles.highlights}>
                {job.highlights.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : null}
            {extra?.(job)}
          </Reveal>
        );
      })}
    </ol>
  );
}
