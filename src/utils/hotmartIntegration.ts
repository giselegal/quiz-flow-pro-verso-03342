import { trackSaleConversion } from '@/utils/analytics';

// Declare window interface extensions
declare global {
  interface Window {
    hmtc?: (transaction: any) => void;
  }
}

// Function to initialize Hotmart tracking
export const initHotmartTracking = (hmtc: any, transaction: any) => {
  if (typeof window === 'undefined') return;

  try {
    if (hmtc && typeof hmtc === 'function') {
      hmtc(transaction);
      console.log('[Hotmart Integration] Tracking initialized', transaction);
    } else {
      console.warn('[Hotmart Integration] hmtc function not available.');
    }
  } catch (error) {
    console.error('[Hotmart Integration] Error initializing tracking:', error);
  }
};

// Function to track product purchase
export const trackHotmartPurchase = (transaction: any) => {
  if (typeof window === 'undefined') return;

  try {
    if (window.onload) {
      window.onload = () => {
        if (window.hmtc && typeof window.hmtc === 'function') {
          window.hmtc(transaction);
          console.log('[Hotmart Integration] Purchase tracked', transaction);
        } else {
          console.warn('[Hotmart Integration] hmtc function not available.');
        }
      };
    } else {
      if (window.hmtc && typeof window.hmtc === 'function') {
        window.hmtc(transaction);
        console.log('[Hotmart Integration] Purchase tracked', transaction);
      } else {
        console.warn('[Hotmart Integration] hmtc function not available.');
      }
    }
  } catch (error) {
    console.error('[Hotmart Integration] Error tracking purchase:', error);
  }
};

// Function to handle affiliate tracking
export const handleAffiliateTracking = (source: string) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('affiliate_source', source);
    console.log(`[Hotmart Integration] Affiliate source stored: ${source}`);
  } catch (error) {
    console.error('[Hotmart Integration] Error storing affiliate source:', error);
  }
};

// Function to get affiliate source
export const getAffiliateSource = () => {
  if (typeof window === 'undefined') return null;

  try {
    return localStorage.getItem('affiliate_source');
  } catch (error) {
    console.error('[Hotmart Integration] Error retrieving affiliate source:', error);
    return null;
  }
};

// Function to generate a unique transaction ID
export const generateTransactionId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Function to handle purchase completion and track sale conversion
export const handlePurchaseComplete = (transactionData: any) => {
  try {
    if (transactionData && transactionData.value) {
      // Use the imported function instead of window property
      trackSaleConversion(
        transactionData.value,
        transactionData.currency || 'BRL',
        transactionData.productName
      );
    }
  } catch (error) {
    console.error('Error handling purchase complete:', error);
  }
};
