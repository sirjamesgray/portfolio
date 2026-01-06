import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

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
          <Heading style={h1}>Project Update</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Here&apos;s an update on your project: <strong>{projectName}</strong>
          </Text>
          <Section style={updateBox}>
            <Text style={updateText}>{updateMessage}</Text>
          </Section>
          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              View Project
            </Button>
          </Section>
          <Text style={signature}>
            Best,<br />
            Jamie Gray
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default ProjectUpdateEmail

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

const updateBox = {
  backgroundColor: "#f3f4f6",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "24px",
}

const updateText = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0",
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
