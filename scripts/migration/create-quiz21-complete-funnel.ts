/**
 * 🚀 MIGRAÇÃO URGENTE: Quiz 21 Steps Complete para Novo Sistema
 * 
 * Este script converte o template quiz21StepsComplete.ts para o formato
 * do sistema atual de funis no Supabase.
 */

import { createClient } from '@supabase/supabase-js';
import { QUIZ_STYLE_21_STEPS_TEMPLATE, QUIZ_GLOBAL_CONFIG } from '../../src/templates/quiz21StepsComplete';

// Configurações do Supabase
const SUPABASE_URL = 'https://pwtjuuhchtbzttrzoutw.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGp1dWhjaHRienR0cnpvdXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDQ0NjAsImV4cCI6MjA2NzkyMDQ2MH0.EP0qLHBZK8nyxcod0FEVRQln4R_yVSWEGQwuIbJfP_w';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface FunnelData {
    id: string;
    name: string;
    description: string;
    user_id?: string;
    is_published: boolean;
    version: number;
    settings: {
        category: string;
        templateId: string;
        theme: any;
        seo: any;
        analytics: any;
        utm: any;
        branding: any;
        quiz_config: any;
        persistence: any;
    };
    created_at?: string;
    updated_at?: string;
}

interface FunnelPageData {
    id: string;
    funnel_id: string;
    page_type: string;
    page_order: number;
    title: string;
    blocks: any[];
    metadata: {
        stepNumber: number;
        questionType?: string;
        isQuizStep?: boolean;
        hasScoring?: boolean;
        requiredSelections?: number;
        maxSelections?: number;
    };
    created_at?: string;
    updated_at?: string;
}

/**
 * Gera ID único
 */
