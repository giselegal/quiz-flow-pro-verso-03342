-- MELHORIA DA ESTRUTURA FACEBOOK METRICS
-- Corrigindo problemas de isolamento e integração

-- ============================================================================
-- 1. ADICIONAR RELACIONAMENTO COM FUNNELS
-- ============================================================================

-- Adicionar coluna funnel_id na tabela facebook_metrics
ALTER TABLE public.facebook_metrics 
ADD COLUMN funnel_id text REFERENCES public.funnels(id) ON DELETE CASCADE;

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_facebook_metrics_funnel_id 
ON public.facebook_metrics(funnel_id);

-- ============================================================================
-- 2. TABELA DE CONFIGURAÇÕES CONSOLIDADA POR FUNIL
-- ============================================================================

-- Tabela unificada de configurações de tracking por funil
CREATE TABLE IF NOT EXISTS public.funnel_tracking_config (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    funnel_id text NOT NULL REFERENCES public.funnels(id) ON DELETE CASCADE,
    
    -- Facebook Pixel
    facebook_pixel_id text,
    facebook_access_token text, -- Criptografado
    facebook_enabled boolean DEFAULT false,
    
    -- Google Analytics
    google_analytics_id text,
    google_measurement_id text,
    google_enabled boolean DEFAULT false,
    
    -- UTM Configuration
    utm_source text DEFAULT 'quiz',
    utm_medium text DEFAULT 'organic',
    utm_campaign text,
    utm_term text,
    utm_content text,
    
    -- Configurações Avançadas
    track_custom_events boolean DEFAULT true,
    server_side_tracking boolean DEFAULT false,
    
    -- Eventos personalizados para este funil
    custom_events jsonb DEFAULT '[]',
    
    -- Status e metadados
    is_active boolean DEFAULT true,
    last_sync timestamp with time zone,
    
    -- Timestamps
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    
    -- Constraint para garantir uma configuração por funil
    UNIQUE(funnel_id)
);

-- ============================================================================
-- 3. TABELA DE MAPEAMENTO CAMPANHA -> FUNIL
-- ============================================================================

-- Relaciona campanhas do Facebook com funis específicos
CREATE TABLE IF NOT EXISTS public.facebook_campaign_funnel_mapping (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    campaign_id text NOT NULL,
    campaign_name text,
    funnel_id text NOT NULL REFERENCES public.funnels(id) ON DELETE CASCADE,
    
    -- Configurações específicas da campanha
    utm_parameters jsonb DEFAULT '{}',
    target_audience text,
    budget_daily numeric(10,2),
    
    -- Status
    is_active boolean DEFAULT true,
    
    -- Timestamps
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    
    -- Índices
    UNIQUE(campaign_id, funnel_id)
);

-- ============================================================================
-- 4. VIEW CONSOLIDADA PARA MÉTRICAS POR FUNIL
-- ============================================================================

-- View que combina métricas do Facebook com dados do funil
CREATE OR REPLACE VIEW public.funnel_facebook_metrics AS
SELECT 
    f.id as funnel_id,
    f.name as funnel_name,
    fm.campaign_id,
    fm.campaign_name,
    fm.date_start,
    fm.date_end,
    
    -- Métricas agregadas
    SUM(fm.impressions) as total_impressions,
    SUM(fm.clicks) as total_clicks,
    SUM(fm.spend) as total_spend,
    SUM(fm.conversions) as total_conversions,
    SUM(fm.quiz_starts) as total_quiz_starts,
    SUM(fm.quiz_completions) as total_quiz_completions,
    SUM(fm.leads_generated) as total_leads,
    
    -- Métricas calculadas
    CASE 
        WHEN SUM(fm.impressions) > 0 
        THEN (SUM(fm.clicks)::numeric / SUM(fm.impressions) * 100)::numeric(8,4)
        ELSE 0 
    END as avg_ctr,
    
    CASE 
        WHEN SUM(fm.clicks) > 0 
        THEN (SUM(fm.spend) / SUM(fm.clicks))::numeric(10,4)
        ELSE 0 
    END as avg_cpc,
    
    CASE 
        WHEN SUM(fm.spend) > 0 AND SUM(fm.conversions) > 0
        THEN (SUM(fm.conversions) * 100 / SUM(fm.spend))::numeric(10,4)
        ELSE 0 
    END as roas,
    
    -- Configurações do funil
    ftc.facebook_pixel_id,
    ftc.utm_campaign as funnel_utm_campaign
    
