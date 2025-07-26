-- Schema SQL Completo para Sistemas Melhorados
-- Execute este script no Supabase SQL Editor

-- ================================
-- 1. TABELA DE FUNIS (verificar se já existe)
-- ================================

-- Verificar e criar tabela de funis se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'funnels') THEN
        CREATE TABLE funnels (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            description TEXT,
            pages JSONB DEFAULT '[]'::jsonb,
            seo JSONB DEFAULT '{}'::jsonb,
            status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'paused', 'archived')),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            published_at TIMESTAMPTZ,
            is_published BOOLEAN DEFAULT FALSE
        );
        
        -- Índices para performance
        CREATE INDEX idx_funnels_user_id ON funnels(user_id);
        CREATE INDEX idx_funnels_status ON funnels(status);
        CREATE INDEX idx_funnels_published ON funnels(is_published);
        CREATE INDEX idx_funnels_created_at ON funnels(created_at);
    END IF;
END $$;

-- ================================
-- 2. URLS CUSTOMIZADAS
-- ================================

CREATE TABLE IF NOT EXISTS custom_urls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funnel_id UUID REFERENCES funnels(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_custom_urls_funnel_id ON custom_urls(funnel_id);
CREATE INDEX IF NOT EXISTS idx_custom_urls_slug ON custom_urls(slug);
CREATE INDEX IF NOT EXISTS idx_custom_urls_primary ON custom_urls(is_primary) WHERE is_primary = TRUE;

-- Constraint: apenas uma URL primária por funil
CREATE UNIQUE INDEX IF NOT EXISTS idx_custom_urls_primary_funnel 
ON custom_urls(funnel_id) WHERE is_primary = TRUE;

-- ================================
-- 3. ANALYTICS DE FUNIS
-- ================================

CREATE TABLE IF NOT EXISTS funnel_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funnel_id UUID REFERENCES funnels(id) ON DELETE CASCADE,
    views INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    last_viewed TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE UNIQUE INDEX IF NOT EXISTS idx_funnel_analytics_funnel_id ON funnel_analytics(funnel_id);

-- ================================
-- 4. EVENTOS DE ANALYTICS DETALHADOS
-- ================================

CREATE TABLE IF NOT EXISTS funnel_analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funnel_id UUID REFERENCES funnels(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('view', 'conversion', 'click', 'exit', 'scroll')),
    session_data JSONB DEFAULT '{}'::jsonb,
    user_agent TEXT,
    ip_address INET,
    referrer TEXT,
    page_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para analytics
CREATE INDEX IF NOT EXISTS idx_analytics_events_funnel_id ON funnel_analytics_events(funnel_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON funnel_analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON funnel_analytics_events(created_at);

-- ================================
-- 5. WORKFLOW DE PUBLICAÇÃO
-- ================================

CREATE TABLE IF NOT EXISTS workflow_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funnel_id UUID REFERENCES funnels(id) ON DELETE CASCADE,
    status_from TEXT,
    status_to TEXT NOT NULL,
    comment TEXT,
    scheduled_for TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_workflow_history_funnel_id ON workflow_history(funnel_id);
CREATE INDEX IF NOT EXISTS idx_workflow_history_created_by ON workflow_history(created_by);
CREATE INDEX IF NOT EXISTS idx_workflow_history_scheduled ON workflow_history(scheduled_for);

-- ================================
-- 6. LOGS DE AUDITORIA
-- ================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    old_data JSONB,
    new_data JSONB,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para auditoria
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- ================================
-- 7. PERMISSÕES DE USUÁRIO
-- ================================

CREATE TABLE IF NOT EXISTS user_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    permission TEXT NOT NULL CHECK (permission IN ('read', 'write', 'delete', 'admin')),
    granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_resource ON user_permissions(resource_type, resource_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_permissions_unique 
ON user_permissions(user_id, resource_type, resource_id, permission) WHERE is_active = TRUE;

-- ================================
-- 8. ROLES/FUNÇÕES DE USUÁRIO
-- ================================

CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('viewer', 'editor', 'admin', 'owner')),
    assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- ================================
-- 9. FUNÇÕES RPC PARA ANALYTICS
-- ================================

-- Função para incrementar views
CREATE OR REPLACE FUNCTION increment_funnel_views(funnel_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO funnel_analytics (funnel_id, views, last_viewed)
    VALUES (funnel_id, 1, NOW())
    ON CONFLICT (funnel_id)
    DO UPDATE SET 
        views = funnel_analytics.views + 1,
        last_viewed = NOW(),
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Função para incrementar conversões
CREATE OR REPLACE FUNCTION increment_funnel_conversions(funnel_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO funnel_analytics (funnel_id, conversions)
    VALUES (funnel_id, 1)
    ON CONFLICT (funnel_id)
    DO UPDATE SET 
        conversions = funnel_analytics.conversions + 1,
        updated_at = NOW();
    
    -- Atualizar taxa de conversão
    UPDATE funnel_analytics 
    SET conversion_rate = CASE 
        WHEN views > 0 THEN (conversions::DECIMAL / views::DECIMAL) * 100
        ELSE 0
    END
    WHERE funnel_analytics.funnel_id = increment_funnel_conversions.funnel_id;
END;
$$ LANGUAGE plpgsql;

-- ================================
-- 10. TRIGGERS PARA AUDITORIA
-- ================================

-- Função trigger para auditoria automática
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        action,
        resource_type,
        resource_id,
        old_data,
        new_data,
        created_at
    ) VALUES (
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id::TEXT, OLD.id::TEXT),
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
        NOW()
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger nas tabelas principais
DROP TRIGGER IF EXISTS audit_funnels ON funnels;
CREATE TRIGGER audit_funnels
    AFTER INSERT OR UPDATE OR DELETE ON funnels
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ================================
-- 11. RLS (ROW LEVEL SECURITY)
-- ================================

-- Ativar RLS nas tabelas
ALTER TABLE funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Políticas básicas para funis
CREATE POLICY "Users can view their own funnels" ON funnels
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own funnels" ON funnels
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own funnels" ON funnels
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own funnels" ON funnels
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para URLs customizadas
CREATE POLICY "Users can manage URLs for their funnels" ON custom_urls
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM funnels 
            WHERE funnels.id = custom_urls.funnel_id 
            AND funnels.user_id = auth.uid()
        )
    );

-- Políticas para analytics (apenas leitura para donos)
CREATE POLICY "Users can view analytics for their funnels" ON funnel_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM funnels 
            WHERE funnels.id = funnel_analytics.funnel_id 
            AND funnels.user_id = auth.uid()
        )
    );

