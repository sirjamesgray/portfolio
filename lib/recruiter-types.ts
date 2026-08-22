// Types for the recruiter password-protected area

export interface RecruiterPassword {
  id: string
  label: string
  password_hash: string
  password_salt: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RecruiterAccessLog {
  id: string
  password_id: string
  visitor_name: string
  visitor_company: string | null
  visitor_message: string | null
  ip_address: string | null
  user_agent: string | null
  referrer: string | null
  created_at: string
  // Joined from recruiter_passwords
  password_label?: string
}

export interface RecruiterSession {
  password_id: string
  password_label: string
  visitor_name: string
  visitor_company?: string
  visitor_message?: string
  expires_at: number
}

// Project detail shown to recruiters in the protected area
export interface RecruiterProjectDetail {
  id: string
  title: string
  subtitle: string
  timeline: string
  role: string
  tags: string[]
  description: string
  challenges: string[]
  architecture: string[]
  impact: string
  links: {
    live?: string
    github?: string
    case_study?: string
  }
  icon?: string
  screenshots?: string[]
}