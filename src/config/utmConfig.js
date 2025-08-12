// Configuração UTM otimizada para 6 criativos numerados
// Teste A/B: Página Quiz vs Página Oferta Direta

export const UTM_CONFIG = {
  // Configuração base da campanha
  campaign: {
    source: 'facebook',
    medium: 'cpc',
    campaign: 'quiz_style_abtest_2025',
    trackingVersion: 'v2.0',
  },

  // 6 Criativos numerados com características específicas
  creatives: {
    'criativo-1': {
      id: 'criativo-1',
      name: 'Elegante Mulher Vestido',
      utm_content: 'criativo-1',
      utm_term: 'estilo_elegante',
      description: 'Mulher elegante com vestido sofisticado',
      target_audience: 'mulheres_25_45_classe_ab',
      expected_ctr: 2.1,
      expected_conversion: 1.8,
    },
    'criativo-2': {
      id: 'criativo-2',
      name: 'Casual Jovem Jeans',
      utm_content: 'criativo-2',
      utm_term: 'estilo_casual',
      description: 'Jovem com look casual e jeans',
      target_audience: 'mulheres_18_35_casual',
      expected_ctr: 1.9,
      expected_conversion: 1.5,
    },
    'criativo-3': {
      id: 'criativo-3',
      name: 'Profissional Executiva',
      utm_content: 'criativo-3',
      utm_term: 'estilo_profissional',
      description: 'Executiva com roupa de trabalho',
      target_audience: 'mulheres_28_50_profissionais',
      expected_ctr: 1.7,
      expected_conversion: 2.2,
    },
    'criativo-4': {
      id: 'criativo-4',
      name: 'Romântico Floral',
      utm_content: 'criativo-4',
      utm_term: 'estilo_romantico',
      description: 'Look romântico com estampa floral',
      target_audience: 'mulheres_20_40_romanticas',
      expected_ctr: 2.3,
      expected_conversion: 1.6,
    },
    'criativo-5': {
      id: 'criativo-5',
      name: 'Moderno Minimalista',
      utm_content: 'criativo-5',
      utm_term: 'estilo_moderno',
      description: 'Estilo moderno e minimalista',
      target_audience: 'mulheres_22_38_urbanas',
      expected_ctr: 1.8,
      expected_conversion: 1.9,
    },
    'criativo-6': {
      id: 'criativo-6',
      name: 'Clássico Atemporal',
      utm_content: 'criativo-6',
      utm_term: 'estilo_classico',
      description: 'Look clássico e atemporal',
      target_audience: 'mulheres_30_55_conservadoras',
      expected_ctr: 1.6,
      expected_conversion: 2.0,
    },
  },

  // Páginas do teste A/B
  pages: {
    pageA: {
      path: '/',
      name: 'Quiz como Isca',
      description: 'Página com quiz interativo + resultado + oferta',
      funnel_type: 'quiz_isca',
      expected_conversion_boost: 1.2, // 20% maior conversão esperada
    },
    pageB: {
      path: '/quiz-descubra-seu-estilo',
      name: 'Oferta Direta',
      description: 'Landing page de oferta direta',
      funnel_type: 'oferta_direta',
      expected_conversion_boost: 0.8, // 20% menor conversão esperada
    },
  },
};

// Função para gerar URLs completas dos criativos
export const generateCreativeUrls = () => {
  const baseUrls = {
    pageA: 'https://quiz-sell-genius.com',
    pageB: 'https://quiz-sell-genius.com/quiz-descubra-seu-estilo',
  };

  const urls = {
    pageA: [],
    pageB: [],
  };

  Object.values(UTM_CONFIG.creatives).forEach(creative => {
    const utmParams = new URLSearchParams({
      utm_source: UTM_CONFIG.campaign.source,
      utm_medium: UTM_CONFIG.campaign.medium,
      utm_campaign: UTM_CONFIG.campaign.campaign,
      utm_content: creative.utm_content,
      utm_term: creative.utm_term,
    }).toString();

    urls.pageA.push({
      creative_id: creative.id,
      creative_name: creative.name,
      url: `${baseUrls.pageA}?${utmParams}`,
      expected_performance: {
        ctr: creative.expected_ctr * UTM_CONFIG.pages.pageA.expected_conversion_boost,
        conversion: creative.expected_conversion * UTM_CONFIG.pages.pageA.expected_conversion_boost,
      },
    });

    urls.pageB.push({
      creative_id: creative.id,
      creative_name: creative.name,
      url: `${baseUrls.pageB}?${utmParams}`,
      expected_performance: {
        ctr: creative.expected_ctr * UTM_CONFIG.pages.pageB.expected_conversion_boost,
        conversion: creative.expected_conversion * UTM_CONFIG.pages.pageB.expected_conversion_boost,
      },
    });
  });

  return urls;
};

