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

interface WelcomeEmailProps {
  name: string
  dashboardUrl: string
}

export function WelcomeEmail({ name, dashboardUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Jamie Gray Web Development</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome, {name}!</Heading>
          <Text style={text}>
            Thanks for signing up! I&apos;m excited to work with you on your project.
          </Text>
          <Text style={text}>
            Your dashboard is now ready. Here you can track your project progress,
            communicate with me, and manage payments.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              View Dashboard
            </Button>
          </Section>
          <Text style={text}>
            I&apos;ll be in touch soon to discuss your project in more detail.
          </Text>
          <Text style={signature}>
            Best,<br />
            Jamie Gray
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail

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

const signature = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "24px",
  marginTop: "24px",
}
