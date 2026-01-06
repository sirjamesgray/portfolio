import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface MagicLinkEmailProps {
  magicLink: string
  email: string
}

export function MagicLinkEmail({ magicLink, email }: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Sign in to Jamie Gray Web Development</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo/Brand Header */}
          <Section style={logoSection}>
            <div style={logoCircle}>
              <Text style={logoText}>JG</Text>
            </div>
          </Section>

          {/* Main Content */}
          <Section style={contentSection}>
            <Heading style={h1}>Sign in to your account</Heading>
            <Text style={paragraph}>
              Click the button below to securely sign in to your dashboard. This magic link will expire in 1 hour for your security.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={magicLink}>
                Sign in to Dashboard
              </Button>
            </Section>

            <Text style={secondaryText}>
              Or copy and paste this URL into your browser:
            </Text>
            <Text style={linkText}>
              <Link href={magicLink} style={link}>
                {magicLink}
              </Link>
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Security Notice */}
          <Section style={securitySection}>
            <Text style={securityText}>
              If you didn&apos;t request this email, you can safely ignore it. Someone may have entered your email address by mistake.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This email was sent to {email}
            </Text>
            <Text style={footerBrand}>
              Jamie Gray Web Development
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default MagicLinkEmail

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
  maxWidth: "500px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  overflow: "hidden" as const,
}

const logoSection = {
  backgroundColor: "#10b981",
  padding: "32px 0",
  textAlign: "center" as const,
}

const logoCircle = {
  width: "64px",
  height: "64px",
  backgroundColor: "#ffffff",
  borderRadius: "50%",
  margin: "0 auto",
  display: "flex" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
}

const logoText = {
  color: "#10b981",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0",
  lineHeight: "64px",
  textAlign: "center" as const,
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

const secondaryText = {
  color: "#71717a",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "0 0 8px",
  textAlign: "center" as const,
}

const linkText = {
  margin: "0",
  textAlign: "center" as const,
  wordBreak: "break-all" as const,
}

const link = {
  color: "#10b981",
  fontSize: "12px",
  textDecoration: "underline",
}

const divider = {
  borderColor: "#e4e4e7",
  borderWidth: "1px",
  margin: "0 40px",
}

const securitySection = {
  padding: "24px 40px",
}

const securityText = {
  color: "#a1a1aa",
  fontSize: "13px",
  lineHeight: "22px",
  margin: "0",
  textAlign: "center" as const,
}

const footer = {
  backgroundColor: "#fafafa",
  padding: "24px 40px",
  borderTop: "1px solid #e4e4e7",
}

const footerText = {
  color: "#a1a1aa",
  fontSize: "12px",
  lineHeight: "20px",
  margin: "0 0 8px",
  textAlign: "center" as const,
}

const footerBrand = {
  color: "#71717a",
  fontSize: "13px",
  fontWeight: "600",
  margin: "0",
  textAlign: "center" as const,
}
