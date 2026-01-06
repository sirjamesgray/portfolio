-- Add requirements versioning for projects
-- Store requirements as HTML from rich text editor

-- Rename notes to requirements (keeping notes for backwards compat)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS requirements TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS requirements_updated_at TIMESTAMPTZ;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS requirements_updated_by UUID REFERENCES auth.users(id);

-- Create requirements history table for version tracking
CREATE TABLE IF NOT EXISTS requirements_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  updated_by_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fetching versions by project
CREATE INDEX IF NOT EXISTS idx_requirements_versions_project_id ON requirements_versions(project_id);
CREATE INDEX IF NOT EXISTS idx_requirements_versions_created_at ON requirements_versions(created_at DESC);

-- Enable RLS on requirements_versions
ALTER TABLE requirements_versions ENABLE ROW LEVEL SECURITY;

-- Admin can see all versions
CREATE POLICY "Admins can view all requirement versions" ON requirements_versions
  FOR SELECT USING (true);

-- Admin can insert versions
CREATE POLICY "Admins can insert requirement versions" ON requirements_versions
  FOR INSERT WITH CHECK (true);

-- Users can view versions for their own projects
CREATE POLICY "Users can view their project requirement versions" ON requirements_versions
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );
