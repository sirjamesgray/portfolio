import type { Metadata } from "next";
import Link from "next/link";
import {
  BriefcaseBusiness,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Wrench,
} from "lucide-react";
import { RESUME_DATA } from "@/lib/resume-data";
import { PrintButton } from "./print-button";
import styles from "./resume.module.css";

export const metadata: Metadata = {
  title: "Resume | Jamie Gray",
  description: "Jamie Gray's product engineering and product design experience.",
};

function displayUrl(value: string) {
  return value.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

function displayPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10
    ? `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
    : value;
}

export default function ResumePage() {
  const { basics, experience, skills, tools } = RESUME_DATA;

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-900 print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex max-w-[8.5in] items-center justify-between gap-4 print:hidden">
        <div>
          <p className="text-sm font-semibold">Generated résumé draft</p>
          <p className="text-xs text-zinc-600">The original PDF is still available.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/documents/resume.pdf"
            className="text-sm font-medium text-zinc-700 underline underline-offset-4"
          >
            View old résumé
          </Link>
          <PrintButton />
        </div>
      </div>

      <article
        className={`${styles.sheet} mx-auto overflow-hidden bg-white shadow-xl print:shadow-none`}
      >
        <header className="bg-zinc-950 px-[0.58in] py-[0.42in] text-white">
          <div className="flex items-start justify-between gap-8">
            <div>
              <h1 className="text-[31px] font-bold leading-none tracking-[-0.035em]">{basics.name}</h1>
              <p className="mt-2 text-[14px] font-medium text-emerald-400">{basics.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-1.5 text-[8.5px] text-zinc-300">
              <a className="flex items-center gap-1.5" href={`mailto:${basics.email}`}><Mail className="size-3 text-emerald-400" />{basics.email}</a>
              <span className="flex items-center gap-1.5"><MapPin className="size-3 text-emerald-400" />{basics.location}</span>
              <a className="flex items-center gap-1.5" href={`tel:${basics.phone}`}><Phone className="size-3 text-emerald-400" />{displayPhone(basics.phone)}</a>
              <a className="flex items-center gap-1.5" href={basics.website}><Globe className="size-3 text-emerald-400" />{displayUrl(basics.website)}</a>
              <a className="flex items-center gap-1.5" href={basics.linkedin}><Linkedin className="size-3 text-emerald-400" />LinkedIn</a>
              <a className="flex items-center gap-1.5" href={basics.github}><Github className="size-3 text-emerald-400" />GitHub</a>
            </div>
          </div>
        </header>

        <section className="mx-[0.58in] mt-5 border-b border-zinc-200 pb-4">
          <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-800">
            <Sparkles className="size-3.5" /> Profile
          </h2>
          <p className="mt-2 text-[10px] leading-[1.55] text-zinc-700">{basics.summary}</p>
        </section>

        <div className="mx-[0.58in] mt-5 grid grid-cols-[minmax(0,1fr)_1.7in] gap-8 pb-[0.45in]">
        <section>
          <h2 className="flex items-center gap-2 border-b border-zinc-300 pb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-800">
            <BriefcaseBusiness className="size-3.5" /> Experience
          </h2>
          <div className="mt-3 space-y-3">
            {experience.map((job) => (
              <div key={`${job.company}-${job.startDate}`} className="break-inside-avoid">
                <div className="flex items-baseline justify-between gap-5">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-[10.5px] font-bold">{job.role}</h3>
                    <p className="text-[9.5px] font-medium text-emerald-800">
                      {job.company}{job.context ? ` · ${job.context}` : ""}
                    </p>
                  </div>
                  <p className="shrink-0 text-[8.5px] font-medium text-zinc-500">
                    {job.startDate} – {job.endDate}
                  </p>
                </div>
                <p className="mt-0.5 text-[8px] text-zinc-500">{job.location}</p>
                {job.highlights.length > 0 && (
                  <ul className="mt-1.5 list-disc space-y-0.5 pl-3.5 text-[8.5px] leading-[1.4] text-zinc-700 marker:text-emerald-700">
                    {job.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6 border-l border-zinc-200 pl-5">
          <section className="break-inside-avoid">
            <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-800">
              <Sparkles className="size-3.5" /> Capabilities
            </h2>
            <ul className="mt-3 space-y-1.5 text-[9px] leading-[1.35] text-zinc-700">
              {skills.map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          </section>
          <section className="break-inside-avoid">
            <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-800">
              <Wrench className="size-3.5" /> Tools
            </h2>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {tools.map((tool) => <li className="rounded bg-zinc-100 px-2 py-1 text-[8px] text-zinc-700" key={tool}>{tool}</li>)}
            </ul>
          </section>
        </aside>
        </div>
      </article>
    </main>
  );
}
