import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { CareerBackdrop } from "@/components/career-backdrop";

/**
 * One page frame for every public route: backdrop, square header, content, footer.
 * Use it so standalone pages match the home page.
 */
export function CareerShell({
  children,
  width = "max-w-6xl",
  bare = false,
}: {
  children: React.ReactNode;
  width?: string;
  /** Full width main for pages whose sections set their own container. */
  bare?: boolean;
}) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-black text-foreground">
      <CareerBackdrop />
      <SiteHeader landingPage="career" customerDashboardEnabled={false} />
      <main className={bare ? "relative z-10 pb-4 pt-20" : `relative z-10 mx-auto w-full ${width} px-4 pb-16 pt-24 sm:px-6`}>{children}</main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
