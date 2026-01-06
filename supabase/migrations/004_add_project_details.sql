-- Add additional project details for better project management

-- Add new columns to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10,2) DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS vercel_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_type TEXT;

-- Create index for sorting by created_at (if not exists)
CREATE INDEX IF NOT EXISTS idx_projects_created_at_desc ON projects(created_at DESC);
