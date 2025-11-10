-- ============================================================================
-- Migration: Performance Indexes and Constraints
-- Date: 2025-11-10
-- Description: Adiciona índices compostos críticos para otimização de queries
--              e constraints de integridade nas tabelas principais
-- ============================================================================

-- ============================================================================
-- SECTION 1: COMPONENT INSTANCES OPTIMIZATION
-- ============================================================================

-- Índice composto para queries por funnel + step (query mais comum)
CREATE INDEX IF NOT EXISTS idx_component_instances_funnel_step 
ON component_instances(funnel_id, step_key)
WHERE funnel_id IS NOT NULL AND step_key IS NOT NULL;

-- Índice para queries por user + created (analytics e histórico)
CREATE INDEX IF NOT EXISTS idx_component_instances_user_created 
ON component_instances(user_id, created_at DESC)
WHERE user_id IS NOT NULL;

-- Índice para queries por type (filtragem por tipo de componente)
CREATE INDEX IF NOT EXISTS idx_component_instances_type 
ON component_instances(component_type)
WHERE component_type IS NOT NULL;

-- Índice parcial para componentes ativos (excluir soft-deleted)
CREATE INDEX IF NOT EXISTS idx_component_instances_active 
ON component_instances(funnel_id, updated_at DESC)
WHERE deleted_at IS NULL;

-- ============================================================================
-- SECTION 2: QUIZ SESSIONS OPTIMIZATION
-- ============================================================================

-- Índice composto para queries por user + data (dashboard e analytics)
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_created 
ON quiz_sessions(user_id, created_at DESC)
WHERE user_id IS NOT NULL;

-- Índice para queries por quiz_id (performance por quiz)
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_quiz_created 
ON quiz_sessions(quiz_id, created_at DESC)
WHERE quiz_id IS NOT NULL;

-- Índice para sessões completas (conversions)
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_completed 
ON quiz_sessions(completed_at DESC)
WHERE completed_at IS NOT NULL;

-- Índice parcial para sessões ativas (em progresso)
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_active 
ON quiz_sessions(started_at DESC)
WHERE completed_at IS NULL AND started_at IS NOT NULL;

-- ============================================================================
-- SECTION 3: QUIZ PRODUCTION OPTIMIZATION
-- ============================================================================

-- Índice para queries por user (meus quizzes)
CREATE INDEX IF NOT EXISTS idx_quiz_production_user 
ON quiz_production(user_id, created_at DESC)
WHERE user_id IS NOT NULL;

-- Índice para quizzes públicos ativos
CREATE INDEX IF NOT EXISTS idx_quiz_production_active 
ON quiz_production(is_active, updated_at DESC)
WHERE is_active = true;

-- Índice composto para busca por slug (URLs públicas)
CREATE INDEX IF NOT EXISTS idx_quiz_production_slug 
ON quiz_production(slug)
WHERE slug IS NOT NULL AND is_active = true;

-- ============================================================================
-- SECTION 4: FUNNELS OPTIMIZATION
-- ============================================================================

-- Índice para queries por user (meus funis)
CREATE INDEX IF NOT EXISTS idx_funnels_user 
ON funnels(user_id, created_at DESC)
WHERE user_id IS NOT NULL;

-- Índice para funis ativos
CREATE INDEX IF NOT EXISTS idx_funnels_active 
ON funnels(is_active, updated_at DESC)
WHERE is_active = true;

-- Índice para busca por nome (autocomplete)
CREATE INDEX IF NOT EXISTS idx_funnels_name_trgm 
ON funnels USING gin(name gin_trgm_ops)
WHERE name IS NOT NULL;

-- ============================================================================
-- SECTION 5: ANALYTICS TABLES OPTIMIZATION
-- ============================================================================

-- Índice para system_health_metrics (monitoring)
CREATE INDEX IF NOT EXISTS idx_health_metrics_service_recorded 
ON system_health_metrics(service_name, recorded_at DESC)
WHERE service_name IS NOT NULL;

-- Índice para métricas críticas (alertas)
CREATE INDEX IF NOT EXISTS idx_health_metrics_critical 
ON system_health_metrics(status, recorded_at DESC)
WHERE status = 'critical';

