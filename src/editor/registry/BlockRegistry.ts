/**
 * 🎯 BLOCK REGISTRY - Sistema de Componentes Modulares
 * 
 * Registry centralizado que mapeia tipos de blocos para componentes React.
 * Base

do 100% no template quiz21StepsComplete.ts
 * 
 * COMPONENTES SUPORTADOS (21 etapas):
 * - Step 1: quiz-intro-header, form-input, button
 * - Steps 2-11: quiz-question, quiz-options, quiz-navigation
 * - Step 12: transition (loading)
 * - Steps 13-18: quiz-strategic-question, radio-options
 * - Step 19: transition-result
 * - Step 20: result-display, result-secondary-list
 * - Step 21: offer-card, offer-urgency, checkout-button
 */

import React from 'react';
import { BlockData } from '@/editor/hooks/useStepBlocks';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface BlockComponentProps {
    data: BlockData;
    isSelected: boolean;
    isEditable: boolean;
    onSelect: () => void;
    onUpdate: (updates: Partial<BlockData>) => void;
}

export interface BlockDefinition {
    type: string;
    label: string;
    icon: string;
    category: 'intro' | 'question' | 'transition' | 'result' | 'offer' | 'utility';
    description: string;
    defaultProps: {
        content?: Record<string, any>;
        properties?: Record<string, any>;
    };
    schema?: Record<string, any>; // JSON Schema para validação
}

