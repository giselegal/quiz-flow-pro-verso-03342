/**
 * 🚀 MIGRAÇÃO URGENTE: Quiz 21 Steps Complete para Novo Sistema
 */

const { createClient } = require('@supabase/supabase-js');

// Configurações do Supabase
const SUPABASE_URL = 'https://pwtjuuhchtbzttrzoutw.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGp1dWhjaHRienR0cnpvdXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDQ0NjAsImV4cCI6MjA2NzkyMDQ2MH0.EP0qLHBZK8nyxcod0FEVRQln4R_yVSWEGQwuIbJfP_w';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Dados essenciais do quiz convertidos do template
 */
const QUIZ_DATA = {
    funnel: {
        id: 'quiz21-complete-urgente',
        name: 'Quiz de Estilo Pessoal - 21 Etapas Completo',
        description: 'Quiz completo para descoberta do estilo pessoal com 21 etapas, incluindo coleta de dados, quiz pontuado, questões estratégicas e resultados personalizados.',
        is_published: true,
        version: 2,
        settings: {
            category: 'quiz',
            templateId: 'quiz21StepsComplete',
            theme: {
                primaryColor: '#B89B7A',
                secondaryColor: '#F8F9FA',
                backgroundColor: '#FFFFFF',
                textColor: '#374151'
            },
            quiz_config: {
                totalQuestions: 10,
                strategicQuestions: 6,
                scoringSystem: 'weighted',
                autoAdvance: true,
                showProgress: true,
                multipleSelection: true,
                requiredSelections: 3,
                maxSelections: 3
            },
            seo: {
                title: 'Descubra Seu Estilo Pessoal - Quiz Interativo',
                description: 'Descubra seu estilo predominante através do nosso quiz personalizado',
                keywords: 'estilo pessoal, consultoria de imagem, quiz de estilo, moda feminina'
            }
        }
    },

    pages: [
        // Etapa 1 - Coleta do Nome
        {
            id: 'quiz21-complete-urgente-page-1',
            page_type: 'lead_capture',
            page_order: 1,
            title: 'Vamos começar?',
            blocks: [
                {
                    id: 'step1-header',
                    type: 'quiz-intro-header',
                    order: 0,
                    content: {
                        showLogo: true,
                        showProgress: false,
                        showNavigation: false
                    },
                    properties: {
                        backgroundColor: '#F8F9FA',
                        textAlign: 'center',
                        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
                    }
                },
                {
                    id: 'step1-title',
                    type: 'text',
                    order: 1,
                    content: {
                        text: 'DESCUBRA SEU ESTILO PESSOAL'
                    },
                    properties: {
                        fontSize: '28px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#B89B7A',
                        marginBottom: '16px'
                    }
                },
                {
                    id: 'step1-description',
                    type: 'text',
                    order: 2,
                    content: {
                        text: 'Para começarmos, preciso saber como você gostaria de ser chamada:'
                    },
                    properties: {
                        fontSize: '18px',
                        textAlign: 'center',
                        color: '#374151',
                        marginBottom: '24px'
                    }
                },
                {
                    id: 'step1-input',
                    type: 'text-input',
                    order: 3,
                    content: {
                        placeholder: 'Digite seu primeiro nome',
                        required: true
                    },
                    properties: {
                        fieldId: 'userName',
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '16px'
                    }
                }
            ],
            metadata: {
                stepNumber: 1,
                isQuizStep: false,
                hasScoring: false
            }
        },

        // Etapa 2 - Primeira Questão do Quiz
        {
            id: 'quiz21-complete-urgente-page-2',
            page_type: 'quiz_question',
            page_order: 2,
            title: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
            blocks: [
                {
                    id: 'step2-header',
                    type: 'quiz-intro-header',
                    order: 0,
                    content: {
                        title: 'Questão 1 de 10',
                        showProgress: true,
                        showNavigation: true
                    },
                    properties: {
                        backgroundColor: '#F8F9FA',
                        progressValue: 10,
                        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
                    }
                },
                {
                    id: 'step2-question',
                    type: 'options-grid',
                    order: 1,
                    content: {
                        question: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
                        options: [
                            {
                                id: 'natural_q1',
                                text: 'Vestido fluido e leve em tons terrosos',
                                imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735354/1_hpfhhm.webp'
                            },
                            {
                                id: 'classico_q1',
                                text: 'Conjunto alfaiatado neutro e elegante',
                                imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735354/2_dwdgux.webp'
                            },
                            {
                                id: 'contemporaneo_q1',
                                text: 'Look casual com jeans e blazer estruturado',
                                imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735354/3_akmxbk.webp'
                            },
                            {
                                id: 'elegante_q1',
                                text: 'Vestido midi em cor sólida e corte clássico',
                                imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735354/4_rprvty.webp'
                            },
                            {
                                id: 'romantico_q1',
                                text: 'Vestido com detalhes delicados em rosa suave',
                                imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735354/5_a8cgkl.webp'
                            },
                            {
                                id: 'sexy_q1',
                                text: 'Look ajustado preto com decote estratégico',
                                imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735354/6_t6eqhq.webp'
                            },
                            {
                                id: 'dramatico_q1',
                                text: 'Conjunto todo preto com linhas marcantes',
                                imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735354/7_ybgnrn.webp'
                            },
                            {
                                id: 'criativo_q1',
                                text: 'Look colorido e despojado com mix de estampas',
                                imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735354/8_rczwsm.webp'
                            }
                        ]
                    },
                    properties: {
                        questionId: 'q1_roupa_favorita',
                        showImages: true,
                        imageSize: 'custom',
                        imageWidth: 300,
                        imageHeight: 300,
                        columns: 2,
                        requiredSelections: 3,
                        maxSelections: 3,
                        multipleSelection: true,
                        autoAdvanceOnComplete: true,
                        scoreValues: {
                            natural_q1: 1,
                            classico_q1: 1,
                            contemporaneo_q1: 1,
                            elegante_q1: 1,
                            romantico_q1: 1,
                            sexy_q1: 1,
                            dramatico_q1: 1,
                            criativo_q1: 1
                        }
                    }
                }
            ],
            metadata: {
                stepNumber: 2,
                questionType: 'multiple_choice_images',
                isQuizStep: true,
                hasScoring: true,
                requiredSelections: 3,
                maxSelections: 3
            }
        },

        // Etapa 20 - Resultado
        {
            id: 'quiz21-complete-urgente-page-20',
            page_type: 'result',
            page_order: 20,
            title: 'Seu Resultado Personalizado',
            blocks: [
                {
                    id: 'step20-header',
                    type: 'quiz-intro-header',
                    order: 0,
                    content: {
                        title: 'Parabéns! Descobrimos seu estilo!',
                        showProgress: true
                    },
                    properties: {
                        backgroundColor: '#F8F9FA',
                        progressValue: 100,
                        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
                    }
                },
                {
                    id: 'step20-result-display',
                    type: 'result-display',
                    order: 1,
                    content: {
                        resultTitle: 'SEU ESTILO PREDOMINANTE É:',
                        dynamicResult: true,
                        showScore: true,
                        showRecommendations: true
                    },
                    properties: {
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        padding: '32px',
                        textAlign: 'center',
                        showShadow: true
                    }
                },
                {
                    id: 'step20-description',
                    type: 'text',
                    order: 2,
                    content: {
                        text: 'Baseado nas suas respostas, identificamos suas preferências de estilo e criamos recomendações personalizadas para você.'
                    },
                    properties: {
                        fontSize: '16px',
                        textAlign: 'center',
                        color: '#6B7280',
                        marginTop: '24px',
                        marginBottom: '32px'
                    }
                }
            ],
            metadata: {
                stepNumber: 20,
                isQuizStep: false,
                hasScoring: false,
                showsResult: true
            }
        },

        // Etapa 21 - Oferta
        {
            id: 'quiz21-complete-urgente-page-21',
            page_type: 'offer',
            page_order: 21,
            title: 'Oferta Especial Para Você',
            blocks: [
                {
                    id: 'step21-header',
                    type: 'quiz-intro-header',
                    order: 0,
                    content: {
                        title: 'Transforme Seu Estilo Agora!'
                    },
                    properties: {
                        backgroundColor: '#F8F9FA',
                        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
                    }
                },
                {
                    id: 'step21-offer-title',
                    type: 'text',
                    order: 1,
                    content: {
                        text: 'GUIA COMPLETO DO SEU ESTILO PESSOAL'
                    },
                    properties: {
                        fontSize: '32px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#B89B7A',
                        marginBottom: '16px'
                    }
                },
                {
                    id: 'step21-price',
                    type: 'price-display',
                    order: 2,
                    content: {
                        originalPrice: 197,
                        currentPrice: 97,
                        currency: 'R$',
                        showDiscount: true
                    },
                    properties: {
                        textAlign: 'center',
                        fontSize: '24px',
                        color: '#059669',
                        marginBottom: '24px'
                    }
                },
                {
                    id: 'step21-cta',
                    type: 'button',
                    order: 3,
                    content: {
                        buttonText: 'QUERO TRANSFORMAR MEU ESTILO AGORA',
                        buttonUrl: 'https://checkout.stylequest.com.br/oferta-especial'
                    },
                    properties: {
                        backgroundColor: '#B89B7A',
                        textColor: '#FFFFFF',
                        borderRadius: '8px',
                        width: '100%',
                        padding: '16px 24px',
                        fontSize: '18px',
                        fontWeight: 'bold'
                    }
                }
            ],
            metadata: {
                stepNumber: 21,
                isQuizStep: false,
                hasScoring: false,
                isOffer: true
            }
        }
    ]
};

