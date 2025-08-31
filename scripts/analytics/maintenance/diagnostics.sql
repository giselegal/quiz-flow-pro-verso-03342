-- Diagnostics for quiz_* tables (compatible with variant: public.quiz_sessions with funnel_id/quiz_user_id)
-- Run in Supabase SQL editor

-- Counts
SELECT 'quiz_users' AS table, COUNT(*) AS rows FROM public.quiz_users
UNION ALL
SELECT 'quiz_sessions', COUNT(*) FROM public.quiz_sessions
UNION ALL
SELECT 'quiz_step_responses', COUNT(*) FROM public.quiz_step_responses
UNION ALL
SELECT 'quiz_results', COUNT(*) FROM public.quiz_results
UNION ALL
SELECT 'quiz_analytics', COUNT(*) FROM public.quiz_analytics
UNION ALL
SELECT 'quiz_conversions', COUNT(*) FROM public.quiz_conversions
ORDER BY table;

-- Orphans
-- Sessions without user
SELECT s.id AS session_id
FROM public.quiz_sessions s
LEFT JOIN public.quiz_users u ON u.id = s.quiz_user_id
WHERE u.id IS NULL
LIMIT 100;

-- Sessions with non-existing funnel
SELECT s.id AS session_id
FROM public.quiz_sessions s
LEFT JOIN public.funnels f ON f.id = s.funnel_id
WHERE f.id IS NULL
LIMIT 100;

-- Responses without session
SELECT r.id AS response_id
FROM public.quiz_step_responses r
LEFT JOIN public.quiz_sessions s ON s.id = r.session_id
WHERE s.id IS NULL
LIMIT 100;

-- Results without session
SELECT res.id AS result_id
FROM public.quiz_results res
LEFT JOIN public.quiz_sessions s ON s.id = res.session_id
WHERE s.id IS NULL
LIMIT 100;

-- Duplicated users by session_id (should not happen ideally)
SELECT session_id, COUNT(*) AS dup_count
FROM public.quiz_users
GROUP BY session_id
HAVING COUNT(*) > 1
ORDER BY dup_count DESC
LIMIT 100;

-- Recent rows (sample)
SELECT id, email, name, utm_source, created_at
FROM public.quiz_users
ORDER BY created_at DESC NULLS LAST
LIMIT 10;

SELECT id, funnel_id, quiz_user_id, status, current_step, last_activity
FROM public.quiz_sessions
ORDER BY last_activity DESC NULLS LAST
LIMIT 10;

SELECT id, session_id, step_number, question_id, responded_at
FROM public.quiz_step_responses
ORDER BY responded_at DESC NULLS LAST
LIMIT 10;
