/**
 * 🎯 SCRIPT FINAL - Aplicar Funil Único no Browser
 * 
 * Execute este script no console do browser (F12) para aplicar
 * a limpeza e manter apenas um funil ativo baseado no quiz21StepsComplete.ts
 */

(function () {
    console.log('🚀 Iniciando aplicação de funil único...');

    try {
        // 1. Limpar localStorage existente
        console.log('🧹 Limpando localStorage...');
        const keys = Object.keys(localStorage);
        const funnelKeys = keys.filter(key =>
            key.startsWith('funnel-') ||
            key.startsWith('funnelData-') ||
            key.includes('funnel') ||
            key.includes('Funnel') ||
            key.includes('quiz') ||
            key.includes('Quiz')
        );

        console.log('📋 Encontradas', funnelKeys.length, 'chaves de funis para remover');
        funnelKeys.forEach(key => {
            localStorage.removeItem(key);
            console.log('   ✅ Removido:', key);
        });

        // 2. Criar funil único baseado no quiz21StepsComplete.ts
        console.log('🎯 Criando funil único...');

        const activeFunnelData = {
            id: 'quiz-style-main',
            name: 'Quiz de Estilo Pessoal - 21 Etapas',
            description: 'Template completo do quiz de estilo predominante',
            origin: 'quiz21StepsComplete.ts',
            templateSource: 'quiz21StepsComplete',
            isActive: true,
            version: '2.0.0',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: 'demo-user',
            template: 'quiz21StepsComplete',
            totalSteps: 21,
            currentStep: 1,
            status: 'active',
            metadata: {
                templateSource: 'quiz21StepsComplete.ts',
                hasStepConfig: true,
                isNoCodeEnabled: true,
                persistenceMethod: 'localStorage',
                cleanupDate: new Date().toISOString(),
                uniqueFunnel: true,
                browserCleanup: true
            },
            // Configurações das etapas (NOCODE)
            stepConfigurations: {
                'step-1': {
                    stepId: '1',
                    stepName: 'Coleta de Nome',
                    nextStep: 'linear',
                    isActive: true,
                    type: 'form',
                    description: 'Etapa inicial para coleta do nome do usuário'
                },
                'step-2': {
                    stepId: '2',
                    stepName: 'Questão 1 - Tipo de Roupa Favorita',
                    nextStep: 'linear',
                    isActive: true,
                    type: 'quiz',
                    requiredSelections: 3,
                    description: 'Primeira questão do quiz sobre preferências de estilo'
                },
                'step-3': {
                    stepId: '3',
                    stepName: 'Questão 2 - Personalidade',
                    nextStep: 'linear',
                    isActive: true,
                    type: 'quiz',
                    requiredSelections: 3,
                    description: 'Segunda questão sobre características de personalidade'
                },
                'step-4': {
                    stepId: '4',
                    stepName: 'Questão 3 - Visual de Identificação',
                    nextStep: 'linear',
                    isActive: true,
                    type: 'quiz',
                    requiredSelections: 3
                },
                'step-5': {
                    stepId: '5',
                    stepName: 'Questão 4 - Detalhes',
                    nextStep: 'linear',
                    isActive: true,
                    type: 'quiz',
                    requiredSelections: 3
                },
                'step-6': {
                    stepId: '6',
                    stepName: 'Questão 5 - Estampas',
                    nextStep: 'linear',
                    isActive: true,
                    type: 'quiz',
                    requiredSelections: 3
                },
                'step-7': {
                    stepId: '7',
                    stepName: 'Questão 6 - Casaco',
                    nextStep: 'linear',
                    isActive: true,
                    type: 'quiz',
                    requiredSelections: 3
                },
                'step-8': {
                    stepId: '8',
                    stepName: 'Questão 7 - Calça',
                    nextStep: 'linear',
                    isActive: true,
                    type: 'quiz',
                    requiredSelections: 3
                },
                'step-9': {
                    stepId: '9',
                    stepName: 'Questão 8 - Sapatos',
                    nextStep: 'linear',
                    isActive: true,
                    type: 'quiz',
                    requiredSelections: 3
                },
                'step-10': {
                    stepId: '10',
                    stepName: 'Questão 9 - Acessórios',
                    nextStep: 'linear',
                    isActive: true,
                    type: 'quiz',
                    requiredSelections: 3
                },
                'step-11': {
                    stepId: '11',
                    stepName: 'Questão 10 - Tecidos',
                    nextStep: 'step-12',
                    isActive: true,
                    type: 'quiz',
                    requiredSelections: 3,
                    description: 'Última questão do quiz de estilo'
                },
                'step-12': {
                    stepId: '12',
                    stepName: 'Transição para Questões Estratégicas',
                    nextStep: 'step-13',
                    isActive: true,
                    type: 'transition',
                    description: 'Transição entre quiz de estilo e questões estratégicas'
                },
                'step-13': {
                    stepId: '13',
                    stepName: 'Questão Estratégica 1 - Autoavaliação',
                    nextStep: 'step-14',
                    isActive: true,
                    type: 'strategic',
                    requiredSelections: 1
                },
                'step-14': {
                    stepId: '14',
                    stepName: 'Questão Estratégica 2 - Desafio',
                    nextStep: 'step-15',
                    isActive: true,
                    type: 'strategic',
                    requiredSelections: 1
                },
                'step-15': {
                    stepId: '15',
                    stepName: 'Questão Estratégica 3 - Frequência',
                    nextStep: 'step-16',
                    isActive: true,
                    type: 'strategic',
                    requiredSelections: 1
                },
                'step-16': {
                    stepId: '16',
                    stepName: 'Questão Estratégica 4 - Investimento',
                    nextStep: 'step-17',
                    isActive: true,
                    type: 'strategic',
                    requiredSelections: 1
                },
                'step-17': {
                    stepId: '17',
                    stepName: 'Questão Estratégica 5 - Preço',
                    nextStep: 'step-18',
                    isActive: true,
                    type: 'strategic',
                    requiredSelections: 1
                },
                'step-18': {
                    stepId: '18',
                    stepName: 'Questão Estratégica 6 - Objetivo Principal',
                    nextStep: 'step-19',
                    isActive: true,
                    type: 'strategic',
                    requiredSelections: 1,
                    description: 'Última questão estratégica'
                },
                'step-19': {
                    stepId: '19',
                    stepName: 'Transição para Resultado',
                    nextStep: 'step-20',
                    isActive: true,
                    type: 'transition',
                    description: 'Transição final antes do resultado'
                },
                'step-20': {
                    stepId: '20',
                    stepName: 'Página de Resultado',
                    nextStep: 'step-21',
                    isActive: true,
                    type: 'result',
                    description: 'Apresentação do resultado do quiz de estilo'
                },
                'step-21': {
                    stepId: '21',
                    stepName: 'Página de Oferta',
                    nextStep: 'end',
                    isActive: true,
                    type: 'offer',
                    description: 'Página final com oferta comercial'
                }
            },
            // Configurações de navegação
            navigation: {
                enableBackButton: true,
                showProgress: true,
                autoAdvance: true,
                validateBeforeAdvance: true,
                progressCalculation: 'steps',
                totalSteps: 21
            },
            // Configurações do template
            templateConfig: {
                name: 'Quiz de Estilo Pessoal',
                category: 'style-quiz',
                questions: 10,
                strategicQuestions: 6,
                resultPages: 2,
                totalSteps: 21,
                baseTemplate: 'quiz21StepsComplete.ts'
            }
        };

        // 3. Salvar dados no localStorage
        const funnelKey = 'active-funnel-main';
        localStorage.setItem(funnelKey, JSON.stringify(activeFunnelData));
        localStorage.setItem('current-active-funnel-id', activeFunnelData.id);
        localStorage.setItem('funnel-cleanup-timestamp', new Date().toISOString());
        localStorage.setItem('cleanup-method', 'browser-script');

        console.log('✅ Funil único criado e salvo como:', funnelKey);

        // 4. Verificar resultado
        const savedFunnel = JSON.parse(localStorage.getItem(funnelKey));
        console.log('\n📊 RESUMO DO FUNIL ATIVO:');
        console.log('========================');
        console.log('   - ID:', savedFunnel.id);
        console.log('   - Nome:', savedFunnel.name);
        console.log('   - Origem:', savedFunnel.origin);
        console.log('   - Template:', savedFunnel.template);
        console.log('   - Total de etapas:', savedFunnel.totalSteps);
        console.log('   - Configurações de etapa:', Object.keys(savedFunnel.stepConfigurations).length);
        console.log('   - Status:', savedFunnel.status);
        console.log('   - NOCODE habilitado:', savedFunnel.metadata.isNoCodeEnabled);

        // 5. Disparar evento personalizado
        window.dispatchEvent(new CustomEvent('funnelCleanupCompleted', {
            detail: {
                success: true,
                activeFunnelId: savedFunnel.id,
                funnelKey: funnelKey,
                removedCount: funnelKeys.length
            }
        }));

        console.log('\n🎉 LIMPEZA CONCLUÍDA COM SUCESSO!');
        console.log('🎯 Agora você tem apenas UM funil ativo baseado no quiz21StepsComplete.ts');
        console.log('📝 Para verificar: localStorage.getItem("active-funnel-main")');

        return {
            success: true,
            activeFunnelId: savedFunnel.id,
            message: 'Funil único aplicado com sucesso!'
        };

    } catch (error) {
        console.error('❌ Erro durante a aplicação:', error);
        return {
            success: false,
            error: error.message
        };
    }
})();

// Criar função global para fácil acesso
window.applyUniqueFunnel = function () {
    console.log('🔄 Reaplicando funil único...');
    return arguments.callee();
};

console.log('\n💡 DICA: Execute "applyUniqueFunnel()" para reaplicar a limpeza');
