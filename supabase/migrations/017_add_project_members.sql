-- Add project members table for multi-user project associations
-- Supports: admin (assigned admin), owner (main customer), viewer (additional viewers)

-- Create enum for member roles
DO $$ BEGIN
  CREATE TYPE project_member_role AS ENUM ('admin', 'owner', 'viewer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create project_members table
CREATE TABLE IF NOT EXISTS project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role project_member_role NOT NULL,
  added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Each user can only have one role per project
  UNIQUE(project_id, user_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_members_role ON project_members(role);

-- Enable RLS
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_members

-- Service role can do everything
CREATE POLICY "Service role full access project_members"
  ON project_members FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can manage all project members
CREATE POLICY "Admins can manage project_members"
  ON project_members FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
  );

-- Users can view their own memberships
CREATE POLICY "Users can view own memberships"
  ON project_members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Migrate existing user_id from projects to project_members as 'owner'
-- Only for projects where user_id is set
INSERT INTO project_members (project_id, user_id, role)
SELECT id, user_id, 'owner'::project_member_role
FROM projects
WHERE user_id IS NOT NULL
ON CONFLICT (project_id, user_id) DO NOTHING;

-- Add assigned_admin_id column to projects table for backward compatibility
-- This makes it easy to query the admin without joining
ALTER TABLE projects ADD COLUMN IF NOT EXISTS assigned_admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Index for admin lookups
CREATE INDEX IF NOT EXISTS idx_projects_assigned_admin_id ON projects(assigned_admin_id);
