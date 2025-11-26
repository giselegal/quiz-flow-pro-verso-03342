import { useState, useEffect } from 'react';
import { Settings, X, ToggleLeft, ToggleRight, Trash2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    type FeatureFlags,
    getFeatureFlag,
    setFeatureFlag,
    getAllFeatureFlags,
    resetFeatureFlags,
} from '@/core/utils/featureFlags';

interface FeatureFlagsPanelProps {
    /** Mostrar painel por padrão */
    defaultOpen?: boolean;
    /** Classe CSS adicional */
    className?: string;
}

/**
 * Painel de controle de Feature Flags (apenas desenvolvimento)
 * 
 * Permite visualizar e togglear todas as feature flags do sistema.
 * Útil para testar features experimentais sem modificar código.
 * 
 * @example
 * ```tsx
 * // No componente raiz do app (apenas DEV)
 * {import.meta.env.DEV && <FeatureFlagsPanel />}
 * ```
 */
export function FeatureFlagsPanel({ defaultOpen = false, className }: FeatureFlagsPanelProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [flags, setFlags] = useState<FeatureFlags>(getAllFeatureFlags());
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    // Atualizar flags quando mudarem
    useEffect(() => {
        const interval = setInterval(() => {
            setFlags(getAllFeatureFlags());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleToggle = (key: keyof FeatureFlags) => {
        const newValue = !getFeatureFlag(key);
        setFeatureFlag(key, newValue);
        setFlags(getAllFeatureFlags());
    };

    const handleReset = () => {
        if (confirm('Resetar todas as feature flags para valores padrão?')) {
            resetFeatureFlags();
            setFlags(getAllFeatureFlags());
        }
    };

    // Categorizar flags
    const categorizedFlags: Record<string, Array<keyof FeatureFlags>> = {
        'Editor Architecture': [
            'useUnifiedEditor',
            'useUnifiedContext',
            'useSinglePropertiesPanel',
            'useCoreDraftHook',
        ],
        'Performance': [
            'enableLazyLoading',
            'enableAdvancedValidation',
            'usePersistenceService',
            'enableBatchOperations',
            'useOptimisticUpdates',
        ],
        'Validation': [
            'useValidationOnType',
            'showInlineValidationErrors',
            'enableStrictValidation',
        ],
        'Developer': [
            'enableErrorBoundaries',
            'enablePerformanceMonitoring',
            'enableDebugPanel',
            'showDevTools',
        ],
        'Experimental': [
            'enableExperimentalFeatures',
            'useNewUIComponents',
            'enableAccessibilityEnhancements',
            'enableAdvancedDragDrop',
            'useVirtualScrolling',
        ],
    };

    // Filtrar flags
    const getFilteredFlags = () => {
        let flagsToShow: Array<[string, keyof FeatureFlags]> = [];

        if (filterCategory === 'all') {
            Object.entries(categorizedFlags).forEach(([category, keys]) => {
                keys.forEach(key => {
                    flagsToShow.push([category, key]);
                });
            });
        } else {
            const keys = categorizedFlags[filterCategory] || [];
            keys.forEach(key => {
                flagsToShow.push([filterCategory, key]);
            });
        }

        if (searchTerm) {
            flagsToShow = flagsToShow.filter(([_, key]) =>
                String(key).toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return flagsToShow;
    };

    const filteredFlags = getFilteredFlags();
    const categories = Object.keys(categorizedFlags);

    // Não renderizar em produção
    if (!import.meta.env.DEV) {
        return null;
    }

    return (
        <div className={cn('fixed bottom-4 right-4 z-[9999]', className)}>
            {/* Botão de toggle */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg transition-all hover:scale-105"
                    title="Abrir Feature Flags"
                >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Feature Flags</span>
                </button>
            )}

            {/* Painel */}
            {isOpen && (
                <div className="w-96 max-h-[600px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <Settings className="w-5 h-5 text-indigo-600" />
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                Feature Flags
                            </h3>
                            <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded">
                                DEV
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleReset}
                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                title="Resetar para padrão"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 space-y-3">
                        <input
                            type="text"
                            placeholder="Buscar flag..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => setFilterCategory('all')}
                                className={cn(
                                    'px-3 py-1 text-xs font-medium rounded-full transition-colors',
                                    filterCategory === 'all'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                )}
                            >
                                Todas
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setFilterCategory(category)}
                                    className={cn(
                                        'px-3 py-1 text-xs font-medium rounded-full transition-colors',
                                        filterCategory === category
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    )}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Lista de flags */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
                        {filteredFlags.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                Nenhuma flag encontrada
                            </div>
                        ) : (
                            filteredFlags.map(([category, key]) => {
                                const isEnabled = flags[key];
                                return (
                                    <div
                                        key={key}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                                    >
                                        <div className="flex-1 min-w-0 mr-3">
                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                {key}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {category}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleToggle(key)}
                                            className={cn(
                                                'flex items-center gap-1 px-3 py-1.5 rounded-full transition-all',
                                                isEnabled
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                            )}
                                            title={isEnabled ? 'Desabilitar' : 'Habilitar'}
                                        >
                                            {isEnabled ? (
                                                <>
                                                    <ToggleRight className="w-4 h-4" />
                                                    <span className="text-xs font-medium">ON</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ToggleLeft className="w-4 h-4" />
                                                    <span className="text-xs font-medium">OFF</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                        {filteredFlags.length} flags • {filteredFlags.filter(([_, key]) => flags[key]).length} ativas
                    </div>
                </div>
            )}
        </div>
    );
}
