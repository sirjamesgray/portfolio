-- Add Calendly-related fields to projects table
-- These are used to track consultation bookings from Calendly webhooks

ALTER TABLE projects ADD COLUMN IF NOT EXISTS consultation_scheduled_at timestamptz;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS calendly_event_uri text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS calendly_invitee_uri text;

-- Add index for looking up projects by Calendly event
CREATE INDEX IF NOT EXISTS idx_projects_calendly_event ON projects(calendly_event_uri) WHERE calendly_event_uri IS NOT NULL;

COMMENT ON COLUMN projects.consultation_scheduled_at IS 'Scheduled time for consultation call (from Calendly)';
COMMENT ON COLUMN projects.calendly_event_uri IS 'Calendly event URI for tracking';
COMMENT ON COLUMN projects.calendly_invitee_uri IS 'Calendly invitee URI for tracking';
