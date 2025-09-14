/**
 * TODO: TypeScript Migration - Deadline: Janeiro 2025
 * - [ ] Criar interfaces para eventos GA4 (EventParams, CustomEventData)
 * - [ ] Tipar adequadamente window.gtag com declaração global
 * - [ ] Implementar factory pattern para diferentes providers (GA4, FB, LinkedIn)
 * - [ ] Adicionar validação de parâmetros obrigatórios
 * - [ ] Separar responsabilidades (tracking vs logging vs validation)
 */

import { appLogger } from './logger';

// Tipos mínimos para migração
interface EventParams {
  [key: string]: any; // TODO: especificar parâmetros GA4 válidos
}

interface CustomEventData {
  category: string;
  action: string;
  label: string;
  value?: number;
}

interface TimingData {
  category: string;
  variable: string;
  value: number;
  label?: string;
}

// Function to track a generic event
export const trackEvent = (event_name: string, params?: EventParams): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event_name, params);
  }
  appLogger.info('Analytics Event', { event_name, params });
};

// Function to track a custom event
export const trackCustomEvent = (
  category: string,
  action: string,
  label: string,
  value?: number
): void => {
  const eventData: CustomEventData = { category, action, label, value };

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
  appLogger.info('Analytics Custom Event', eventData);
};

// Function to track timing
export const trackTiming = (category: string, variable: string, value: number, label?: string): void => {
  const timingData: TimingData = { category, variable, value, label };

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'timing_complete', {
      event_category: category,
      name: variable,
      value: value,
      event_label: label,
    });
  }
  appLogger.info('Analytics Timing', timingData);
};

// Function to track an exception
export const trackException = (description: string, fatal: boolean = false) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: description,
      fatal: fatal,
    });
  }
  console.log(`[Analytics] Exception: ${description} - Fatal: ${fatal}`);
};

// Function to set user properties
export const setUserProperties = (properties: object) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', properties);
  }
  console.log(`[Analytics] User Properties:`, properties);
};

// Function to track a page view
export const trackPageView = (pagePath: string, additionalData?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: document.title,
      page_location: window.location.href,
      ...additionalData,
    });
  }
  console.log(`[Analytics] Page view: ${pagePath}`, additionalData);
};

// Quiz specific tracking functions
export const trackQuizStart = (userName?: string, userEmail?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'quiz_start', {
      event_category: 'engagement',
      user_name: userName,
      user_email: userEmail,
    });
  }
  console.log('[Analytics] Quiz Start:', { userName, userEmail });
};

export const trackQuizAnswer = (questionId: string, answer: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'quiz_answer', {
      event_category: 'engagement',
      question_id: questionId,
      answer: answer,
    });
  }
  console.log('[Analytics] Quiz Answer:', { questionId, answer });
};

export const trackQuizComplete = (result?: any) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'quiz_complete', {
      event_category: 'conversion',
      result_type: result?.primaryStyle?.category,
    });
  }
  console.log('[Analytics] Quiz Complete:', { result });
};

export const trackResultView = (resultType: string, data?: any) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'result_view', {
      event_category: 'engagement',
      result_type: resultType,
      ...data,
    });
  }
  console.log('[Analytics] Result View:', { resultType, data });
};

// Fix getCreativePerformance to accept no arguments and return proper format
export const getCreativePerformance = async (): Promise<Record<string, any>> => {
  // Mock implementation for now
  return {
    'creative-1': {
      creative_name: 'Elegante Mulher Vestido',
      page_views: 1250,
      quiz_starts: 890,
      quiz_completions: 678,
      leads: 234,
      purchases: 45,
      revenue: 4500,
      conversion_rate: '2.3',
      cost_per_lead: 15.5,
    },
    'creative-2': {
      creative_name: 'Casual Moderna',
      page_views: 980,
      quiz_starts: 720,
      quiz_completions: 540,
      leads: 180,
      purchases: 32,
      revenue: 3200,
      conversion_rate: '1.8',
      cost_per_lead: 18.2,
    },
  };
};

// Export getAnalyticsEvents properly - single declaration
export const getAnalyticsEvents = (): any[] => {
  return [];
};

// Function to track a social interaction
export const trackSocialInteraction = (network: string, action: string, target: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'social', {
      event_category: 'social',
      social_network: network,
      social_action: action,
      social_target: target,
    });
  }
  console.log(`[Analytics] Social Interaction: ${network} - ${action} - ${target}`);
};

// Function to track a refund
export const trackRefund = (transaction_id: string, value?: number, currency?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'refund', {
      transaction_id: transaction_id,
      value: value,
      currency: currency,
    });
  }
  console.log(`[Analytics] Refund: ${transaction_id} - ${value} - ${currency}`);
};

