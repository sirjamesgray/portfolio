-- Rename existing column to represent customer opt-out
-- (true = customer opted out, false/null = customer consents)
ALTER TABLE projects RENAME COLUMN feature_on_landing_page TO customer_opted_out_of_landing_page;

-- Add admin control for showing on landing page
ALTER TABLE projects ADD COLUMN IF NOT EXISTS show_on_landing_page boolean DEFAULT false;

-- Add comments
COMMENT ON COLUMN projects.customer_opted_out_of_landing_page IS 'If true, customer has opted out of being featured on landing page';
COMMENT ON COLUMN projects.show_on_landing_page IS 'Admin control: if true AND customer has not opted out, project will show on landing page';

-- Update RLS policy for project_content_blocks to use new columns
DROP POLICY IF EXISTS "Public can read content blocks for featured projects" ON project_content_blocks;

CREATE POLICY "Public can read content blocks for featured projects"
ON project_content_blocks FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_content_blocks.project_id
    AND projects.show_on_landing_page = true
    AND (projects.customer_opted_out_of_landing_page IS NULL OR projects.customer_opted_out_of_landing_page = false)
  )
);
