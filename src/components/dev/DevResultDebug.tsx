import React, { useEffect, useState } from 'react';
import { StorageService } from '@/services/core/StorageService';
import { useUnifiedQuizState } from '@/hooks/useUnifiedQuizState';

/**
 * 🔍 COMPONENTE DE DEBUG EXPANDIDO - FASE 5
 * 
 * Mostra estado completo do sistema unificado para diagnóstico
 */
export const DevResultDebug: React.FC = () => {
    const { data, getDataStats } = useUnifiedQuizState();
    const [isExpanded, setIsExpanded] = useState(false);
    const [stats, setStats] = useState<any>({});

    const [legacyState, setLegacyState] = useState({
        userName: '',
        quizUserName: '',
        quizResult: null as any,
        currentStep: (globalThis as any)?.__quizCurrentStep || '',
    });

    useEffect(() => {
        const loadLegacyAndStats = () => {
            // Legacy data
            setLegacyState({
                userName: StorageService.safeGetString('userName') || '',
                quizUserName: StorageService.safeGetString('quizUserName') || '',
                quizResult: StorageService.safeGetJSON('quizResult'),
                currentStep: (globalThis as any)?.__quizCurrentStep || ''
            });

            // Current stats
            setStats(getDataStats());
        };

        loadLegacyAndStats();
        const interval = setInterval(loadLegacyAndStats, 2000);

        return () => clearInterval(interval);
    }, [getDataStats]);

    const renderSelectionsSummary = () => {
        const selections = data.selections;
        const count = Object.keys(selections).length;
        
        if (count === 0) return 'Nenhuma seleção';
        
        return (
            <div className="text-xs">
                <div>{count} perguntas respondidas</div>
                {isExpanded && (
                    <div className="mt-1 space-y-1">
                        {Object.entries(selections).map(([qId, options]) => (
                            <div key={qId} className="flex justify-between">
                                <span className="truncate max-w-[100px]">{qId}:</span>
                                <span className="text-blue-600">{options.length} opções</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderFormDataSummary = () => {
        const formData = data.formData;
        const count = Object.keys(formData).length;
        
        if (count === 0) return 'Nenhum dado';
        
        return (
            <div className="text-xs">
                <div>{count} campos preenchidos</div>
                {isExpanded && (
                    <div className="mt-1 space-y-1">
                        {Object.entries(formData).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                                <span className="truncate max-w-[80px]">{key}:</span>
                                <span className="text-green-600 truncate max-w-[100px]">
                                    {String(value).substring(0, 20)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed bottom-4 left-4 bg-black/90 text-white p-3 rounded-lg shadow-lg text-xs font-mono max-w-sm z-50">
            <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-yellow-400">🔍 Quiz Debug</div>
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-gray-300 hover:text-white"
                >
                    {isExpanded ? '▼' : '▶'}
                </button>
            </div>

            {/* Status Principal */}
            <div className="space-y-1 mb-2">
                <div><b>Step:</b> {data.metadata.currentStep}/21</div>
                <div><b>Completos:</b> {data.metadata.completedSteps.length}</div>
                <div><b>Tem Resultado:</b> {data.result ? '✅' : '❌'}</div>
                <div><b>Dados OK:</b> {stats.selectionsCount >= 8 ? '✅' : `❌ (${stats.selectionsCount}/8)`}</div>
            </div>

            {/* Dados Unificados */}
            <div className="border-t border-gray-600 pt-2 space-y-2">
                <div>
                    <div className="text-blue-400 font-semibold">📊 Seleções:</div>
                    {renderSelectionsSummary()}
                </div>
                
                <div>
                    <div className="text-green-400 font-semibold">📝 Formulários:</div>
                    {renderFormDataSummary()}
                </div>

                {data.result && (
                    <div>
                        <div className="text-purple-400 font-semibold">🎯 Resultado:</div>
                        <div className="text-xs">
                            <div><b>Estilo:</b> {data.result?.primaryStyle?.style || '—'}</div>
                            <div><b>%:</b> {data.result?.primaryStyle?.percentage || 0}%</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Dados Legacy (compatibilidade) */}
            {isExpanded && (
                <div className="border-t border-gray-600 pt-2 mt-2">
                    <div className="text-gray-400 font-semibold mb-1">📦 Legacy:</div>
                    <div className="space-y-1 text-xs">
                        <div><b>userName:</b> {legacyState.userName || '—'}</div>
                        <div><b>quizUserName:</b> {legacyState.quizUserName || '—'}</div>
                        <div><b>legacyResult:</b> {legacyState.quizResult?.primaryStyle?.style || '—'}</div>
                    </div>
                </div>
            )}

            {/* Estatísticas Técnicas */}
            {isExpanded && (
                <div className="border-t border-gray-600 pt-2 mt-2">
                    <div className="text-gray-400 font-semibold mb-1">⚙️ Stats:</div>
                    <div className="space-y-1 text-xs">
                        <div><b>Tamanho:</b> {Math.round(stats.dataSize / 1024)}KB</div>
                        <div><b>Última Atualização:</b></div>
                        <div className="text-gray-500 text-xs">
                            {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleTimeString() : '—'}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DevResultDebug;
