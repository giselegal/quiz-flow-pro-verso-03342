import React from 'react';
import { ErrorBoundary } from '@/components/editor/ErrorBoundary';
import { OptimizedEditorProvider } from '@/components/editor/OptimizedEditorProvider';
import { OptimizedModularEditorPro } from '@/components/editor/OptimizedModularEditorPro';
import { useParams } from 'wouter';

/**
 * 🎯 MAIN EDITOR SIMPLIFICADO - PERFORMANCE OPTIMIZADA
 * 
 * Editor principal consolidado focado em performance:
 * ✅ Apenas 1 Provider (OptimizedEditorProvider)
 * ✅ Apenas 1 Editor (ModularEditorPro - já funcional)
 * ✅ Lazy loading inteligente por step
 * ✅ Cache com TTL para evitar recarregamentos
 * ✅ Memory management (máximo 3 steps carregados)
 * ✅ Debounced operations para performance
 * 
 * Funcionalidades garantidas:
 * - 4 colunas responsivas
 * - 21 etapas dinâmicas com lazy loading
 * - Drag & Drop robusto
 * - Performance otimizada
 * - UltraUnifiedPropertiesPanel
 */
const MainEditorOptimized: React.FC = () => {
    const params = useParams<{ funnelId?: string }>();
    const funnelId = params.funnelId || 'quiz-style-21-steps';

    // Debug info para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
        console.log('🚀 MainEditorOptimized iniciado:', {
            funnelId,
            timestamp: new Date().toISOString(),
            provider: 'OptimizedEditorProvider único',
            editor: 'ModularEditorPro',
            features: ['LazyLoading', 'MemoryManagement', 'DebouncedOperations']
        });
    }

    return (
        <div className="h-screen w-full bg-background">
            <ErrorBoundary>
                <OptimizedEditorProvider
                    funnelId={funnelId}
                    enableSupabase={true}
                    initial={{
                        currentStep: 1,
                        selectedBlockId: null,
                        isSupabaseEnabled: true,
                        databaseMode: 'supabase',
                        isLoading: false
                    }}
                >
                    <OptimizedModularEditorPro className="h-full w-full" />
                </OptimizedEditorProvider>
            </ErrorBoundary>
        </div>
    );
};

export default MainEditorOptimized;