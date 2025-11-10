-- ============================================================================
-- Migration: Auth Hardening and RLS Policies (VERSÃO SIMPLIFICADA)
-- Date: 2025-11-10
-- Version: 3.0 - Minimalista e Defensiva
-- Description: Habilita RLS básico nas tabelas existentes
-- ============================================================================

-- ============================================================================
-- SECTION 1: HABILITAR RLS EM TABELAS EXISTENTES
-- ============================================================================

DO $$
BEGIN
  -- Apenas habilitar RLS, sem criar policies por enquanto
  -- Policies podem ser adicionadas manualmente depois conforme necessário
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'funnels') THEN
    ALTER TABLE funnels ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE '✅ RLS habilitado para funnels';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_production') THEN
    ALTER TABLE quiz_production ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE '✅ RLS habilitado para quiz_production';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'component_instances') THEN
    ALTER TABLE component_instances ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE '✅ RLS habilitado para component_instances';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_sessions') THEN
    ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE '✅ RLS habilitado para quiz_sessions';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'system_health_metrics') THEN
    ALTER TABLE system_health_metrics ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE '✅ RLS habilitado para system_health_metrics';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'security_audit_logs') THEN
    ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE '✅ RLS habilitado para security_audit_logs';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rate_limits') THEN
    ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE '✅ RLS habilitado para rate_limits';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '╔════════════════════════════════════════════════════╗';
  RAISE NOTICE '║  ✅ RLS Habilitado nas Tabelas Existentes         ║';
  RAISE NOTICE '╚════════════════════════════════════════════════════╝';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  IMPORTANTE: RLS está ativo mas SEM policies!';
  RAISE NOTICE '   Isso significa que NINGUÉM pode acessar os dados.';
  RAISE NOTICE '';
  RAISE NOTICE '📝 PRÓXIMO PASSO:';
  RAISE NOTICE '   Adicionar policies manualmente no Dashboard conforme';
  RAISE NOTICE '   a estrutura real das tabelas for conhecida.';
  RAISE NOTICE '';
  RAISE NOTICE '💡 OU: Desabilitar RLS temporariamente com:';
  RAISE NOTICE '   ALTER TABLE nome_tabela DISABLE ROW LEVEL SECURITY;';
  
END $$;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
