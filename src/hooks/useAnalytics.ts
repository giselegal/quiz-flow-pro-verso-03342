/**
 * 🎯 ANALYTICS HOOK - PLACEHOLDER
 * 
 * Hook temporário para resolver dependências de imports
 */

import { useCallback } from 'react';

export const useAnalytics = () => {
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    console.log('📊 Analytics event:', eventName, properties);
  }, []);

  return {
    trackEvent
  };
};

export default useAnalytics;