-- ============================================================================
-- Migration: Performance Indexes and Constraints (FIXED)
-- Date: 2025-11-10
-- Version: 2.0 (Corrigido para estrutura real das tabelas)
-- Description: Adiciona índices compostos críticos para otimização de queries
-- ============================================================================

-- ============================================================================
-- SECTION 0: VERIFICAÇÃO DE ESTRUTURA (Execute esta query primeiro!)
-- ============================================================================
-- Execute esta query no SQL Editor para ver as colunas reais:
/*
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('component_instances', 'quiz_sessions', 'quiz_production', 'funnels')
ORDER BY table_name, ordinal_position;
*/

-- ============================================================================
-- SECTION 1: COMPONENT INSTANCES OPTIMIZATION (Versão Segura)
-- ============================================================================

-- Índice para queries por funnel_id (se a coluna existir)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'component_instances' 
    AND column_name = 'funnel_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_component_instances_funnel 
    ON component_instances(funnel_id)
    WHERE funnel_id IS NOT NULL;
    RAISE NOTICE '✅ Índice idx_component_instances_funnel criado';
  ELSE
    RAISE NOTICE '⚠️  Coluna funnel_id não existe em component_instances';
  END IF;
END $$;

-- Índice para queries por user_id + created_at
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'component_instances' 
    AND column_name = 'user_id'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'component_instances' 
    AND column_name = 'created_at'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_component_instances_user_created 
    ON component_instances(user_id, created_at DESC)
    WHERE user_id IS NOT NULL;
    RAISE NOTICE '✅ Índice idx_component_instances_user_created criado';
  END IF;
END $$;

-- Índice para queries por type (se a coluna existir)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'component_instances' 
    AND column_name IN ('component_type', 'type', 'block_type')
  ) THEN
    -- Tentar com component_type
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'component_instances' AND column_name = 'component_type'
    ) THEN
      CREATE INDEX IF NOT EXISTS idx_component_instances_type 
      ON component_instances(component_type)
      WHERE component_type IS NOT NULL;
      RAISE NOTICE '✅ Índice idx_component_instances_type criado';
    -- Tentar com type
    ELSIF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'component_instances' AND column_name = 'type'
    ) THEN
      CREATE INDEX IF NOT EXISTS idx_component_instances_type 
      ON component_instances(type)
      WHERE type IS NOT NULL;
      RAISE NOTICE '✅ Índice idx_component_instances_type criado (coluna: type)';
    END IF;
  END IF;
END $$;

-- Índice para componentes ativos (excluir soft-deleted)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'component_instances' 
    AND column_name = 'deleted_at'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_component_instances_active 
    ON component_instances(updated_at DESC)
    WHERE deleted_at IS NULL;
    RAISE NOTICE '✅ Índice idx_component_instances_active criado';
  END IF;
END $$;

-- ============================================================================
-- SECTION 2: QUIZ SESSIONS OPTIMIZATION
-- ============================================================================

-- Verificar se tabela existe
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'quiz_sessions'
  ) THEN
    -- Índice composto user + created
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'quiz_sessions' AND column_name = 'user_id'
    ) THEN
      CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_created 
      ON quiz_sessions(user_id, created_at DESC)
      WHERE user_id IS NOT NULL;
      RAISE NOTICE '✅ Índice idx_quiz_sessions_user_created criado';
    END IF;

    -- Índice por quiz_id
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'quiz_sessions' AND column_name = 'quiz_id'
    ) THEN
      CREATE INDEX IF NOT EXISTS idx_quiz_sessions_quiz_created 
      ON quiz_sessions(quiz_id, created_at DESC)
      WHERE quiz_id IS NOT NULL;
      RAISE NOTICE '✅ Índice idx_quiz_sessions_quiz_created criado';
    END IF;

    -- Índice para sessões completas
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'quiz_sessions' AND column_name = 'completed_at'
    ) THEN
      CREATE INDEX IF NOT EXISTS idx_quiz_sessions_completed 
      ON quiz_sessions(completed_at DESC)
      WHERE completed_at IS NOT NULL;
      RAISE NOTICE '✅ Índice idx_quiz_sessions_completed criado';
    END IF;

    -- Índice para sessões ativas
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'quiz_sessions' AND column_name = 'started_at'
    ) THEN
      CREATE INDEX IF NOT EXISTS idx_quiz_sessions_active 
      ON quiz_sessions(started_at DESC)
      WHERE completed_at IS NULL AND started_at IS NOT NULL;
      RAISE NOTICE '✅ Índice idx_quiz_sessions_active criado';
    END IF;
  ELSE
    RAISE NOTICE '⚠️  Tabela quiz_sessions não existe';
  END IF;
