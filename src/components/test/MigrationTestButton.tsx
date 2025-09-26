/**
 * 🎯 COMPONENTE DE TESTE: Migration Service
 * 
 * Componente React simples para testar a migração
 * das imagens do quiz-estilo
 */

import React, { useState } from 'react';
import { migrateQuizEstiloImages } from '@/services/ImageMigrationService';

const MigrationTestButton: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
    const [result, setResult] = useState<any>(null);

    const runTest = async () => {
        setStatus('running');
        setResult(null);

        try {
            console.log('🔥 Executando Migration Service...');
            const migrationResult = await migrateQuizEstiloImages();

            setResult(migrationResult);
            setStatus('success');

            console.log('✅ Migração concluída:', migrationResult.stats);

        } catch (error) {
            console.error('❌ Erro na migração:', error);
            setStatus('error');
            setResult({ error: error instanceof Error ? error.message : 'Erro desconhecido' });
        }
    };

    const getStatusEmoji = () => {
        switch (status) {
            case 'running': return '⏳';
            case 'success': return '✅';
            case 'error': return '❌';
            default: return '🔥';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'running': return 'Migrando...';
            case 'success': return 'Concluída!';
            case 'error': return 'Erro!';
            default: return 'Migrar Quiz-Estilo';
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-[#432818] mb-4">
                    🔥 Migration Service - Teste
                </h2>

                <button
                    onClick={runTest}
                    disabled={status === 'running'}
                    className={`
                        px-6 py-3 rounded-lg font-semibold text-white transition-all
                        ${status === 'running'
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#B89B7A] hover:bg-[#A68A6D] active:scale-95'
                        }
                    `}
                >
                    {getStatusEmoji()} {getStatusText()}
                </button>

                {/* Resultado */}
                {result && status === 'success' && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                        <h3 className="font-semibold text-green-800 mb-2">📊 Estatísticas:</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Total:</span>
                                <span className="font-semibold ml-2">{result.stats.totalImages}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Migradas:</span>
                                <span className="font-semibold ml-2 text-green-600">{result.stats.migrated}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Falhas:</span>
                                <span className="font-semibold ml-2 text-red-600">{result.stats.failed}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Compressão:</span>
                                <span className="font-semibold ml-2 text-blue-600">
                                    {result.stats.compressionRatio.toFixed(1)}%
                                </span>
                            </div>
                        </div>

                        {result.stats.spaceSaved > 0 && (
                            <div className="mt-3 p-2 bg-green-100 rounded">
                                <span className="text-green-700 font-semibold">
                                    💾 Economizados: {(result.stats.spaceSaved / 1024).toFixed(1)} KB
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Erro */}
                {result && status === 'error' && (
                    <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                        <h3 className="font-semibold text-red-800 mb-2">❌ Erro:</h3>
                        <p className="text-red-700 text-sm">{result.error}</p>
                    </div>
                )}

                {/* Loading */}
                {status === 'running' && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                            <span className="text-blue-700">
                                Otimizando imagens do quiz-estilo...
                                <br />
                                <small className="text-blue-600">
                                    (Logo + Intro + 8 estilos = 10 imagens)
                                </small>
                            </span>
                        </div>
                    </div>
                )}

                {/* Instruções */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">💡 Como funciona:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Baixa imagens do Cloudinary</li>
                        <li>• Converte para WebP otimizado</li>
                        <li>• Armazena no IndexedDB (cache offline)</li>
                        <li>• Próximos carregamentos são instantâneos</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MigrationTestButton;