import { Section, Text } from "@react-email/components"

/**
 * Email Logo Component
 *
 * Renders the JG logo SVG in a white rounded box on an emerald background header.
 * The SVG is embedded directly for maximum email client compatibility.
 */
export function EmailLogo() {
  return (
    <Section style={logoSection}>
      <div style={logoBox}>
        {/* Inline SVG for maximum email client compatibility */}
        <svg
          width="36"
          height="36"
          viewBox="0 0 174 174"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", margin: "0 auto" }}
        >
          {/* J letter */}
          <path
            d="M72.5 13H15.5C49 13 72.5 34.5 72.5 64.473V13Z"
            fill="#10b981"
          />
          <path
            d="M72.5 64.473V13H15.5C49 13 72.5 34.5 72.5 64.473ZM72.5 64.473V132.5C72.5 148.24 59.7401 161 44 161C28.2599 161 15.5 148.24 15.5 132.5V99.2569"
            stroke="#10b981"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* G letter */}
          <path
            d="M116.79 99.2569H158.5V132.849C158.5 111.5 141 99.2569 116.79 99.2569Z"
            fill="#10b981"
          />
          <path
            d="M158.5 55.473V41.5C158.5 25.7599 145.74 13 130 13C114.26 13 101.5 25.7599 101.5 41.5V55.473V132.5C101.5 148.24 114.436 161 130.176 161C145.723 161 158.5 148.397 158.5 132.849M158.5 132.849V99.2569H116.79C141 99.2569 158.5 111.5 158.5 132.849Z"
            stroke="#10b981"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Section>
  )
}

// Styles for the logo section
const logoSection = {
  backgroundColor: "#10b981",
  padding: "32px 0",
  textAlign: "center" as const,
}

const logoBox = {
  width: "64px",
  height: "64px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  margin: "0 auto",
  display: "flex" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  padding: "14px",
}

/**
 * HTML string for inline email templates (non-React)
 * Use this in API routes that send HTML directly
 */
export const emailLogoHtml = `
<div style="background-color: #10b981; padding: 32px 0; text-align: center;">
  <div style="width: 64px; height: 64px; background-color: #ffffff; border-radius: 12px; margin: 0 auto; display: flex; align-items: center; justify-content: center; padding: 14px; box-sizing: border-box;">
    <svg width="36" height="36" viewBox="0 0 174 174" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
      <path d="M72.5 13H15.5C49 13 72.5 34.5 72.5 64.473V13Z" fill="#10b981"/>
      <path d="M72.5 64.473V13H15.5C49 13 72.5 34.5 72.5 64.473ZM72.5 64.473V132.5C72.5 148.24 59.7401 161 44 161C28.2599 161 15.5 148.24 15.5 132.5V99.2569" stroke="#10b981" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M116.79 99.2569H158.5V132.849C158.5 111.5 141 99.2569 116.79 99.2569Z" fill="#10b981"/>
      <path d="M158.5 55.473V41.5C158.5 25.7599 145.74 13 130 13C114.26 13 101.5 25.7599 101.5 41.5V55.473V132.5C101.5 148.24 114.436 161 130.176 161C145.723 161 158.5 148.397 158.5 132.849M158.5 132.849V99.2569H116.79C141 99.2569 158.5 111.5 158.5 132.849Z" stroke="#10b981" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
</div>
`
