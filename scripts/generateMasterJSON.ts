/**
 * 🚀 GERADOR DE JSON MASTER CORRETO
 * 
 * Este script converte quiz21StepsComplete.ts para JSON master válido
 * compatível com HybridTemplateService
 */

import * as fs from 'fs';
import * as path from 'path';

// Importar dados do TypeScript
import {
    QUIZ_STYLE_21_STEPS_TEMPLATE,
    QUIZ_GLOBAL_CONFIG
} from '../src/templates/quiz21StepsComplete';

// Definir interfaces compatíveis
interface StepBehaviorConfig {
    autoAdvance: boolean;
    autoAdvanceDelay: number;
    showProgress: boolean;
    allowBack: boolean;
}

interface StepValidationConfig {
    type: 'input' | 'selection' | 'none' | 'transition';
    required: boolean;
    requiredSelections?: number;
    maxSelections?: number;
    minLength?: number;
    message: string;
}

interface StepTemplate {
    metadata: {
        name: string;
        description: string;
        type: string;
        category: string;
    };
    behavior: StepBehaviorConfig;
    validation: StepValidationConfig;
    blocks: any[];
}

interface MasterTemplate {
    templateVersion: string;
    metadata: {
        id: string;
        name: string;
        description: string;
        version: string;
        category: string;
        templateType: string;
        createdAt: string;
        updatedAt: string;
        author: string;
    };
    globalConfig: {
        branding: any;
        navigation: {
            autoAdvanceSteps: number[];
            manualAdvanceSteps: number[];
            transitionSteps: number[];
            autoAdvanceDelay: number;
        };
        validation: {
            rules: Record<string, any>;
        };
        scoring: {
            categories: string[];
            algorithm: any;
        };
        analytics: any;
    };
    steps: Record<string, StepTemplate>;
}

// 🎯 APLICAR REGRAS GLOBAIS (mesmo do HybridTemplateService)
function getGlobalRules(stepNumber: number): { behavior: StepBehaviorConfig; validation: StepValidationConfig } {
    // Etapa 1: Input nome (manual)
    if (stepNumber === 1) {
        return {
            behavior: {
                autoAdvance: false,
                autoAdvanceDelay: 0,
                showProgress: false,
                allowBack: false,
            },
            validation: {
                type: 'input',
                required: true,
                minLength: 2,
                message: 'Digite seu nome para continuar',
            },
        };
    }

    // Etapas 2-11: 3 seleções obrigatórias + auto-avanço após 3ª seleção
    if (stepNumber >= 2 && stepNumber <= 11) {
        return {
            behavior: {
                autoAdvance: true,
                autoAdvanceDelay: 1500,
                showProgress: true,
                allowBack: true,
            },
            validation: {
                type: 'selection',
                required: true,
                requiredSelections: 3,
                maxSelections: 3,
                message: 'Selecione 3 opções para continuar',
            },
        };
    }

    // Etapas 12 e 19: Páginas de transição - botão "Continuar" ativo (manual)
    if (stepNumber === 12 || stepNumber === 19) {
        return {
            behavior: {
                autoAdvance: false,
                autoAdvanceDelay: 0,
                showProgress: true,
                allowBack: true,
            },
            validation: {
                type: 'transition',
                required: false,
                message: 'Clique em "Continuar" para prosseguir',
            },
        };
    }

    // Etapas 13-18: 1 opção obrigatória + botão "Avançar" manual após seleção
    if (stepNumber >= 13 && stepNumber <= 18) {
        return {
            behavior: {
                autoAdvance: false,
                autoAdvanceDelay: 0,
                showProgress: true,
                allowBack: true,
            },
            validation: {
                type: 'selection',
                required: true,
                requiredSelections: 1,
                maxSelections: 1,
                message: 'Selecione uma opção para continuar',
            },
        };
    }

    // Outras etapas (20, 21, etc.)
    return {
        behavior: {
            autoAdvance: false,
            autoAdvanceDelay: 0,
            showProgress: true,
            allowBack: stepNumber < 21,
        },
        validation: {
            type: 'none',
            required: false,
            message: '',
        },
    };
}

// 🔍 INFERIR TIPO DA ETAPA
function inferStepType(stepNumber: number): string {
    if (stepNumber === 1) return 'intro';
    if (stepNumber >= 2 && stepNumber <= 11) return 'question';
    if (stepNumber === 12 || stepNumber === 19) return 'transition';
    if (stepNumber >= 13 && stepNumber <= 18) return 'strategic';
    if (stepNumber === 20) return 'result';
    if (stepNumber === 21) return 'offer';
    return 'other';
}