// ============================================================================
// BLOCK DEFINITIONS - BASEADO NO QUIZ 21 ETAPAS
// ============================================================================

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
    // ========================================================================
    // STEP 1 - INTRO COMPONENTS
    // ========================================================================
    {
        type: 'quiz-intro-header',
        label: 'Header do Quiz',
        icon: '📝',
        category: 'intro',
        description: 'Título principal da introdução do quiz',
        defaultProps: {
            content: {
                title: 'Bem-vinda',
                subtitle: 'Descubra seu estilo pessoal'
            },
            properties: {
                alignment: 'center',
                fontSize: '2xl',
                fontWeight: 'bold',
                textColor: '#432818',
                backgroundColor: '#FAF9F7'
            }
        }
    },
    {
        type: 'text',
        label: 'Texto Descritivo',
        icon: '📄',
        category: 'intro',
        description: 'Bloco de texto com formatação',
        defaultProps: {
            content: {
                text: 'Texto descritivo...',
                html: '<p>Texto com <strong>formatação</strong></p>'
            },
            properties: {
                fontSize: 'base',
                textColor: '#334155',
                lineHeight: '1.6',
                marginBottom: '1rem'
            }
        }
    },
    {
        type: 'form-input',
        label: 'Campo de Input',
        icon: '📥',
        category: 'intro',
        description: 'Campo para coleta de dados (nome, email, etc)',
        defaultProps: {
            content: {
                label: 'Como posso te chamar?',
                placeholder: 'Digite seu nome...',
                type: 'text'
            },
            properties: {
                required: true,
                variableName: 'userName',
                validation: 'text',
                minLength: 2,
                maxLength: 50
            }
        }
    },
    {
        type: 'button',
        label: 'Botão de Ação',
        icon: '🔘',
        category: 'intro',
        description: 'Botão para navegação ou ação',
        defaultProps: {
            content: {
                text: 'Começar Quiz',
                icon: 'arrow-right'
            },
            properties: {
                variant: 'primary',
                size: 'lg',
                fullWidth: true,
                action: 'next',
                backgroundColor: '#3B82F6',
                textColor: '#FFFFFF'
            }
        }
    },

    // ========================================================================
    // STEPS 2-11 - QUESTION COMPONENTS
    // ========================================================================
    {
        type: 'quiz-question',
        label: 'Pergunta do Quiz',
        icon: '❓',
        category: 'question',
        description: 'Bloco de pergunta com múltiplas opções',
        defaultProps: {
            content: {
                questionNumber: 'Pergunta X de 10',
                questionText: 'Qual das opções abaixo mais combina com você?',
                subtitle: 'Selecione 3 opções'
            },
            properties: {
                requiredSelections: 3,
                multipleChoice: true,
                showCounter: true,
                fontSize: 'xl',
                fontWeight: 'semibold'
            }
        }
    },
    {
        type: 'quiz-options',
        label: 'Opções de Resposta',
        icon: '☑️',
        category: 'question',
        description: 'Grid de opções clicáveis com imagens',
        defaultProps: {
            content: {
                options: [
                    {
                        id: 'opt-1',
                        text: 'Opção 1',
                        image: 'https://via.placeholder.com/300',
                        value: 'romantico',
                        points: 1
                    },
                    {
                        id: 'opt-2',
                        text: 'Opção 2',
                        image: 'https://via.placeholder.com/300',
                        value: 'classico',
                        points: 1
                    }
                ]
            },
            properties: {
                columns: 3,
                gap: '1rem',
                aspectRatio: '1/1',
                hoverEffect: 'scale',
                selectedBorderColor: '#3B82F6',
                selectedBorderWidth: '3px'
            }
        }
    },
    {
        type: 'quiz-navigation',
        label: 'Navegação do Quiz',
        icon: '➡️',
        category: 'question',
        description: 'Botões de navegação (Voltar/Próximo)',
        defaultProps: {
            content: {
                backText: 'Voltar',
                nextText: 'Próxima Pergunta',
                disabledText: 'Selecione 3 opções para continuar'
            },
            properties: {
                showBack: true,
                showNext: true,
                disableNextUntilComplete: true,
                position: 'bottom-center',
                spacing: '1rem'
            }
        }
    },

    // ========================================================================
    // STEPS 12, 19 - TRANSITION COMPONENTS
    // ========================================================================
    {
        type: 'transition',
        label: 'Tela de Transição',
        icon: '⏳',
        category: 'transition',
        description: 'Loading/transição entre etapas',
        defaultProps: {
            content: {
                title: 'Analisando suas respostas...',
                messages: [
                    'Processando suas preferências',
                    'Identificando seu estilo',
                    'Preparando resultado personalizado'
                ]
            },
            properties: {
                duration: 3000,
                autoProgress: true,
                showProgress: true,
                backgroundColor: '#FAF9F7',
                loaderType: 'dots'
            }
        }
    },
    {
        type: 'transition-result',
        label: 'Transição para Resultado',
        icon: '🔄',
        category: 'transition',
        description: 'Transição especial antes do resultado',
        defaultProps: {
            content: {
                title: 'Preparando seu resultado...',
                subtitle: 'Em alguns segundos você descobrirá seu estilo predominante'
            },
            properties: {
                duration: 2000,
                autoProgress: true,
                showAnimation: true,
                animationType: 'fade-in'
            }
        }
    },

    // ========================================================================
    // STEP 20 - RESULT COMPONENTS
    // ========================================================================
    {
        type: 'result-calculation',
        label: 'Cálculo de Resultados',
        icon: '🧮',
        category: 'result',
        description: 'Sistema híbrido de cálculo e processamento de resultados do quiz',
        defaultProps: {
            content: {},
            properties: {
                calculationMethod: 'weighted_sum',
                scoreMapping: {
                    romantico: { min: 0, max: 100, label: 'Romântico' },
                    classico: { min: 0, max: 100, label: 'Clássico' },
                    moderno: { min: 0, max: 100, label: 'Moderno' },
                    criativo: { min: 0, max: 100, label: 'Criativo' },
                    dramatico: { min: 0, max: 100, label: 'Dramático' }
                },
                resultLogic: {
                    winnerSelection: 'highest_score',
                    tieBreaker: 'secondary_scores',
                    minThreshold: 20
                },
                leadCapture: {
                    id: 'step20-form',
                    type: 'lead-form',
                    properties: {
                        fields: ['name', 'email', 'phone'],
                        submitText: 'Receber Guia Gratuito'
                    }
                }
            }
        },
        schema: {
            type: 'object',
            properties: {
                calculationMethod: {
                    type: 'string',
                    enum: ['weighted_sum', 'percentage', 'ranking'],
                    title: 'Método de Cálculo'
                },
                scoreMapping: {
                    type: 'object',
                    title: 'Mapeamento de Pontuações',
                    additionalProperties: {
                        type: 'object',
                        properties: {
                            min: { type: 'number', title: 'Mínimo' },
                            max: { type: 'number', title: 'Máximo' },
                            label: { type: 'string', title: 'Label' }
                        }
                    }
                },
                resultLogic: {
                    type: 'object',
                    title: 'Lógica de Resultado',
                    properties: {
                        winnerSelection: {
                            type: 'string',
                            enum: ['highest_score', 'threshold_based'],
                            title: 'Seleção do Vencedor'
                        },
                        tieBreaker: {
                            type: 'string',
                            enum: ['secondary_scores', 'random', 'first_encountered'],
                            title: 'Critério de Desempate'
                        },
                        minThreshold: {
                            type: 'number',
                            title: 'Limite Mínimo (%)',
                            minimum: 0,
                            maximum: 100
                        }
                    }
                }
            }
        }
    },
    {
        type: 'result-headline',
        label: 'Resultado Principal',
        icon: '🏆',
        category: 'result',
        description: 'Exibição do resultado principal do quiz',
        defaultProps: {
            content: {
                title: '{userName}, seu estilo é:',
                resultVariable: 'dominantStyle',
                celebrationEmoji: '🎉'
            },
            properties: {
                fontSize: '3xl',
                fontWeight: 'bold',
                textAlign: 'center',
                showConfetti: true,
                animateIn: true
            }
        }
    },
    {
        type: 'result-secondary-list',
        label: 'Lista de Características',
        icon: '📋',
        category: 'result',
        description: 'Lista de características ou estilos secundários',
        defaultProps: {
            content: {
                title: 'Suas características:',
                items: [
                    'Característica 1',
                    'Característica 2',
                    'Característica 3'
                ]
            },
            properties: {
                layout: 'vertical',
                iconType: 'checkmark',
                iconColor: '#10B981',
                spacing: '0.5rem'
            }
        }
    },
    {
        type: 'result-description',
        label: 'Descrição do Resultado',
        icon: '📝',
        category: 'result',
        description: 'Descrição detalhada do resultado',
        defaultProps: {
            content: {
                text: 'Baseado nas suas respostas, você tem características...'
            },
            properties: {
                fontSize: 'base',
                lineHeight: '1.8',
                textAlign: 'left',
                backgroundColor: '#F9FAFB',
                padding: '1.5rem',
                borderRadius: '0.5rem'
            }
        }
    },

    // ========================================================================
    // STEP 21 - OFFER COMPONENTS
    // ========================================================================
    {
        type: 'offer-core',
        label: 'Oferta Principal',
        icon: '🎁',
        category: 'offer',
        description: 'Card da oferta principal',
        defaultProps: {
            content: {
                title: 'Transforme Seu Guarda-Roupa',
                description: 'Consultoria personalizada baseada no seu estilo',
                image: 'https://via.placeholder.com/600x400',
                price: 'R$ 497',
                originalPrice: 'R$ 997',
                discount: '50% OFF'
            },
            properties: {
                layout: 'horizontal',
                showBadge: true,
                badgeText: 'OFERTA LIMITADA',
                badgeColor: '#EF4444',
                borderColor: '#B89B7A',
                borderWidth: '2px'
            }
        }
    },
    {
        type: 'offer-urgency',
        label: 'Urgência/Escassez',
        icon: '⏰',
        category: 'offer',
        description: 'Contador de urgência ou escassez',
        defaultProps: {
            content: {
                title: 'Esta oferta expira em:',
                type: 'countdown',
                endTime: '+24h',
                urgencyMessage: 'Restam apenas {count} vagas!'
            },
            properties: {
                showCountdown: true,
                countdownSize: 'lg',
                backgroundColor: '#FEF2F2',
                textColor: '#991B1B',
                pulsate: true
            }
        }
    },
    {
        type: 'checkout-button',
        label: 'Botão de Checkout',
        icon: '💳',
        category: 'offer',
        description: 'Botão para finalizar compra',
        defaultProps: {
            content: {
                text: 'QUERO TRANSFORMAR MEU ESTILO',
                subtext: 'Pagamento 100% seguro',
                icon: 'lock'
            },
            properties: {
                size: 'xl',
                fullWidth: true,
                variant: 'cta',
                backgroundColor: '#10B981',
                textColor: '#FFFFFF',
                fontSize: 'lg',
                fontWeight: 'bold',
                pulseAnimation: true
            }
        }
    },

    // ========================================================================
    // UTILITY COMPONENTS (Usados em múltiplas etapas)
    // ========================================================================
    {
        type: 'image',
        label: 'Imagem',
        icon: '🖼️',
        category: 'utility',
        description: 'Bloco de imagem responsiva',
        defaultProps: {
            content: {
                url: 'https://via.placeholder.com/800x600',
                alt: 'Imagem descritiva'
            },
            properties: {
                width: '100%',
                aspectRatio: '16/9',
                objectFit: 'cover',
                borderRadius: '0.5rem',
                lazyLoad: true
            }
        }
    },
    {
        type: 'divider',
        label: 'Divisor',
        icon: '➖',
        category: 'utility',
        description: 'Linha divisória',
        defaultProps: {
            content: {},
            properties: {
                width: '100%',
                height: '1px',
                backgroundColor: '#E5E7EB',
                margin: '2rem 0'
            }
        }
    },
    {
        type: 'spacer',
        label: 'Espaçamento',
        icon: '⬜',
        category: 'utility',
        description: 'Espaço vertical/horizontal',
        defaultProps: {
            content: {},
            properties: {
                height: '2rem',
                width: '100%'
            }
        }
    },
    {
        type: 'progress-bar',
        label: 'Barra de Progresso',
        icon: '📊',
        category: 'utility',
        description: 'Barra de progresso do quiz',
        defaultProps: {
            content: {
                currentStep: 1,
                totalSteps: 21,
                showPercentage: true
            },
            properties: {
                height: '8px',
                backgroundColor: '#E5E7EB',
                fillColor: '#3B82F6',
                borderRadius: '9999px',
                position: 'top',
                showLabels: true
            }
        }
    }
];

