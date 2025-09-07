-- RLS hardening for quiz/session related tables
-- Date: 2025-09-07

-- Enable RLS
ALTER TABLE IF EXISTS public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.quiz_step_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.quiz_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.quiz_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.quiz_users ENABLE ROW LEVEL SECURITY;

-- Supporting indexes (safe if already exist)
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_funnel_id ON public.quiz_sessions(funnel_id);
CREATE INDEX IF NOT EXISTS idx_quiz_step_responses_session_id ON public.quiz_step_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_session_id ON public.quiz_results(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_analytics_funnel_id ON public.quiz_analytics(funnel_id);
CREATE INDEX IF NOT EXISTS idx_quiz_analytics_session_id ON public.quiz_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_conversions_session_id ON public.quiz_conversions(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_users_session_id ON public.quiz_users(session_id);

-- =====================================================================
-- quiz_sessions policies
-- =====================================================================
DO $$ BEGIN
  BEGIN
    DROP POLICY IF EXISTS quiz_sessions_select_by_owner ON public.quiz_sessions;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY quiz_sessions_select_by_owner ON public.quiz_sessions
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.funnels f
        WHERE f.id = quiz_sessions.funnel_id AND f.user_id = auth.uid()
      )
    );

  BEGIN
    DROP POLICY IF EXISTS quiz_sessions_insert_open ON public.quiz_sessions;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY quiz_sessions_insert_open ON public.quiz_sessions
    FOR INSERT WITH CHECK (true);

  BEGIN
    DROP POLICY IF EXISTS quiz_sessions_update_by_owner ON public.quiz_sessions;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY quiz_sessions_update_by_owner ON public.quiz_sessions
    FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM public.funnels f
        WHERE f.id = quiz_sessions.funnel_id AND f.user_id = auth.uid()
      )
    );

  BEGIN
    DROP POLICY IF EXISTS quiz_sessions_delete_by_owner ON public.quiz_sessions;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY quiz_sessions_delete_by_owner ON public.quiz_sessions
    FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM public.funnels f
        WHERE f.id = quiz_sessions.funnel_id AND f.user_id = auth.uid()
      )
    );
END $$;

-- =====================================================================
-- quiz_step_responses policies
-- =====================================================================
DO $$ BEGIN
  BEGIN
    DROP POLICY IF EXISTS quiz_step_responses_select_by_owner ON public.quiz_step_responses;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY quiz_step_responses_select_by_owner ON public.quiz_step_responses
    FOR SELECT USING (
      EXISTS (
        SELECT 1
        FROM public.quiz_sessions s
        JOIN public.funnels f ON f.id = s.funnel_id
        WHERE s.id = quiz_step_responses.session_id AND f.user_id = auth.uid()
      )
    );

  BEGIN
    DROP POLICY IF EXISTS quiz_step_responses_insert_open ON public.quiz_step_responses;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY quiz_step_responses_insert_open ON public.quiz_step_responses
    FOR INSERT WITH CHECK (true);

  BEGIN
    DROP POLICY IF EXISTS quiz_step_responses_update_by_owner ON public.quiz_step_responses;
  EXCEPTION WHEN undefined_object THEN NULL; END;
    CREATE POLICY quiz_step_responses_update_by_owner ON public.quiz_step_responses
      FOR UPDATE USING (
        EXISTS (
          SELECT 1
          FROM public.quiz_sessions s
          JOIN public.funnels f ON f.id = s.funnel_id
          WHERE s.id = quiz_step_responses.session_id AND f.user_id = auth.uid()
        )
      );

  BEGIN
    DROP POLICY IF EXISTS quiz_step_responses_delete_by_owner ON public.quiz_step_responses;
  EXCEPTION WHEN undefined_object THEN NULL; END;
    CREATE POLICY quiz_step_responses_delete_by_owner ON public.quiz_step_responses
      FOR DELETE USING (
        EXISTS (
          SELECT 1
          FROM public.quiz_sessions s
          JOIN public.funnels f ON f.id = s.funnel_id
          WHERE s.id = quiz_step_responses.session_id AND f.user_id = auth.uid()
        )
      );
END $$;

-- =====================================================================
-- quiz_results policies
-- =====================================================================
DO $$ BEGIN
  BEGIN
    DROP POLICY IF EXISTS quiz_results_select_by_owner ON public.quiz_results;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY quiz_results_select_by_owner ON public.quiz_results
    FOR SELECT USING (
      EXISTS (
        SELECT 1
        FROM public.quiz_sessions s
        JOIN public.funnels f ON f.id = s.funnel_id
        WHERE s.id = quiz_results.session_id AND f.user_id = auth.uid()
      )
    );

  BEGIN
    DROP POLICY IF EXISTS quiz_results_insert_open ON public.quiz_results;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY quiz_results_insert_open ON public.quiz_results
    FOR INSERT WITH CHECK (true);

  BEGIN
    DROP POLICY IF EXISTS quiz_results_update_by_owner ON public.quiz_results;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY quiz_results_update_by_owner ON public.quiz_results
    FOR UPDATE USING (
      EXISTS (
        SELECT 1
        FROM public.quiz_sessions s
        JOIN public.funnels f ON f.id = s.funnel_id
        WHERE s.id = quiz_results.session_id AND f.user_id = auth.uid()
      )
    );

  BEGIN
    DROP POLICY IF EXISTS quiz_results_delete_by_owner ON public.quiz_results;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY quiz_results_delete_by_owner ON public.quiz_results
    FOR DELETE USING (
      EXISTS (
        SELECT 1
        FROM public.quiz_sessions s
        JOIN public.funnels f ON f.id = s.funnel_id
        WHERE s.id = quiz_results.session_id AND f.user_id = auth.uid()
      )
    );
