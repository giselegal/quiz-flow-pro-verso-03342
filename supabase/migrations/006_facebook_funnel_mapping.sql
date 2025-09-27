-- DADOS DE EXEMPLO COM RELACIONAMENTO FUNIL-CAMPANHA
-- Populando com configurações e métricas isoladas por funil

-- ============================================================================
-- 1. CONFIGURAÇÕES DE TRACKING POR FUNIL
-- ============================================================================

-- Inserir configurações de tracking para cada funil
INSERT INTO public.funnel_tracking_config (
    funnel_id,
    facebook_pixel_id,
    facebook_enabled,
    google_analytics_id,
    google_enabled,
    utm_source,
    utm_medium,
    utm_campaign,
    track_custom_events,
    custom_events,
    is_active
) VALUES 
-- Quiz de Personalidade 21 Passos
(
    'quiz21StepsComplete',
    'FB_PIXEL_QUIZ_PERSONALITY',
    true,
    'GA_QUIZ_PERSONALITY_ID',
    true,
    'facebook',
    'cpc',
    'quiz_personalidade_2025',
    true,
    '[
        {"name": "quiz_start", "facebook_event": "InitiateCheckout"},
        {"name": "quiz_complete", "facebook_event": "CompleteRegistration"},
        {"name": "result_view", "facebook_event": "ViewContent"},
        {"name": "email_capture", "facebook_event": "Lead"}
    ]',
    true
),
-- Lead Magnet Fashion
(
    'leadMagnetFashion',
    'FB_PIXEL_FASHION_LEAD',
    true,
    'GA_FASHION_ID',
    true,
    'facebook',
    'social',
    'fashion_leadmagnet_2025',
    true,
    '[
        {"name": "download_start", "facebook_event": "InitiateCheckout"},
        {"name": "download_complete", "facebook_event": "Lead"},
        {"name": "guide_view", "facebook_event": "ViewContent"}
    ]',
    true
),
-- Webinar Signup
(
    'webinarSignup',
    'FB_PIXEL_WEBINAR',
    true,
    'GA_WEBINAR_ID',
    true,
    'facebook',
    'cpc',
    'webinar_tech_2025',
    true,
    '[
        {"name": "webinar_registration", "facebook_event": "CompleteRegistration"},
        {"name": "webinar_attended", "facebook_event": "Purchase"}
    ]',
    true
),
-- NPS Survey
(
    'npseSurvey',
    'FB_PIXEL_NPS',
    false,
    'GA_NPS_ID',
    true,
    'organic',
    'email',
    'nps_survey_internal',
    false,
    '[]',
    true
),
-- ROI Calculator
(
    'roiCalculator',
    'FB_PIXEL_ROI_CALC',
    true,
    'GA_ROI_CALC_ID',
    true,
    'facebook',
    'cpc',
    'roi_calculator_business',
    true,
    '[
        {"name": "calculation_start", "facebook_event": "AddToCart"},
        {"name": "calculation_complete", "facebook_event": "Purchase"},
        {"name": "consultation_request", "facebook_event": "Lead"}
    ]',
    true
);

-- ============================================================================
-- 2. MAPEAMENTO CAMPANHAS -> FUNIS
-- ============================================================================

-- Mapear campanhas específicas para funis
INSERT INTO public.facebook_campaign_funnel_mapping (
    campaign_id,
    campaign_name,
    funnel_id,
    utm_parameters,
    target_audience,
    budget_daily,
    is_active
) VALUES
-- Campanhas do Quiz de Personalidade
(
    'camp_quiz_personalidade_001',
    'Quiz Personalidade - Descubra Seu Estilo',
    'quiz21StepsComplete',
    '{"source": "facebook", "medium": "cpc", "campaign": "quiz_personalidade_2025", "content": "criativo_principal"}',
    'Interesse em Moda - Mulheres 25-45',
    50.00,
    true
),
(
    'camp_retargeting_abandoned_004',
    'Retargeting - Complete Seu Quiz',
    'quiz21StepsComplete',
    '{"source": "facebook", "medium": "retargeting", "campaign": "quiz_personalidade_retargeting", "content": "abandono_incentivo"}',
    'Usuários que Abandonaram Quiz',
    25.00,
    true
),
-- Campanha do Lead Magnet Fashion
(
    'camp_leadmagnet_fashion_002',
    'Lead Magnet - Guia de Estilo Grátis',
    'leadMagnetFashion',
    '{"source": "facebook", "medium": "social", "campaign": "fashion_leadmagnet_2025", "content": "download_gratuito"}',
    'Lookalike - Compradores Moda',
    35.00,
    true
),
-- Campanha do Webinar
(
    'camp_webinar_tech_003',
    'Webinar Tech Trends 2025',
    'webinarSignup',
    '{"source": "facebook", "medium": "cpc", "campaign": "webinar_tech_2025", "content": "webinar_promo"}',
    'Interesse em Tecnologia',
    40.00,
    true
),
-- Campanha A/B Test
(
    'camp_ab_test_creative_005',
    'A/B Test - Imagem vs Vídeo',
    'quiz21StepsComplete',
    '{"source": "facebook", "medium": "cpc", "campaign": "quiz_personalidade_ab_test", "content": "video_animado"}',
    'Público Amplo - Moda',
    30.00,
    true
);

