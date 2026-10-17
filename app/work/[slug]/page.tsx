import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CareerShell } from "@/components/career-shell";
import { WorkDetail } from "@/components/work-detail";
import { WorkPageChrome } from "@/components/work-modal";
import { getWork, WORK_ENTRIES } from "@/lib/work-catalog";

type Params = { slug: string };

export function generateStaticParams() {
  return WORK_ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) return {};
  const title = `${work.name} | Jamie Gray`;
  const url = `https://www.jamiegray.net/work/${work.slug}`;
  return {
    title,
    description: work.description,
    openGraph: {
      title,
      description: work.description,
      url,
      siteName: "Jamie Gray",
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: work.description,
    },
  };
}

export default async function WorkPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  return (
    <CareerShell>
      <WorkPageChrome slug={slug} />
      <WorkDetail slug={slug} />
    </CareerShell>
  );
}
