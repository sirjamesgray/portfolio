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

interface ProjectSubmittedEmailProps {
  name: string
  projectType: string
  loginUrl: string
}

export function ProjectSubmittedEmail({ name, projectType, loginUrl }: ProjectSubmittedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Thanks for your project request! I'll be in touch soon.</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo/Brand Header */}
          <EmailLogo />

          {/* Main Content */}
          <Section style={contentSection}>
            <Heading style={h1}>Thanks for reaching out, {name}!</Heading>
            <Text style={paragraph}>
              I've received your {projectType.toLowerCase()} project request and I'm excited to learn more about what you're building.
            </Text>

            {/* What's Next */}
            <Section style={stepsSection}>
              <Text style={stepsTitle}>What happens next?</Text>
              <div style={stepCard}>
                <Text style={stepNumber}>1</Text>
                <div style={stepContent}>
                  <Text style={stepHeading}>I'll review your request</Text>
                  <Text style={stepText}>I'll look through your project details and prepare some initial thoughts.</Text>
                </div>
              </div>
              <div style={stepCard}>
                <Text style={stepNumber}>2</Text>
                <div style={stepContent}>
                  <Text style={stepHeading}>Schedule a consultation</Text>
                  <Text style={stepText}>We'll hop on a quick call to discuss your project in detail.</Text>
                </div>
              </div>
              <div style={stepCard}>
                <Text style={stepNumber}>3</Text>
                <div style={stepContent}>
                  <Text style={stepHeading}>Receive a quote</Text>
                  <Text style={stepText}>I'll put together a detailed proposal with timeline and pricing.</Text>
                </div>
              </div>
            </Section>

            <Section style={buttonContainer}>
              <Button style={button} href={loginUrl}>
                Log In to View Your Project
              </Button>
            </Section>

            <Text style={secondaryParagraph}>
              I typically respond within 24 hours. If you have any urgent questions, feel free to reply to this email.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Signature */}
          <Section style={signatureSection}>
            <Text style={signatureText}>Talk soon!</Text>
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

export default ProjectSubmittedEmail

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
  fontSize: "26px",
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

const stepsSection = {
  marginBottom: "32px",
}

const stepsTitle = {
  color: "#18181b",
  fontSize: "15px",
  fontWeight: "600",
  margin: "0 0 16px",
  textAlign: "center" as const,
}

const stepCard = {
  display: "flex" as const,
  alignItems: "flex-start" as const,
  backgroundColor: "#fafafa",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "12px",
  border: "1px solid #e4e4e7",
}

const stepNumber = {
  backgroundColor: "#10b981",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "700",
  width: "28px",
  height: "28px",
  lineHeight: "28px",
  textAlign: "center" as const,
  borderRadius: "50%",
  margin: "0 12px 0 0",
  flexShrink: 0,
}

const stepContent = {
  flex: 1,
}

const stepHeading = {
  color: "#18181b",
  fontSize: "15px",
  fontWeight: "600",
  margin: "0 0 4px",
}

const stepText = {
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
