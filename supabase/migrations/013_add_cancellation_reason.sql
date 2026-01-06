-- Add cancellation_reason column to projects table
-- This is used for soft-delete functionality where admin can archive/cancel projects with a reason

ALTER TABLE projects ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

-- Add comment for documentation
COMMENT ON COLUMN projects.cancellation_reason IS 'Required when status is canceled. Explains why the project was archived/canceled.';
