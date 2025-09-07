-- RLS hardening para o core de Quiz (sessions, step_responses, results, analytics, conversions, users)
-- Data: 2025-09-06

-- Observação: Algumas tabelas podem não existir neste ambiente. Usamos to_regclass para aplicar apenas quando existirem.

DO $$
BEGIN
  -- quiz_sessions --------------------------------------------------------
  IF to_regclass('public.quiz_sessions') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY';

    -- Recriar políticas de forma idempotente
    EXECUTE 'DROP POLICY IF EXISTS quiz_sessions_select_own ON public.quiz_sessions';
    EXECUTE 'DROP POLICY IF EXISTS quiz_sessions_insert_own ON public.quiz_sessions';
    EXECUTE 'DROP POLICY IF EXISTS quiz_sessions_update_own ON public.quiz_sessions';

    EXECUTE $$
      CREATE POLICY quiz_sessions_select_own ON public.quiz_sessions
      FOR SELECT USING (
        auth.uid() = quiz_user_id
      )
    $$;

    EXECUTE $$
      CREATE POLICY quiz_sessions_insert_own ON public.quiz_sessions
      FOR INSERT WITH CHECK (
        auth.uid() = quiz_user_id
      )
    $$;

    EXECUTE $$
      CREATE POLICY quiz_sessions_update_own ON public.quiz_sessions
      FOR UPDATE USING (
        auth.uid() = quiz_user_id
      )
    $$;

    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_quiz_sessions_quiz_user_id ON public.quiz_sessions(quiz_user_id)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_quiz_sessions_funnel_id ON public.quiz_sessions(funnel_id)';
  END IF;

  -- quiz_step_responses --------------------------------------------------
  IF to_regclass('public.quiz_step_responses') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.quiz_step_responses ENABLE ROW LEVEL SECURITY';

    EXECUTE 'DROP POLICY IF EXISTS quiz_step_responses_select_by_session_owner ON public.quiz_step_responses';
    EXECUTE 'DROP POLICY IF EXISTS quiz_step_responses_insert_by_session_owner ON public.quiz_step_responses';
    EXECUTE 'DROP POLICY IF EXISTS quiz_step_responses_update_by_session_owner ON public.quiz_step_responses';
    EXECUTE 'DROP POLICY IF EXISTS quiz_step_responses_delete_by_session_owner ON public.quiz_step_responses';

    EXECUTE $$
      CREATE POLICY quiz_step_responses_select_by_session_owner ON public.quiz_step_responses
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.quiz_sessions qs
          WHERE qs.id = quiz_step_responses.session_id
            AND qs.quiz_user_id = auth.uid()
        )
      )
    $$;

    EXECUTE $$
      CREATE POLICY quiz_step_responses_insert_by_session_owner ON public.quiz_step_responses
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.quiz_sessions qs
          WHERE qs.id = quiz_step_responses.session_id
            AND qs.quiz_user_id = auth.uid()
        )
      )
    $$;

    EXECUTE $$
      CREATE POLICY quiz_step_responses_update_by_session_owner ON public.quiz_step_responses
      FOR UPDATE USING (
        EXISTS (
          SELECT 1 FROM public.quiz_sessions qs
          WHERE qs.id = quiz_step_responses.session_id
            AND qs.quiz_user_id = auth.uid()
        )
      )
    $$;

    EXECUTE $$
      CREATE POLICY quiz_step_responses_delete_by_session_owner ON public.quiz_step_responses
      FOR DELETE USING (
        EXISTS (
          SELECT 1 FROM public.quiz_sessions qs
          WHERE qs.id = quiz_step_responses.session_id
            AND qs.quiz_user_id = auth.uid()
        )
      )
    $$;

    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_quiz_step_responses_session_id ON public.quiz_step_responses(session_id)';
  END IF;

  -- quiz_results ---------------------------------------------------------
  IF to_regclass('public.quiz_results') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY';

    EXECUTE 'DROP POLICY IF EXISTS quiz_results_select_by_session_owner ON public.quiz_results';
    EXECUTE 'DROP POLICY IF EXISTS quiz_results_insert_by_session_owner ON public.quiz_results';
    EXECUTE 'DROP POLICY IF EXISTS quiz_results_update_by_session_owner ON public.quiz_results';
    EXECUTE 'DROP POLICY IF EXISTS quiz_results_delete_by_session_owner ON public.quiz_results';

    EXECUTE $$
      CREATE POLICY quiz_results_select_by_session_owner ON public.quiz_results
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.quiz_sessions qs
          WHERE qs.id = quiz_results.session_id
            AND qs.quiz_user_id = auth.uid()
        )
      )
    $$;

    EXECUTE $$
      CREATE POLICY quiz_results_insert_by_session_owner ON public.quiz_results
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.quiz_sessions qs
          WHERE qs.id = quiz_results.session_id
            AND qs.quiz_user_id = auth.uid()
        )
      )
    $$;

    EXECUTE $$
      CREATE POLICY quiz_results_update_by_session_owner ON public.quiz_results
      FOR UPDATE USING (
        EXISTS (
          SELECT 1 FROM public.quiz_sessions qs
          WHERE qs.id = quiz_results.session_id
            AND qs.quiz_user_id = auth.uid()
        )
      )
    $$;

    EXECUTE $$
      CREATE POLICY quiz_results_delete_by_session_owner ON public.quiz_results
      FOR DELETE USING (
        EXISTS (
          SELECT 1 FROM public.quiz_sessions qs
          WHERE qs.id = quiz_results.session_id
            AND qs.quiz_user_id = auth.uid()
        )
      )
    $$;

    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_quiz_results_session_id ON public.quiz_results(session_id)';
  END IF;

  -- quiz_analytics -------------------------------------------------------
  IF to_regclass('public.quiz_analytics') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.quiz_analytics ENABLE ROW LEVEL SECURITY';

    EXECUTE 'DROP POLICY IF EXISTS quiz_analytics_select_by_funnel_owner ON public.quiz_analytics';
    EXECUTE 'DROP POLICY IF EXISTS quiz_analytics_insert_by_owner_or_session ON public.quiz_analytics';

    EXECUTE $$
      CREATE POLICY quiz_analytics_select_by_funnel_owner ON public.quiz_analytics
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.funnels f
          WHERE f.id = quiz_analytics.funnel_id
            AND f.user_id = auth.uid()
        )
      )
    $$;

    EXECUTE $$
      CREATE POLICY quiz_analytics_insert_by_owner_or_session ON public.quiz_analytics
      FOR INSERT WITH CHECK (
        (
          EXISTS (
            SELECT 1 FROM public.quiz_sessions qs
            JOIN public.funnels f ON f.id = qs.funnel_id
            WHERE qs.id = quiz_analytics.session_id
              AND f.user_id = auth.uid()
          )
        ) OR (user_id = auth.uid())
      )
    $$;

    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_quiz_analytics_funnel_id ON public.quiz_analytics(funnel_id)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_quiz_analytics_session_id ON public.quiz_analytics(session_id)';
  END IF;

  -- quiz_conversions -----------------------------------------------------
  IF to_regclass('public.quiz_conversions') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.quiz_conversions ENABLE ROW LEVEL SECURITY';

    EXECUTE 'DROP POLICY IF EXISTS quiz_conversions_select_by_funnel_owner ON public.quiz_conversions';
    EXECUTE 'DROP POLICY IF EXISTS quiz_conversions_insert_by_funnel_owner ON public.quiz_conversions';

    EXECUTE $$
      CREATE POLICY quiz_conversions_select_by_funnel_owner ON public.quiz_conversions
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.funnels f
          WHERE f.id = quiz_conversions.funnel_id
            AND f.user_id = auth.uid()
        )
      )
    $$;

    EXECUTE $$
      CREATE POLICY quiz_conversions_insert_by_funnel_owner ON public.quiz_conversions
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.funnels f
          WHERE f.id = quiz_conversions.funnel_id
            AND f.user_id = auth.uid()
        )
      )
    $$;

    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_quiz_conversions_funnel_id ON public.quiz_conversions(funnel_id)';
  END IF;

  -- quiz_users -----------------------------------------------------------
  IF to_regclass('public.quiz_users') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.quiz_users ENABLE ROW LEVEL SECURITY';

    EXECUTE 'DROP POLICY IF EXISTS quiz_users_select_own ON public.quiz_users';
    EXECUTE 'DROP POLICY IF EXISTS quiz_users_update_own ON public.quiz_users';

    EXECUTE $$
      CREATE POLICY quiz_users_select_own ON public.quiz_users
      FOR SELECT USING (
        id = auth.uid()
      )
    $$;

    EXECUTE $$
      CREATE POLICY quiz_users_update_own ON public.quiz_users
      FOR UPDATE USING (
        id = auth.uid()
      )
    $$;
  END IF;
END
$$;
