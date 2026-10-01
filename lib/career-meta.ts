import type { Metadata } from "next";

export const CAREER_TITLE = "Jamie Gray — Software that lets people earn from their own work";

export const CAREER_DESCRIPTION =
  "I build software that lets people earn from their own work: writers on WeWrite, a local business on Lucent Wash. Full Stack Developer, previously a Product Designer, in Fort Worth. Remote or DFW.";

export const CAREER_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Jamie Gray, Full Stack Developer",
} as const;

export function careerMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = `https://www.jamiegray.net${path}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Jamie Gray",
      locale: "en_US",
      type: "website",
      images: [CAREER_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@jamiegraytech",
      images: [CAREER_OG_IMAGE.url],
    },
  };
}