-- ================================
-- 12. DADOS INICIAIS
-- ================================

-- Inserir permissões padrão para novos usuários
INSERT INTO user_roles (user_id, role, assigned_at)
SELECT auth.uid(), 'editor', NOW()
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

-- ================================
-- 13. VIEWS ÚTEIS
-- ================================

-- View para estatísticas resumidas de funis
CREATE OR REPLACE VIEW funnel_stats AS
SELECT 
    f.id,
    f.name,
    f.status,
    f.user_id,
    f.created_at,
    f.updated_at,
    COALESCE(fa.views, 0) as views,
    COALESCE(fa.conversions, 0) as conversions,
    COALESCE(fa.conversion_rate, 0) as conversion_rate,
    cu.slug as custom_url
FROM funnels f
LEFT JOIN funnel_analytics fa ON f.id = fa.funnel_id
LEFT JOIN custom_urls cu ON f.id = cu.funnel_id AND cu.is_primary = TRUE;

-- View para histórico de workflow resumido
CREATE OR REPLACE VIEW workflow_summary AS
SELECT 
    funnel_id,
    status_to as current_status,
    MAX(created_at) as last_status_change,
    COUNT(*) as status_changes
FROM workflow_history
GROUP BY funnel_id, status_to;

-- ================================
-- MENSAGEM DE SUCESSO
-- ================================

DO $$ 
BEGIN
    RAISE NOTICE 'Schema completo criado com sucesso!';
    RAISE NOTICE 'Tabelas criadas: funnels, custom_urls, funnel_analytics, funnel_analytics_events, workflow_history, audit_logs, user_permissions, user_roles';
    RAISE NOTICE 'Funções RPC: increment_funnel_views, increment_funnel_conversions';
    RAISE NOTICE 'Views: funnel_stats, workflow_summary';
    RAISE NOTICE 'RLS ativado em todas as tabelas com políticas básicas';
END $$;