// 📝 OBTER NOME E DESCRIÇÃO DA ETAPA
function getStepMetadata(stepNumber: number) {
    const stepType = inferStepType(stepNumber);

    const stepNames: Record<number, string> = {
        1: 'Coleta do Nome',
        2: 'Q1 - Estilo de Roupa',
        3: 'Q2 - Cores Favoritas',
        4: 'Q3 - Ocasiões',
        5: 'Q4 - Acessórios',
        6: 'Q5 - Tecidos',
        7: 'Q6 - Silhuetas',
        8: 'Q7 - Estampas',
        9: 'Q8 - Sapatos',
        10: 'Q9 - Bolsas',
        11: 'Q10 - Inspirações',
        12: 'Transição para Estratégicas',
        13: 'E1 - Prioridade no Look',
        14: 'E2 - Orçamento',
        15: 'E3 - Lifestyle',
        16: 'E4 - Corpo e Conforto',
        17: 'E5 - Personalidade',
        18: 'E6 - Objetivos',
        19: 'Transição para Resultado',
        20: 'Resultado do Quiz',
        21: 'Página de Oferta'
    };

    const stepDescriptions: Record<number, string> = {
        1: 'Página inicial para coleta do nome do usuário',
        2: 'Primeira questão sobre preferências de estilo de roupa',
        3: 'Segunda questão sobre cores favoritas e paleta pessoal',
        4: 'Terceira questão sobre ocasiões e contextos de uso',
        5: 'Quarta questão sobre acessórios e complementos',
        6: 'Quinta questão sobre tecidos e texturas preferidas',
        7: 'Sexta questão sobre silhuetas e cortes',
        8: 'Sétima questão sobre estampas e padronagens',
        9: 'Oitava questão sobre calçados e estilo dos pés',
        10: 'Nona questão sobre bolsas e acessórios funcionais',
        11: 'Décima questão sobre inspirações e referências',
        12: 'Página de transição entre questões pontuadas e estratégicas',
        13: 'Primeira questão estratégica sobre prioridades no visual',
        14: 'Segunda questão estratégica sobre orçamento e investimento',
        15: 'Terceira questão estratégica sobre lifestyle e rotina',
        16: 'Quarta questão estratégica sobre corpo e conforto',
        17: 'Quinta questão estratégica sobre personalidade',
        18: 'Sexta questão estratégica sobre objetivos com o estilo',
        19: 'Página de transição para apresentação do resultado',
        20: 'Página de resultado com estilo predominante calculado',
        21: 'Página de oferta de consultoria personalizada'
    };

    return {
        name: stepNames[stepNumber] || `Step ${stepNumber}`,
        description: stepDescriptions[stepNumber] || `Etapa ${stepNumber} do quiz`,
        type: stepType,
        category: stepNumber <= 11 ? 'quiz-question' :
            stepNumber <= 18 ? 'strategic-question' :
                stepNumber === 12 || stepNumber === 19 ? 'transition' :
                    stepNumber === 20 ? 'result' :
                        stepNumber === 21 ? 'offer' : 'other'
    };
}

// 🚀 GERADOR PRINCIPAL
export function generateMasterJSON(): MasterTemplate {
    console.log('🚀 Gerando JSON Master correto...');

    // Validar se temos o template TypeScript
    if (!QUIZ_STYLE_21_STEPS_TEMPLATE) {
        throw new Error('❌ QUIZ_STYLE_21_STEPS_TEMPLATE não encontrado!');
    }

    const steps: Record<string, StepTemplate> = {};

    // Gerar todos os 21 steps
    Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach(stepKey => {
        const stepNumber = parseInt(stepKey.replace('step-', ''));
        const globalRules = getGlobalRules(stepNumber);
        const metadata = getStepMetadata(stepNumber);
        const blocks = QUIZ_STYLE_21_STEPS_TEMPLATE[stepKey];

        steps[stepKey] = {
            metadata,
            behavior: globalRules.behavior,
            validation: globalRules.validation,
            blocks: blocks || []
        };
    });

    // Construir configurações globais
    const globalConfig = {
        branding: {
            primaryColor: '#B89B7A',
            secondaryColor: '#432818',
            backgroundColor: '#FAF9F7',
            logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            logoAlt: 'Logo Gisele Galvão'
        },
        navigation: {
            autoAdvanceSteps: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            manualAdvanceSteps: [1, 13, 14, 15, 16, 17, 18, 20, 21],
            transitionSteps: [12, 19],
            autoAdvanceDelay: 1500
        },
        validation: {
            rules: {
                step1: {
                    type: 'input',
                    required: true,
                    minLength: 2,
                    message: 'Digite seu nome para continuar'
                },
                steps2to11: {
                    type: 'selection',
                    required: true,
                    requiredSelections: 3,
                    maxSelections: 3,
                    message: 'Selecione 3 opções para continuar'
                },
                steps13to18: {
                    type: 'selection',
                    required: true,
                    requiredSelections: 1,
                    maxSelections: 1,
                    message: 'Selecione uma opção para continuar'
                }
            }
        },
        scoring: {
            categories: [
                'Natural',
                'Clássico',
                'Contemporâneo',
                'Elegante',
                'Romântico',
                'Sexy',
                'Dramático',
                'Criativo'
            ],
            algorithm: {
                type: 'category-points',
                normalQuestionWeight: 1.0,
                strategicQuestionWeight: 0.0,
                minimumScoreDifference: 2,
                tieBreaker: 'first-selected'
            }
        },
        analytics: {
            enabled: true,
            trackingId: 'quiz-21-steps-complete',
            events: [
                'page_view',
                'step_completed',
                'option_selected',
                'quiz_completed'
            ]
        }
    };

    // Construir template master completo
    const masterTemplate: MasterTemplate = {
        templateVersion: '2.0.0',
        metadata: {
            id: 'quiz21StepsComplete',
            name: 'Quiz de Estilo Pessoal - 21 Etapas Completo',
            description: 'Template completo para descoberta do estilo pessoal com 21 etapas, incluindo coleta de dados, quiz pontuado, questões estratégicas e ofertas.',
            version: '2.0.0',
            category: 'quiz',
            templateType: 'quiz-complete',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            author: 'Gisele Galvão'
        },
        globalConfig,
        steps
    };

    console.log(`✅ JSON Master gerado com ${Object.keys(steps).length} steps`);
    return masterTemplate;
}

