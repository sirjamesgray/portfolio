-- Add brand color field for project cards on landing page and projects page
-- This is a preset color name (e.g., "amber", "cyan", "purple", "emerald", "rose")
ALTER TABLE projects ADD COLUMN IF NOT EXISTS public_brand_color TEXT DEFAULT 'emerald';
