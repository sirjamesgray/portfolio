-- Add a column for rich HTML content (alternative to content blocks)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS public_content_html text;

-- Comment explaining the field
COMMENT ON COLUMN projects.public_content_html IS 'Rich HTML content for the public project page, managed via CMS editor';
