-- ============================================================================
-- Migration: Security Enhancements - Phase 2
-- Date: 2025-11-28
-- Description: Melhorias adicionais de segurança, validação de input e
--              proteções contra ataques comuns
-- ============================================================================

-- ============================================================================
-- SECTION 1: TABELA DE RATE LIMITS (se não existir)
-- ============================================================================

CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL,  -- IP, user_id, ou API key
    endpoint TEXT NOT NULL,    -- Endpoint sendo limitado
    current INTEGER DEFAULT 0, -- Contagem atual de requisições
    "limit" INTEGER NOT NULL,  -- Limite máximo
    window INTEGER NOT NULL,   -- Janela de tempo em segundos
    reset_time INTEGER NOT NULL, -- Timestamp UNIX do reset
    last_request INTEGER NOT NULL, -- Timestamp UNIX da última requisição
    user_id TEXT,              -- User ID opcional para tracking
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_endpoint ON rate_limits(identifier, endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_time ON rate_limits(reset_time);
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_id ON rate_limits(user_id);

-- ============================================================================
-- SECTION 2: TABELAS DE AUDITORIA DE SEGURANÇA (se não existirem)
-- ============================================================================

CREATE TABLE IF NOT EXISTS security_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    user_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    endpoint TEXT,
    http_method TEXT,
    status_code INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_event_type ON security_audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_severity ON security_audit_logs(severity);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_user_id ON security_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_created_at ON security_audit_logs(created_at);

CREATE TABLE IF NOT EXISTS system_health_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    metric_unit TEXT DEFAULT 'ms',
    status TEXT CHECK (status IN ('healthy', 'warning', 'critical')) DEFAULT 'healthy',
    metadata JSONB DEFAULT '{}'::jsonb,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_system_health_metrics_service ON system_health_metrics(service_name);
CREATE INDEX IF NOT EXISTS idx_system_health_metrics_status ON system_health_metrics(status);
CREATE INDEX IF NOT EXISTS idx_system_health_metrics_recorded_at ON system_health_metrics(recorded_at);

-- ============================================================================
-- SECTION 3: FUNÇÕES DE VALIDAÇÃO DE INPUT
-- ============================================================================

-- Função para sanitizar strings (prevenir XSS)
CREATE OR REPLACE FUNCTION sanitize_string(input_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    IF input_text IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Remover tags HTML/JavaScript básicos
    RETURN regexp_replace(
        regexp_replace(
            input_text,
            '<[^>]*>',  -- Remove HTML tags
            '',
            'g'
        ),
        '(javascript:|on\w+\s*=)',  -- Remove event handlers e javascript:
        '',
        'gi'
    );
END;
$$;

-- Função para validar email
CREATE OR REPLACE FUNCTION is_valid_email(email_text TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    RETURN email_text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$;

-- Função para validar URL
CREATE OR REPLACE FUNCTION is_valid_url(url_text TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    RETURN url_text ~* '^https?://[^\s/$.?#].[^\s]*$';
END;
$$;

-- Função para validar UUID
CREATE OR REPLACE FUNCTION is_valid_uuid(uuid_text TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    RETURN uuid_text ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
END;
$$;

-- ============================================================================
-- SECTION 4: FUNÇÕES RPC PARA RATE LIMITING
-- ============================================================================

CREATE OR REPLACE FUNCTION record_system_metric(
    p_service_name TEXT,
    p_metric_name TEXT,
    p_metric_value NUMERIC,
    p_metric_unit TEXT DEFAULT 'ms',
    p_status TEXT DEFAULT 'healthy',
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_metric_id UUID;
BEGIN
    INSERT INTO system_health_metrics (
        service_name,
        metric_name,
        metric_value,
        metric_unit,
        status,
        metadata
    ) VALUES (
        p_service_name,
        p_metric_name,
        p_metric_value,
        p_metric_unit,
        p_status,
        p_metadata
    ) RETURNING id INTO v_metric_id;
    
    RETURN v_metric_id;
END;
$$;

CREATE OR REPLACE FUNCTION log_security_event(
    p_event_type TEXT,
    p_event_data JSONB DEFAULT '{}'::jsonb,
    p_severity TEXT DEFAULT 'medium',
    p_user_id TEXT DEFAULT NULL,
    p_ip_address TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_event_id UUID;
BEGIN
    INSERT INTO security_audit_logs (
        event_type,
        event_data,
        severity,
        user_id,
        ip_address,
        user_agent
    ) VALUES (
        p_event_type,
        p_event_data,
        p_severity,
        COALESCE(p_user_id, auth.uid()::TEXT),
        p_ip_address,
        p_user_agent
    ) RETURNING id INTO v_event_id;
    
    -- Alertar em eventos críticos
    IF p_severity = 'critical' THEN
        RAISE WARNING 'CRITICAL SECURITY EVENT: % - %', p_event_type, p_event_data;
    END IF;
    
    RETURN v_event_id;
END;
$$;

-- ============================================================================
-- SECTION 5: PROTEÇÕES CONTRA SQL INJECTION
-- ============================================================================

-- Trigger para validar JSONB antes de inserir/atualizar
CREATE OR REPLACE FUNCTION validate_jsonb_input()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_jsonb_field JSONB;
BEGIN
    -- Validar campos JSONB comuns
    IF TG_TABLE_NAME = 'funnels' THEN
        -- Validar estrutura de pages
        IF NEW.pages IS NOT NULL THEN
            IF NOT jsonb_typeof(NEW.pages) = 'array' THEN
                RAISE EXCEPTION 'Invalid pages format: must be array';
            END IF;
        END IF;
        
        -- Validar estrutura de seo
        IF NEW.seo IS NOT NULL THEN
            IF NOT jsonb_typeof(NEW.seo) = 'object' THEN
                RAISE EXCEPTION 'Invalid seo format: must be object';
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Aplicar validação nas tabelas com JSONB
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'funnels'
    ) THEN
        DROP TRIGGER IF EXISTS validate_funnels_jsonb ON funnels;
        CREATE TRIGGER validate_funnels_jsonb
            BEFORE INSERT OR UPDATE ON funnels
            FOR EACH ROW
            EXECUTE FUNCTION validate_jsonb_input();
        RAISE NOTICE '✅ Trigger validate_funnels_jsonb criado';
    END IF;
END $$;

-- ============================================================================
-- SECTION 6: CONSTRAINTS ADICIONAIS DE SEGURANÇA
-- ============================================================================

-- Adicionar constraints de validação em funnels
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'funnels'
    ) THEN
        -- Name não pode ser vazio
        ALTER TABLE funnels 
        ADD CONSTRAINT funnels_name_not_empty 
        CHECK (length(trim(name)) > 0);
        
        -- is_published deve ser boolean válido
        ALTER TABLE funnels 
        ADD CONSTRAINT funnels_valid_published 
        CHECK (is_published IS NOT NULL);
        
        RAISE NOTICE '✅ Constraints de segurança adicionados em funnels';
    END IF;
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE '⚠️  Constraints já existem, pulando';
END $$;

-- ============================================================================
-- SECTION 7: POLÍTICAS RLS ADICIONAIS
-- ============================================================================

-- RLS para rate_limits (apenas service_role)
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rate_limits_service_role_only" ON rate_limits
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- RLS para security_audit_logs (apenas leitura para authenticated, escrita para service_role)
ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "security_logs_read_own" ON security_audit_logs
    FOR SELECT
    USING (
        auth.role() = 'service_role' OR
        (auth.role() = 'authenticated' AND user_id = auth.uid()::TEXT)
    );

CREATE POLICY "security_logs_write_service" ON security_audit_logs
    FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

-- RLS para system_health_metrics
ALTER TABLE system_health_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "health_metrics_read_authenticated" ON system_health_metrics
    FOR SELECT
    USING (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY "health_metrics_write_service" ON system_health_metrics
    FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- SECTION 8: FUNÇÃO PARA LIMPAR DADOS ANTIGOS
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_old_security_data()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_deleted_count INTEGER := 0;
BEGIN
    -- Deletar rate limits expirados (mais de 7 dias)
    DELETE FROM rate_limits
    WHERE reset_time < EXTRACT(EPOCH FROM NOW() - INTERVAL '7 days')::INTEGER;
    
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    
    -- Deletar logs de segurança antigos (mais de 90 dias, exceto críticos)
    DELETE FROM security_audit_logs
    WHERE created_at < NOW() - INTERVAL '90 days'
    AND severity != 'critical';
    
    GET DIAGNOSTICS v_deleted_count = v_deleted_count + ROW_COUNT;
    
    -- Deletar métricas antigas (mais de 30 dias)
    DELETE FROM system_health_metrics
    WHERE recorded_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS v_deleted_count = v_deleted_count + ROW_COUNT;
    
    RAISE NOTICE '🗑️  Deleted % old records', v_deleted_count;
    
    RETURN v_deleted_count;
END;
$$;

-- ============================================================================
-- SECTION 9: ÍNDICES DE PERFORMANCE PARA SEGURANÇA
-- ============================================================================

-- Índice para buscas rápidas de eventos por user_id e período
CREATE INDEX IF NOT EXISTS idx_security_logs_user_time 
ON security_audit_logs(user_id, created_at DESC);

-- Índice para análise de eventos por tipo e severidade
CREATE INDEX IF NOT EXISTS idx_security_logs_type_severity 
ON security_audit_logs(event_type, severity, created_at DESC);

-- Índice para métricas por serviço e período
CREATE INDEX IF NOT EXISTS idx_health_metrics_service_time 
ON system_health_metrics(service_name, recorded_at DESC);

-- ============================================================================
-- SECTION 10: GRANTS E PERMISSÕES
-- ============================================================================

-- Permitir que authenticated users executem funções de validação
GRANT EXECUTE ON FUNCTION sanitize_string(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION is_valid_email(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION is_valid_url(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION is_valid_uuid(TEXT) TO authenticated;

-- Apenas service_role pode gravar métricas e logs
GRANT EXECUTE ON FUNCTION record_system_metric(TEXT, TEXT, NUMERIC, TEXT, TEXT, JSONB) TO service_role;
GRANT EXECUTE ON FUNCTION log_security_event(TEXT, JSONB, TEXT, TEXT, TEXT, TEXT) TO service_role;

-- Apenas service_role pode executar cleanup
GRANT EXECUTE ON FUNCTION cleanup_old_security_data() TO service_role;

-- ============================================================================
-- SECTION 11: VIEWS DE SEGURANÇA
-- ============================================================================

-- View para monitorar tentativas de rate limit excedido
CREATE OR REPLACE VIEW v_rate_limit_violations AS
SELECT 
    identifier,
    endpoint,
    COUNT(*) as violation_count,
    MAX(last_request) as last_violation,
    user_id
FROM rate_limits
WHERE current >= "limit"
GROUP BY identifier, endpoint, user_id
ORDER BY violation_count DESC;

-- View para eventos de segurança críticos recentes
CREATE OR REPLACE VIEW v_critical_security_events AS
SELECT 
    event_type,
    severity,
    user_id,
    ip_address,
    event_data,
    created_at
FROM security_audit_logs
WHERE severity IN ('high', 'critical')
AND created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- View para métricas de saúde do sistema
CREATE OR REPLACE VIEW v_system_health_summary AS
SELECT 
    service_name,
    metric_name,
    AVG(metric_value) as avg_value,
    MIN(metric_value) as min_value,
    MAX(metric_value) as max_value,
    COUNT(*) as sample_count,
    MAX(recorded_at) as last_recorded
FROM system_health_metrics
WHERE recorded_at > NOW() - INTERVAL '24 hours'
GROUP BY service_name, metric_name
ORDER BY service_name, metric_name;

-- ============================================================================
-- SECTION 12: COMENTÁRIOS E DOCUMENTAÇÃO
-- ============================================================================

COMMENT ON TABLE rate_limits IS 
  'Rate limiting records to prevent API abuse';

COMMENT ON TABLE security_audit_logs IS 
  'Security event audit trail for compliance and monitoring';

COMMENT ON TABLE system_health_metrics IS 
  'System performance and health monitoring metrics';

COMMENT ON FUNCTION sanitize_string(TEXT) IS 
  'Sanitize user input to prevent XSS attacks';

COMMENT ON FUNCTION log_security_event IS 
  'Log security events with automatic severity handling';

COMMENT ON FUNCTION cleanup_old_security_data IS 
  'Periodic cleanup of expired security and monitoring data';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '🔒 Migration 20251128_security_enhancements completed';
    RAISE NOTICE '✅ Tables: rate_limits, security_audit_logs, system_health_metrics';
    RAISE NOTICE '✅ Functions: 8 (validation, logging, cleanup)';
    RAISE NOTICE '✅ Views: 3 (monitoring and analysis)';
    RAISE NOTICE '✅ Triggers: 1 (JSONB validation)';
    RAISE NOTICE '✅ RLS Policies: 5 (access control)';
    RAISE NOTICE '📊 Security infrastructure ready!';
END $$;
