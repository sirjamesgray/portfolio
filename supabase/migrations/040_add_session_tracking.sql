-- Add session tracking to access logs
-- Tracks last_active_at for session duration calculation

ALTER TABLE recruiter_access_logs
  ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;

-- Create a view for password usage stats
CREATE OR REPLACE VIEW recruiter_password_stats AS
SELECT
  rp.id AS password_id,
  rp.label AS password_label,
  rp.is_active,
  COUNT(ral.id) AS total_visits,
  COUNT(DISTINCT ral.visitor_name) AS unique_visitors,
  MAX(ral.created_at) AS last_visit_at,
  AVG(
    EXTRACT(EPOCH FROM (COALESCE(ral.last_active_at, ral.created_at) - ral.created_at))
  ) AS avg_session_seconds
FROM recruiter_passwords rp
LEFT JOIN recruiter_access_logs ral ON ral.password_id = rp.id
GROUP BY rp.id, rp.label, rp.is_active
ORDER BY last_visit_at DESC NULLS LAST;