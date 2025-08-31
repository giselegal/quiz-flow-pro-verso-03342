-- Full reset (truncate all quiz_* data). Use with caution.
BEGIN;
TRUNCATE TABLE public.quiz_analytics RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.quiz_conversions RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.quiz_results RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.quiz_step_responses RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.quiz_sessions RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.quiz_users RESTART IDENTITY CASCADE;
COMMIT;
