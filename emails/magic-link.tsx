import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
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
          <Heading style={h1}>Sign in to your account</Heading>
          <Text style={text}>
            Click the button below to sign in to your account. This link will expire in 1 hour.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={magicLink}>
              Sign in
            </Button>
          </Section>
          <Text style={text}>
            If you didn&apos;t request this email, you can safely ignore it.
          </Text>
          <Text style={footer}>
            This email was sent to {email}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default MagicLinkEmail

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  borderRadius: "8px",
  maxWidth: "465px",
}

const h1 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.25",
  marginBottom: "24px",
  textAlign: "center" as const,
}

const text = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "24px",
  marginBottom: "16px",
}

const buttonContainer = {
  textAlign: "center" as const,
  marginBottom: "24px",
}

const button = {
  backgroundColor: "#10b981",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
}

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "20px",
  textAlign: "center" as const,
  marginTop: "24px",
}