// 💾 SALVAR JSON MASTER
export function saveMasterJSON(): void {
    try {
        const masterTemplate = generateMasterJSON();
        const jsonContent = JSON.stringify(masterTemplate, null, 2);

        // Caminho para salvar
        const outputPath = path.join(process.cwd(), 'public/templates/quiz21-complete.json');
        const backupPath = path.join(process.cwd(), 'public/templates/quiz21-complete-backup.json');

        // Fazer backup do arquivo anterior se existir
        if (fs.existsSync(outputPath)) {
            fs.copyFileSync(outputPath, backupPath);
            console.log('📦 Backup criado:', backupPath);
        }

        // Salvar novo JSON
        fs.writeFileSync(outputPath, jsonContent, 'utf8');

        console.log('🎉 JSON Master salvo com sucesso!');
        console.log('📁 Local:', outputPath);
        console.log('📊 Tamanho:', (jsonContent.length / 1024).toFixed(2), 'KB');
        console.log('🔢 Steps incluídos:', Object.keys(masterTemplate.steps).length);

        // Validar JSON gerado
        validateGeneratedJSON(masterTemplate);

    } catch (error) {
        console.error('❌ Erro ao salvar JSON Master:', error);
        throw error;
    }
}

// ✅ VALIDAR JSON GERADO
function validateGeneratedJSON(masterTemplate: MasterTemplate): void {
    console.log('🔍 Validando JSON gerado...');

    const issues: string[] = [];

    // Validar estrutura básica
    if (!masterTemplate.templateVersion) issues.push('templateVersion ausente');
    if (!masterTemplate.metadata?.id) issues.push('metadata.id ausente');
    if (!masterTemplate.globalConfig) issues.push('globalConfig ausente');
    if (!masterTemplate.steps) issues.push('steps ausente');

    // Validar steps
    const stepKeys = Object.keys(masterTemplate.steps);
    if (stepKeys.length !== 21) {
        issues.push(`Esperado 21 steps, encontrados ${stepKeys.length}`);
    }

    // Validar estrutura de cada step
    stepKeys.forEach(stepKey => {
        const step = masterTemplate.steps[stepKey];
        if (!step.metadata) issues.push(`${stepKey}: metadata ausente`);
        if (!step.behavior) issues.push(`${stepKey}: behavior ausente`);
        if (!step.validation) issues.push(`${stepKey}: validation ausente`);
        if (!step.blocks) issues.push(`${stepKey}: blocks ausente`);
    });

    // Validar configurações globais
    if (!masterTemplate.globalConfig.navigation?.autoAdvanceSteps) {
        issues.push('globalConfig.navigation.autoAdvanceSteps ausente');
    }

    if (issues.length > 0) {
        console.warn('⚠️ Issues encontrados:');
        issues.forEach(issue => console.warn(`  - ${issue}`));
    } else {
        console.log('✅ JSON Master validado com sucesso!');
    }
}

// 🚀 EXECUTAR AUTOMATICAMENTE
console.log('🎯 === GERADOR DE JSON MASTER CORRETO ===');
saveMasterJSON();
console.log('✅ Processo concluído!');

export default {
    generateMasterJSON,
    saveMasterJSON,
    getGlobalRules,
    inferStepType,
    getStepMetadata
};