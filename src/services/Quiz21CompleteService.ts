import { supabase } from '@/integrations/supabase/client';
import { Block } from '@/types/editor';

/**
 * 🚀 CRIAÇÃO DIRETA DO QUIZ 21 STEPS COMPLETE
 * 
 * Este serviço cria o funil diretamente via interface web,
 * contornando problemas de RLS
 */

export interface QuizFunnelData {
    id: string;
    name: string;
    description: string;
    settings: {
        category: string;
        templateId: string;
        theme: any;
        quiz_config: any;
        seo: any;
    };
    pages: QuizPageData[];
}

export interface QuizPageData {
    id: string;
    page_type: string;
    page_order: number;
    title: string;
    blocks: Block[];
    metadata: {
        stepNumber: number;
        questionType?: string;
        isQuizStep?: boolean;
        hasScoring?: boolean;
        requiredSelections?: number;
        maxSelections?: number;
    };
}

/**
 * Dados essenciais do Quiz 21 Steps Complete
 */
export const QUIZ_21_COMPLETE_DATA: QuizFunnelData = {
    id: 'quiz21-complete-urgente',
    name: 'Quiz de Estilo Pessoal - 21 Etapas Completo',
    description: 'Quiz completo para descoberta do estilo pessoal com 21 etapas, incluindo coleta de dados, quiz pontuado, questões estratégicas e resultados personalizados.',
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
                        showNavigation: false,
                    },
                    properties: {
                        backgroundColor: '#F8F9FA',
                        textAlign: 'center',
                        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
                    },
                },
                {
                    id: 'step1-title',
                    type: 'text',
                    order: 1,
                    content: {
                        text: 'DESCUBRA SEU ESTILO PESSOAL',
                    },
                    properties: {
                        fontSize: '28px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#B89B7A',
                        marginBottom: '16px',
                    },
                },
                {
                    id: 'step1-description',
                    type: 'text',
                    order: 2,
                    content: {
                        text: 'Para começarmos, preciso saber como você gostaria de ser chamada:',
                    },
                    properties: {
                        fontSize: '18px',
                        textAlign: 'center',
                        color: '#374151',
                        marginBottom: '24px',
                    },
                },
                {
                    id: 'step1-input',
                    type: 'text-input',
                    order: 3,
                    content: {
                        placeholder: 'Digite seu primeiro nome',
                        required: true,
                    },
                    properties: {
                        fieldId: 'userName',
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '16px',
                    },
                },
            ],
            metadata: {
                stepNumber: 1,
                isQuizStep: false,
                hasScoring: false,
            },
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
                        showNavigation: true,
                    },
                    properties: {
                        backgroundColor: '#F8F9FA',
                        progressValue: 10,
                        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
                    },
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
                                imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735354/1_hpfhhm.webp',
                            },
                            {
                                id: 'classico_q1',
                                text: 'Conjunto alfaiatado neutro e elegante',
                                imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735354/2_dwdgux.webp',
                            },
                            {
                                id: 'contemporaneo_q1',
                                text: 'Look casual com jeans e blazer estruturado',
                                imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735354/3_akmxbk.webp',
                            },
                            {
                                id: 'elegante_q1',
                                text: 'Vestido midi em cor sólida e corte clássico',
                                imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735354/4_rprvty.webp',
                            },
                            {
                                id: 'romantico_q1',
                                text: 'Vestido com detalhes delicados em rosa suave',
                                imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735354/5_a8cgkl.webp',
                            },
                            {
                                id: 'sexy_q1',
                                text: 'Look ajustado preto com decote estratégico',
                                imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735354/6_t6eqhq.webp',
                            },
                            {
                                id: 'dramatico_q1',
                                text: 'Conjunto todo preto com linhas marcantes',
                                imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735354/7_ybgnrn.webp',
                            },
                            {
                                id: 'criativo_q1',
                                text: 'Look colorido e despojado com mix de estampas',
                                imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735354/8_rczwsm.webp',
                            },
                        ],
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
                            criativo_q1: 1,
                        },
                    },
                },
            ],
            metadata: {
                stepNumber: 2,
                questionType: 'multiple_choice_images',
                isQuizStep: true,
                hasScoring: true,
                requiredSelections: 3,
                maxSelections: 3,
            },
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
                        showProgress: true,
                    },
                    properties: {
                        backgroundColor: '#F8F9FA',
                        progressValue: 100,
                        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
                    },
                },
                {
                    id: 'step20-result-display',
                    type: 'result-display',
                    order: 1,
                    content: {
                        resultTitle: 'SEU ESTILO PREDOMINANTE É:',
                        dynamicResult: true,
                        showScore: true,
                        showRecommendations: true,
                    },
                    properties: {
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        padding: '32px',
                        textAlign: 'center',
                        showShadow: true,
                    },
                },
                {
                    id: 'step20-description',
                    type: 'text',
                    order: 2,
                    content: {
                        text: 'Baseado nas suas respostas, identificamos suas preferências de estilo e criamos recomendações personalizadas para você.',
                    },
                    properties: {
                        fontSize: '16px',
                        textAlign: 'center',
                        color: '#6B7280',
                        marginTop: '24px',
                        marginBottom: '32px',
                    },
                },
            ],
            metadata: {
                stepNumber: 20,
                isQuizStep: false,
                hasScoring: false,
            },
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
                        title: 'Transforme Seu Estilo Agora!',
                    },
                    properties: {
                        backgroundColor: '#F8F9FA',
                        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
                    },
                },
                {
                    id: 'step21-offer-title',
                    type: 'text',
                    order: 1,
                    content: {
                        text: 'GUIA COMPLETO DO SEU ESTILO PESSOAL',
                    },
                    properties: {
                        fontSize: '32px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#B89B7A',
                        marginBottom: '16px',
                    },
                },
                {
                    id: 'step21-price',
                    type: 'price-display',
                    order: 2,
                    content: {
                        originalPrice: 197,
                        currentPrice: 97,
                        currency: 'R$',
                        showDiscount: true,
                    },
                    properties: {
                        textAlign: 'center',
                        fontSize: '24px',
                        color: '#059669',
                        marginBottom: '24px',
                    },
                },
                {
                    id: 'step21-cta',
                    type: 'button',
                    order: 3,
                    content: {
                        buttonText: 'QUERO TRANSFORMAR MEU ESTILO AGORA',
                        buttonUrl: 'https://checkout.stylequest.com.br/oferta-especial',
                    },
                    properties: {
                        backgroundColor: '#B89B7A',
                        textColor: '#FFFFFF',
                        borderRadius: '8px',
                        width: '100%',
                        padding: '16px 24px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                    },
                },
            ],
            metadata: {
                stepNumber: 21,
                isQuizStep: false,
                hasScoring: false,
            },
        },
    ],
};

