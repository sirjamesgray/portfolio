-- Update project statuses to align with the project checklist steps
-- Old statuses: lead, contacted, in_progress, completed, canceled
-- New statuses: consultation, quote_sent, quote_accepted, payment, development, delivered, canceled

-- First, alter the status column to text to allow migration
ALTER TABLE projects ALTER COLUMN status TYPE text;

-- Map old statuses to new ones:
-- lead -> consultation (initial stage)
-- contacted -> quote_sent (contact = quote sent stage)
-- in_progress -> development (working on project)
-- completed -> delivered (project complete)
-- canceled -> canceled (no change)

UPDATE projects SET status = 'consultation' WHERE status = 'lead';
UPDATE projects SET status = 'quote_sent' WHERE status = 'contacted';
UPDATE projects SET status = 'development' WHERE status = 'in_progress';
UPDATE projects SET status = 'delivered' WHERE status = 'completed';

-- Drop the old enum type if it exists
DROP TYPE IF EXISTS project_status CASCADE;

-- Create new enum with updated values
CREATE TYPE project_status AS ENUM (
  'consultation',
  'quote_sent',
  'quote_accepted',
  'payment',
  'development',
  'delivered',
  'canceled'
);

-- Convert the column back to enum
ALTER TABLE projects ALTER COLUMN status TYPE project_status USING status::project_status;

-- Set default
ALTER TABLE projects ALTER COLUMN status SET DEFAULT 'consultation';

-- Add comment documenting the new status values
COMMENT ON COLUMN projects.status IS 'Project status: consultation, quote_sent, quote_accepted, payment, development, delivered, canceled';
