-- Security and Performance Fixes
-- Generated from Supabase CLI inspection on 2026-01-06

-- ============================================
-- PART 1: DROP UNUSED INDEXES (Performance)
-- ============================================
-- These indexes show 0% usage and 0 index scans, consuming storage without benefit.
-- Primary key indexes must be kept even if unused as they enforce uniqueness.

-- Unused indexes on requirements_versions (never queried by index)
DROP INDEX IF EXISTS idx_requirements_versions_project_id;
DROP INDEX IF EXISTS idx_requirements_versions_created_at;

-- Unused indexes on quotes (queried by project_id but not status)
DROP INDEX IF EXISTS idx_quotes_status;

-- Unused indexes on contacts (email lookup via pkey, user_id not used)
DROP INDEX IF EXISTS idx_contacts_user_id;

-- Unused index on activity_log (created_at rarely filtered)
DROP INDEX IF EXISTS idx_activity_log_created_at;

-- Unused index on projects (calendly uri unique constraint kept, but these aren't used)
DROP INDEX IF EXISTS idx_projects_contact_id;
DROP INDEX IF EXISTS idx_projects_status;

-- Unused indexes on messages (rarely queried)
DROP INDEX IF EXISTS idx_messages_sender_id;
DROP INDEX IF EXISTS idx_messages_created_at;
DROP INDEX IF EXISTS idx_messages_project_id;

-- Unused indexes on invoices
DROP INDEX IF EXISTS idx_invoices_stripe_invoice_id;
DROP INDEX IF EXISTS idx_invoices_status;

-- ============================================
-- PART 2: FIX RLS POLICIES (Security)
-- ============================================

-- 2a. Fix requirements_versions - currently allows ANY authenticated user to see ALL versions
DROP POLICY IF EXISTS "Admins can view all requirement versions" ON requirements_versions;
DROP POLICY IF EXISTS "Admins can insert requirement versions" ON requirements_versions;
DROP POLICY IF EXISTS "Users can view their project requirement versions" ON requirements_versions;

-- Proper admin-only policy for all operations
CREATE POLICY "Admins can manage requirement versions" ON requirements_versions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
  );

-- Users can only view versions for their own projects
CREATE POLICY "Users can view own project requirement versions" ON requirements_versions
  FOR SELECT
  TO authenticated
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

-- Service role access
DROP POLICY IF EXISTS "Service role full access requirements_versions" ON requirements_versions;
CREATE POLICY "Service role full access requirements_versions"
  ON requirements_versions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 2b. Clean up conflicting policies on contacts (drop old overly-permissive policies)
DROP POLICY IF EXISTS "Authenticated users can view contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can insert contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can update contacts" ON contacts;

-- 2c. Clean up conflicting policies on projects (drop old overly-permissive policies)
DROP POLICY IF EXISTS "Authenticated users can view projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON projects;

-- 2d. Clean up conflicting policies on activity_log (should be admin-only)
DROP POLICY IF EXISTS "Authenticated users can view activity_log" ON activity_log;
DROP POLICY IF EXISTS "Authenticated users can insert activity_log" ON activity_log;

-- Create proper admin-only policies for activity_log
CREATE POLICY "Admins can view activity_log" ON activity_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
  );

CREATE POLICY "Admins can insert activity_log" ON activity_log
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
  );

-- ============================================
-- PART 3: ADD MISSING POLICIES
-- ============================================

-- 3a. Add DELETE policy for projects (users can delete their own projects)
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- 3b. Add DELETE policy for contacts (users can delete their own contacts)
DROP POLICY IF EXISTS "Users can delete own contacts" ON contacts;
CREATE POLICY "Users can delete own contacts"
  ON contacts FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- 3c. Add UPDATE policy for messages (users can update their own messages, e.g., mark as read)
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (
    sender_id = auth.uid()
    OR
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
  );

-- 3d. Add admin policies for contacts and projects (admins should see/manage everything)
DROP POLICY IF EXISTS "Admins can manage all contacts" ON contacts;
CREATE POLICY "Admins can manage all contacts"
  ON contacts FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
  );

DROP POLICY IF EXISTS "Admins can manage all projects" ON projects;
CREATE POLICY "Admins can manage all projects"
  ON projects FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
  );

-- ============================================
-- PART 4: RUN VACUUM ANALYZE (Performance)
-- ============================================
-- Update table statistics for query planner optimization

ANALYZE contacts;
ANALYZE projects;
ANALYZE activity_log;
ANALYZE messages;
ANALYZE quotes;
ANALYZE invoices;
ANALYZE requirements_versions;