/**
 * Cria o funil via FunnelUnifiedService (com autenticação)
 */
export async function createQuiz21CompleteViaService(): Promise<string | null> {
    try {
        console.log('🚀 Criando Quiz 21 Complete via serviço unificado...');

        // Verificar se usuário está autenticado
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error('❌ Usuário não autenticado:', authError);
            throw new Error('É necessário estar logado para criar funis');
        }

        // Importar serviço dinamicamente
        const { FunnelUnifiedService } = await import('@/services/FunnelUnifiedService');
        const funnelService = FunnelUnifiedService.getInstance();

        // Criar funil
        const unifiedFunnelData = {
            id: QUIZ_21_COMPLETE_DATA.id,
            name: QUIZ_21_COMPLETE_DATA.name,
            description: QUIZ_21_COMPLETE_DATA.description,
            category: QUIZ_21_COMPLETE_DATA.settings.category,
            userId: user.id,
            isPublished: true,
            version: 2,
            templateId: QUIZ_21_COMPLETE_DATA.settings.templateId,
            isFromTemplate: true,
            settings: {
                ...QUIZ_21_COMPLETE_DATA.settings,
                theme: QUIZ_21_COMPLETE_DATA.settings.theme,
                branding: QUIZ_21_COMPLETE_DATA.settings.theme,
                seo: QUIZ_21_COMPLETE_DATA.settings.seo
            },
            context: {
                currentStepId: QUIZ_21_COMPLETE_DATA.pages[0]?.id || 'step-1',
                totalSteps: QUIZ_21_COMPLETE_DATA.pages.length,
                completedSteps: 0,
                userProgress: {},
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            } as any,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const createdFunnel = await funnelService.createFunnel(unifiedFunnelData);

        // Salvar páginas usando updateFunnel com páginas incluídas
        await funnelService.updateFunnel(createdFunnel.id, {
            pages: QUIZ_21_COMPLETE_DATA.pages.map(page => ({
                id: page.id,
                type: page.page_type,
                order: page.page_order,
                title: page.title,
                blocks: page.blocks,
                metadata: page.metadata || {}
            }))
        }, user?.id || 'anonymous');

        console.log(`✅ Quiz 21 Complete criado: ${createdFunnel.id}`);
        return createdFunnel.id;

    } catch (error) {
        console.error('❌ Erro ao criar quiz via serviço:', error);
        return null;
    }
}

/**
 * Testa se o funil foi criado corretamente
 */
export async function testQuiz21Complete(funnelId: string): Promise<boolean> {
    try {
        console.log('🧪 Testando Quiz 21 Complete...');

        // Verificar se funil existe
        const { data: funnel, error: funnelError } = await supabase
            .from('funnels')
            .select('*')
            .eq('id', funnelId)
            .single();

        if (funnelError || !funnel) {
            console.error('❌ Funil não encontrado:', funnelError);
            return false;
        }

        // Verificar páginas
        const { data: pages, error: pagesError } = await supabase
            .from('funnel_pages')
            .select('*')
            .eq('funnel_id', funnelId)
            .order('page_order');

        if (pagesError || !pages || pages.length === 0) {
            console.error('❌ Páginas não encontradas:', pagesError);
            return false;
        }

        console.log(`✅ Teste aprovado - Funil: ${funnel.name}, Páginas: ${pages.length}`);
        return true;

    } catch (error) {
        console.error('❌ Erro no teste:', error);
        return false;
    }
}