// Function to track a checkout progress
export const trackCheckoutProgress = (step: number, option?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'checkout_progress', {
      checkout_step: step,
      checkout_option: option,
    });
  }
  console.log(`[Analytics] Checkout Progress: ${step} - ${option}`);
};

// Function to track a product impression
export const trackProductImpression = (products: object[], list_name: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item_list', {
      items: products,
      item_list_name: list_name,
    });
  }
  console.log(`[Analytics] Product Impression: ${list_name}`, products);
};

// Function to track a product click
export const trackProductClick = (product: object, list_name: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'select_content', {
      content_type: 'product',
      items: [product],
      item_list_name: list_name,
    });
  }
  console.log(`[Analytics] Product Click: ${list_name}`, product);
};

// Function to track a product detail view
export const trackProductDetailView = (product: object) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      items: [product],
    });
  }
  console.log(`[Analytics] Product Detail View`, product);
};

// Function to track adding a product to the cart
export const trackAddToCart = (product: object) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      items: [product],
    });
  }
  console.log(`[Analytics] Add to Cart`, product);
};

// Function to track removing a product from the cart
export const trackRemoveFromCart = (product: object) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'remove_from_cart', {
      items: [product],
    });
  }
  console.log(`[Analytics] Remove from Cart`, product);
};

// Function to track starting a checkout process
export const trackBeginCheckout = (products: object[], coupon?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      items: products,
      coupon: coupon,
    });
  }
  console.log(`[Analytics] Begin Checkout`, products, coupon);
};

// Function to track adding payment information
export const trackAddPaymentInfo = (payment_type: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_payment_info', {
      payment_type: payment_type,
    });
  }
  console.log(`[Analytics] Add Payment Info`, payment_type);
};

// Function to track a purchase
export const trackPurchase = (
  transaction_id: string,
  value: number,
  currency: string,
  products: object[],
  coupon?: string,
  shipping?: number,
  tax?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transaction_id,
      value: value,
      currency: currency,
      items: products,
      coupon: coupon,
      shipping: shipping,
      tax: tax,
    });
  }
  console.log(
    `[Analytics] Purchase`,
    transaction_id,
    value,
    currency,
    products,
    coupon,
    shipping,
    tax
  );
};

export const captureUTMParameters = () => {
  if (typeof window === 'undefined') return {};

  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};

  const utmKeys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'fbclid',
    'gclid',
  ];

  utmKeys.forEach(key => {
    const value = urlParams.get(key);
    if (value) {
      utmParams[key] = value;
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn(`[Analytics] Failed to store ${key} in localStorage`, e);
      }
    }
  });

  if (Object.keys(utmParams).length > 0 && window.gtag) {
    window.gtag('set', 'user_properties', utmParams);
  }

  console.log('[Analytics] UTM parameters captured:', utmParams);
  return utmParams;
};

export const initFacebookPixel = (): void => {
  if (typeof window !== 'undefined') {
    appLogger.info('Facebook Pixel initialization requested');
    appLogger.warn('Facebook Pixel implementation moved to HTML for typing safety');
    // TODO: Implement Facebook Pixel via HTML script tags in index.html
    // This avoids complex typing issues with the auto-generated FB code
  }
};

export const trackButtonClick = (buttonId: string, buttonText?: string, location?: string) => {
  if (typeof window === 'undefined') return;

  const data = {
    button_id: buttonId,
    button_text: buttonText || 'unknown',
    button_location: location || 'unknown',
  };

  if (window.gtag) {
    window.gtag('event', 'button_click', data);
  }

  if (window.fbq) {
    window.fbq('trackCustom', 'ButtonClick', data);
  }

  console.log(`[Analytics] Button click: ${buttonText} (${buttonId})`, data);
};

export const trackSaleConversion = (
  value: number,
  currency: string = 'BRL',
  productName?: string
) => {
  if (typeof window === 'undefined') return;

  const data = {
    value,
    currency,
    content_name: productName || 'Product',
    content_type: 'product',
  };

  if (window.gtag) {
    window.gtag('event', 'purchase', data);
  }

  if (window.fbq) {
    window.fbq('track', 'Purchase', data);
  }

  console.log(`[Analytics] Sale conversion: ${value} ${currency}`, data);
};

// ✨ EVENTOS ESPECÍFICOS PARA FUNIL DE ESTILO
export const trackStyleQuizStart = (templateType: string = 'style_quiz') => {
  if (typeof window === 'undefined') return;

  const data = {
    content_category: 'quiz',
    content_name: templateType,
    event_category: 'engagement',
  };

  if (window.gtag) {
    window.gtag('event', 'begin_checkout', data);
  }

  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', data);
    window.fbq('trackCustom', 'StyleQuizStart', data);
  }

  console.log(`[Analytics] Style Quiz Started: ${templateType}`, data);
};