/**
 * Verifica se as tabelas existem
 */
async function checkTables() {
    try {
        console.log('🔍 Verificando tabelas...');

        const { error: funnelsError } = await supabase
            .from('funnels')
            .select('id')
            .limit(1);

        if (funnelsError) {
            console.error('❌ Tabela funnels não existe:', funnelsError.message);
            return false;
        }

        const { error: pagesError } = await supabase
            .from('funnel_pages')
            .select('id')
            .limit(1);

        if (pagesError) {
            console.error('❌ Tabela funnel_pages não existe:', pagesError.message);
            return false;
        }

        console.log('✅ Tabelas verificadas com sucesso');
        return true;
    } catch (error) {
        console.error('❌ Erro ao verificar tabelas:', error);
        return false;
    }
}

/**
 * Salva o funil no Supabase
 */
async function saveFunnelToSupabase() {
    try {
        console.log('💾 Salvando funil no Supabase...');

        const now = new Date().toISOString();

        const funnelData = {
            ...QUIZ_DATA.funnel,
            user_id: null, // Será definido pelo usuário logado
            created_at: now,
            updated_at: now
        };

        // 1. Salvar funil principal
        const { error: funnelError } = await supabase
            .from('funnels')
            .upsert([funnelData])
            .select();

        if (funnelError) {
            console.error('❌ Erro ao salvar funil:', funnelError);
            return false;
        }

        console.log(`✅ Funil salvo: ${funnelData.id}`);

        // 2. Salvar páginas
        const pagesData = QUIZ_DATA.pages.map(page => ({
            ...page,
            funnel_id: funnelData.id,
            created_at: now,
            updated_at: now
        }));

        const { error: pagesError } = await supabase
            .from('funnel_pages')
            .upsert(pagesData)
            .select();

        if (pagesError) {
            console.error('❌ Erro ao salvar páginas:', pagesError);
            return false;
        }

        console.log(`✅ ${pagesData.length} páginas salvas`);
        return true;

    } catch (error) {
        console.error('❌ Erro geral ao salvar:', error);
        return false;
    }
}