// ============================================================================
// REGISTRY MAP (será preenchido com componentes React reais)
// ============================================================================

export const BLOCK_REGISTRY: Record<string, React.FC<BlockComponentProps>> = {};

/**
 * Registrar componente no registry
 */
export function registerBlock(type: string, component: React.FC<BlockComponentProps>) {
    if (BLOCK_REGISTRY[type]) {
        console.warn(`⚠️ Componente ${type} já está registrado. Sobrescrevendo...`);
    }

    BLOCK_REGISTRY[type] = component;
    console.log(`✅ Componente ${type} registrado com sucesso`);
}

/**
 * Obter componente do registry
 */
export function getBlockComponent(type: string): React.FC<BlockComponentProps> | null {
    const component = BLOCK_REGISTRY[type];

    if (!component) {
        console.warn(`⚠️ Componente ${type} não encontrado no registry`);
        return null;
    }

    return component;
}

/**
 * Obter definição de bloco
 */
export function getBlockDefinition(type: string): BlockDefinition | null {
    const definition = BLOCK_DEFINITIONS.find(def => def.type === type);

    if (!definition) {
        console.warn(`⚠️ Definição para ${type} não encontrada`);
        return null;
    }

    return definition;
}

/**
 * Listar blocos por categoria
 */
export function getBlocksByCategory(category: BlockDefinition['category']): BlockDefinition[] {
    return BLOCK_DEFINITIONS.filter(def => def.category === category);
}

/**
 * Validar se um tipo de bloco existe
 */
export function isValidBlockType(type: string): boolean {
    return BLOCK_DEFINITIONS.some(def => def.type === type);
}
