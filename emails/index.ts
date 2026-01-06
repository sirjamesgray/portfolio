export { MagicLinkEmail } from "./magic-link"
export { WelcomeEmail } from "./welcome"
export { ProjectUpdateEmail } from "./project-update"
export { ProjectSubmittedEmail } from "./project-submitted"

// Email template registry for admin view
export const emailTemplates = [
  {
    id: "magic-link",
    name: "Magic Link",
    description: "Passwordless sign-in email with magic link",
    subject: "Sign in to Jamie Gray Web Development",
    previewProps: {
      magicLink: "https://jamiegray.net/auth/callback?token=example",
      email: "customer@example.com",
    },
  },
  {
    id: "welcome",
    name: "Welcome",
    description: "Welcome email sent to new customers after sign-up",
    subject: "Welcome to Jamie Gray Web Development",
    previewProps: {
      name: "John Doe",
      dashboardUrl: "https://jamiegray.net/dashboard",
    },
  },
  {
    id: "project-update",
    name: "Project Update",
    description: "Notification when there's an update on a customer's project",
    subject: "Update on your project: {projectName}",
    previewProps: {
      name: "John Doe",
      projectName: "Company Website",
      updateMessage: "We've completed the initial wireframes and are ready for your feedback. Please log in to review and leave comments.",
      dashboardUrl: "https://jamiegray.net/dashboard/projects/1",
    },
  },
  {
    id: "project-submitted",
    name: "Project Submitted",
    description: "Confirmation email sent when a customer submits a new project request",
    subject: "Thanks for your {projectType} request!",
    previewProps: {
      name: "John Doe",
      projectType: "Website",
      loginUrl: "https://jamiegray.net/login",
    },
  },
] as const

export type EmailTemplateId = typeof emailTemplates[number]["id"]
