/**
 * 🧹 LIMPEZA AUTOMÁTICA DE FUNIS - Executar automaticamente no localStorage
 * 
 * Este script remove funis duplicados e mantém apenas um ativo
 * baseado no template quiz21StepsComplete.ts
 */

console.log('🚀 Iniciando limpeza automática de funis...');

// Função para executar a limpeza
function cleanupFunnels() {
    try {
        // 1. Verificar localStorage atual
        const keys = Object.keys(localStorage);
        console.log('📊 Total de chaves no localStorage:', keys.length);

        const funnelKeys = keys.filter(key =>
            key.startsWith('funnel-') ||
            key.startsWith('funnelData-') ||
            key.includes('funnel') ||
            key.includes('Funnel') ||
            key.includes('quiz') ||
            key.includes('Quiz')
        );

        console.log('📋 Chaves relacionadas a funis encontradas:', funnelKeys.length);
        funnelKeys.forEach(key => {
            const value = localStorage.getItem(key);
            console.log(`   - ${key}: ${value ? (value.length > 100 ? value.length + ' caracteres' : value) : 'vazio'}`);
        });

        // 2. Limpar todas as chaves de funis antigas
        console.log('\n🗑️ Removendo funis duplicados...');
        let removedCount = 0;
        funnelKeys.forEach(key => {
            localStorage.removeItem(key);
            console.log(`   ✅ Removido: ${key}`);
            removedCount++;
        });

        // 3. Limpar dados temporários e caches
        const tempKeys = keys.filter(key =>
            key.includes('draft') ||
            key.includes('temp') ||
            key.includes('backup') ||
            key.includes('copy') ||
            key.includes('duplicate') ||
            key.includes('cache') ||
            key.includes('session')
        );

        if (tempKeys.length > 0) {
            console.log('\n🧹 Removendo dados temporários...');
            tempKeys.forEach(key => {
                localStorage.removeItem(key);
                console.log(`   ✅ Removido: ${key}`);
                removedCount++;
            });
        }

        // 4. Criar um único funil ativo baseado no template quiz21StepsComplete.ts
        const activeFunnelData = {
            id: 'quiz-style-main',
            name: 'Quiz de Estilo Pessoal - 21 Etapas',
            description: 'Template completo do quiz de estilo predominante baseado em quiz21StepsComplete.ts',
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
                uniqueFunnel: true
            },
            // Configuração das etapas (NOCODE)
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
                'step-12': {
                    stepId: '12',
                    stepName: 'Transição para Questões Estratégicas',
                    nextStep: 'linear',
                    isActive: true,
                    type: 'transition',
                    description: 'Transição entre quiz de estilo e questões estratégicas'
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
                totalSteps: 21
            }
        };

        // 5. Salvar o funil único e ativo
        const funnelKey = 'active-funnel-main';
        localStorage.setItem(funnelKey, JSON.stringify(activeFunnelData));

        // Criar também uma referência rápida
        localStorage.setItem('current-active-funnel-id', activeFunnelData.id);
        localStorage.setItem('funnel-cleanup-timestamp', new Date().toISOString());

        console.log(`\n✅ Funil único criado e salvo como: ${funnelKey}`);

        // 6. Verificar resultado
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

        // 7. Estatísticas finais
        const finalKeys = Object.keys(localStorage);
        console.log('\n📈 ESTATÍSTICAS DA LIMPEZA:');
        console.log('===========================');
        console.log('   - Itens removidos:', removedCount);
        console.log('   - Chaves antes:', keys.length);
        console.log('   - Chaves depois:', finalKeys.length);
        console.log('   - Economia:', keys.length - finalKeys.length, 'itens');

        console.log('\n🎉 Limpeza concluída com sucesso!');
        console.log('📝 Para verificar: localStorage.getItem("active-funnel-main")');

        return {
            success: true,
            removedCount,
            activeFunnelId: savedFunnel.id,
            funnelKey: funnelKey
        };

    } catch (error) {
        console.error('❌ Erro durante a limpeza:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Executar automaticamente se o script for carregado diretamente
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    // Executar após um pequeno delay para garantir que o DOM esteja pronto
    setTimeout(() => {
        const result = cleanupFunnels();

        if (result.success) {
            console.log('\n✨ LIMPEZA AUTOMÁTICA CONCLUÍDA ✨');
            console.log('Agora você tem apenas UM funil ativo baseado no quiz21StepsComplete.ts');

            // Dispatch event para notificar outros componentes
            window.dispatchEvent(new CustomEvent('funnelCleanupCompleted', {
                detail: result
            }));
        }
    }, 100);
}

// Exportar função para uso manual
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { cleanupFunnels };
} else {
    window.cleanupFunnels = cleanupFunnels;
}
