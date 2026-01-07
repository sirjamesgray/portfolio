-- Fix RLS policies: use auth.jwt() instead of querying auth.users
-- The auth.users table is not accessible to authenticated users,
-- but auth.jwt() provides access to the user's metadata

-- For projects: use jwt() to check admin status
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR user_id IS NULL
    OR (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

DROP POLICY IF EXISTS "Users can update own projects" ON projects;
CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

-- For contacts: use jwt() to check admin status
DROP POLICY IF EXISTS "Users can view own contacts" ON contacts;
CREATE POLICY "Users can view own contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR user_id IS NULL
    OR (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

DROP POLICY IF EXISTS "Users can update own contacts" ON contacts;
CREATE POLICY "Users can update own contacts"
  ON contacts FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );
