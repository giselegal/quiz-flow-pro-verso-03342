-- RLS HARDENING MIGRATION
-- Data: 2025-10-09
-- Objetivo: substituir políticas permissivas usadas em dev por políticas seguras para produção.
-- Idempotente: usa DROP POLICY IF EXISTS e CREATE POLICY com nomes estáveis.

BEGIN;

-- =======================
-- FUNNELS
-- =======================
ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;

-- Remover políticas permissivas de dev
DROP POLICY IF EXISTS "Enable read access for all users" ON public.funnels;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.funnels;
DROP POLICY IF EXISTS "Enable update for all users" ON public.funnels;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.funnels;

-- Políticas por dono (usuário autenticado)
CREATE POLICY "funnels_owner_select"
  ON public.funnels FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "funnels_owner_update"
  ON public.funnels FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "funnels_owner_delete"
  ON public.funnels FOR DELETE
  TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "funnels_owner_insert"
  ON public.funnels FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid()::text);

-- Leitura pública apenas de funis publicados
CREATE POLICY "funnels_public_read_published"
  ON public.funnels FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- =======================
-- QUIZ_USERS
-- =======================
ALTER TABLE public.quiz_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.quiz_users;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.quiz_users;
DROP POLICY IF EXISTS "Enable update for all users" ON public.quiz_users;

-- Dono (owner do funnel ligado à sessão/quiz_user) pode ler/atualizar
CREATE POLICY "quiz_users_owner_read"
  ON public.quiz_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.quiz_sessions s
      JOIN public.funnels f ON f.id = s.funnel_id
      WHERE s.quiz_user_id = quiz_users.id
        AND f.user_id = auth.uid()::text
    )
  );

CREATE POLICY "quiz_users_owner_update"
  ON public.quiz_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.quiz_sessions s
      JOIN public.funnels f ON f.id = s.funnel_id
      WHERE s.quiz_user_id = quiz_users.id
        AND f.user_id = auth.uid()::text
    )
  );

-- Público pode inserir (visitantes iniciando quiz)
CREATE POLICY "quiz_users_public_insert"
  ON public.quiz_users FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- =======================
-- QUIZ_SESSIONS
-- =======================
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.quiz_sessions;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.quiz_sessions;
DROP POLICY IF EXISTS "Enable update for all users" ON public.quiz_sessions;

-- Dono do funil pode ler/alterar/deletar sessões do seu funil
CREATE POLICY "quiz_sessions_owner_read"
  ON public.quiz_sessions FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.funnels f WHERE f.id = quiz_sessions.funnel_id AND f.user_id = auth.uid()::text)
  );

CREATE POLICY "quiz_sessions_owner_update"
  ON public.quiz_sessions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.funnels f WHERE f.id = quiz_sessions.funnel_id AND f.user_id = auth.uid()::text)
  );

CREATE POLICY "quiz_sessions_owner_delete"
  ON public.quiz_sessions FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.funnels f WHERE f.id = quiz_sessions.funnel_id AND f.user_id = auth.uid()::text)
  );

-- Público pode criar sessão contanto que o funil exista
CREATE POLICY "quiz_sessions_public_insert"
  ON public.quiz_sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.funnels f WHERE f.id = quiz_sessions.funnel_id)
  );

-- =======================
-- QUIZ_RESULTS
-- =======================
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.quiz_results;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.quiz_results;

CREATE POLICY "quiz_results_owner_read"
  ON public.quiz_results FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions s
      JOIN public.funnels f ON f.id = s.funnel_id
      WHERE s.id = quiz_results.session_id AND f.user_id = auth.uid()::text
    )
  );

CREATE POLICY "quiz_results_public_insert"
  ON public.quiz_results FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.quiz_sessions s WHERE s.id = quiz_results.session_id)
  );

-- =======================
-- QUIZ_STEP_RESPONSES
-- =======================
ALTER TABLE public.quiz_step_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.quiz_step_responses;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.quiz_step_responses;

CREATE POLICY "quiz_step_responses_owner_read"
  ON public.quiz_step_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions s
      JOIN public.funnels f ON f.id = s.funnel_id
      WHERE s.id = quiz_step_responses.session_id AND f.user_id = auth.uid()::text
    )
  );

CREATE POLICY "quiz_step_responses_public_insert"
  ON public.quiz_step_responses FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.quiz_sessions s WHERE s.id = quiz_step_responses.session_id)
  );

-- =======================
-- QUIZ_CONVERSIONS
-- =======================
ALTER TABLE public.quiz_conversions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.quiz_conversions;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.quiz_conversions;

CREATE POLICY "quiz_conversions_owner_read"
  ON public.quiz_conversions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions s
      JOIN public.funnels f ON f.id = s.funnel_id
      WHERE s.id = quiz_conversions.session_id AND f.user_id = auth.uid()::text
    )
  );

CREATE POLICY "quiz_conversions_public_insert"
  ON public.quiz_conversions FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.quiz_sessions s WHERE s.id = quiz_conversions.session_id)
  );

-- =======================
-- ADMIN/AI/SYSTEM TABLES (user_id)
-- =======================
-- admin_goals, ai_optimization_recommendations, optimization_results, rate_limits, backup_jobs
-- Políticas padrão: apenas o dono (user_id) pode CRUD; sem acesso público

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['admin_goals','ai_optimization_recommendations','optimization_results','rate_limits','backup_jobs']
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);

    -- Não sabemos os nomes das políticas prévias; remover genéricas se existirem
    EXECUTE format('DROP POLICY IF EXISTS "Enable read access for all users" ON public.%I;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Enable insert for all users" ON public.%I;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Enable update for all users" ON public.%I;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Enable delete for all users" ON public.%I;', t);

    EXECUTE format('CREATE POLICY %L ON public.%I FOR SELECT TO authenticated USING (user_id = auth.uid()::text);', t||'_owner_select', t);
    EXECUTE format('CREATE POLICY %L ON public.%I FOR UPDATE TO authenticated USING (user_id = auth.uid()::text);', t||'_owner_update', t);
    EXECUTE format('CREATE POLICY %L ON public.%I FOR DELETE TO authenticated USING (user_id = auth.uid()::text);', t||'_owner_delete', t);
    EXECUTE format('CREATE POLICY %L ON public.%I FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid()::text);', t||'_owner_insert', t);
  END LOOP;
END $$;

COMMIT;
