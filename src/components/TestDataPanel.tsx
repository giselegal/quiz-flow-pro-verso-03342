/**
 * 🧪 PAINEL DE TESTE - GERADOR DE DADOS
 */

import React, { useState } from 'react';
import { generateTestData, clearTestData } from '@/utils/testDataGenerator';

export const TestDataPanel: React.FC = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [lastResult, setLastResult] = useState<any>(null);

    const handleGenerateData = async () => {
        setIsGenerating(true);
        try {
            const result = await generateTestData(25); // Gerar 25 participantes
            setLastResult(result);
            alert('✅ Dados de teste gerados com sucesso!');
        } catch (error) {
            console.error('Erro:', error);
            alert('❌ Erro ao gerar dados de teste');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleClearData = async () => {
        if (!confirm('⚠️ Tem certeza que deseja limpar todos os dados de teste?')) {
            return;
        }

        setIsClearing(true);
        try {
            await clearTestData();
            setLastResult(null);
            alert('✅ Dados de teste removidos com sucesso!');
        } catch (error) {
            console.error('Erro:', error);
            alert('❌ Erro ao limpar dados de teste');
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">🧪 Painel de Teste - Dados Simulados</h2>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600 mb-2">
                    Este painel permite gerar dados simulados para testar a tabela de participantes.
                </p>
                <p className="text-sm text-gray-600">
                    Os dados incluem sessões completas, abandonadas e em andamento com respostas realistas.
                </p>
            </div>

            <div className="flex gap-4 mb-6">
                <button
                    onClick={handleGenerateData}
                    disabled={isGenerating}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isGenerating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Gerando...
                        </>
                    ) : (
                        '🎲 Gerar 25 Participantes'
                    )}
                </button>

                <button
                    onClick={handleClearData}
                    disabled={isClearing}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isClearing ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Limpando...
                        </>
                    ) : (
                        '🧹 Limpar Dados de Teste'
                    )}
                </button>
            </div>

            {lastResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">📊 Último Resultado:</h3>
                    <ul className="text-sm text-green-700 space-y-1">
                        <li>• {lastResult.sessions} sessões criadas</li>
                        <li>• {lastResult.results} resultados completos</li>
                        <li>• {lastResult.responses} respostas por etapa</li>
                    </ul>
                </div>
            )}

            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">ℹ️ Informações:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Os dados simulados têm prefixo "session_" para fácil identificação</li>
                    <li>• Aproximadamente 70% das sessões são marcadas como completas</li>
                    <li>• Dados incluem diferentes dispositivos (mobile, tablet, desktop)</li>
                    <li>• Tempos de resposta e abandonos são simulados realisticamente</li>
                </ul>
            </div>
        </div>
    );
};

export default TestDataPanel;
