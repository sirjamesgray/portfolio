-- Fix infinite recursion in admins table RLS policy
--
-- The issue: "Admins can view admins" policy queries the admins table
-- to check if the user is an admin, which triggers the same policy,
-- causing infinite recursion (error 42P17).
--
-- The fix: Change the policy to only allow users to see their own
-- admin record (user_id = auth.uid()), which doesn't require
-- querying the admins table again.

-- Drop the recursive policy
DROP POLICY IF EXISTS "Admins can view admins" ON admins;

-- Create a non-recursive policy: users can only see their own admin record
CREATE POLICY "Users can view own admin record"
  ON admins FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Note: The is_admin() function still works because it's SECURITY DEFINER,
-- which bypasses RLS. The service_role can still manage all admin records.
