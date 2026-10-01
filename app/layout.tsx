import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CAREER_DESCRIPTION, CAREER_OG_IMAGE, CAREER_TITLE } from "@/lib/career-meta";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  colorScheme: "dark",
  themeColor: "#000000",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jamiegray.net"),
  title: {
    default: CAREER_TITLE,
    template: "%s",
  },
  description: CAREER_DESCRIPTION,
  openGraph: {
    title: CAREER_TITLE,
    description: CAREER_DESCRIPTION,
    url: "https://www.jamiegray.net",
    siteName: "Jamie Gray",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: CAREER_OG_IMAGE.url,
        width: CAREER_OG_IMAGE.width,
        height: CAREER_OG_IMAGE.height,
        alt: CAREER_OG_IMAGE.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: CAREER_TITLE,
    description: CAREER_DESCRIPTION,
    creator: "@jamiegraytech",
    images: ["/opengraph-image"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://www.jamiegray.net/#person",
      name: "Jamie Gray",
      url: "https://www.jamiegray.net",
      jobTitle: "Full Stack Developer",
      description:
        "Full Stack Developer, previously a Product Designer. Builds software that lets people earn from their own work. Writers on WeWrite. A local business on Lucent Wash. Based in Fort Worth.",
      sameAs: [
        "https://x.com/jamiegraytech",
        "https://www.linkedin.com/in/jamiegraytech/",
      ],
      knowsAbout: [
        "Product Design",
        "UX Design",
        "Software Engineering",
        "React",
        "Next.js",
        "TypeScript",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.jamiegray.net/#website",
      url: "https://www.jamiegray.net",
      name: "Jamie Gray",
      publisher: { "@id": "https://www.jamiegray.net/#person" },
    },
    {
      "@type": "ProfilePage",
      "@id": "https://www.jamiegray.net/#profilepage",
      url: "https://www.jamiegray.net",
      name: "Jamie Gray | Full Stack Developer",
      mainEntity: { "@id": "https://www.jamiegray.net/#person" },
    },
  ],
};

export default function RootLayout({
  children,
  modal,
}: LayoutProps<"/"> & { modal?: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {modal}
        {process.env.VERCEL ? <Analytics /> : null}
        {process.env.VERCEL ? <SpeedInsights /> : null}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
