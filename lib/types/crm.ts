// CRM Types for Projects and Contacts

export type ProjectStatus = 'lead' | 'contacted' | 'in_progress' | 'completed' | 'canceled';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  contact_id: string;
  calendly_event_uri?: string | null;
  calendly_invitee_uri?: string | null;
  status: ProjectStatus;
  meeting_time?: string | null;
  event_type?: string | null;
  notes?: string | null;
  custom_answers?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithContact extends Project {
  contact: Contact;
}

export interface ActivityLog {
  id: string;
  project_id: string;
  action: string;
  details?: Record<string, unknown>;
  created_at: string;
}

export interface ActivityLogWithProject extends ActivityLog {
  project: ProjectWithContact;
}

// Calendly Webhook Types
export interface CalendlyWebhookPayload {
  event: 'invitee.created' | 'invitee.canceled';
  payload: {
    event_type: {
      uuid: string;
      name: string;
    };
    event: {
      uuid: string;
      uri: string;
      start_time: string;
      end_time: string;
    };
    invitee: {
      uuid: string;
      uri: string;
      email: string;
      name: string;
      timezone: string;
      questions_and_answers?: Array<{
        question: string;
        answer: string;
      }>;
    };
    scheduled_event?: {
      uuid: string;
      uri: string;
    };
  };
}

// Status badge colors for UI
export const STATUS_COLORS: Record<ProjectStatus, { bg: string; text: string; border: string }> = {
  lead: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-500',
    border: 'border-yellow-500/30',
  },
  contacted: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    border: 'border-blue-500/30',
  },
  in_progress: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-500',
    border: 'border-emerald-500/30',
  },
  completed: {
    bg: 'bg-green-500/10',
    text: 'text-green-500',
    border: 'border-green-500/30',
  },
  canceled: {
    bg: 'bg-red-500/10',
    text: 'text-red-500',
    border: 'border-red-500/30',
  },
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  lead: 'Lead',
  contacted: 'Contacted',
  in_progress: 'In Progress',
  completed: 'Completed',
  canceled: 'Canceled',
};
