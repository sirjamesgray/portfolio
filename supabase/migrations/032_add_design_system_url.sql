-- Add design system URL and toggle for displaying on project pages
ALTER TABLE projects ADD COLUMN IF NOT EXISTS public_design_system_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS show_design_system_link BOOLEAN DEFAULT false;
