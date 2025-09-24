/**
 * 🧪 TEMPLATE DE TESTE - Para verificar se o sistema está funcionando
 */

export const testTemplate = {
    config: {
        globalConfig: {
            theme: {
                primaryColor: "#10B981",
                secondaryColor: "#F59E0B",
                accentColor: "#EF4444"
            },
            navigation: {
                allowBack: true,
                showProgress: true
            },
            analytics: {
                enabled: true,
                trackingId: "test-analytics"
            }
        },
        seo: {
            title: "Template de Teste",
            description: "Template simples para testar o sistema de carregamento",
            keywords: ["teste", "template", "debug"]
        },
        tracking: {
            googleAnalytics: "GA_TEST_ID",
            facebookPixel: "FB_TEST_ID",
            customEvents: {
                "test_start": "Teste iniciado",
                "test_complete": "Teste finalizado"
            }
        }
    },
    steps: [
        {
            stepNumber: 1,
            type: 'intro' as const,
            title: 'Bem-vindo ao Teste',
            subtitle: 'Este é um template de teste simples',
            blocks: [
                {
                    id: 'test-header',
                    type: 'header',
                    content: {
                        title: 'Template de Teste Funcionando! ✅',
                        subtitle: 'Se você está vendo isso, o sistema de templates está operacional'
                    }
                },
                {
                    id: 'test-description',
                    type: 'description',
                    content: {
                        text: 'Este é um template de teste simples para verificar se o carregamento dinâmico está funcionando corretamente.'
                    }
                }
            ],
            navigation: {
                nextButton: 'Continuar Teste',
                autoAdvance: false,
                autoAdvanceDelay: 0
            }
        },
        {
            stepNumber: 2,
            type: 'question' as const,
            title: 'Pergunta de Teste',
            subtitle: 'Selecione uma opção para testar',
            blocks: [
                {
                    id: 'test-question',
                    type: 'multiple-choice',
                    content: {
                        question: 'O sistema de templates está funcionando?',
                        options: [
                            { id: 'opt1', text: '✅ Sim, está funcionando perfeitamente!', value: 'yes' },
                            { id: 'opt2', text: '⚠️ Parcialmente, precisa ajustes', value: 'partial' },
                            { id: 'opt3', text: '❌ Não, há problemas', value: 'no' }
                        ]
                    }
                }
            ],
            validation: {
                required: true,
                minSelections: 1,
                maxSelections: 1
            },
            navigation: {
                nextButton: 'Finalizar Teste',
                autoAdvance: false,
                autoAdvanceDelay: 0
            }
        },
        {
            stepNumber: 3,
            type: 'result' as const,
            title: 'Resultado do Teste',
            subtitle: 'Sistema de templates testado com sucesso!',
            blocks: [
                {
                    id: 'test-result',
                    type: 'result-display',
                    content: {
                        title: '🎉 Parabéns!',
                        description: 'O sistema de templates está funcionando corretamente. Você pode agora criar e editar templates dinâmicamente.',
                        features: [
                            '✅ Carregamento dinâmico de templates',
                            '✅ Conversão para formato do editor',
                            '✅ Integração com CRUD unificado',
                            '✅ Interface responsiva'
                        ]
                    }
                }
            ],
            navigation: {
                nextButton: 'Concluir',
                autoAdvance: false,
                autoAdvanceDelay: 0
            }
        }
    ]
};

export default testTemplate;