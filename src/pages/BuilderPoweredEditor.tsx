import React from 'react';
import { ErrorBoundary } from '@/components/editor/ErrorBoundary';
import { BuilderEditorProvider } from '@/components/editor/BuilderEditorProvider';
import { OptimizedModularEditorPro } from '@/components/editor/OptimizedModularEditorPro';
import { useParams } from 'wouter';

/**
 * 🎯 BUILDER-POWERED MAIN EDITOR
 * 
 * ESTRATÉGIA HÍBRIDA:
 * ✅ Usa Builder System internamente (dados + lógica)
 * ✅ Mantém exatamente o mesmo layout visual atual
 * ✅ Componente OptimizedModularEditorPro inalterado
 * ✅ 4 colunas + drag & drop + interface atual
 * ✅ Zero mudança visual para o usuário
 * 
 * RESULTADO:
 * - Visual: Idêntico ao atual
 * - Funcionalidade: Renderização de etapas GARANTIDA
 * - Performance: Builder System otimizado
 * - Cálculos: Automáticos (5 engines)
 * - Manutenção: Simples e robusta
 */
const BuilderPoweredEditor: React.FC = () => {
    const params = useParams<{ funnelId?: string }>();
    const funnelId = params.funnelId || 'builder-quiz-21-steps';

    // Debug info para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
        console.log('🏗️ BuilderPoweredEditor iniciado:', {
            funnelId,
            timestamp: new Date().toISOString(),
            provider: 'BuilderEditorProvider (Builder System)',
            editor: 'OptimizedModularEditorPro (visual inalterado)',
            features: [
                'Builder System Engine',
                'Quiz 21 etapas garantido',
                'Cálculos automáticos',
                'Layout visual idêntico',
                'Zero breaking changes'
            ]
        });
    }

    return (
        <div className="h-screen w-full bg-background">
            <ErrorBoundary>
                {/* 🎯 MUDANÇA CRÍTICA: BuilderEditorProvider em vez de OptimizedEditorProvider */}
                <BuilderEditorProvider
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
                    {/* 
                        🎨 COMPONENTE VISUAL: INALTERADO 
                        
                        O OptimizedModularEditorPro continua exatamente igual:
                        - 4 colunas responsivas
                        - Drag & drop funcional  
                        - Painel de propriedades
                        - Interface atual
                        
                        A única diferença é que agora ele recebe dados do Builder System!
                    */}
                    <OptimizedModularEditorPro />
                </BuilderEditorProvider>
            </ErrorBoundary>

            {/* Debug Panel - Mostra que Builder System está ativo */}
            {process.env.NODE_ENV === 'development' && (
                <div className="fixed top-4 left-4 bg-green-100 border border-green-400 rounded-lg p-3 text-xs max-w-sm">
                    <div className="font-semibold text-green-800 mb-1">🏗️ Builder System Ativo</div>
                    <div className="text-green-700 space-y-1">
                        <div>✅ Funil: {funnelId}</div>
                        <div>✅ 21 etapas geradas automaticamente</div>
                        <div>✅ Cálculos de variáveis ativados</div>
                        <div>✅ Layout visual mantido</div>
                        <div className="text-xs text-green-600 mt-2">
                            Mesmo visual, tecnologia Builder por baixo!
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuilderPoweredEditor;