/**
 * 🎯 ACTIVATED FEATURES HOOK - Central activation system
 */

import { useState, useEffect } from 'react';
import { unifiedEventTracker } from '@/analytics/UnifiedEventTracker';
import { unifiedAnalyticsEngine } from '@/analytics/UnifiedAnalyticsEngine';

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
      // Placeholder: gerar insights simulados via unifiedAnalyticsEngine (funnel default)
      const summary = await unifiedAnalyticsEngine.getFunnelSummary('default');
      const data = {
        topFunnel: (summary as any).funnelId || 'default',
        completionRate: (summary as any).completionRate || 0,
        totalParticipants: (summary as any).totalParticipants || 0,
        generatedAt: new Date().toISOString()
      };
      setInsights(data);
      unifiedEventTracker.track({
        type: 'editor_action',
        funnelId: 'feature-center',
        sessionId: 'feature-session',
        userId: 'system',
        payload: { feature: 'aiInsights', action: 'load_insights' }
      });
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

    unifiedEventTracker.track({
      type: 'editor_action',
      funnelId: 'feature-center',
      sessionId: 'feature-session',
      userId: 'system',
      payload: { feature: featureName }
    });
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