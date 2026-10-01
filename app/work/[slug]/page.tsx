import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
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
    <div className="min-h-screen bg-black text-foreground">
      <SiteHeader landingPage="career" customerDashboardEnabled={false} />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-24 sm:px-6">
        <WorkPageChrome slug={slug} />
        <WorkDetail slug={slug} />
      </main>
      <Footer />
    </div>
  );
}
