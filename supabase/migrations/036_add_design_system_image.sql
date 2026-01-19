-- Add design system image field for showcasing design systems on landing page
-- This is separate from the project hero image - it's specifically a screenshot of the design system

ALTER TABLE projects ADD COLUMN IF NOT EXISTS design_system_image_url TEXT;
