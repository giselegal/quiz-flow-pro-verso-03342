/**
 * 🎯 ACTIVATED FEATURES HOOK - Central activation system
 */

import { useState, useEffect } from 'react';
import { activatedAnalytics } from '@/services/ActivatedAnalytics';

export const useActivatedFeatures = () => {
  const [features, setFeatures] = useState({
    // FASE 1: Quick Wins - Ativados
    aiInsights: true,
    realtimeAnalytics: true,
    premiumTemplates: true,
    abTesting: true,
    
    // FASE 2: Coming soon
    fashionAI: false,
    predictiveAnalytics: false,
    automatedOptimization: false
  });

  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (features.aiInsights) {
      loadAIInsights();
    }
  }, [features.aiInsights]);

  const loadAIInsights = async () => {
    setIsLoading(true);
    try {
      const data = await activatedAnalytics.getAIPoweredInsights();
      setInsights(data);
    } catch (error) {
      console.error('Failed to load AI insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const activateFeature = (featureName: string) => {
    setFeatures(prev => ({
      ...prev,
      [featureName]: true
    }));
    
    console.log(`🚀 Feature activated: ${featureName}`);
  };

  return {
    features,
    insights,
    isLoading,
    activateFeature,
    refreshInsights: loadAIInsights
  };
};

export default useActivatedFeatures;