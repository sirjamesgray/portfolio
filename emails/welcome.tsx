import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import { EmailLogo } from "./components"

interface WelcomeEmailProps {
  name: string
  dashboardUrl: string
}

export function WelcomeEmail({ name, dashboardUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Jamie Gray Web Development - Let&apos;s build something great!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo/Brand Header */}
          <EmailLogo />

          {/* Main Content */}
          <Section style={contentSection}>
            <Heading style={h1}>Welcome, {name}!</Heading>
            <Text style={paragraph}>
              I&apos;m thrilled to have you on board! Thank you for choosing to work with me on your project.
            </Text>

            {/* Feature Cards */}
            <Section style={featuresSection}>
              <div style={featureCard}>
                <Text style={featureIcon}>📊</Text>
                <Text style={featureTitle}>Track Progress</Text>
                <Text style={featureText}>Follow your project&apos;s journey from start to finish</Text>
              </div>
              <div style={featureCard}>
                <Text style={featureIcon}>💬</Text>
                <Text style={featureTitle}>Easy Communication</Text>
                <Text style={featureText}>Chat directly with me about your project</Text>
              </div>
              <div style={featureCard}>
                <Text style={featureIcon}>📁</Text>
                <Text style={featureTitle}>Manage Files</Text>
                <Text style={featureText}>Access all your project files in one place</Text>
              </div>
            </Section>

            <Section style={buttonContainer}>
              <Button style={button} href={dashboardUrl}>
                View Your Dashboard
              </Button>
            </Section>

            <Text style={secondaryParagraph}>
              I&apos;ll be in touch soon to discuss your project in more detail. In the meantime, feel free to explore your dashboard and let me know if you have any questions.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Signature */}
          <Section style={signatureSection}>
            <Text style={signatureText}>Looking forward to working with you!</Text>
            <Text style={signatureName}>Jamie Gray</Text>
            <Text style={signatureTitle}>Product Engineer</Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerBrand}>
              Jamie Gray Web Development
            </Text>
            <Text style={footerLinks}>
              <Link href="https://jamiegray.net" style={footerLink}>Website</Link>
              {" • "}
              <Link href="https://x.com/jamiegraytech" style={footerLink}>X</Link>
              {" • "}
              <Link href="https://linkedin.com/in/jamiegraytech" style={footerLink}>LinkedIn</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail

const main = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: "40px 0",
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  borderRadius: "16px",
  maxWidth: "540px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  overflow: "hidden" as const,
}

const contentSection = {
  padding: "40px 40px 32px",
}

const h1 = {
  color: "#18181b",
  fontSize: "28px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 16px",
  textAlign: "center" as const,
}

const paragraph = {
  color: "#52525b",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 32px",
  textAlign: "center" as const,
}

const featuresSection = {
  marginBottom: "32px",
}

const featureCard = {
  backgroundColor: "#fafafa",
  borderRadius: "12px",
  padding: "16px 20px",
  marginBottom: "12px",
  border: "1px solid #e4e4e7",
}

const featureIcon = {
  fontSize: "20px",
  margin: "0 0 4px",
}

const featureTitle = {
  color: "#18181b",
  fontSize: "15px",
  fontWeight: "600",
  margin: "0 0 4px",
}

const featureText = {
  color: "#71717a",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "0",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "0 0 24px",
}

const button = {
  backgroundColor: "#10b981",
  borderRadius: "12px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 40px",
  boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.4)",
}

const secondaryParagraph = {
  color: "#71717a",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0",
  textAlign: "center" as const,
}

const divider = {
  borderColor: "#e4e4e7",
  borderWidth: "1px",
  margin: "0 40px",
}

const signatureSection = {
  padding: "24px 40px",
  textAlign: "center" as const,
}

const signatureText = {
  color: "#52525b",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 8px",
}

const signatureName = {
  color: "#18181b",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0",
}

const signatureTitle = {
  color: "#71717a",
  fontSize: "13px",
  margin: "4px 0 0",
}

const footer = {
  backgroundColor: "#fafafa",
  padding: "24px 40px",
  borderTop: "1px solid #e4e4e7",
  textAlign: "center" as const,
}

const footerBrand = {
  color: "#71717a",
  fontSize: "13px",
  fontWeight: "600",
  margin: "0 0 8px",
}

const footerLinks = {
  color: "#a1a1aa",
  fontSize: "12px",
  margin: "0",
}

const footerLink = {
  color: "#10b981",
  textDecoration: "none",
}
