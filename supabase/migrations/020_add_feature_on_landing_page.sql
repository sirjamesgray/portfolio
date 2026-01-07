-- Add column to track if customer consents to featuring their project on landing page
ALTER TABLE projects ADD COLUMN IF NOT EXISTS feature_on_landing_page boolean DEFAULT false;

-- Add comment for clarity
COMMENT ON COLUMN projects.feature_on_landing_page IS 'Whether the customer consents to featuring this project on the public landing page';
