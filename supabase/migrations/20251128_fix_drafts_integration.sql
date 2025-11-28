-- ============================================================================
-- Migration: Correção de Integração Drafts/Funnels
-- Date: 2025-11-28
-- Description: Corrige inconsistências entre código e schema do banco
--              para sistema de drafts e versionamento
-- ============================================================================

-- ============================================================================
-- SECTION 1: CORREÇÃO quiz_drafts - Adicionar política DELETE
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'quiz_drafts'
  ) THEN
    -- Garantir que RLS está habilitado
    ALTER TABLE quiz_drafts ENABLE ROW LEVEL SECURITY;

    -- Dropar políticas antigas se existirem
    DROP POLICY IF EXISTS "Users can view own drafts" ON quiz_drafts;
    DROP POLICY IF EXISTS "Users can create drafts" ON quiz_drafts;
    DROP POLICY IF EXISTS "Users can update own drafts" ON quiz_drafts;
    DROP POLICY IF EXISTS "Users can delete own drafts" ON quiz_drafts;

    -- Criar políticas completas (CRUD)
    CREATE POLICY "quiz_drafts_select_policy" ON quiz_drafts
      FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "quiz_drafts_insert_policy" ON quiz_drafts
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "quiz_drafts_update_policy" ON quiz_drafts
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    -- NOVA: Política DELETE (estava faltando!)
    CREATE POLICY "quiz_drafts_delete_policy" ON quiz_drafts
      FOR DELETE
      USING (auth.uid() = user_id);

    RAISE NOTICE '✅ RLS policies atualizadas para quiz_drafts (incluindo DELETE)';
  ELSE
    RAISE NOTICE '⚠️  Tabela quiz_drafts não existe - pulando';
  END IF;
END $$;

-- ============================================================================
-- SECTION 2: CORREÇÃO quiz_production - RLS atualizado
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'quiz_production'
  ) THEN
    -- Garantir que RLS está habilitado
    ALTER TABLE quiz_production ENABLE ROW LEVEL SECURITY;

    -- Dropar políticas antigas
    DROP POLICY IF EXISTS "Anyone can view production" ON quiz_production;
    DROP POLICY IF EXISTS "Only admins can publish" ON quiz_production;
    DROP POLICY IF EXISTS "quiz_production_select_policy" ON quiz_production;
    DROP POLICY IF EXISTS "quiz_production_insert_policy" ON quiz_production;
    DROP POLICY IF EXISTS "quiz_production_update_policy" ON quiz_production;
    DROP POLICY IF EXISTS "quiz_production_delete_policy" ON quiz_production;

    -- SELECT: Todos podem ler versões publicadas
    CREATE POLICY "quiz_production_select_policy" ON quiz_production
      FOR SELECT
      USING (true);

    -- INSERT: Apenas owners podem publicar
    CREATE POLICY "quiz_production_insert_policy" ON quiz_production
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    -- UPDATE: Apenas owners podem atualizar
    CREATE POLICY "quiz_production_update_policy" ON quiz_production
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    -- DELETE: Apenas owners podem deletar
    CREATE POLICY "quiz_production_delete_policy" ON quiz_production
      FOR DELETE
      USING (auth.uid() = user_id);

    RAISE NOTICE '✅ RLS policies atualizadas para quiz_production';
  ELSE
    RAISE NOTICE '⚠️  Tabela quiz_production não existe - pulando';
  END IF;
END $$;

-- ============================================================================
-- SECTION 3: FUNÇÕES DE PUBLICAÇÃO
-- ============================================================================

