// Global type declarations

interface Window {
  // Analytics tracking functions
  fbq?: (event: string, eventName: string, params?: any) => void;
  _fbq?: any;
  gtag?: (event: string, eventName: string, params?: any) => void;

  // Custom utility functions exposed to the global scope
  checkMainRoutes?: () => any;
  fixMainRoutes?: () => any;
  monitorFunnelRoutes?: () => any;
  checkSiteHealth?: () => any;
  fixBlurryIntroQuizImages?: () => number;

  // Other global variables
  isDev?: boolean;
  isPreview?: boolean;
  isProduction?: boolean;
}

// Extend EventTarget to include DOM-specific properties
interface EventTarget {
  tagName?: string;
  closest?: (selector: string) => Element | null;
  href?: string;
  getAttribute?: (name: string) => string | null;
  textContent?: string | null;
}
