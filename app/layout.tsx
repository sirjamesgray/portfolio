import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
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
    default: "Jamie Gray — Product Engineer & Design Engineer",
    template: "%s",
  },
  description:
    "I design in code and ship real products with AI agents. 8+ years across startups, agencies, and enterprise. Based in Fort Worth. Remote or DFW.",
  openGraph: {
    title: "Jamie Gray — Product Engineer & Design Engineer",
    description:
      "I design in code and ship real products with AI agents. 8+ years across startups, agencies, and enterprise. Based in Fort Worth. Remote or DFW.",
    url: "https://www.jamiegray.net",
    siteName: "Jamie Gray",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Jamie Gray, Product Engineer and Design Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jamie Gray — Product Engineer & Design Engineer",
    description:
      "I design in code and ship real products with AI agents. Based in Fort Worth. Remote or DFW.",
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
      jobTitle: "Product Engineer / Design Engineer",
      description:
        "Product engineer and design engineer who designs in code and ships real products with AI agents. Based in Fort Worth.",
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
      name: "Jamie Gray | Product Engineer",
      mainEntity: { "@id": "https://www.jamiegray.net/#person" },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