-- Função para publicar draft (RPC)
CREATE OR REPLACE FUNCTION publish_quiz_draft(draft_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_draft RECORD;
  v_production_id UUID;
BEGIN
  -- Buscar draft
  SELECT * INTO v_draft FROM quiz_drafts WHERE id = draft_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Draft não encontrado: %', draft_id;
  END IF;

  -- Verificar ownership
  IF v_draft.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Sem permissão para publicar este draft';
  END IF;

  -- Inserir em produção
  INSERT INTO quiz_production (
    user_id,
    draft_id,
    funnel_id,
    name,
    slug,
    content,
    metadata,
    version,
    status
  )
  VALUES (
    v_draft.user_id,
    v_draft.id,
    v_draft.funnel_id,
    v_draft.name,
    v_draft.slug,
    v_draft.content,
    v_draft.metadata,
    COALESCE(
      (SELECT MAX(version) + 1 FROM quiz_production WHERE funnel_id = v_draft.funnel_id),
      1
    ),
    'published'
  )
  ON CONFLICT (slug) DO UPDATE SET
    content = EXCLUDED.content,
    version = EXCLUDED.version,
    metadata = EXCLUDED.metadata,
    updated_at = NOW()
  RETURNING id INTO v_production_id;

  -- Atualizar draft
  UPDATE quiz_drafts 
  SET is_published = true, updated_at = NOW()
  WHERE id = draft_id;

  RETURN v_production_id;
END;
$$;

-- Função para criar draft a partir de funnel
CREATE OR REPLACE FUNCTION create_draft_from_funnel(
  p_funnel_id TEXT,
  p_name TEXT DEFAULT NULL,
  p_slug TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_draft_id UUID;
  v_funnel RECORD;
BEGIN
  -- Verificar se usuário está autenticado
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado';
  END IF;

  -- Buscar funnel
  SELECT * INTO v_funnel FROM funnels WHERE id = p_funnel_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Funnel não encontrado: %', p_funnel_id;
  END IF;

  -- Verificar ownership
  IF v_funnel.user_id != auth.uid()::text THEN
    RAISE EXCEPTION 'Sem permissão para criar draft deste funnel';
  END IF;

  -- Criar draft
  INSERT INTO quiz_drafts (
    user_id,
    funnel_id,
    name,
    slug,
    content,
    metadata,
    status
  )
  VALUES (
    auth.uid(),
    p_funnel_id,
    COALESCE(p_name, v_funnel.name),
    COALESCE(p_slug, p_funnel_id),
    jsonb_build_object(
      'steps', '[]'::jsonb,
      'metadata', COALESCE(v_funnel.settings, '{}'::jsonb)
    ),
    jsonb_build_object(
      'source_funnel', p_funnel_id,
      'created_from', 'funnel'
    ),
    'draft'
  )
  ON CONFLICT (user_id, funnel_id) DO UPDATE SET
    updated_at = NOW()
  RETURNING id INTO v_draft_id;

  RETURN v_draft_id;
END;
$$;

-- ============================================================================
-- SECTION 4: ADICIONAR COLUNA funnel_id SE NÃO EXISTIR
-- ============================================================================

DO $$
BEGIN
  -- Verificar se coluna funnel_id existe em quiz_drafts
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
    AND table_name = 'quiz_drafts'
    AND column_name = 'funnel_id'
  ) THEN
    -- Adicionar coluna funnel_id
    ALTER TABLE quiz_drafts ADD COLUMN funnel_id TEXT;
    
    -- Popular funnel_id com base no id (para drafts existentes)
    UPDATE quiz_drafts SET funnel_id = id WHERE funnel_id IS NULL;
    
    -- Tornar NOT NULL após popular
    ALTER TABLE quiz_drafts ALTER COLUMN funnel_id SET NOT NULL;
    
    -- Adicionar índice
    CREATE INDEX IF NOT EXISTS idx_quiz_drafts_funnel_id ON quiz_drafts(funnel_id);
    
    RAISE NOTICE '✅ Coluna funnel_id adicionada em quiz_drafts';
  ELSE
    RAISE NOTICE '⚠️  Coluna funnel_id já existe em quiz_drafts';
  END IF;
END $$;

-- ============================================================================
-- SECTION 5: ADICIONAR COLUNA user_id SE NÃO EXISTIR
-- ============================================================================

DO $$
BEGIN
  -- Verificar se coluna user_id existe em quiz_production
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
    AND table_name = 'quiz_production'
    AND column_name = 'user_id'
  ) THEN
    -- Adicionar coluna user_id
    ALTER TABLE quiz_production ADD COLUMN user_id UUID REFERENCES auth.users(id);
    
    -- Popular com UUID vazio para registros existentes (se houver)
    -- Nota: Idealmente deveria vir do draft_id relacionado
    UPDATE quiz_production p
    SET user_id = d.user_id
    FROM quiz_drafts d
    WHERE p.draft_id = d.id AND p.user_id IS NULL;
    
    -- Adicionar índice
    CREATE INDEX IF NOT EXISTS idx_quiz_production_user_id ON quiz_production(user_id);
    
    RAISE NOTICE '✅ Coluna user_id adicionada em quiz_production';
  ELSE
    RAISE NOTICE '⚠️  Coluna user_id já existe em quiz_production';
  END IF;
END $$;

-- ============================================================================
-- SECTION 6: GRANTS E PERMISSÕES
-- ============================================================================

-- Permitir que authenticated users executem funções RPC
GRANT EXECUTE ON FUNCTION publish_quiz_draft(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION create_draft_from_funnel(TEXT, TEXT, TEXT) TO authenticated;

-- ============================================================================
-- SECTION 7: COMENTÁRIOS E DOCUMENTAÇÃO
-- ============================================================================

COMMENT ON FUNCTION publish_quiz_draft(UUID) IS 
  'Publica um draft para produção, criando nova versão em quiz_production';

COMMENT ON FUNCTION create_draft_from_funnel(TEXT, TEXT, TEXT) IS 
  'Cria um draft a partir de um funnel existente';

COMMENT ON POLICY "quiz_drafts_delete_policy" ON quiz_drafts IS 
  'Users podem deletar seus próprios drafts';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '🔒 Migration 20251128_fix_drafts_integration completed successfully';
  RAISE NOTICE '✅ quiz_drafts: RLS completo com DELETE policy';
  RAISE NOTICE '✅ quiz_production: RLS atualizado';
  RAISE NOTICE '✅ Funções RPC: publish_quiz_draft, create_draft_from_funnel';
  RAISE NOTICE '✅ Colunas funnel_id e user_id verificadas/adicionadas';
  RAISE NOTICE '📋 Sistema de drafts integrado com funnels';
END $$;
