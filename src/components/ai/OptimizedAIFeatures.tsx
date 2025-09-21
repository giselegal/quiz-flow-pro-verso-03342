/**
 * 🚀 OPTIMIZED AI FEATURES - LAZY LOADING + PERFORMANCE
 * 
 * Componente otimizado que carrega features IA sob demanda
 * para reduzir bundle inicial e melhorar performance
 */

import React, { lazy, Suspense, useState, useCallback } from 'react';
import { Bot, Sparkles, Palette, BarChart3, TestTube2, Calculator, Download, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { aiCache } from '@/services/AICache';

// 🚀 LAZY LOADING de componentes IA para otimizar bundle
const TemplatesIASidebar = lazy(() => import('../editor/sidebars/TemplatesIASidebar').then(m => ({ default: m.TemplatesIASidebar })));
const BrandKitAdvancedSidebar = lazy(() => import('../editor/sidebars/BrandKitAdvancedSidebar').then(m => ({ default: m.BrandKitAdvancedSidebar })));
const AnalyticsDashboardOverlay = lazy(() => import('../analytics/AnalyticsDashboardOverlay').then(m => ({ default: m.AnalyticsDashboardOverlay })));
const ABTestingIntegration = lazy(() => import('../testing/ABTestingIntegration').then(m => ({ default: m.ABTestingIntegration })));
const MLPredictionsOverlay = lazy(() => import('../ml/MLPredictionsOverlay').then(m => ({ default: m.MLPredictionsOverlay })));
const AdvancedExportSystem = lazy(() => import('../export/AdvancedExportSystem').then(m => ({ default: m.AdvancedExportSystem })));
const PerformanceMonitoring = lazy(() => import('../monitoring/PerformanceMonitoring').then(m => ({ default: m.PerformanceMonitoring })));
const AIStepGenerator = lazy(() => import('../editor/AIStepGenerator').then(m => ({ default: m.AIStepGenerator })));

interface OptimizedAIFeaturesProps {
  onSelectTemplate?: (template: any) => void;
  onStepsGenerated?: (steps: any[]) => void;
  className?: string;
}

/**
 * Loading fallback otimizado
 */
const AIFeatureLoader: React.FC<{ feature: string }> = ({ feature }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div className="bg-background rounded-lg p-6 shadow-2xl border max-w-sm">
      <div className="flex items-center gap-3 mb-4">
        <Bot className="w-6 h-6 text-primary animate-pulse" />
        <h3 className="font-medium">Carregando {feature}</h3>
      </div>
      <div className="space-y-2">
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>
        <p className="text-xs text-muted-foreground">Iniciando sistema de IA...</p>
      </div>
    </div>
  </div>
);

export const OptimizedAIFeatures: React.FC<OptimizedAIFeaturesProps> = ({
  onSelectTemplate,
  onStepsGenerated,
  className = ""
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [loadingFeature, setLoadingFeature] = useState<string | null>(null);

  const openFeature = useCallback(async (featureName: string) => {
    setLoadingFeature(featureName);
    // Simular pequeno delay para UX mais suave
    await new Promise(resolve => setTimeout(resolve, 300));
    setActiveModal(featureName);
    setLoadingFeature(null);
  }, []);

  const closeFeature = useCallback(() => {
    setActiveModal(null);
    setLoadingFeature(null);
  }, []);

  // Cache de estatísticas IA
  const cacheStats = aiCache.getStats();

  return (
    <>
      <div className={`bg-background border-b ${className}`}>
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              {/* AI Generator */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => openFeature('ai-generator')}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
              >
                <Bot className="w-4 h-4 text-blue-600" />
                Gerar Steps IA
                <Badge className="bg-blue-600 text-white text-xs ml-1">Smart</Badge>
              </Button>

              {/* Templates IA */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => openFeature('templates')}
              >
                <Sparkles className="w-4 h-4" />
                Templates IA
                {cacheStats.totalRequests > 0 && (
                  <Badge variant="secondary" className="text-xs ml-1">
                    {Math.round(cacheStats.hitRate)}% cache
                  </Badge>
                )}
              </Button>

              {/* Brand Kit Pro */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => openFeature('brandkit-advanced')}
                className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200"
              >
                <Palette className="w-4 h-4 text-pink-600" />
                Brand Kit Pro
                <Badge className="bg-pink-600 text-white text-xs ml-1">Pro</Badge>
              </Button>

              {/* Analytics Live */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => openFeature('analytics')}
                className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200"
              >
                <BarChart3 className="w-4 h-4 text-purple-600" />
                Analytics Live
                <Badge className="bg-purple-600 text-white text-xs ml-1">Real-time</Badge>
              </Button>

              {/* A/B Testing */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => openFeature('ab-testing')}
                className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200"
              >
                <TestTube2 className="w-4 h-4 text-indigo-600" />
                A/B Testing
                <Badge className="bg-indigo-600 text-white text-xs ml-1">Neural</Badge>
              </Button>

              {/* ML Predictions */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => openFeature('ml-predictions')}
                className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200"
              >
                <Calculator className="w-4 h-4 text-blue-600" />
                Cálculos ML
                <Badge className="bg-blue-600 text-white text-xs ml-1">AI</Badge>
              </Button>

              {/* Performance Monitor */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => openFeature('performance')}
                className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200"
              >
                <Activity className="w-4 h-4 text-orange-600" />
                Performance
                <Badge className="bg-orange-600 text-white text-xs ml-1">Live</Badge>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {/* Cache Status */}
              {cacheStats.totalRequests > 0 && (
                <div className="text-xs text-muted-foreground">
                  Cache: {cacheStats.hits}/{cacheStats.totalRequests} hits
                </div>
              )}

              {/* Export Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => openFeature('export')}
                className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
              >
                <Download className="w-4 h-4 text-green-600" />
                Exportar
                <Badge className="bg-green-600 text-white text-xs ml-1">Multi</Badge>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loadingFeature && (
        <AIFeatureLoader feature={loadingFeature} />
      )}

      {/* Lazy Loaded Modals */}
      {activeModal && (
        <Suspense fallback={<AIFeatureLoader feature="Componente IA" />}>
          {activeModal === 'ai-generator' && (
            <AIStepGenerator
              onStepsGenerated={onStepsGenerated || (() => {})}
              onClose={closeFeature}
            />
          )}

          {activeModal === 'templates' && (
            <TemplatesIASidebar
              onSelectTemplate={onSelectTemplate || (() => {})}
              onClose={closeFeature}
            />
          )}

          {activeModal === 'export' && (
            <AdvancedExportSystem onClose={closeFeature} />
          )}

          {activeModal === 'ml-predictions' && (
            <MLPredictionsOverlay onClose={closeFeature} />
          )}

          {activeModal === 'ab-testing' && (
            <ABTestingIntegration onClose={closeFeature} />
          )}

          {activeModal === 'performance' && (
            <PerformanceMonitoring onClose={closeFeature} />
          )}

          {activeModal === 'analytics' && (
            <AnalyticsDashboardOverlay onClose={closeFeature} />
          )}

          {activeModal === 'brandkit-advanced' && (
            <div className="fixed inset-0 z-[100] flex items-start justify-center">
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={closeFeature}
              />
              <div className="relative w-full max-w-6xl mx-4 mt-4 bg-background rounded-xl shadow-2xl border-2 border-pink-200/50">
                <BrandKitAdvancedSidebar onClose={closeFeature} />
              </div>
            </div>
          )}
        </Suspense>
      )}
    </>
  );
};

export default OptimizedAIFeatures;