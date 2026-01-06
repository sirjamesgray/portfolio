-- Make contact_id nullable on projects table
-- This allows admins to create projects without an associated contact

ALTER TABLE projects
ALTER COLUMN contact_id DROP NOT NULL;
