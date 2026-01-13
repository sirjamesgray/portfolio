-- Fix RLS security vulnerability: user_metadata is editable by end users
-- Replace all raw_user_meta_data checks with a secure admins table lookup
--
-- The issue: raw_user_meta_data (user_metadata) can be modified by users via
-- supabase.auth.updateUser(), making it insecure for authorization checks.
--
-- The fix: Create an admins table that can only be modified by service_role,
-- then use that table for admin checks in RLS policies.

-- ============================================
-- PART 1: CREATE SECURE ADMINS TABLE
-- ============================================

-- Create admins table (if not exists)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);

-- Enable RLS on admins table
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Only service_role can modify admins table (most secure)
DROP POLICY IF EXISTS "Service role manages admins" ON admins;
CREATE POLICY "Service role manages admins"
  ON admins FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can view the admins table (for admin dashboard)
DROP POLICY IF EXISTS "Admins can view admins" ON admins;
CREATE POLICY "Admins can view admins"
  ON admins FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );

-- ============================================
-- PART 2: CREATE HELPER FUNCTION
-- ============================================

-- Create a function to check admin status (more efficient than subquery)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid());
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ============================================
-- PART 3: MIGRATE EXISTING ADMINS
-- ============================================

-- Migrate existing admins from user_metadata to admins table
-- This preserves your current admin users
INSERT INTO admins (user_id)
SELECT id FROM auth.users
WHERE raw_user_meta_data->>'is_admin' = 'true'
ON CONFLICT (user_id) DO NOTHING;

-- Also add admins by email (matching ADMIN_EMAILS in the app)
-- This ensures the app's hardcoded admin list is also in the DB
INSERT INTO admins (user_id)
SELECT id FROM auth.users
WHERE email = 'jamiegray2234@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- PART 4: FIX PROJECTS TABLE RLS POLICIES
-- ============================================

-- Drop the insecure policies
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
DROP POLICY IF EXISTS "Admins can manage all projects" ON projects;

-- Recreate with secure admin check
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR user_id IS NULL
    OR public.is_admin()
  );

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_admin()
  );

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_admin()
  );

-- ============================================
-- PART 5: FIX CONTACTS TABLE RLS POLICIES
-- ============================================

-- Drop the insecure policies
DROP POLICY IF EXISTS "Users can view own contacts" ON contacts;
DROP POLICY IF EXISTS "Users can update own contacts" ON contacts;
DROP POLICY IF EXISTS "Users can delete own contacts" ON contacts;
DROP POLICY IF EXISTS "Admins can manage all contacts" ON contacts;

-- Recreate with secure admin check
CREATE POLICY "Users can view own contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR user_id IS NULL
    OR public.is_admin()
  );

CREATE POLICY "Users can update own contacts"
  ON contacts FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_admin()
  );

CREATE POLICY "Users can delete own contacts"
  ON contacts FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_admin()
  );

-- Admins can insert contacts
DROP POLICY IF EXISTS "Admins can insert contacts" ON contacts;
CREATE POLICY "Admins can insert contacts"
  ON contacts FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- ============================================
-- PART 6: FIX PROJECT_MEMBERS TABLE RLS
-- ============================================

DROP POLICY IF EXISTS "Admins can manage project_members" ON project_members;
CREATE POLICY "Admins can manage project_members"
  ON project_members FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- PART 7: FIX ACTIVITY_LOG TABLE RLS
-- ============================================

DROP POLICY IF EXISTS "Admins can view activity_log" ON activity_log;
DROP POLICY IF EXISTS "Admins can insert activity_log" ON activity_log;

CREATE POLICY "Admins can view activity_log"
  ON activity_log FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert activity_log"
  ON activity_log FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- ============================================
-- PART 8: FIX REQUIREMENTS_VERSIONS TABLE RLS
-- ============================================

DROP POLICY IF EXISTS "Admins can manage requirement versions" ON requirements_versions;
CREATE POLICY "Admins can manage requirement versions"
  ON requirements_versions FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- PART 9: FIX MESSAGES TABLE RLS
-- ============================================

DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (
    sender_id = auth.uid()
    OR project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    OR public.is_admin()
  );

-- Fix other message policies that might use user_metadata
DROP POLICY IF EXISTS "Admins can view all messages" ON messages;
CREATE POLICY "Admins can view all messages"
  ON messages FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can send messages" ON messages;
CREATE POLICY "Admins can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- ============================================
-- PART 10: FIX QUOTES TABLE RLS
-- ============================================

DROP POLICY IF EXISTS "Admins can manage quotes" ON quotes;
CREATE POLICY "Admins can manage quotes"
  ON quotes FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- PART 11: FIX INVOICES TABLE RLS
-- ============================================

DROP POLICY IF EXISTS "Admins can manage invoices" ON invoices;
CREATE POLICY "Admins can manage invoices"
  ON invoices FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- PART 12: FIX PROJECT_ASSETS TABLE RLS (if exists)
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'project_assets') THEN
    DROP POLICY IF EXISTS "Admins can manage project assets" ON project_assets;
    CREATE POLICY "Admins can manage project assets"
      ON project_assets FOR ALL
      TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;

-- ============================================
-- PART 13: FIX PROJECT_CONTENT_BLOCKS TABLE RLS (if exists)
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'project_content_blocks') THEN
    DROP POLICY IF EXISTS "Admins can manage content blocks" ON project_content_blocks;
    CREATE POLICY "Admins can manage content blocks"
      ON project_content_blocks FOR ALL
      TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;

-- ============================================
-- PART 14: FIX FEATURE_FLAGS TABLE RLS (if exists)
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'feature_flags') THEN
    DROP POLICY IF EXISTS "Admins can manage feature flags" ON feature_flags;
    CREATE POLICY "Admins can manage feature flags"
      ON feature_flags FOR ALL
      TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;

-- ============================================
-- DONE
-- ============================================

-- Note: After running this migration, you should:
-- 1. Verify your admin users are in the admins table
-- 2. Remove the is_admin check from your application's updateUser calls
-- 3. Use the service_role client to add/remove admins via the admins table
