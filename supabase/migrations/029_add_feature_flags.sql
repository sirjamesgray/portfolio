-- Feature flags table for controlling site-wide behavior
CREATE TABLE IF NOT EXISTS feature_flags (
  name text PRIMARY KEY,
  enabled boolean NOT NULL DEFAULT true,
  description text,
  updated_at timestamptz DEFAULT now(),
  updated_by text
);

-- Enable RLS
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- Allow admins to read/write (via service role in API routes)
-- Public can read flags (needed for server components)
CREATE POLICY "Anyone can read feature flags"
  ON feature_flags FOR SELECT
  USING (true);

-- Insert initial feature flag
-- customer-dashboard=true means users sign up into our system
-- customer-dashboard=false means we route users directly to Calendly
INSERT INTO feature_flags (name, enabled, description)
VALUES (
  'customer-dashboard',
  true,
  'When enabled, users can sign up and access their project dashboard. When disabled, users are directed to Calendly and communications happen via email.'
)
ON CONFLICT (name) DO NOTHING;

COMMENT ON TABLE feature_flags IS 'Site-wide feature flags for controlling application behavior';
