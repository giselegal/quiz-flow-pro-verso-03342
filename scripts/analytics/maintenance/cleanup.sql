-- Cleanup for quiz_* tables (variant with funnel_id/quiz_user_id)
-- Review and run inside a transaction in Supabase SQL editor

BEGIN;

-- 1) Remove responses orphaned from missing sessions
DELETE FROM public.quiz_step_responses r
USING public.quiz_sessions s
WHERE r.session_id = s.id
AND FALSE; -- safety: set to TRUE to enable, see variant below

-- Safe orphan delete (no USING): keep only where session doesn't exist
DELETE FROM public.quiz_step_responses r
WHERE NOT EXISTS (
  SELECT 1 FROM public.quiz_sessions s WHERE s.id = r.session_id
);

-- 2) Remove results orphaned from missing sessions
DELETE FROM public.quiz_results res
WHERE NOT EXISTS (
  SELECT 1 FROM public.quiz_sessions s WHERE s.id = res.session_id
);

-- 3) Remove sessions orphaned from missing users
DELETE FROM public.quiz_sessions s
WHERE NOT EXISTS (
  SELECT 1 FROM public.quiz_users u WHERE u.id = s.quiz_user_id
);

-- 4) Remove sessions with missing funnels (if funnels table is authoritative)
-- Uncomment if you want to strictly enforce funnel existence
-- DELETE FROM public.quiz_sessions s
-- WHERE NOT EXISTS (
--   SELECT 1 FROM public.funnels f WHERE f.id = s.funnel_id
-- );

-- 5) Deduplicate quiz_users by session_id keeping the newest created_at
WITH ranked AS (
  SELECT id, session_id, created_at,
         ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY created_at DESC, id DESC) AS rn
  FROM public.quiz_users
)
DELETE FROM public.quiz_users u
USING ranked r
WHERE u.id = r.id AND r.rn > 1;

-- 6) Optional: purge very old test data (older than 90 days)
-- DELETE FROM public.quiz_step_responses WHERE responded_at < NOW() - INTERVAL '90 days';
-- DELETE FROM public.quiz_results WHERE created_at < NOW() - INTERVAL '90 days';
-- DELETE FROM public.quiz_sessions WHERE started_at < NOW() - INTERVAL '90 days';
-- DELETE FROM public.quiz_users WHERE created_at < NOW() - INTERVAL '90 days';

COMMIT;

-- Maintenance (run separately if needed)
-- VACUUM ANALYZE public.quiz_users;
-- VACUUM ANALYZE public.quiz_sessions;
-- VACUUM ANALYZE public.quiz_step_responses;
-- VACUUM ANALYZE public.quiz_results;
