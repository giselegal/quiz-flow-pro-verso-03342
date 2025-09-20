import React from 'react';
import { useLocation } from 'wouter';
import ModularEditorPro from '@/components/editor/EditorPro/components/ModularEditorPro';
import { SimpleBuilderProvider } from '@/components/editor/SimpleBuilderProviderFixed';

/**
 * 🚀 EDITOR IA PRO - Versão inicial simplificada
 * 
 * Esta é a versão 1.0 que estabelece a base para as funcionalidades avançadas.
 * Próximas versões incluirão: IA, Analytics, Brand Kit, A/B Testing
 */

interface EditorProPageProps {
    params?: {
        funnelId?: string;
    };
}

const EditorProPageSimple: React.FC<EditorProPageProps> = ({ params }) => {
    const [, navigate] = useLocation();
    const { funnelId } = params || {};

    return (
        <div className="h-screen w-screen bg-slate-900 relative">
            {/* 🎯 HEADER - Badge Pro + Navigation */}
            <div className="absolute top-0 left-0 right-0 z-50 bg-slate-800 border-b border-slate-700 h-12 flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-white font-semibold flex items-center gap-2">
                        🚀 Editor IA Pro
                        <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full">
                            BETA v1.0
                        </span>
                    </h1>
                </div>

                {/* 🎛️ Controles Pro (placeholder) */}
                <div className="flex items-center gap-2">
                    <button
                        className="px-3 py-1 bg-slate-700 text-gray-300 rounded text-sm hover:bg-slate-600"
                        onClick={() => alert('🤖 Templates IA - Em desenvolvimento!')}
                    >
                        🤖 Templates IA
                    </button>

                    <button
                        className="px-3 py-1 bg-slate-700 text-gray-300 rounded text-sm hover:bg-slate-600"
                        onClick={() => alert('🎨 Brand Kit - Em desenvolvimento!')}
                    >
                        🎨 Brand Kit
                    </button>

                    <button
                        className="px-3 py-1 bg-slate-700 text-gray-300 rounded text-sm hover:bg-slate-600"
                        onClick={() => alert('📊 Analytics - Em desenvolvimento!')}
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

            {/* 🎯 MAIN EDITOR - Com SimpleBuilderProvider */}
            <div className="pt-12 h-full">
                <SimpleBuilderProvider funnelId={funnelId}>
                    <ModularEditorPro
                        showProFeatures={true}
                    />
                </SimpleBuilderProvider>
            </div>

            {/* 🎯 OVERLAY: Info sobre funcionalidades */}
            <div className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg shadow-xl max-w-sm">
                <div className="text-sm">
                    <div className="font-semibold mb-1">🚀 Editor IA Pro v1.0</div>
                    <div className="text-xs opacity-90">
                        Base estabelecida com sucesso! Próximas funcionalidades:
                        <br />• 🤖 Geração IA com Gemini
                        <br />• 📊 Analytics em tempo real
                        <br />• 🎨 Brand Kit automático
                        <br />• 🧪 A/B Testing integrado
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorProPageSimple;