-- Add project icon field for displaying in project tables and landing page cards
-- The icon is typically a small logo or avatar representing the project/client

ALTER TABLE projects ADD COLUMN IF NOT EXISTS icon_url TEXT;