END $$;

-- ============================================================================
-- SECTION 3: QUIZ PRODUCTION OPTIMIZATION
-- ============================================================================

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'quiz_production'
  ) THEN
    -- Índice por user
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'quiz_production' AND column_name = 'user_id'
    ) THEN
      CREATE INDEX IF NOT EXISTS idx_quiz_production_user 
      ON quiz_production(user_id, created_at DESC)
      WHERE user_id IS NOT NULL;
      RAISE NOTICE '✅ Índice idx_quiz_production_user criado';
    END IF;

    -- Índice para quizzes ativos
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'quiz_production' AND column_name = 'is_active'
    ) THEN
      CREATE INDEX IF NOT EXISTS idx_quiz_production_active 
      ON quiz_production(is_active, updated_at DESC)
      WHERE is_active = true;
      RAISE NOTICE '✅ Índice idx_quiz_production_active criado';
    END IF;

    -- Índice por slug
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'quiz_production' AND column_name = 'slug'
    ) THEN
      CREATE INDEX IF NOT EXISTS idx_quiz_production_slug 
      ON quiz_production(slug)
      WHERE slug IS NOT NULL;
      RAISE NOTICE '✅ Índice idx_quiz_production_slug criado';
    END IF;
  ELSE
    RAISE NOTICE '⚠️  Tabela quiz_production não existe';
  END IF;
END $$;

-- ============================================================================
-- SECTION 4: FUNNELS OPTIMIZATION
-- ============================================================================

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'funnels'
  ) THEN
    -- Índice por user
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'funnels' AND column_name = 'user_id'
    ) THEN
      CREATE INDEX IF NOT EXISTS idx_funnels_user 
      ON funnels(user_id, created_at DESC)
      WHERE user_id IS NOT NULL;
      RAISE NOTICE '✅ Índice idx_funnels_user criado';
    END IF;

    -- Índice para funis ativos
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'funnels' AND column_name = 'is_active'
    ) THEN
      CREATE INDEX IF NOT EXISTS idx_funnels_active 
      ON funnels(is_active, updated_at DESC)
      WHERE is_active = true;
      RAISE NOTICE '✅ Índice idx_funnels_active criado';
    END IF;

    -- Índice trigram para busca por nome (requer extensão pg_trgm)
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'funnels' AND column_name = 'name'
    ) THEN
      -- Verificar se extensão pg_trgm está habilitada
      IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm') THEN
        CREATE INDEX IF NOT EXISTS idx_funnels_name_trgm 
        ON funnels USING gin(name gin_trgm_ops)
        WHERE name IS NOT NULL;
        RAISE NOTICE '✅ Índice idx_funnels_name_trgm criado';
      ELSE
        -- Criar índice simples se pg_trgm não estiver disponível
        CREATE INDEX IF NOT EXISTS idx_funnels_name 
        ON funnels(name)
        WHERE name IS NOT NULL;
        RAISE NOTICE '✅ Índice idx_funnels_name criado (pg_trgm não disponível)';
      END IF;
    END IF;
  ELSE
    RAISE NOTICE '⚠️  Tabela funnels não existe';
  END IF;