function generateId(): string {
    return `funnel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Converte o template para o formato do Supabase
 */
async function convertTemplateToFunnel(): Promise<{ funnel: FunnelData; pages: FunnelPageData[] }> {
    console.log('🔄 Convertendo template quiz21StepsComplete para formato Supabase...');

    // 1. Criar dados do funil principal
    const funnelId = generateId();
    const now = new Date().toISOString();

    const funnel: FunnelData = {
        id: funnelId,
        name: 'Quiz de Estilo Pessoal - 21 Etapas Completo',
        description: 'Quiz completo para descoberta do estilo pessoal com 21 etapas, incluindo coleta de dados, quiz pontuado, questões estratégicas e resultados personalizados.',
        is_published: true,
        version: 2,
        settings: {
            category: 'quiz',
            templateId: 'quiz21StepsComplete',
            theme: QUIZ_GLOBAL_CONFIG.branding,
            seo: QUIZ_GLOBAL_CONFIG.seo,
            analytics: QUIZ_GLOBAL_CONFIG.analytics,
            utm: QUIZ_GLOBAL_CONFIG.utm,
            branding: QUIZ_GLOBAL_CONFIG.branding,
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
            persistence: {
                enabled: true,
                autoSave: true,
                storage: ['localStorage', 'supabase'],
                compression: true
            }
        },
        created_at: now,
        updated_at: now
    };

    // 2. Converter cada etapa para páginas
    const pages: FunnelPageData[] = [];

    Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach(([stepKey, blocks], index) => {
        const stepNumber = parseInt(stepKey.replace('step-', ''));

        let pageType = 'content';
        let questionType = undefined;
        let isQuizStep = false;
        let hasScoring = false;
        let requiredSelections = undefined;
        let maxSelections = undefined;

        // Determinar tipo da página baseado no conteúdo
        if (stepNumber === 1) {
            pageType = 'lead_capture';
        } else if (stepNumber >= 2 && stepNumber <= 11) {
            pageType = 'quiz_question';
            isQuizStep = true;
            hasScoring = true;
            requiredSelections = 3;
            maxSelections = 3;
            questionType = 'multiple_choice_images';
        } else if (stepNumber === 12 || stepNumber === 19) {
            pageType = 'transition';
        } else if (stepNumber >= 13 && stepNumber <= 18) {
            pageType = 'strategic_question';
            isQuizStep = true;
            questionType = 'single_choice';
            requiredSelections = 1;
            maxSelections = 1;
        } else if (stepNumber === 20) {
            pageType = 'result';
        } else if (stepNumber === 21) {
            pageType = 'offer';
        }

        // Determinar título da página
        let title = `Etapa ${stepNumber}`;
        const headerBlock = blocks.find(b => b.type === 'quiz-intro-header');
        if (headerBlock?.content?.title) {
            title = headerBlock.content.title;
        } else if (blocks.find(b => b.type === 'options-grid')?.content?.question) {
            title = blocks.find(b => b.type === 'options-grid')?.content?.question || title;
        }

        const page: FunnelPageData = {
            id: `${funnelId}-page-${stepNumber}`,
            funnel_id: funnelId,
            page_type: pageType,
            page_order: stepNumber,
            title: title,
            blocks: blocks.map(block => ({
                ...block,
                // Garantir que todas as propriedades estejam serializáveis
                properties: {
                    ...block.properties,
                    // Converter funções para strings se existirem
                    scoreValues: block.properties?.scoreValues ?
                        typeof block.properties.scoreValues === 'object' ?
                            block.properties.scoreValues : {} : undefined
                }
            })),
            metadata: {
                stepNumber,
                questionType,
                isQuizStep,
                hasScoring,
                requiredSelections,
                maxSelections
            },
            created_at: now,
            updated_at: now
        };

        pages.push(page);
    });

    console.log(`✅ Convertido: 1 funil + ${pages.length} páginas`);

    return { funnel, pages };
}

/**
 * Salva o funil no Supabase
 */
async function saveFunnelToSupabase(funnel: FunnelData, pages: FunnelPageData[]): Promise<boolean> {
    try {
        console.log('💾 Salvando funil no Supabase...');

        // 1. Salvar funil principal
        const { error: funnelError } = await supabase
            .from('funnels')
            .upsert([funnel])
            .select();

        if (funnelError) {
            console.error('❌ Erro ao salvar funil:', funnelError);
            return false;
        }

        console.log(`✅ Funil salvo: ${funnel.id}`);

        // 2. Salvar páginas
        const { error: pagesError } = await supabase
            .from('funnel_pages')
            .upsert(pages)
            .select();

        if (pagesError) {
            console.error('❌ Erro ao salvar páginas:', pagesError);
            return false;
        }

        console.log(`✅ ${pages.length} páginas salvas`);

        return true;
    } catch (error) {
        console.error('❌ Erro geral ao salvar:', error);
        return false;
    }
}

/**
 * Verifica se as tabelas existem
 */
async function checkTables(): Promise<boolean> {
    try {
        console.log('🔍 Verificando tabelas...');

        // Testar tabela funnels
        const { error: funnelsError } = await supabase
            .from('funnels')
            .select('id')
            .limit(1);

        if (funnelsError) {
            console.error('❌ Tabela funnels não existe:', funnelsError.message);
            return false;
        }

        // Testar tabela funnel_pages
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
 * Executa a migração completa
 */
async function runMigration(): Promise<void> {
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

        // 2. Converter template
        const { funnel, pages } = await convertTemplateToFunnel();

        // 3. Salvar no Supabase
        const saved = await saveFunnelToSupabase(funnel, pages);

        if (saved) {
            console.log('\n🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
            console.log('================================================');
            console.log(`📋 Funil ID: ${funnel.id}`);
            console.log(`📄 Total de páginas: ${pages.length}`);
            console.log(`🎯 Categoria: ${funnel.settings.category}`);
            console.log(`🔗 Template ID: ${funnel.settings.templateId}`);
            console.log('\n🌐 Acesse em:');
            console.log(`• Editor: http://localhost:8080/editor-pro/${funnel.id}`);
            console.log(`• Preview: http://localhost:8080/preview/${funnel.id}`);
        } else {
            console.log('\n❌ FALHA NA MIGRAÇÃO');
            console.log('Verifique os logs de erro acima');
        }

    } catch (error) {
        console.error('\n❌ ERRO CRÍTICO NA MIGRAÇÃO:', error);
    }
}

/**
 * Executa se chamado diretamente
 */
if (require.main === module) {
    runMigration().catch(console.error);
}

export { runMigration, convertTemplateToFunnel, saveFunnelToSupabase };