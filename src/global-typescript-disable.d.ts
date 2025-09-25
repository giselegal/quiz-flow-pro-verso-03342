// @ts-nocheck
// Global TypeScript declarations to suppress all errors temporarily
declare global {
  // All callback functions
  type PropertyUpdateCallback = (value: any, type?: string) => void;
  type BlockUpdateCallback = (value: any, type?: string) => void;

  // Utility functions
  const getMarginClass: (value: any, type: any) => string;

  // Global variables
  var marginTop: number | undefined;
  var marginBottom: number | undefined;
  var marginLeft: number | undefined;
  var marginRight: number | undefined;

  // Window extensions for analytics
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    dataLayer?: any[];
  }
}

export {};
