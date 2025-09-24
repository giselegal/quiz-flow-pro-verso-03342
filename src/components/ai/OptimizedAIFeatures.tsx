/**
 * 🚀 OPTIMIZED AI FEATURES - LAZY LOADING + PERFORMANCE
 * 
 * Componente otimizado que carrega features IA sob demanda
 * para reduzir bundle inicial e melhorar performance
 */

import React, { lazy, Suspense, useState, useCallback } from 'react';
import { Bot, Download, Activity } from 'lucide-react';
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
              {/* Recursos não funcionais removidos: Gerar Steps IA, Smart Templates IA, Brand Kit Pro, Analytics Live Real-time, A/B Testing Neural, Cálculos ML AI */}

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
              onStepsGenerated={onStepsGenerated || (() => { })}
              onClose={closeFeature}
            />
          )}

          {activeModal === 'templates' && (
            <TemplatesIASidebar
              onSelectTemplate={onSelectTemplate || (() => { })}
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