END $$;

-- =====================================================================
-- quiz_analytics policies
-- =====================================================================
DO $$ BEGIN
  BEGIN
    DROP POLICY IF EXISTS quiz_analytics_select_by_owner ON public.quiz_analytics;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY quiz_analytics_select_by_owner ON public.quiz_analytics
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.funnels f
        WHERE f.id = quiz_analytics.funnel_id AND f.user_id = auth.uid()
      ) OR EXISTS (
        SELECT 1
        FROM public.quiz_sessions s
        JOIN public.funnels f ON f.id = s.funnel_id
        WHERE s.id = quiz_analytics.session_id AND f.user_id = auth.uid()
      )
    );

  BEGIN
    DROP POLICY IF EXISTS quiz_analytics_insert_open ON public.quiz_analytics;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY quiz_analytics_insert_open ON public.quiz_analytics
    FOR INSERT WITH CHECK (true);

  BEGIN
    DROP POLICY IF EXISTS quiz_analytics_update_by_owner ON public.quiz_analytics;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY quiz_analytics_update_by_owner ON public.quiz_analytics
    FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM public.funnels f
        WHERE f.id = quiz_analytics.funnel_id AND f.user_id = auth.uid()
      )
    );

  BEGIN
    DROP POLICY IF EXISTS quiz_analytics_delete_by_owner ON public.quiz_analytics;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY quiz_analytics_delete_by_owner ON public.quiz_analytics
    FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM public.funnels f
        WHERE f.id = quiz_analytics.funnel_id AND f.user_id = auth.uid()
      )
    );
END $$;

-- =====================================================================
-- quiz_conversions policies
-- =====================================================================
DO $$ BEGIN
  BEGIN
    DROP POLICY IF EXISTS quiz_conversions_select_by_owner ON public.quiz_conversions;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY quiz_conversions_select_by_owner ON public.quiz_conversions
    FOR SELECT USING (
      EXISTS (
        SELECT 1
        FROM public.quiz_sessions s
        JOIN public.funnels f ON f.id = s.funnel_id
        WHERE s.id = quiz_conversions.session_id AND f.user_id = auth.uid()
      )
    );

  BEGIN
    DROP POLICY IF EXISTS quiz_conversions_insert_open ON public.quiz_conversions;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY quiz_conversions_insert_open ON public.quiz_conversions
    FOR INSERT WITH CHECK (true);

  BEGIN
    DROP POLICY IF EXISTS quiz_conversions_update_by_owner ON public.quiz_conversions;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY quiz_conversions_update_by_owner ON public.quiz_conversions
    FOR UPDATE USING (
      EXISTS (
        SELECT 1
        FROM public.quiz_sessions s
        JOIN public.funnels f ON f.id = s.funnel_id
        WHERE s.id = quiz_conversions.session_id AND f.user_id = auth.uid()
      )
    );

  BEGIN
    DROP POLICY IF EXISTS quiz_conversions_delete_by_owner ON public.quiz_conversions;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY quiz_conversions_delete_by_owner ON public.quiz_conversions
    FOR DELETE USING (
      EXISTS (
        SELECT 1
        FROM public.quiz_sessions s
        JOIN public.funnels f ON f.id = s.funnel_id
        WHERE s.id = quiz_conversions.session_id AND f.user_id = auth.uid()
      )
    );
END $$;

-- =====================================================================
-- quiz_users policies (owner-based via related session)
-- =====================================================================
DO $$ BEGIN
  BEGIN
    DROP POLICY IF EXISTS quiz_users_select_by_owner ON public.quiz_users;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY quiz_users_select_by_owner ON public.quiz_users
    FOR SELECT USING (
      EXISTS (
        SELECT 1
        FROM public.quiz_sessions s
        JOIN public.funnels f ON f.id = s.funnel_id
        WHERE s.id = quiz_users.session_id AND f.user_id = auth.uid()
      )
    );

  BEGIN
    DROP POLICY IF EXISTS quiz_users_insert_open ON public.quiz_users;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY quiz_users_insert_open ON public.quiz_users
    FOR INSERT WITH CHECK (true);

  BEGIN
    DROP POLICY IF EXISTS quiz_users_update_by_owner ON public.quiz_users;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY quiz_users_update_by_owner ON public.quiz_users
    FOR UPDATE USING (
      EXISTS (
        SELECT 1
        FROM public.quiz_sessions s
        JOIN public.funnels f ON f.id = s.funnel_id
        WHERE s.id = quiz_users.session_id AND f.user_id = auth.uid()
      )
    );

  BEGIN
    DROP POLICY IF EXISTS quiz_users_delete_by_owner ON public.quiz_users;
  EXCEPTION WHEN undefined_object THEN NULL; END;
  CREATE POLICY quiz_users_delete_by_owner ON public.quiz_users
    FOR DELETE USING (
      EXISTS (
        SELECT 1
        FROM public.quiz_sessions s
        JOIN public.funnels f ON f.id = s.funnel_id
        WHERE s.id = quiz_users.session_id AND f.user_id = auth.uid()
      )
    );
END $$;