export const trackStyleConsultationStart = (formData?: any) => {
  if (typeof window === 'undefined') return;

  const data = {
    content_category: 'consultation',
    content_name: 'style_consultation',
    event_category: 'engagement',
    ...formData,
  };

  if (window.gtag) {
    window.gtag('event', 'generate_lead', data);
  }

  if (window.fbq) {
    window.fbq('track', 'Lead', data);
    window.fbq('trackCustom', 'StyleConsultationStart', data);
  }

  console.log('[Analytics] Style Consultation Started', data);
};

export const trackResultGenerated = (resultType: string, templateType: string) => {
  if (typeof window === 'undefined') return;

  const data = {
    content_category: 'result',
    content_name: resultType,
    template_type: templateType,
    event_category: 'conversion',
  };

  if (window.gtag) {
    window.gtag('event', 'conversion', data);
  }

  if (window.fbq) {
    window.fbq('track', 'CompleteRegistration', data);
    window.fbq('trackCustom', 'StyleResultGenerated', data);
  }

  console.log(`[Analytics] Result Generated: ${resultType}`, data);
};

export const trackOfferView = (offerType: string = 'style_guide') => {
  if (typeof window === 'undefined') return;

  const data = {
    content_category: 'offer',
    content_name: offerType,
    event_category: 'engagement',
  };

  if (window.gtag) {
    window.gtag('event', 'view_promotion', data);
  }

  if (window.fbq) {
    window.fbq('track', 'ViewContent', data);
    window.fbq('trackCustom', 'OfferView', data);
  }

  console.log(`[Analytics] Offer Viewed: ${offerType}`, data);
};

export const trackEmailCapture = (email: string, source: string = 'style_offer') => {
  if (typeof window === 'undefined') return;

  const data = {
    content_category: 'lead',
    content_name: source,
    event_category: 'conversion',
    email_domain: email.split('@')[1] || 'unknown',
  };

  if (window.gtag) {
    window.gtag('event', 'sign_up', data);
  }

  if (window.fbq) {
    window.fbq('track', 'CompleteRegistration', data);
    window.fbq('trackCustom', 'EmailCapture', data);
  }

  console.log(`[Analytics] Email Captured: ${email}`, data);
};

// 🚀 CONVERSÃO HOTMART - Link específico fornecido
export const trackHotmartClick = (source: string = 'style_result') => {
  if (typeof window === 'undefined') return;

  const hotmartUrl = 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912';
  const data = {
    content_category: 'hotmart',
    content_name: 'style_guide_premium',
    content_url: hotmartUrl,
    event_category: 'conversion',
    source_page: source,
    value: 97, // Valor estimado do produto
    currency: 'BRL',
  };

  if (window.gtag) {
    window.gtag('event', 'add_to_cart', data);
    window.gtag('event', 'begin_checkout', data);
  }

  if (window.fbq) {
    window.fbq('track', 'AddToCart', data);
    window.fbq('track', 'InitiateCheckout', data);
    window.fbq('trackCustom', 'HotmartClick', data);
  }

  console.log('[Analytics] Hotmart Click Tracked', data);
};

export const trackHotmartConversion = (transactionId?: string, value: number = 97) => {
  if (typeof window === 'undefined') return;

  const data = {
    content_category: 'hotmart',
    content_name: 'style_guide_premium',
    event_category: 'purchase',
    transaction_id: transactionId || `hotmart_${Date.now()}`,
    value,
    currency: 'BRL',
  };

  if (window.gtag) {
    window.gtag('event', 'purchase', data);
  }

  if (window.fbq) {
    window.fbq('track', 'Purchase', data);
    window.fbq('trackCustom', 'HotmartConversion', data);
  }

  console.log('[Analytics] Hotmart Conversion Tracked', data);
};

// 📊 EVENTOS DE TEMPLATES IA
export const trackAIAgentStart = (templateType: string) => {
  if (typeof window === 'undefined') return;

  const data = {
    content_category: 'ai_agent',
    content_name: templateType,
    event_category: 'engagement',
  };

  if (window.gtag) {
    window.gtag('event', 'begin_checkout', data);
  }

  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', data);
    window.fbq('trackCustom', 'AIAgentStart', data);
  }

  console.log(`[Analytics] AI Agent Started: ${templateType}`, data);
};

export const trackTemplateGenerated = (templateType: string, funnelId: string) => {
  if (typeof window === 'undefined') return;

  const data = {
    content_category: 'ai_generated',
    content_name: templateType,
    funnel_id: funnelId,
    event_category: 'conversion',
  };

  if (window.gtag) {
    window.gtag('event', 'conversion', data);
  }

  if (window.fbq) {
    window.fbq('track', 'CompleteRegistration', data);
    window.fbq('trackCustom', 'TemplateGenerated', data);
  }

  console.log(`[Analytics] Template Generated: ${templateType} - ${funnelId}`, data);
};
