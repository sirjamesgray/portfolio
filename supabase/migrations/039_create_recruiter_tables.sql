-- Recruiter password area tables
-- Stores hashed passwords + access logs for the /for-recruiters private area

-- Create the recruiter passwords table
CREATE TABLE IF NOT EXISTS recruiter_passwords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the recruiter access logs table
CREATE TABLE IF NOT EXISTS recruiter_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  password_id UUID NOT NULL REFERENCES recruiter_passwords(id) ON DELETE CASCADE,
  visitor_name TEXT NOT NULL,
  visitor_company TEXT,
  visitor_message TEXT,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_recruiter_access_logs_password_id ON recruiter_access_logs(password_id);
CREATE INDEX IF NOT EXISTS idx_recruiter_access_logs_created_at ON recruiter_access_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recruiter_passwords_is_active ON recruiter_passwords(is_active);

-- Updated_at trigger for recruiter_passwords
DROP TRIGGER IF EXISTS update_recruiter_passwords_updated_at ON recruiter_passwords;
CREATE TRIGGER update_recruiter_passwords_updated_at
  BEFORE UPDATE ON recruiter_passwords
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE recruiter_passwords ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_access_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Service role full access recruiter_passwords" ON recruiter_passwords;
DROP POLICY IF EXISTS "Service role full access recruiter_access_logs" ON recruiter_access_logs;

-- Service role bypass for API routes
CREATE POLICY "Service role full access recruiter_passwords"
  ON recruiter_passwords FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access recruiter_access_logs"
  ON recruiter_access_logs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);