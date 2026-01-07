-- Create enum for content block types
CREATE TYPE project_content_type AS ENUM ('header', 'text', 'image');

-- Create table for project content blocks (CMS)
CREATE TABLE IF NOT EXISTS project_content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type project_content_type NOT NULL,
  content text NOT NULL,
  -- For images: content stores the URL, image_alt stores alt text
  image_alt text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create indexes
CREATE INDEX idx_project_content_blocks_project_id ON project_content_blocks(project_id);
CREATE INDEX idx_project_content_blocks_display_order ON project_content_blocks(project_id, display_order);

-- Add columns for public project page metadata
ALTER TABLE projects ADD COLUMN IF NOT EXISTS public_title text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS public_description text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS public_hero_image text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS public_industry text;

-- RLS policies for project_content_blocks
ALTER TABLE project_content_blocks ENABLE ROW LEVEL SECURITY;

-- Service role has full access
CREATE POLICY "Service role full access project_content_blocks"
ON project_content_blocks FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Public can read content blocks for featured projects
CREATE POLICY "Public can read content blocks for featured projects"
ON project_content_blocks FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_content_blocks.project_id
    AND projects.feature_on_landing_page = true
  )
);

-- Admins can manage content blocks
CREATE POLICY "Admins can manage content blocks"
ON project_content_blocks FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
);