// Simulação de dados para dashboard (desenvolvimento)
export const generateMockCreativeData = (days = 7) => {
  const mockData = {};

  Object.values(UTM_CONFIG.creatives).forEach(creative => {
    const baseViews = Math.floor(Math.random() * 500) + 200; // 200-700 views
    const conversionRate = (creative.expected_conversion + (Math.random() * 0.5 - 0.25)).toFixed(1);
    const leads = Math.floor(baseViews * (parseFloat(conversionRate) / 100));
    const purchases = Math.floor(leads * 0.15); // 15% dos leads compram

    mockData[creative.utm_content] = {
      creative_name: creative.name,
      page_views: baseViews,
      quiz_starts: Math.floor(baseViews * 0.8),
      quiz_completions: Math.floor(baseViews * 0.6),
      leads: leads,
      purchases: purchases,
      revenue: purchases * 39.9, // Preço do produto
      conversion_rate: `${conversionRate}%`,
      cost_per_lead: ((baseViews * 1.2) / leads).toFixed(2), // CPC simulado de R$1,20
    };
  });

  return mockData;
};

// Configuração de alertas para o gestor de tráfego
export const PERFORMANCE_ALERTS = {
  critical: {
    conversion_rate_min: 0.5, // Abaixo de 0.5% = crítico
    cpa_max: 50.0, // Acima de R$50 = crítico
    no_leads_hours: 48, // Sem leads por 48h = crítico
  },
  warning: {
    conversion_rate_min: 1.0, // Abaixo de 1.0% = atenção
    cpa_max: 35.0, // Acima de R$35 = atenção
    declining_days: 3, // Performance caindo por 3 dias = atenção
  },
  excellent: {
    conversion_rate_min: 2.0, // Acima de 2.0% = excelente
    roas_min: 5.0, // ROAS acima de 5:1 = excelente
    consistency_days: 7, // 7 dias consistente = excelente
  },
};

// Função para análise automática de performance
export const analyzeCreativePerformance = creativeData => {
  const analysis = {};

  Object.entries(creativeData).forEach(([creativeId, data]) => {
    const conversionRate = parseFloat(data.conversion_rate);
    const cpa = parseFloat(data.cost_per_lead);

    let status = 'regular';
    let recommendation = 'Continuar monitorando';
    let action = 'monitor';

    if (conversionRate >= PERFORMANCE_ALERTS.excellent.conversion_rate_min) {
      status = 'excellent';
      recommendation = 'ESCALAR: Aumentar budget e criar variações';
      action = 'scale';
    } else if (conversionRate <= PERFORMANCE_ALERTS.critical.conversion_rate_min) {
      status = 'critical';
      recommendation = 'PAUSAR: Performance muito baixa';
      action = 'pause';
    } else if (conversionRate <= PERFORMANCE_ALERTS.warning.conversion_rate_min) {
      status = 'warning';
      recommendation = 'OTIMIZAR: Testar variações ou ajustar público';
      action = 'optimize';
    } else {
      status = 'good';
      recommendation = 'BOM: Manter e acompanhar de perto';
      action = 'maintain';
    }

    analysis[creativeId] = {
      ...data,
      status,
      recommendation,
      action,
      performance_score: calculatePerformanceScore(conversionRate, cpa),
    };
  });

  return analysis;
};

// Calcular score de performance (0-100)
const calculatePerformanceScore = (conversionRate, cpa) => {
  let score = 0;

  // Score baseado na taxa de conversão (0-60 pontos)
  if (conversionRate >= 2.0) score += 60;
  else if (conversionRate >= 1.5) score += 50;
  else if (conversionRate >= 1.0) score += 40;
  else if (conversionRate >= 0.5) score += 20;
  else score += 0;

  // Score baseado no CPA (0-40 pontos)
  if (cpa <= 25) score += 40;
  else if (cpa <= 35) score += 30;
  else if (cpa <= 45) score += 20;
  else if (cpa <= 55) score += 10;
  else score += 0;

  return Math.min(score, 100);
};

// Exportar configuração para uso no dashboard
export default UTM_CONFIG;