-- ============================================================================
-- 3. ATUALIZAR MÉTRICAS EXISTENTES COM FUNNEL_ID
-- ============================================================================

-- Relacionar métricas existentes com funis através do mapeamento
UPDATE public.facebook_metrics fm
SET funnel_id = fcfm.funnel_id
FROM public.facebook_campaign_funnel_mapping fcfm
WHERE fm.campaign_id = fcfm.campaign_id;

-- ============================================================================
-- 4. INSERIR MÉTRICAS ADICIONAIS COM RELACIONAMENTO
-- ============================================================================

-- Métricas específicas por funil para demonstração
INSERT INTO public.facebook_metrics (
    campaign_id,
    campaign_name,
    adset_id,
    adset_name,
    ad_id,
    ad_name,
    funnel_id,
    date_start,
    date_end,
    impressions,
    reach,
    clicks,
    unique_clicks,
    spend,
    likes,
    comments,
    shares,
    post_engagements,
    cpm,
    cpc,
    ctr,
    conversions,
    conversion_value,
    quiz_starts,
    quiz_completions,
    leads_generated,
    demographics,
    device_breakdown,
    placement_breakdown,
    account_id,
    currency
) VALUES
-- Métricas específicas do ROI Calculator (antes não tinha)
(
    'camp_roi_calculator_new_006',
    'ROI Calculator - Consultorias Business',
    'adset_roi_006',
    'Empresários - ROI Focus',
    'ad_roi_006',
    'Criativo Calculator',
    'roiCalculator',
    CURRENT_DATE - interval '10 days',
    CURRENT_DATE - interval '3 days',
    15600,
    13200,
    450,
    420,
    198.75,
    67,
    18,
    12,
    89,
    12.74,
    0.442,
    2.88,
    28,
    14000.00, -- Alto valor de conversão para consultorias
    89,
    67,
    28, -- 28 leads qualificados
    '{"age_groups": {"35-44": 45, "45-54": 35, "55-64": 20}, "gender": {"female": 35, "male": 65}}',
    '{"desktop": 55, "mobile": 40, "tablet": 5}',
    '{"facebook_feeds": 65, "instagram_feed": 20, "linkedin": 10, "right_column": 5}',
    'act_123456789',
    'BRL'
),
-- Métricas do NPS Survey (campanha interna, baixo investimento)
(
    'camp_nps_internal_007',
    'NPS Survey - Satisfação Clientes',
    'adset_nps_007',
    'Clientes Ativos',
    'ad_nps_007',
    'Pesquisa Satisfação',
    'npseSurvey',
    CURRENT_DATE - interval '5 days',
    CURRENT_DATE - interval '1 day',
    5200,
    4800,
    234,
    220,
    45.80,
    23,
    12,
    8,
    38,
    8.81,
    0.196,
    4.50,
    89,
    0, -- NPS não gera receita direta
    156,
    134,
    89, -- 89 respostas completas ao NPS
    '{"age_groups": {"25-34": 30, "35-44": 40, "45-54": 30}, "gender": {"female": 55, "male": 45}}',
    '{"desktop": 40, "mobile": 55, "tablet": 5}',
    '{"facebook_feeds": 70, "instagram_feed": 25, "messenger": 5}',
    'act_123456789',
    'BRL'
);

SELECT 'Facebook campaigns are now properly mapped to specific funnels with isolated tracking!' AS status;