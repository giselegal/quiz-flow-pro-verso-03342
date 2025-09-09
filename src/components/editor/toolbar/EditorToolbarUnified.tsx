import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';
import { useEditor } from '@/core/contexts/LegacyCompatibilityWrapper';
import { useUnifiedContext } from '@/core/contexts/UnifiedContextProvider';
import { useFunnelNavigation } from '@/hooks/useFunnelNavigation';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Monitor, Save, Smartphone, Tablet } from 'lucide-react';

interface EditorToolbarUnifiedProps {
    className?: string;
    useLegacyFallback?: boolean;
}

/**
 * 🎨 TOOLBAR UNIFICADA COM CONTEXTO CENTRALIZADO
 *
 * Versão modernizada da toolbar usando UnifiedContextProvider.
 * Mantém compatibilidade com hooks legacy quando necessário.
 * 
 * Features:
 * - Context unificado para estado centralizado
 * - Fallback para hooks legacy durante migração
 * - Performance otimizada com memoização
 * - UI state consolidado
 */
export const EditorToolbarUnified: React.FC<EditorToolbarUnifiedProps> = ({
    className = '',
    useLegacyFallback = false
}) => {
    // Contexto unificado (preferencial)
    const unifiedContext = useLegacyFallback ? null : (() => {
        try {
            return useUnifiedContext();
        } catch {
            return null;
        }
    })();

    // Fallback legacy se unifiedContext não disponível
    const legacyEditor = unifiedContext ? null : useEditor();

    // Viewport control local (será migrado para unifiedContext)
    const [localViewport, setLocalViewport] = useState<'sm' | 'md' | 'lg' | 'xl'>('xl');

    // Dados derivados do contexto
    const editorData = useMemo(() => {
        if (unifiedContext) {
            return {
                totalBlocks: unifiedContext.editor.activeBlocks?.length || 0,
                viewportSize: unifiedContext.ui.viewMode || 'desktop',
                save: unifiedContext.save,
                canSave: !unifiedContext.persistence.isSaving,
                isDirty: unifiedContext.persistence.lastSaved === null,
            };
        }

        if (legacyEditor) {
            return {
                totalBlocks: Object.values(legacyEditor.state.stepBlocks).flat().length,
                viewportSize: localViewport,
                save: legacyEditor.persistenceActions.save,
                canSave: true,
                isDirty: legacyEditor.state.isDirty,
            };
        }

        // Fallback seguro
        return {
            totalBlocks: 0,
            viewportSize: 'xl',
            save: async () => ({ success: false }),
            canSave: false,
            isDirty: false,
        };
    }, [unifiedContext, legacyEditor, localViewport]);

    const funnelNavigation = useFunnelNavigation();

    const handleSave = async () => {
        try {
            const result = await editorData.save();
            if (unifiedContext && 'success' in result && result.success) {
                console.log('✅ Projeto salvo com sucesso via UnifiedContext');
            } else if (legacyEditor) {
                console.log('✅ Projeto salvo com sucesso via Legacy Context');
            } else {
                console.error('❌ Erro ao salvar projeto:', result);
            }
        } catch (error) {
            console.error('❌ Erro ao salvar projeto:', error);
        }
    };

    const setViewportSize = (size: 'sm' | 'md' | 'lg' | 'xl') => {
        if (unifiedContext) {
            // Mapear para viewMode do UnifiedContext
            const viewModeMap: Record<string, 'desktop' | 'mobile' | 'tablet'> = {
                'sm': 'mobile',
                'md': 'tablet',
                'lg': 'desktop',
                'xl': 'desktop'
            };
            unifiedContext.setViewMode(viewModeMap[size] || 'desktop');
        } else {
            setLocalViewport(size);
        }
    };

    const viewportOptions = [
        { id: 'sm', icon: Smartphone, label: 'Mobile', size: '375px' },
        { id: 'md', icon: Tablet, label: 'Tablet', size: '768px' },
        { id: 'lg', icon: Monitor, label: 'Desktop', size: '1024px' },
        { id: 'xl', icon: LayoutGrid, label: 'Desktop XL', size: '1920px' },
    ];

    // Mapear viewMode atual para viewport
    const getCurrentViewport = () => {
        if (unifiedContext) {
            const viewMode = unifiedContext.ui.viewMode;
            const viewportMap: Record<string, string> = {
                'mobile': 'sm',
                'tablet': 'md',
                'desktop': 'xl'
            };
            return viewportMap[viewMode] || 'xl';
        }
        return editorData.viewportSize;
    };

    const currentViewport = getCurrentViewport();

    return (
        <div
            className={cn(
                'border-b border-gray-700/50 p-4 flex items-center justify-between shadow-2xl backdrop-blur-sm',
                'bg-gradient-to-r from-black via-gray-900 to-black',
                className
            )}
        >
            {/* Logo e informações do projeto */}
            <div className="flex items-center space-x-6">
                <motion.div
                    className="relative group cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    whileHover={{
                        scale: 1.05,
                        rotate: [0, -1, 1, 0],
                        transition: { duration: 0.3 },
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Logo className="h-10 w-auto transform-gpu filter drop-shadow-lg" />
                </motion.div>

                {/* Informações do projeto */}
                <div className="flex items-center gap-3 text-sm">
                    <Badge
                        variant="outline"
                        className={cn(
                            "text-xs border-brand-brightBlue/30 backdrop-blur-sm",
                            unifiedContext
                                ? "bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-400 border-green-400/30"
                                : "bg-gradient-to-r from-brand-brightBlue/20 to-brand-brightPink/20 text-brand-brightBlue"
                        )}
                    >
                        {unifiedContext ? 'Unified Context' : 'Legacy Mode'}
                    </Badge>
                    <div className="h-4 w-px bg-gray-600"></div>
                    <span className="text-gray-300 font-medium">{editorData.totalBlocks} blocos</span>
                    {editorData.isDirty && (
                        <>
                            <div className="h-4 w-px bg-gray-600"></div>
                            <span className="text-yellow-400 text-xs">• Não salvo</span>
                        </>
                    )}
                    <div className="h-4 w-px bg-gray-600"></div>
                    <span className="text-gray-300">
                        Etapa <span className="text-brand-brightPink font-semibold">{funnelNavigation.currentStepNumber || 1}</span> de <span className="text-brand-brightBlue">{funnelNavigation.totalSteps || 21}</span>
                    </span>
                </div>
            </div>

            {/* Controles de viewport no centro */}
            <div className="flex items-center space-x-2 bg-gray-800/50 p-2 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                {viewportOptions.map(option => {
                    const IconComponent = option.icon;
                    const isActive = currentViewport === option.id;
                    return (
                        <Button
                            key={option.id}
                            variant="ghost"
                            size="sm"
                            className={cn(
                                'h-9 w-9 p-0 transition-all duration-200',
                                isActive
                                    ? 'bg-gradient-to-r from-brand-brightBlue to-brand-brightPink text-white shadow-lg scale-105'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                            )}
                            onClick={() => setViewportSize(option.id as any)}
                            title={`${option.label} (${option.size})`}
                        >
                            <IconComponent className="h-4 w-4" />
                        </Button>
                    );
                })}
            </div>

            {/* Botões de ação à direita */}
            <div className="flex items-center space-x-3">
                <Button
                    onClick={handleSave}
                    disabled={!editorData.canSave}
                    size="sm"
                    className={cn(
                        "font-medium px-6 shadow-lg",
                        editorData.canSave
                            ? "bg-gradient-to-r from-brand-brightBlue to-brand-brightPink hover:from-brand-brightPink hover:to-brand-brightBlue text-white"
                            : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    )}
                >
                    <Save className="mr-2 h-4 w-4" />
                    {unifiedContext?.persistence.isSaving ? 'Salvando...' : 'Salvar'}
                </Button>

                {/* Debug info em modo desenvolvimento */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="text-xs text-gray-500">
                        {unifiedContext ? '🎯 Unified' : '⚠️ Legacy'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditorToolbarUnified;
