-- Add public live URL and toggle for displaying on project pages
ALTER TABLE projects ADD COLUMN IF NOT EXISTS public_live_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS show_live_link BOOLEAN DEFAULT false;