FROM public.funnels f
LEFT JOIN public.facebook_metrics fm ON fm.funnel_id = f.id
LEFT JOIN public.funnel_tracking_config ftc ON ftc.funnel_id = f.id
WHERE fm.date_start IS NOT NULL
GROUP BY 
    f.id, f.name, fm.campaign_id, fm.campaign_name, 
    fm.date_start, fm.date_end,
    ftc.facebook_pixel_id, ftc.utm_campaign;

-- ============================================================================
-- 5. FUNÇÃO PARA OBTER MÉTRICAS ESPECÍFICAS DO FUNIL
-- ============================================================================

CREATE OR REPLACE FUNCTION get_funnel_facebook_summary(
    funnel_id_param text,
    date_start_param date DEFAULT CURRENT_DATE - interval '30 days',
    date_end_param date DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    funnel_id text,
    funnel_name text,
    total_campaigns bigint,
    total_impressions bigint,
    total_clicks bigint,
    total_spend numeric,
    total_conversions bigint,
    total_quiz_starts bigint,
    total_quiz_completions bigint,
    total_leads bigint,
    avg_ctr numeric,
    avg_cpc numeric,
    roas numeric,
    facebook_pixel_id text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ffm.funnel_id,
        ffm.funnel_name,
        COUNT(DISTINCT ffm.campaign_id)::bigint as total_campaigns,
        COALESCE(SUM(ffm.total_impressions), 0)::bigint as total_impressions,
        COALESCE(SUM(ffm.total_clicks), 0)::bigint as total_clicks,
        COALESCE(SUM(ffm.total_spend), 0) as total_spend,
        COALESCE(SUM(ffm.total_conversions), 0)::bigint as total_conversions,
        COALESCE(SUM(ffm.total_quiz_starts), 0)::bigint as total_quiz_starts,
        COALESCE(SUM(ffm.total_quiz_completions), 0)::bigint as total_quiz_completions,
        COALESCE(SUM(ffm.total_leads), 0)::bigint as total_leads,
        
        -- Métricas médias
        CASE 
            WHEN SUM(ffm.total_impressions) > 0 
            THEN (SUM(ffm.total_clicks)::numeric / SUM(ffm.total_impressions) * 100)::numeric(8,4)
            ELSE 0::numeric(8,4)
        END as avg_ctr,
        
        CASE 
            WHEN SUM(ffm.total_clicks) > 0 
            THEN (SUM(ffm.total_spend) / SUM(ffm.total_clicks))::numeric(10,4)
            ELSE 0::numeric(10,4)
        END as avg_cpc,
        
        CASE 
            WHEN SUM(ffm.total_spend) > 0 AND SUM(ffm.total_conversions) > 0
            THEN (SUM(ffm.total_conversions) * 100 / SUM(ffm.total_spend))::numeric(10,4)
            ELSE 0::numeric(10,4)
        END as roas,
        
        MAX(ffm.facebook_pixel_id) as facebook_pixel_id
        
    FROM public.funnel_facebook_metrics ffm
    WHERE ffm.funnel_id = funnel_id_param
    AND ffm.date_start >= date_start_param
    AND ffm.date_end <= date_end_param
    GROUP BY ffm.funnel_id, ffm.funnel_name;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. RLS E POLÍTICAS
-- ============================================================================

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.funnel_tracking_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facebook_campaign_funnel_mapping ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar para produção)
CREATE POLICY "Enable read access for all users" ON public.funnel_tracking_config FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.funnel_tracking_config FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.funnel_tracking_config FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.facebook_campaign_funnel_mapping FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.facebook_campaign_funnel_mapping FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.facebook_campaign_funnel_mapping FOR UPDATE USING (true);

-- ============================================================================
-- 7. TRIGGERS PARA UPDATED_AT
-- ============================================================================

CREATE TRIGGER update_funnel_tracking_config_updated_at 
    BEFORE UPDATE ON public.funnel_tracking_config 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_facebook_campaign_funnel_mapping_updated_at 
    BEFORE UPDATE ON public.facebook_campaign_funnel_mapping 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

SELECT 'Facebook metrics structure improved! Now funnels have isolated tracking configurations.' AS status;