// Facebook Pixel utility functions for A/B test
import {
  getPixelId,
  getCurrentFunnelConfig,
  trackFunnelEvent,
} from "../services/pixelManager";

/**
 * Initialize Facebook Pixel with the provided ID
 * @param pixelId Facebook Pixel ID to initialize
 * @returns True if initialization was successful
 */
export const initFacebookPixel = (pixelId: string): boolean => {
  try {
    if (!pixelId) {
      console.warn("Facebook Pixel ID not provided");
      return false;
    }

    // Initialize Facebook Pixel
    if (!window.fbq) {
      window.fbq = function (...args: unknown[]) {
        (window.fbq as any).q = (window.fbq as any).q || [];
        (window.fbq as any).q.push(args);
      };
      window._fbq = window.fbq;
      (window.fbq as any).loaded = true;
      (window.fbq as any).version = "2.0";
    }

    window.fbq("init", pixelId);
    console.log(`Facebook Pixel initialized with ID: ${pixelId}`);
    return true;
  } catch (error) {
    console.error("Error initializing Facebook Pixel:", error);
    return false;
  }
};

/**
 * Track a custom event with Facebook Pixel
 * @param eventName Name of the event to track
 * @param params Additional parameters to send
 */
export const trackPixelEvent = (
  eventName: string,
  params?: Record<string, unknown>
): void => {
  try {
    if (typeof window === "undefined" || !window.fbq) {
      console.warn("Facebook Pixel not initialized");
      return;
    }

    if (params) {
      window.fbq("track", eventName, params);
    } else {
      window.fbq("track", eventName);
    }

    console.log(`Tracked Facebook Pixel event: ${eventName}`, params || "");
  } catch (error) {
    console.error(`Error tracking Facebook Pixel event ${eventName}:`, error);
  }
};

/**
 * Load Facebook Pixel dynamically based on current route
 */
export const loadFacebookPixelDynamic = (): void => {
  try {
    // Usa o pixelManager para obter o pixel ID correto baseado na rota atual
    const pixelId = getPixelId();
    const funnelConfig = getCurrentFunnelConfig();

    if (pixelId) {
      initFacebookPixel(pixelId);
      console.log(
        `Loaded Facebook Pixel for funnel: ${funnelConfig.funnelName} (${pixelId})`
      );

      // Dispara evento de inicialização específico do funil
      trackFunnelEvent("PixelInitialized", {
        pixel_id: pixelId,
        funnel_type: funnelConfig.funnelName,
        page_url: window.location.href,
      });
    } else {
      console.warn("No Facebook Pixel ID found for current route");
    }
  } catch (error) {
    console.error("Error loading Facebook Pixel:", error);
  }
};

export default {
  initFacebookPixel,
  trackPixelEvent,
  loadFacebookPixelDynamic,
};
