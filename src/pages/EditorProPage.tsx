import React, { Suspense } from 'react';
import { LoadingFallback } from '@/components/ui/loading-fallback';
import { useLocation } from 'wouter';

// 🚀 EDITOR IA PRO - Importações dos sistemas avançados
import PureBuilderProvider from '@/components/editor/PureBuilderProvider';
import ModularEditorPro from '@/components/editor/EditorPro/components/ModularEditorPro';

// 🤖 Sistemas IA avançados
import { TemplatesIASidebar } from '@/components/editor/sidebars/TemplatesIASidebar';
import { BrandKitSidebar } from '@/components/editor/sidebars/BrandKitSidebar';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

// 🎯 Hooks para funcionalidades avançadas
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEditorPro } from '@/hooks/useEditorPro';
import { type FunnelTemplate } from '@/services/FunnelAIAgent';

/**
 * 🚀 EDITOR IA PRO - Sistema completo com todas as funcionalidades avançadas
 * 
 * Diferenças do Editor Básico (/editor):
 * - ✅ Geração IA com Gemini 2.0 
 * - ✅ Templates dinâmicos (FunnelAIAgent)
 * - ✅ Cálculos ML (UnifiedCalculationEngine)
 * - ✅ Brand Kit automático
 * - ✅ Analytics em tempo real
 * - ✅ A/B Testing integrado
 * - ✅ Drag & drop + funcionalidades básicas mantidas
 */

interface EditorProPageProps {
    params?: {
        funnelId?: string;
    };
}

const EditorProPage: React.FC<EditorProPageProps> = ({ params }) => {
    const [, navigate] = useLocation();
    const { funnelId } = params || {};

    // 🎯 Hook customizado para funcionalidades Pro
    const {
        isTemplatesIAOpen,
        isBrandKitOpen,
        isAnalyticsOpen,
        toggleTemplatesIA,
        toggleBrandKit,
        toggleAnalytics,
        isLoading,
        error
    } = useEditorPro();

    // 📊 Analytics em tempo real
    const { trackEvent } = useAnalytics();

    // Handler para seleção de template IA
    const handleSelectTemplate = (template: FunnelTemplate) => {
        console.log('✨ Template IA aplicado:', template.meta.name);

        // Aplicar configuração de design
        if (template.design) {
            document.documentElement.style.setProperty('--primary-color', template.design.primaryColor);
            document.documentElement.style.setProperty('--secondary-color', template.design.secondaryColor);
        }

        // Fechar modal
        toggleTemplatesIA();

        // Track evento
        trackEvent('template_applied', {
            templateName: template.meta.name,
            templateVersion: template.meta.version,
            timestamp: new Date().toISOString()
        });
    };

    React.useEffect(() => {
        // Track acesso ao Editor Pro
        trackEvent('editor_pro_accessed', {
            funnelId: funnelId || 'new',
            timestamp: new Date().toISOString(),
            source: 'direct_navigation'
        });
    }, [funnelId, trackEvent]);

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">
                        ⚠️ Erro no Editor IA Pro
                    </h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/editor')}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Voltar ao Editor Básico
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-slate-900 relative">
            {/* 🎯 HEADER - Badge Pro + Navigation */}
            <div className="absolute top-0 left-0 right-0 z-50 bg-slate-800 border-b border-slate-700 h-12 flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-white font-semibold flex items-center gap-2">
                        🚀 Editor IA Pro
                        <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full">
                            PREMIUM
                        </span>
                    </h1>
                </div>

                {/* 🎛️ Controles Pro */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleTemplatesIA}
                        className={`px-3 py-1 rounded text-sm transition-colors ${isTemplatesIAOpen
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            }`}
                    >
                        🤖 Templates IA
                    </button>

                    <button
                        onClick={toggleBrandKit}
                        className={`px-3 py-1 rounded text-sm transition-colors ${isBrandKitOpen
                            ? 'bg-pink-600 text-white'
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            }`}
                    >
                        🎨 Brand Kit
                    </button>

                    <button
                        onClick={toggleAnalytics}
                        className={`px-3 py-1 rounded text-sm transition-colors ${isAnalyticsOpen
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            }`}
                    >
                        📊 Analytics
                    </button>

                    <button
                        onClick={() => navigate('/editor')}
                        className="px-3 py-1 bg-slate-600 text-gray-300 rounded text-sm hover:bg-slate-500"
                    >
                        ← Editor Básico
                    </button>
                </div>
            </div>

            {/* 🎯 MAIN EDITOR - Com provider híbrido */}
            <div className="pt-12 h-full">
                <Suspense fallback={<LoadingFallback />}>
                    <PureBuilderProvider funnelId={funnelId}>
                        {/* 🎯 Editor principal com funcionalidades básicas + IA */}
                        <ModularEditorPro
                            showProFeatures={true}
                            templatesIAOpen={isTemplatesIAOpen}
                            brandKitOpen={isBrandKitOpen}
                            analyticsOpen={isAnalyticsOpen}
                        />

                        {/* 🤖 SIDEBAR: Templates IA */}
                        {isTemplatesIAOpen && (
                            <TemplatesIASidebar
                                onSelectTemplate={handleSelectTemplate}
                                onClose={() => toggleTemplatesIA()}
                            />
                        )}

                        {/* 🎨 SIDEBAR: Brand Kit */}
                        {isBrandKitOpen && (
                            <BrandKitSidebar onClose={() => toggleBrandKit()} />
                        )}

                        {/* 📊 OVERLAY: Analytics Dashboard */}
                        {isAnalyticsOpen && (
                            <AnalyticsDashboard onClose={() => toggleAnalytics()} />
                        )}
                    </PureBuilderProvider>
                </Suspense>
            </div>

            {/* 🔄 Loading overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[100]">
                    <div className="bg-white rounded-lg p-6 shadow-xl">
                        <div className="flex items-center gap-3">
                            <div className="animate-spin w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                            <span className="text-gray-700">Carregando funcionalidades IA...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditorProPage;