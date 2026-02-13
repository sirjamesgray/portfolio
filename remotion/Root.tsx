import { Composition } from "remotion"
import { MarketingHero } from "./compositions/MarketingHero"
import { FeatureShowcase } from "./compositions/FeatureShowcase"
import { ProductDemo } from "./compositions/ProductDemo"
import { PortfolioShowcase } from "./compositions/PortfolioShowcase"
import { LogoReveal } from "./compositions/LogoReveal"
import { TestimonialVideo } from "./compositions/TestimonialVideo"
import { FeatureHighlight } from "./compositions/FeatureHighlight"
import { CallToAction } from "./compositions/CallToAction"
import { HeroVideo } from "./compositions/product-engineer/HeroVideo"
import { ProblemVideo } from "./compositions/product-engineer/ProblemVideo"
import { ApproachVideo } from "./compositions/product-engineer/ApproachVideo"
import { UIShowcaseVideo } from "./compositions/product-engineer/UIShowcaseVideo"
import { CTAVideo } from "./compositions/product-engineer/CTAVideo"
import { DeleteFigmaVideo } from "./compositions/product-engineer/DeleteFigmaVideo"
import { FullProductEngineerVideo } from "./compositions/product-engineer/FullProductEngineerVideo"

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Product Engineer Landing Page Videos */}

      {/* Full Video - Combined with Transitions - Horizontal (16:9) */}
      <Composition
        id="PE-Full-Horizontal"
        component={FullProductEngineerVideo}
        durationInFrames={1040}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          orientation: "horizontal",
        }}
      />

      {/* Full Video - Combined with Transitions - Vertical (9:16) */}
      <Composition
        id="PE-Full-Vertical"
        component={FullProductEngineerVideo}
        durationInFrames={1040}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          orientation: "vertical",
        }}
      />

      {/* Hero - Horizontal (16:9) */}
      <Composition
        id="PE-Hero-Horizontal"
        component={HeroVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          orientation: "horizontal",
        }}
      />

      {/* Hero - Vertical (9:16) */}
      <Composition
        id="PE-Hero-Vertical"
        component={HeroVideo}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          orientation: "vertical",
        }}
      />

      {/* Problem - Horizontal (16:9) */}
      <Composition
        id="PE-Problem-Horizontal"
        component={ProblemVideo}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          orientation: "horizontal",
        }}
      />

      {/* Problem - Vertical (9:16) */}
      <Composition
        id="PE-Problem-Vertical"
        component={ProblemVideo}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          orientation: "vertical",
        }}
      />

      {/* Approach - Horizontal (16:9) */}
      <Composition
        id="PE-Approach-Horizontal"
        component={ApproachVideo}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          orientation: "horizontal",
        }}
      />

      {/* Approach - Vertical (9:16) */}
      <Composition
        id="PE-Approach-Vertical"
        component={ApproachVideo}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          orientation: "vertical",
        }}
      />

      {/* UI Showcase - Horizontal (16:9) */}
      <Composition
        id="PE-UIShowcase-Horizontal"
        component={UIShowcaseVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          orientation: "horizontal",
        }}
      />

      {/* UI Showcase - Vertical (9:16) */}
      <Composition
        id="PE-UIShowcase-Vertical"
        component={UIShowcaseVideo}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          orientation: "vertical",
        }}
      />

      {/* CTA - Horizontal (16:9) */}
      <Composition
        id="PE-CTA-Horizontal"
        component={CTAVideo}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          orientation: "horizontal",
        }}
      />

      {/* CTA - Vertical (9:16) */}
      <Composition
        id="PE-CTA-Vertical"
        component={CTAVideo}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          orientation: "vertical",
        }}
      />

      {/* Delete Figma - Horizontal (16:9) */}
      <Composition
        id="PE-DeleteFigma-Horizontal"
        component={DeleteFigmaVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          orientation: "horizontal",
        }}
      />

      {/* Delete Figma - Vertical (9:16) */}
      <Composition
        id="PE-DeleteFigma-Vertical"
        component={DeleteFigmaVideo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          orientation: "vertical",
        }}
      />

      {/* Quick Marketing Videos */}
      <Composition
        id="MarketingHero"
        component={MarketingHero}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Build Beautiful Websites",
          subtitle: "Transform your ideas into stunning digital experiences",
        }}
      />
      <Composition
        id="FeatureShowcase"
        component={FeatureShowcase}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          features: [
            "Modern Design",
            "Responsive Layout",
            "Fast Performance",
            "SEO Optimized",
          ],
        }}
      />
      <Composition
        id="ProductDemo"
        component={ProductDemo}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          productName: "Portfolio Platform",
        }}
      />

      {/* Professional Marketing Videos */}
      <Composition
        id="LogoReveal"
        component={LogoReveal}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          brandName: "Jamie Gray",
          subtitle: "Web Development",
          accentColor: "#667eea",
        }}
      />

      <Composition
        id="PortfolioShowcase"
        component={PortfolioShowcase}
        durationInFrames={630}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          name: "Jamie Gray",
          tagline: "Building exceptional digital experiences",
          projects: [
            {
              title: "E-Commerce Platform",
              description: "Full-stack e-commerce solution with real-time inventory",
              tech: ["React", "Node.js", "PostgreSQL"],
            },
            {
              title: "Design System",
              description: "Comprehensive component library for enterprise apps",
              tech: ["TypeScript", "Storybook", "Tailwind"],
            },
            {
              title: "SaaS Dashboard",
              description: "Analytics platform with beautiful data visualizations",
              tech: ["Next.js", "D3.js", "Supabase"],
            },
          ],
        }}
      />

      <Composition
        id="TestimonialVideo"
        component={TestimonialVideo}
        durationInFrames={630}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          testimonials: [
            {
              quote: "Working with this team transformed our online presence. The attention to detail and innovative solutions exceeded our expectations.",
              author: "Sarah Chen",
              role: "CEO",
              company: "TechStart Inc",
              rating: 5,
            },
            {
              quote: "Incredible developer who delivers pixel-perfect implementations on time. Our conversion rate increased by 200% after the redesign.",
              author: "Michael Rodriguez",
              role: "Product Manager",
              company: "GrowthLabs",
              rating: 5,
            },
          ],
          accentColor: "#667eea",
        }}
      />

      <Composition
        id="FeatureHighlight"
        component={FeatureHighlight}
        durationInFrames={630}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Why Choose Us",
          features: [
            {
              icon: "⚡",
              title: "Lightning Fast",
              description: "Optimized for performance with sub-second load times",
              benefits: [
                "Advanced caching strategies",
                "Code splitting & lazy loading",
                "CDN integration",
              ],
            },
            {
              icon: "🎨",
              title: "Pixel Perfect Design",
              description: "Beautiful interfaces that convert visitors to customers",
              benefits: [
                "Mobile-first responsive design",
                "Accessibility compliance",
                "Brand consistency",
              ],
            },
            {
              icon: "🔒",
              title: "Enterprise Security",
              description: "Bank-level security to protect your data",
              benefits: [
                "End-to-end encryption",
                "Regular security audits",
                "GDPR compliant",
              ],
            },
          ],
          accentColor: "#667eea",
        }}
      />

      <Composition
        id="CallToAction"
        component={CallToAction}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          headline: "Ready to Transform Your Business?",
          subheadline: "Join hundreds of satisfied clients who have elevated their digital presence",
          buttonText: "Start Your Project",
          urgencyText: "Limited spots available this month",
          accentColor: "#667eea",
        }}
      />

      {/* Social Media Sizes */}
      <Composition
        id="InstagramSquare-CTA"
        component={CallToAction}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          headline: "Let's Build Something Amazing",
          subheadline: "Professional web development that drives results",
          buttonText: "Get Started",
          urgencyText: "Book your free consultation",
          accentColor: "#667eea",
        }}
      />

      <Composition
        id="InstagramStory-LogoReveal"
        component={LogoReveal}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          brandName: "Jamie Gray",
          subtitle: "Web Dev",
          accentColor: "#667eea",
        }}
      />
    </>
  )
}
