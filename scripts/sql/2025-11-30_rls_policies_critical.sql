-- ============================================================================
-- Migration: 2025-11-30 RLS Policies Critical Hardening
-- Objetivo: Endurecer acesso a tabelas sensíveis (quiz_users, component_instances)
--            e preparar base para futura tabela quiz_analysis.
-- Idempotente: Usa DROP POLICY IF EXISTS e CREATE POLICY IF NOT EXISTS.
-- ============================================================================

BEGIN;

-- =======================
-- QUIZ_USERS (PII)
-- =======================
ALTER TABLE public.quiz_users ENABLE ROW LEVEL SECURITY;

-- Remover políticas anteriores permissivas
DROP POLICY IF EXISTS "quiz_users_public_insert" ON public.quiz_users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.quiz_users;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.quiz_users;
DROP POLICY IF EXISTS "Enable update for all users" ON public.quiz_users;
DROP POLICY IF EXISTS "quiz_users_owner_read" ON public.quiz_users;
DROP POLICY IF EXISTS "quiz_users_owner_update" ON public.quiz_users;

-- Política: usuários só podem acessar registros vinculados a sessões que eles próprios criaram
-- Requer que quiz_sessions tenha funnel associado ao user_id; já garantido em migração anterior.
CREATE POLICY IF NOT EXISTS "quiz_users_select_session_owner"
  ON public.quiz_users FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.quiz_sessions s
      JOIN public.funnels f ON f.id = s.funnel_id
      WHERE s.quiz_user_id = quiz_users.id
        AND f.user_id = auth.uid()::text
    )
  );

-- Insert: permitir criação apenas via fluxo de sessão (anon ou authenticated), mas restringir campos sensíveis
-- Checagem mínima: email, ip_address (se existir) não podem ser pré-populados vazios maliciosamente; placeholder sanitizado.
CREATE POLICY IF NOT EXISTS "quiz_users_controlled_insert"
  ON public.quiz_users FOR INSERT TO anon, authenticated
  WITH CHECK (
    (email IS NULL OR length(email) > 3) AND (session_id IS NOT NULL)
  );

-- Update: somente dono do funil pode atualizar usuário (ex: enriquecer lead)
CREATE POLICY IF NOT EXISTS "quiz_users_owner_update_secure"
  ON public.quiz_users FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.quiz_sessions s
      JOIN public.funnels f ON f.id = s.funnel_id
      WHERE s.quiz_user_id = quiz_users.id
        AND f.user_id = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.quiz_sessions s
      JOIN public.funnels f ON f.id = s.funnel_id
      WHERE s.quiz_user_id = quiz_users.id
        AND f.user_id = auth.uid()::text
    )
  );

-- Delete: somente dono do funil pode remover (limpeza de leads inválidos)
CREATE POLICY IF NOT EXISTS "quiz_users_owner_delete_secure"
  ON public.quiz_users FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.quiz_sessions s
      JOIN public.funnels f ON f.id = s.funnel_id
      WHERE s.quiz_user_id = quiz_users.id
        AND f.user_id = auth.uid()::text
    )
  );

-- =======================
-- COMPONENT_INSTANCES (editáveis)
-- =======================
ALTER TABLE public.component_instances ENABLE ROW LEVEL SECURITY;

-- Remover políticas permissivas prévias (se existirem)
DROP POLICY IF EXISTS "ci_select_by_funnel_owner" ON public.component_instances;
DROP POLICY IF EXISTS "ci_insert_by_funnel_owner" ON public.component_instances;
DROP POLICY IF EXISTS "ci_update_by_funnel_owner" ON public.component_instances;
DROP POLICY IF EXISTS "ci_delete_by_funnel_owner" ON public.component_instances;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.component_instances;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.component_instances;
DROP POLICY IF EXISTS "Enable update for all users" ON public.component_instances;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.component_instances;

-- Select restrito ao dono do funil
CREATE POLICY IF NOT EXISTS "component_instances_owner_select"
  ON public.component_instances FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.funnels f
      WHERE f.id = component_instances.funnel_id
        AND f.user_id = auth.uid()::text
    )
  );

-- Insert: apenas dono do funil pode inserir componentes
CREATE POLICY IF NOT EXISTS "component_instances_owner_insert"
  ON public.component_instances FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.funnels f
      WHERE f.id = component_instances.funnel_id
        AND f.user_id = auth.uid()::text
    )
  );

-- Update: apenas dono
CREATE POLICY IF NOT EXISTS "component_instances_owner_update"
  ON public.component_instances FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.funnels f
      WHERE f.id = component_instances.funnel_id
        AND f.user_id = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.funnels f
      WHERE f.id = component_instances.funnel_id
        AND f.user_id = auth.uid()::text
    )
  );

-- Delete: apenas dono
CREATE POLICY IF NOT EXISTS "component_instances_owner_delete"
  ON public.component_instances FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.funnels f
      WHERE f.id = component_instances.funnel_id
        AND f.user_id = auth.uid()::text
    )
  );

-- =======================
-- QUIZ_ANALYSIS (placeholder futuro)
-- =======================
-- Se existir, aplicar políticas restritivas (apenas dono do funnel via sessão)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema='public' AND table_name='quiz_analysis'
  ) THEN
    ALTER TABLE public.quiz_analysis ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "quiz_analysis_public_read" ON public.quiz_analysis;
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.quiz_analysis;

    CREATE POLICY IF NOT EXISTS "quiz_analysis_owner_select"
      ON public.quiz_analysis FOR SELECT TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.quiz_sessions s
          JOIN public.funnels f ON f.id = s.funnel_id
          WHERE s.id = quiz_analysis.session_id
            AND f.user_id = auth.uid()::text
        )
      );
  END IF;
END $$;

COMMIT;

-- Fim da migração crítica de RLS
