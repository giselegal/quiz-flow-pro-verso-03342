-- FACEBOOK METRICS TABLE
-- Tabela para armazenar métricas detalhadas do Facebook Ads

CREATE TABLE IF NOT EXISTS public.facebook_metrics (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    
    -- Identificadores da campanha/anúncio
    campaign_id text NOT NULL,
    campaign_name text,
    adset_id text,
    adset_name text,
    ad_id text,
    ad_name text,
    
    -- Período dos dados
    date_start date NOT NULL,
    date_end date NOT NULL,
    
    -- Métricas de performance
    impressions bigint DEFAULT 0,
    reach bigint DEFAULT 0,
    clicks bigint DEFAULT 0,
    unique_clicks bigint DEFAULT 0,
    spend numeric(10,2) DEFAULT 0,
    
    -- Métricas de engagement
    likes bigint DEFAULT 0,
    comments bigint DEFAULT 0,
    shares bigint DEFAULT 0,
    post_engagements bigint DEFAULT 0,
    
    -- Métricas calculadas
    cpm numeric(10,4) DEFAULT 0, -- Cost per mille
    cpc numeric(10,4) DEFAULT 0, -- Cost per click
    ctr numeric(8,4) DEFAULT 0,  -- Click-through rate
    cpp numeric(10,4) DEFAULT 0, -- Cost per purchase
    
    -- Conversões (baseado nos eventos do Facebook Pixel)
    conversions bigint DEFAULT 0,
    conversion_value numeric(10,2) DEFAULT 0,
    
    -- Dados específicos do quiz
    quiz_starts bigint DEFAULT 0,
    quiz_completions bigint DEFAULT 0,
    leads_generated bigint DEFAULT 0,
    
    -- Dados demográficos agregados
    demographics jsonb DEFAULT '{}',
    
    -- Dados do device
    device_breakdown jsonb DEFAULT '{}',
    
    -- Placement breakdown
    placement_breakdown jsonb DEFAULT '{}',
    
    -- Metadados
    account_id text,
    currency text DEFAULT 'BRL',
    timezone text DEFAULT 'America/Sao_Paulo',
    last_sync timestamp with time zone DEFAULT timezone('utc'::text, now()),
    
    -- Timestamps
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_facebook_metrics_campaign_id ON public.facebook_metrics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_facebook_metrics_date_start ON public.facebook_metrics(date_start);
CREATE INDEX IF NOT EXISTS idx_facebook_metrics_ad_id ON public.facebook_metrics(ad_id);
CREATE INDEX IF NOT EXISTS idx_facebook_metrics_last_sync ON public.facebook_metrics(last_sync);

-- Tabela para configurações da API do Facebook
CREATE TABLE IF NOT EXISTS public.facebook_api_config (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id text,
    
    -- Credenciais da API
    app_id text NOT NULL,
    app_secret text NOT NULL, -- Deve ser criptografado
    access_token text NOT NULL, -- Deve ser criptografado
    
    -- Configurações
    account_id text NOT NULL,
    page_id text,
    pixel_id text,
    
    -- Status da integração
    is_active boolean DEFAULT false,
    last_sync timestamp with time zone,
    sync_frequency interval DEFAULT '1 hour',
    
    -- Configurações de métricas
    metrics_to_sync text[] DEFAULT ARRAY[
        'impressions',
        'reach', 
        'clicks',
        'spend',
        'conversions',
        'conversion_values'
    ],
    
    -- Configurações de campos
    breakdowns text[] DEFAULT ARRAY[
        'device_platform',
        'placement',
        'gender',
        'age'
    ],
    
    -- Timestamps
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Tabela para logs de sincronização
CREATE TABLE IF NOT EXISTS public.facebook_sync_logs (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    config_id text REFERENCES public.facebook_api_config(id) ON DELETE CASCADE,
    
    -- Dados da sincronização
    sync_type text NOT NULL, -- 'manual', 'automatic', 'retry'
    status text NOT NULL, -- 'success', 'error', 'partial'
    
    -- Resultados
    records_synced integer DEFAULT 0,
    records_updated integer DEFAULT 0,
    records_failed integer DEFAULT 0,
    
    -- Período sincronizado
    date_range_start date,
    date_range_end date,
    
    -- Logs de erro
    error_message text,
    error_details jsonb,
    
    -- Duração
    started_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    completed_at timestamp with time zone,
    duration_seconds integer,
    
    -- Metadados
    triggered_by text, -- user_id ou 'system'
    
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- RLS (Row Level Security)
ALTER TABLE public.facebook_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facebook_api_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facebook_sync_logs ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (para desenvolvimento - ajustar para produção)
CREATE POLICY "Enable read access for all users" ON public.facebook_metrics FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.facebook_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.facebook_metrics FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.facebook_api_config FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.facebook_api_config FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.facebook_api_config FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.facebook_sync_logs FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.facebook_sync_logs FOR INSERT WITH CHECK (true);

-- Trigger para updated_at
CREATE TRIGGER update_facebook_metrics_updated_at 
    BEFORE UPDATE ON public.facebook_metrics 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_facebook_api_config_updated_at 
    BEFORE UPDATE ON public.facebook_api_config 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Função para calcular métricas agregadas
CREATE OR REPLACE FUNCTION calculate_facebook_campaign_summary(campaign_id_param text, date_start_param date, date_end_param date)
RETURNS TABLE (
    total_impressions bigint,
    total_clicks bigint,
    total_spend numeric,
    avg_ctr numeric,
    avg_cpc numeric,
    total_conversions bigint,
    total_conversion_value numeric
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        SUM(impressions)::bigint as total_impressions,
        SUM(clicks)::bigint as total_clicks,
        SUM(spend) as total_spend,
        CASE 
            WHEN SUM(impressions) > 0 THEN (SUM(clicks)::numeric / SUM(impressions)::numeric * 100)::numeric(8,4)
            ELSE 0::numeric(8,4)
        END as avg_ctr,
        CASE 
            WHEN SUM(clicks) > 0 THEN (SUM(spend) / SUM(clicks))::numeric(10,4)
            ELSE 0::numeric(10,4)
        END as avg_cpc,
        SUM(conversions)::bigint as total_conversions,
        SUM(conversion_value) as total_conversion_value
    FROM public.facebook_metrics
    WHERE campaign_id = campaign_id_param
    AND date_start >= date_start_param
    AND date_end <= date_end_param;
END;
$$ LANGUAGE plpgsql;

SELECT 'Facebook metrics tables created successfully!' AS status;