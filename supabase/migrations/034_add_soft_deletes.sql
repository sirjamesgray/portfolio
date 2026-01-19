-- Add soft delete support for projects table
-- This allows recovery of deleted projects and maintains audit trail

-- Add deleted_at column to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

-- Create index for efficient filtering of non-deleted projects
CREATE INDEX IF NOT EXISTS idx_projects_deleted_at ON projects(deleted_at) WHERE deleted_at IS NULL;

-- Update RLS policies to exclude soft-deleted projects for non-admin users
-- Drop existing select policy first
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;

-- Recreate policy to exclude deleted projects
CREATE POLICY "Users can view their own non-deleted projects" ON projects
  FOR SELECT
  USING (
    deleted_at IS NULL
    AND (
      user_id = auth.uid()
      OR EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
    )
  );

-- Admin policy for viewing ALL projects including deleted (for recovery)
DROP POLICY IF EXISTS "Admins can view all projects" ON projects;
CREATE POLICY "Admins can view all projects including deleted" ON projects
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
  );

-- Add comment for documentation
COMMENT ON COLUMN projects.deleted_at IS 'Soft delete timestamp. NULL means not deleted.';
COMMENT ON COLUMN projects.deleted_by IS 'User who performed the soft delete.';
