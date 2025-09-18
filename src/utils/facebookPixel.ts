// @ts-nocheck
// Facebook Pixel utility functions
import { getPixelId, getCurrentFunnelConfig, trackFunnelEvent } from '../services/pixelManager';

// Use the same type definition as in global.d.ts
declare global {
  interface Window {
    fbq?: (event: string, eventName: string, params?: any) => void;
    _fbq?: any;
    __ACTIVE_PIXEL_ID?: string;
    __pixelTest?: (eventName?: string, params?: any) => void;
  }
}

/**
 * Utilities to ensure the Pixel script is loaded and initialized
 */
const ensurePixelScriptLoaded = (): void => {
  if (typeof document === 'undefined') return;
  const src = 'https://connect.facebook.net/en_US/fbevents.js';
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
};

const attachDebugTools = (): void => {
  try {
    window.__pixelTest = (eventName = 'TestEvent', params: any = {}) => {
      if (!window.fbq) {
        console.warn('[Pixel] fbq not ready for test');
        return;
      }
      const payload = { ...params, test: true, ts: Date.now(), pixel_id: window.__ACTIVE_PIXEL_ID };
      window.fbq('trackCustom', eventName, payload);
      console.log(`[Pixel] Test event '${eventName}' sent`, payload);
    };
  } catch {}
};

/**
 * Initialize Facebook Pixel with the provided ID
 * @param pixelId Facebook Pixel ID to initialize
 * @returns True if initialization was successful
 */
export const initFacebookPixel = (pixelId: string): boolean => {
  try {
    if (!pixelId) {
      console.warn('Facebook Pixel ID not provided');
      return false;
    }

    ensurePixelScriptLoaded();

    // Avoid re-initializing the same Pixel ID
    if (window.__ACTIVE_PIXEL_ID === pixelId && window.fbq) {
      console.log(`[Pixel] Facebook Pixel already initialized with ID: ${pixelId}`);
      attachDebugTools();
      return true;
    }

    if (!window.fbq) {
      const w = window as any;
      w.fbq = function () {
        w.fbq.callMethod ? w.fbq.callMethod.apply(w.fbq, arguments) : w.fbq.queue.push(arguments);
      };
      if (!w._fbq) w._fbq = w.fbq;
      w.fbq.push = w.fbq;
      w.fbq.loaded = true;
      w.fbq.version = '2.0';
      w.fbq.queue = [];
    }

    (window as any).fbq('init', pixelId);
    window.__ACTIVE_PIXEL_ID = pixelId;
    attachDebugTools();

    console.log(`Facebook Pixel initialized with ID: ${pixelId}`);
    return true;
  } catch (error) {
    console.error('Error initializing Facebook Pixel:', error);
    return false;
  }
};

/**
 * Track a custom event with Facebook Pixel
 * @param eventName Name of the event to track
 * @param params Additional parameters to send
 */
export const trackPixelEvent = (eventName: string, params?: Record<string, unknown>): void => {
  try {
    if (typeof window === 'undefined' || !window.fbq) {
      console.warn('Facebook Pixel not initialized');
      return;
    }

    window.fbq('track', eventName, params);

    console.log(`Tracked Facebook Pixel event: ${eventName}`, params || '');
  } catch (error) {
    console.error(`Error tracking Facebook Pixel event ${eventName}:`, error);
  }
};

/**
 * Track PageView event on route change - OTIMIZADO
 * @param url The URL to track
 */
export const trackPageView = (url?: string): void => {
  try {
    if (typeof window === 'undefined' || !window.fbq) {
      return;
    }

    // Facebook Pixel - REMOVIDO: PageView não é evento principal
    // window.fbq('track', 'PageView');

    if (url) {
      console.log(`Facebook Pixel PageView removido para otimização: ${url}`);
    }
  } catch (error) {
    console.error('Error tracking Facebook Pixel PageView:', error);
  }
};

// Adding the loadFacebookPixel function to use dynamic pixel management
export const loadFacebookPixel = (): void => {
  try {
    // Usa o pixelManager para obter o pixel ID correto baseado na rota atual
    const pixelId = getPixelId();
    const funnelConfig = getCurrentFunnelConfig();

    if (pixelId) {
      initFacebookPixel(pixelId);
      console.log(`Loaded Facebook Pixel for funnel: ${funnelConfig.funnelName} (${pixelId})`);

      // Dispara evento de inicialização específico do funil
      trackFunnelEvent('PixelInitialized', {
        pixel_id: pixelId,
        funnel_type: funnelConfig.funnelName,
        page_url: window.location.href,
      });
    } else {
      console.warn('No Facebook Pixel ID found for current route');
    }
  } catch (error) {
    console.error('Error loading Facebook Pixel:', error);
  }
};

export default {
  initFacebookPixel,
  trackPixelEvent,
  trackPageView,
  loadFacebookPixel,
};
