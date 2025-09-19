import React from 'react';
import ScalableQuizRenderer from '@/components/core/ScalableQuizRenderer';

/**
 * 🚀 EXEMPLO PRÁTICO DO SISTEMA ESCALÁVEL
 * 
 * Este exemplo mostra como usar o ScalableQuizRenderer
 * com o sistema HybridTemplateService implementado.
 */

const ScalableQuizExample: React.FC = () => {
    const handleQuizComplete = (results: any) => {
        console.log('✅ Quiz completado!', results);

        // Aqui você pode:
        // - Enviar dados para API
        // - Redirecionar para página de resultado
        // - Mostrar modal de sucesso
        // - Integrar com analytics
    };

    const handleStepChange = (step: number, data: any) => {
        console.log(`📍 Step ${step} alterado:`, data);

        // Aqui você pode:
        // - Fazer tracking de analytics
        // - Salvar progresso em localStorage
        // - Enviar dados em tempo real
        // - Atualizar UI externa
    };

    return (
        <div className="min-h-screen bg-stone-50">
            <div className="container mx-auto py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-stone-800 mb-2">
                        🚀 Sistema Escalável em Ação
                    </h1>
                    <p className="text-stone-600">
                        Quiz com HybridTemplateService + BlockPropertiesAPI + JSON Configs
                    </p>
                </div>

                {/* Exemplo 1: Quiz21StepsComplete */}
                <div className="mb-12">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-stone-800 mb-2">
                                Quiz 21 Steps Complete
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-stone-600">
                                <span>🔧 Configuração: JSON Master + Step Overrides</span>
                                <span>📊 Dados: API Real + UNIFIED_TEMPLATE_REGISTRY</span>
                                <span>⚡ Sistema: ScalableHybridTemplateService</span>
                            </div>
                        </div>

                        <ScalableQuizRenderer
                            funnelId="quiz21StepsComplete"
                            mode="preview"
                            onComplete={handleQuizComplete}
                            onStepChange={handleStepChange}
                            debugMode={true}
                            className="max-w-4xl mx-auto"
                        />
                    </div>
                </div>

                {/* Exemplo 2: Lead Magnet Fashion */}
                <div className="mb-12">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-stone-800 mb-2">
                                Lead Magnet Fashion (7 Steps)
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-stone-600">
                                <span>🎯 Funil: Lead Generation</span>
                                <span>⏱️ Duração: ~2 minutos</span>
                                <span>🎨 Tema: Minimal Pink</span>
                            </div>
                        </div>

                        <ScalableQuizRenderer
                            funnelId="lead-magnet-fashion"
                            mode="production"
                            onComplete={(results) => {
                                console.log('Lead capturado!', results);
                                // Redirecionar para download ou thank you page
                            }}
                            onStepChange={handleStepChange}
                            debugMode={false}
                            className="max-w-2xl mx-auto"
                        />
                    </div>
                </div>

                {/* Informações do Sistema */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-stone-800 mb-4">
                        🎯 Recursos Implementados
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium text-stone-700 mb-2">✅ Sistema Escalável</h4>
                            <ul className="text-sm text-stone-600 space-y-1">
                                <li>• HybridTemplateService para configs dinâmicas</li>
                                <li>• JSON Master + Step Overrides</li>
                                <li>• A/B Testing com overrides específicos</li>
                                <li>• Fallback automático para TypeScript</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium text-stone-700 mb-2">✅ Dados Reais</h4>
                            <ul className="text-sm text-stone-600 space-y-1">
                                <li>• BlockPropertiesAPI conectada</li>
                                <li>• Questões, opções e imagens reais</li>
                                <li>• UNIFIED_TEMPLATE_REGISTRY integrado</li>
                                <li>• Cache inteligente e performance</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium text-stone-700 mb-2">✅ NoCode Interface</h4>
                            <ul className="text-sm text-stone-600 space-y-1">
                                <li>• Configuração via JSON files</li>
                                <li>• Override por step individual</li>
                                <li>• Temas e validações customizáveis</li>
                                <li>• Analytics automático integrado</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium text-stone-700 mb-2">✅ Produção Ready</h4>
                            <ul className="text-sm text-stone-600 space-y-1">
                                <li>• Error handling robusto</li>
                                <li>• Loading states otimizados</li>
                                <li>• TypeScript completo</li>
                                <li>• Build sem erros ✅</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Como Duplicar */}
                <div className="mt-8 bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-stone-800 mb-4">
                        🔄 Como Criar um Novo Funil
                    </h3>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-medium">1</span>
                            <div>
                                <strong>Criar estrutura:</strong> <code className="bg-stone-100 px-2 py-1 rounded">templates/funnels/seu-funil-id/</code>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-medium">2</span>
                            <div>
                                <strong>Configurar master:</strong> <code className="bg-stone-100 px-2 py-1 rounded">master.json</code> com settings globais
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-medium">3</span>
                            <div>
                                <strong>Overrides específicos:</strong> <code className="bg-stone-100 px-2 py-1 rounded">steps/step-XX.json</code> quando necessário
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-medium">4</span>
                            <div>
                                <strong>Usar componente:</strong> <code className="bg-stone-100 px-2 py-1 rounded">&lt;ScalableQuizRenderer funnelId="seu-funil-id" /&gt;</code>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-green-100 rounded">
                        <p className="text-green-800 text-sm">
                            <strong>🎉 Pronto!</strong> O sistema automaticamente carrega as configurações e renderiza o funil.
                            Zero código hardcoded, 100% configurável via JSON!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScalableQuizExample;