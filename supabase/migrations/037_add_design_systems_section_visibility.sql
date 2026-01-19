-- Add separate visibility toggle for design systems section
-- This allows a project to appear in the Design Systems section independently
-- of whether it appears in the Projects section

ALTER TABLE projects ADD COLUMN IF NOT EXISTS show_in_design_systems_section BOOLEAN DEFAULT false;

-- Migrate existing data: if a project has show_design_system_link = true,
-- also enable show_in_design_systems_section
UPDATE projects
SET show_in_design_systems_section = true
WHERE show_design_system_link = true
  AND public_design_system_url IS NOT NULL;
