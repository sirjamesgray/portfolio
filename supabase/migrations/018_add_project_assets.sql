-- Add project assets table for storing previous website info, links, and images
-- This allows tracking the client's existing site and reference materials

-- Create enum for asset types
DO $$ BEGIN
  CREATE TYPE project_asset_type AS ENUM ('previous_site', 'reference_link', 'screenshot', 'image', 'document');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create project_assets table
CREATE TABLE IF NOT EXISTS project_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type project_asset_type NOT NULL,
  title TEXT,
  url TEXT,
  storage_path TEXT,  -- For uploaded files stored in Supabase Storage
  thumbnail_url TEXT, -- For image thumbnails
  description TEXT,
  display_order INT DEFAULT 0,
  added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_project_assets_project_id ON project_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_project_assets_type ON project_assets(type);

-- Enable RLS
ALTER TABLE project_assets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_assets

-- Service role can do everything
CREATE POLICY "Service role full access project_assets"
  ON project_assets FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can manage all project assets
CREATE POLICY "Admins can manage project_assets"
  ON project_assets FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
  );

-- Users can view assets for their own projects
CREATE POLICY "Users can view own project assets"
  ON project_assets FOR SELECT
  TO authenticated
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    OR project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
  );

-- Add updated_at trigger
DROP TRIGGER IF EXISTS update_project_assets_updated_at ON project_assets;
CREATE TRIGGER update_project_assets_updated_at
  BEFORE UPDATE ON project_assets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Also add a previous_site_url column directly to projects for quick access
ALTER TABLE projects ADD COLUMN IF NOT EXISTS previous_site_url TEXT;
