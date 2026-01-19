-- Add separate description for design systems section
-- This allows customizing the description shown on the design system card
-- independently from the project description

ALTER TABLE projects ADD COLUMN IF NOT EXISTS design_system_description TEXT;
