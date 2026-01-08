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

interface ProjectUpdateEmailProps {
  name: string
  projectName: string
  updateMessage: string
  dashboardUrl: string
}

export function ProjectUpdateEmail({
  name,
  projectName,
  updateMessage,
  dashboardUrl
}: ProjectUpdateEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Update on your project: {projectName}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo/Brand Header */}
          <EmailLogo />

          {/* Main Content */}
          <Section style={contentSection}>
            <Text style={greeting}>Hi {name},</Text>
            <Heading style={h1}>Project Update</Heading>

            {/* Project Badge */}
            <Section style={projectBadgeContainer}>
              <div style={projectBadge}>
                <Text style={projectBadgeLabel}>Project</Text>
                <Text style={projectBadgeName}>{projectName}</Text>
              </div>
            </Section>

            {/* Update Message Box */}
            <Section style={updateBox}>
              <Text style={updateLabel}>What&apos;s New</Text>
              <Text style={updateText}>{updateMessage}</Text>
            </Section>

            <Section style={buttonContainer}>
              <Button style={button} href={dashboardUrl}>
                View Project Details
              </Button>
            </Section>

            <Text style={secondaryParagraph}>
              Have questions about this update? Simply reply to this email or reach out through your dashboard.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Signature */}
          <Section style={signatureSection}>
            <Text style={signatureText}>Thanks for your continued trust!</Text>
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

export default ProjectUpdateEmail

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

const greeting = {
  color: "#71717a",
  fontSize: "14px",
  margin: "0 0 8px",
  textAlign: "center" as const,
}

const h1 = {
  color: "#18181b",
  fontSize: "28px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 24px",
  textAlign: "center" as const,
}

const projectBadgeContainer = {
  textAlign: "center" as const,
  marginBottom: "24px",
}

const projectBadge = {
  backgroundColor: "#ecfdf5",
  border: "1px solid #a7f3d0",
  borderRadius: "12px",
  padding: "12px 20px",
  display: "inline-block",
}

const projectBadgeLabel = {
  color: "#10b981",
  fontSize: "11px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 2px",
}

const projectBadgeName = {
  color: "#065f46",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0",
}

const updateBox = {
  backgroundColor: "#fafafa",
  borderRadius: "12px",
  padding: "20px 24px",
  marginBottom: "24px",
  border: "1px solid #e4e4e7",
  borderLeft: "4px solid #10b981",
}

const updateLabel = {
  color: "#10b981",
  fontSize: "11px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 8px",
}

const updateText = {
  color: "#374151",
  fontSize: "15px",
  lineHeight: "26px",
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