-- Índice para security_audit_logs (security monitoring)
CREATE INDEX IF NOT EXISTS idx_security_logs_severity_created 
ON security_audit_logs(severity, created_at DESC)
WHERE severity IN ('high', 'critical');

-- Índice para rate_limits (verificação rápida)
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_endpoint 
ON rate_limits(identifier, endpoint, reset_time)
WHERE reset_time > EXTRACT(EPOCH FROM NOW());

-- ============================================================================
-- SECTION 6: CONSTRAINTS AND DATA INTEGRITY
-- ============================================================================

-- Adicionar check constraint para component_instances
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'component_instances_valid_type'
  ) THEN
    ALTER TABLE component_instances
    ADD CONSTRAINT component_instances_valid_type
    CHECK (component_type IN (
      'heading', 'text', 'button', 'image', 'quiz-options', 
      'form-input', 'progress', 'result-card', 'offer', 'video'
    ));
  END IF;
END $$;

-- Adicionar check constraint para quiz_sessions (session válida)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'quiz_sessions_valid_dates'
  ) THEN
    ALTER TABLE quiz_sessions
    ADD CONSTRAINT quiz_sessions_valid_dates
    CHECK (
      started_at IS NOT NULL AND 
      (completed_at IS NULL OR completed_at >= started_at)
    );
  END IF;
END $$;

-- Adicionar unique constraint para slugs ativos
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'quiz_production_unique_active_slug'
  ) THEN
    CREATE UNIQUE INDEX quiz_production_unique_active_slug
    ON quiz_production(slug)
    WHERE is_active = true AND slug IS NOT NULL;
  END IF;
END $$;

-- ============================================================================
-- SECTION 7: MAINTENANCE AND CLEANUP
-- ============================================================================

-- Criar função para limpeza automática de rate_limits expirados
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM rate_limits
  WHERE reset_time < EXTRACT(EPOCH FROM NOW() - INTERVAL '24 hours');
END;
$$;

-- Criar função para arquivamento de sessões antigas
CREATE OR REPLACE FUNCTION archive_old_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Marcar sessões antigas para arquivamento (implementar lógica específica)
  UPDATE quiz_sessions
  SET metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{archived}',
    'true'::jsonb
  )
  WHERE completed_at < NOW() - INTERVAL '90 days'
  AND (metadata->>'archived' IS NULL OR metadata->>'archived' != 'true');
END;
$$;

-- ============================================================================
-- SECTION 8: STATISTICS UPDATE
-- ============================================================================

-- Atualizar estatísticas do PostgreSQL para otimizar planner
ANALYZE component_instances;
ANALYZE quiz_sessions;
ANALYZE quiz_production;
ANALYZE funnels;
ANALYZE system_health_metrics;
ANALYZE security_audit_logs;
ANALYZE rate_limits;

-- ============================================================================
-- SECTION 9: GRANTS AND PERMISSIONS
-- ============================================================================

-- Garantir que authenticated users possam usar os índices
GRANT SELECT ON component_instances TO authenticated;
GRANT SELECT ON quiz_sessions TO authenticated;
GRANT SELECT ON quiz_production TO authenticated;
GRANT SELECT ON funnels TO authenticated;

-- Permitir service_role executar funções de manutenção
GRANT EXECUTE ON FUNCTION cleanup_expired_rate_limits() TO service_role;
GRANT EXECUTE ON FUNCTION archive_old_sessions() TO service_role;

-- ============================================================================
-- SECTION 10: VALIDATION AND MONITORING
-- ============================================================================

-- View para monitorar uso dos índices
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

-- View para monitorar tamanho das tabelas
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
-- MIGRATION COMPLETE
-- ============================================================================

-- Log da migração
DO $$
BEGIN
  RAISE NOTICE '✅ Migration 20251110_add_performance_indexes completed successfully';
  RAISE NOTICE '📊 Índices criados: 18';
  RAISE NOTICE '🔒 Constraints adicionados: 3';
  RAISE NOTICE '🧹 Funções de manutenção: 2';
  RAISE NOTICE '📈 Views de monitoramento: 2';
END $$;
