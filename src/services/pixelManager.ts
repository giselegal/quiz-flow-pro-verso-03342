/**
 * Serviço para gerenciar múltiplos Facebook Pixels no sistema
 */

interface FunnelConfig {
  pixelId: string;
  token: string;
  utmCampaign: string;
  funnelName: string;
  ctaUrl: string;
}

export const FUNNEL_CONFIGS: Record<string, FunnelConfig> = {
  // Funnel 1 - Quiz como isca
  default: {
    pixelId: '1311550759901086',
    token:
      'EAAEJYWeJHLABOwGC1ZC1GxRfJBAAIBHFB4kYqIFrNyoyuRpnRLyNp7L2VZBop3sGuyzchC6XkD1EfBrlxmCoMxTZCBEWrP2DwZBOPu5fZBKZCZBybZBG9xAxaSFJJzk3VZB4i08EKFImWmsKhYXWK9RdtfR0eZCQaoNHFm4rGmby9LNjvZAcuVYEAX6M2e0vSfdB96vWQZDZD',
    utmCampaign: 'Teste Lovable - Por Fora',
    funnelName: 'quiz_isca',
    ctaUrl: 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912',
  },
  // Funnel 2 - Quiz embutido na oferta
  'quiz-descubra-seu-estilo': {
    pixelId: '1038647624890676',
    token:
      'EAAEJYWeJHLABOwGC1ZC1GxRfJBAAIBHFB4kYqIFrNyoyuRpnRLyNp7L2VZBop3sGuyzchC6XkD1EfBrlxmCoMxTZCBEWrP2DwZBOPu5fZBKZCZBybZBG9xAxaSFJJzk3VZB4i08EKFImWmsKhYXWK9RdtfR0eZCQaoNHFm4rGmby9LNjvZAcuVYEAX6M2e0vSfdB96vWQZDZD',
    utmCampaign: 'Teste Lovable - Por Dentro',
    funnelName: 'quiz_embutido',
    ctaUrl: 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912',
  },
};

/**
 * Identifica o funil atual baseado na URL
 */
export const getCurrentFunnel = (): string => {
  if (typeof window === 'undefined') return 'default';

  const path = window.location.pathname;

  // Verifica caminhos específicos para identificar o funil
  if (path.includes('/quiz-descubra-seu-estilo')) {
    return 'quiz-descubra-seu-estilo';
  }

  // Funil padrão se nenhuma condição for atendida
  return 'default';
};

/**
 * Obtém a configuração do funil atual
 */
export const getCurrentFunnelConfig = (): FunnelConfig => {
  const funnelId = getCurrentFunnel();
  return FUNNEL_CONFIGS[funnelId] || FUNNEL_CONFIGS.default;
};

/**
 * Obtém o ID do Pixel do Facebook para o funil atual
 */
export const getPixelId = (): string => {
  return getCurrentFunnelConfig().pixelId;
};

/**
 * Obtém o token de acesso do Facebook para o funil atual
 */
export const getFacebookToken = (): string => {
  return getCurrentFunnelConfig().token;
};

/**
 * Obtém a campanha UTM para o funil atual
 */
export const getUtmCampaign = (): string => {
  return getCurrentFunnelConfig().utmCampaign;
};

/**
 * Obtém a URL de CTA para o funil atual
 */
export const getCtaUrl = (): string => {
  return getCurrentFunnelConfig().ctaUrl;
};

/**
 * Marca evento específico de funil para análises
 */
export const trackFunnelEvent = (eventName: string, eventData: Record<string, any> = {}): void => {
  const funnelConfig = getCurrentFunnelConfig();

  // Adiciona informações do funil aos dados do evento
  const enrichedData = {
    ...eventData,
    funnel_id: funnelConfig.funnelName,
    funnel_name: funnelConfig.funnelName === 'quiz_isca' ? 'Quiz como Isca' : 'Quiz Embutido',
    funnel_campaign: funnelConfig.utmCampaign,
  };

  // Registra no console para debugging
  console.log(`Tracking funnel event: ${eventName}`, enrichedData);

  // Se o Facebook Pixel estiver disponível, envia o evento
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, enrichedData);
  }
};