END $$;

-- ============================================================================
-- SECTION 5: ANALYTICS TABLES OPTIMIZATION
-- ============================================================================

-- System Health Metrics
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'system_health_metrics'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_health_metrics_service_recorded 
    ON system_health_metrics(service_name, recorded_at DESC)
    WHERE service_name IS NOT NULL;
    
    CREATE INDEX IF NOT EXISTS idx_health_metrics_critical 
    ON system_health_metrics(status, recorded_at DESC)
    WHERE status = 'critical';
    
    RAISE NOTICE '✅ Índices system_health_metrics criados';
  END IF;
END $$;

-- Security Audit Logs
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'security_audit_logs'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_security_logs_severity_created 
    ON security_audit_logs(severity, created_at DESC)
    WHERE severity IN ('high', 'critical');
    
    RAISE NOTICE '✅ Índice security_audit_logs criado';
  END IF;
END $$;

-- Rate Limits
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'rate_limits'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_endpoint 
    ON rate_limits(identifier, endpoint, reset_time)
    WHERE reset_time > EXTRACT(EPOCH FROM NOW());
    
    RAISE NOTICE '✅ Índice rate_limits criado';
  END IF;
END $$;

-- ============================================================================
-- SECTION 6: MAINTENANCE FUNCTIONS
-- ============================================================================

-- Função de limpeza de rate_limits
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'rate_limits'
  ) THEN
    DELETE FROM rate_limits
    WHERE reset_time < EXTRACT(EPOCH FROM NOW() - INTERVAL '24 hours');
  END IF;
END;
$$;

-- Função de arquivamento de sessões
CREATE OR REPLACE FUNCTION archive_old_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'quiz_sessions'
  ) THEN
    UPDATE quiz_sessions
    SET metadata = jsonb_set(
      COALESCE(metadata, '{}'::jsonb),
      '{archived}',
      'true'::jsonb
    )
    WHERE completed_at < NOW() - INTERVAL '90 days'
    AND (metadata->>'archived' IS NULL OR metadata->>'archived' != 'true');
  END IF;
END;
$$;

-- ============================================================================
-- SECTION 7: MONITORING VIEWS
-- ============================================================================

-- View para uso de índices
CREATE OR REPLACE VIEW index_usage_stats AS
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- View para tamanho das tabelas
CREATE OR REPLACE VIEW table_size_stats AS
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
  pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) AS indexes_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================================================
-- SECTION 8: STATISTICS UPDATE
-- ============================================================================

DO $$ 
BEGIN
  -- Atualizar estatísticas apenas das tabelas que existem
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'component_instances') THEN
    ANALYZE component_instances;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'quiz_sessions') THEN
    ANALYZE quiz_sessions;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'quiz_production') THEN
    ANALYZE quiz_production;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'funnels') THEN
    ANALYZE funnels;
  END IF;
  
  RAISE NOTICE '✅ Estatísticas atualizadas';
END $$;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

DO $$
DECLARE
  index_count INTEGER;
BEGIN
  -- Contar índices criados
  SELECT COUNT(*) INTO index_count
  FROM pg_indexes
  WHERE schemaname = 'public'
    AND indexname LIKE 'idx_%';
    
  RAISE NOTICE '╔════════════════════════════════════════════════════╗';
  RAISE NOTICE '║                                                    ║';
  RAISE NOTICE '║  ✅ Migration Completed Successfully!             ║';
  RAISE NOTICE '║                                                    ║';
  RAISE NOTICE '╚════════════════════════════════════════════════════╝';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Índices criados: %', index_count;
  RAISE NOTICE '🧹 Funções de manutenção: 2';
  RAISE NOTICE '📈 Views de monitoramento: 2';
  RAISE NOTICE '';
  RAISE NOTICE '💡 Para verificar: SELECT * FROM index_usage_stats;';
END $$;