/**
 * Executa a migração completa
 */
async function runMigration() {
    console.log('🚀 INICIANDO MIGRAÇÃO URGENTE - Quiz 21 Steps Complete');
    console.log('================================================\n');

    try {
        // 1. Verificar tabelas
        const tablesExist = await checkTables();
        if (!tablesExist) {
            console.log('\n❌ ERRO: Tabelas não existem no Supabase');
            console.log('Execute primeiro: npm run create-tables');
            return;
        }

        // 2. Salvar no Supabase
        const saved = await saveFunnelToSupabase();

        if (saved) {
            console.log('\n🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
            console.log('================================================');
            console.log(`📋 Funil ID: ${QUIZ_DATA.funnel.id}`);
            console.log(`📄 Total de páginas: ${QUIZ_DATA.pages.length}`);
            console.log(`🎯 Categoria: ${QUIZ_DATA.funnel.settings.category}`);
            console.log(`🔗 Template ID: ${QUIZ_DATA.funnel.settings.templateId}`);
            console.log('\n🌐 Acesse em:');
            console.log(`• Editor: http://localhost:8080/editor-pro/${QUIZ_DATA.funnel.id}`);
            console.log(`• Preview: http://localhost:8080/preview/${QUIZ_DATA.funnel.id}`);
        } else {
            console.log('\n❌ FALHA NA MIGRAÇÃO');
            console.log('Verifique os logs de erro acima');
        }

    } catch (error) {
        console.error('\n❌ ERRO CRÍTICO NA MIGRAÇÃO:', error);
    }
}

// Executar migração
runMigration().catch(console.error);