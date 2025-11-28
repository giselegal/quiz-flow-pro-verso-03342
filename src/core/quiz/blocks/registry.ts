/**
 * 🎯 BLOCK REGISTRY - Core Quiz System
 * 
 * Registry central para definições de blocos do quiz.
 * Fornece API para registro, busca e validação de tipos de blocos.
 * 
 * @version 1.0.0
 * @status PRODUCTION
 */

import type { BlockDefinition } from './types';
import { BlockCategoryEnum, PropertyTypeEnum } from './types';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Registry singleton para gerenciar definições de blocos
 */
class BlockRegistryClass {
    private definitions: Map<string, BlockDefinition> = new Map();
    private aliases: Map<string, string> = new Map();
    private categoriesCache: Map<string, BlockDefinition[]> = new Map();

    constructor() {
        appLogger.info('BlockRegistry initialized');
        this.registerDefaultBlocks();
    }

    /**
     * Registra blocos padrão do sistema
     */
    private registerDefaultBlocks(): void {
        // ============================================================================
        // PROGRESS & NAVIGATION
        // ============================================================================
        this.register({
            type: 'question-progress',
            name: 'Progresso da Questão',
            description: 'Barra de progresso mostrando avanço no quiz',
            category: BlockCategoryEnum.LAYOUT,
            properties: [
                {
                    key: 'showPercentage',
                    type: PropertyTypeEnum.BOOLEAN,
                    label: 'Mostrar percentual',
                    description: 'Exibir % de conclusão',
                    defaultValue: true
                },
                {
                    key: 'showStepCounter',
                    type: PropertyTypeEnum.BOOLEAN,
                    label: 'Mostrar contador de etapas',
                    description: 'Exibir "3 de 10"',
                    defaultValue: true
                },
                {
                    key: 'barColor',
                    type: PropertyTypeEnum.COLOR,
                    label: 'Cor da barra',
                    description: 'Cor de preenchimento',
                    defaultValue: '#3b82f6'
                }
            ],
            defaultProperties: {
                showPercentage: true,
                showStepCounter: true,
                barColor: '#3b82f6'
            }
        });

        this.register({
            type: 'question-navigation',
            name: 'Navegação de Questões',
            description: 'Botões de navegação (anterior/próximo)',
            category: BlockCategoryEnum.LAYOUT,
            properties: [
                {
                    key: 'showBackButton',
                    type: PropertyTypeEnum.BOOLEAN,
                    label: 'Mostrar botão Voltar',
                    description: 'Permitir voltar para questão anterior',
                    defaultValue: false
                },
                {
                    key: 'nextButtonText',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Texto botão Próximo',
                    description: 'Label do botão avançar',
                    defaultValue: 'Próximo'
                },
                {
                    key: 'backButtonText',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Texto botão Voltar',
                    description: 'Label do botão voltar',
                    defaultValue: 'Voltar'
                }
            ],
            defaultProperties: {
                showBackButton: false,
                nextButtonText: 'Próximo',
                backButtonText: 'Voltar'
            }
        });

        // ============================================================================
        // BLOCOS BÁSICOS
        // ============================================================================
        this.register({
            type: 'text',
            name: 'Texto',
            description: 'Bloco de texto simples',
            category: BlockCategoryEnum.CONTENT,
            properties: [
                {
                    key: 'content',
                    type: PropertyTypeEnum.TEXTAREA,
                    label: 'Conteúdo',
                    description: 'Texto a ser exibido',
                    defaultValue: 'Digite o texto aqui',
                    required: true
                }
            ],
            defaultProperties: {
                content: 'Digite o texto aqui'
            }
        });

        this.register({
            type: 'heading',
            name: 'Título',
            description: 'Bloco de título/cabeçalho',
            category: BlockCategoryEnum.CONTENT,
            properties: [
                {
                    key: 'text',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Texto do título',
                    description: 'Texto do cabeçalho',
                    defaultValue: 'Título',
                    required: true
                },
                {
                    key: 'level',
                    type: PropertyTypeEnum.NUMBER,
                    label: 'Nível',
                    description: 'Nível hierárquico (1-6)',
                    defaultValue: 2,
                    validation: {
                        min: 1,
                        max: 6
                    }
                }
            ],
            defaultProperties: {
                text: 'Título',
                level: 2
            }
        });

        this.register({
            type: 'image',
            name: 'Imagem',
            description: 'Bloco de imagem',
            category: BlockCategoryEnum.MEDIA,
            properties: [
                {
                    key: 'src',
                    type: PropertyTypeEnum.URL,
                    label: 'URL da imagem',
                    description: 'Caminho ou URL da imagem',
                    defaultValue: '',
                    required: true
                },
                {
                    key: 'alt',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Texto alternativo',
                    description: 'Descrição da imagem para acessibilidade',
                    defaultValue: ''
                }
            ],
            defaultProperties: {
                src: '',
                alt: ''
            }
        });

        this.register({
            type: 'button',
            name: 'Botão',
            description: 'Botão de ação/CTA',
            category: BlockCategoryEnum.CONTENT,
            properties: [
                {
                    key: 'text',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Texto do botão',
                    description: 'Texto exibido no botão',
                    defaultValue: 'Clique aqui',
                    required: true
                },
                {
                    key: 'url',
                    type: PropertyTypeEnum.URL,
                    label: 'URL',
                    description: 'Link de destino',
                    defaultValue: ''
                }
            ],
            defaultProperties: {
                text: 'Clique aqui',
                url: ''
            }
        });

        this.register({
            type: 'question',
            name: 'Questão',
            description: 'Bloco de pergunta do quiz',
            category: BlockCategoryEnum.QUESTION,
            properties: [
                {
                    key: 'questionText',
                    type: PropertyTypeEnum.TEXTAREA,
                    label: 'Texto da questão',
                    description: 'Pergunta a ser exibida',
                    defaultValue: 'Qual é a sua pergunta?',
                    required: true
                },
                {
                    key: 'multiSelect',
                    type: PropertyTypeEnum.BOOLEAN,
                    label: 'Seleção múltipla',
                    description: 'Permitir selecionar múltiplas opções',
                    defaultValue: false
                }
            ],
            defaultProperties: {
                questionText: 'Qual é a sua pergunta?',
                multiSelect: false
            }
        });

        this.register({
            type: 'question-title',
            name: 'Título da Questão',
            description: 'Título/cabeçalho da questão',
            category: BlockCategoryEnum.QUESTION,
            properties: [
                {
                    key: 'text',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Texto do título',
                    description: 'Título da questão',
                    defaultValue: 'Pergunta',
                    required: true
                }
            ],
            defaultProperties: {
                text: 'Pergunta'
            }
        });

        this.register({
            type: 'question-description',
            name: 'Descrição da Questão',
            description: 'Texto descritivo/explicativo da questão',
            category: BlockCategoryEnum.QUESTION,
            properties: [
                {
                    key: 'text',
                    type: PropertyTypeEnum.TEXTAREA,
                    label: 'Texto descritivo',
                    description: 'Contexto ou instruções',
                    defaultValue: 'Selecione a melhor opção',
                    required: true
                }
            ],
            defaultProperties: {
                text: 'Selecione a melhor opção'
            }
        });

        this.register({
            type: 'options-grid',
            name: 'Grade de Opções',
            description: 'Grade visual de opções de resposta',
            category: BlockCategoryEnum.QUESTION,
            properties: [
                {
                    key: 'options',
                    type: PropertyTypeEnum.ARRAY,
                    label: 'Opções',
                    description: 'Lista de opções',
                    defaultValue: [],
                    required: true
                },
                {
                    key: 'columns',
                    type: PropertyTypeEnum.NUMBER,
                    label: 'Colunas',
                    description: 'Número de colunas na grade',
                    defaultValue: 2,
                    validation: { min: 1, max: 4 }
                },
                {
                    key: 'multiSelect',
                    type: PropertyTypeEnum.BOOLEAN,
                    label: 'Seleção múltipla',
                    description: 'Permitir múltiplas seleções',
                    defaultValue: false
                }
            ],
            defaultProperties: {
                options: [],
                columns: 2,
                multiSelect: false
            }
        });

        this.register({
            type: 'form-input',
            name: 'Campo de Formulário',
            description: 'Campo de entrada de dados',
            category: BlockCategoryEnum.FORM,
            properties: [
                {
                    key: 'name',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Nome do campo',
                    description: 'Identificador único',
                    defaultValue: 'field',
                    required: true
                },
                {
                    key: 'label',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Label',
                    description: 'Rótulo exibido',
                    defaultValue: 'Campo',
                    required: true
                },
                {
                    key: 'type',
                    type: PropertyTypeEnum.SELECT,
                    label: 'Tipo',
                    description: 'Tipo de entrada',
                    defaultValue: 'text',
                    validation: {
                        options: ['text', 'email', 'tel', 'number', 'textarea', 'select']
                    }
                },
                {
                    key: 'required',
                    type: PropertyTypeEnum.BOOLEAN,
                    label: 'Obrigatório',
                    description: 'Campo obrigatório',
                    defaultValue: false
                },
                {
                    key: 'placeholder',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Placeholder',
                    description: 'Texto de exemplo',
                    defaultValue: ''
                }
            ],
            defaultProperties: {
                name: 'field',
                label: 'Campo',
                type: 'text',
                required: false,
                placeholder: ''
            }
        });

        // ============================================================================
        // INTRO BLOCKS
        // ============================================================================
        this.register({
            type: 'intro-logo',
            name: 'Logo de Introdução',
            description: 'Logo exibido na tela de introdução',
            category: BlockCategoryEnum.INTRO,
            properties: [
                {
                    key: 'src',
                    type: PropertyTypeEnum.URL,
                    label: 'URL do logo',
                    description: 'Caminho ou URL da imagem do logo',
                    defaultValue: '',
                    required: true
                },
                {
                    key: 'alt',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Texto alternativo',
                    description: 'Descrição do logo',
                    defaultValue: 'Logo'
                },
                {
                    key: 'width',
                    type: PropertyTypeEnum.NUMBER,
                    label: 'Largura',
                    description: 'Largura em pixels',
                    defaultValue: 200
                }
            ],
            defaultProperties: {
                src: '',
                alt: 'Logo',
                width: 200
            }
        });

        this.register({
            type: 'intro-logo-header',
            name: 'Cabeçalho com Logo',
            description: 'Cabeçalho completo com logo e branding',
            category: BlockCategoryEnum.INTRO,
            properties: [
                {
                    key: 'logoSrc',
                    type: PropertyTypeEnum.URL,
                    label: 'URL do logo',
                    description: 'Imagem do logo',
                    defaultValue: '',
                    required: true
                },
                {
                    key: 'brandName',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Nome da marca',
                    description: 'Nome exibido ao lado do logo',
                    defaultValue: ''
                },
                {
                    key: 'backgroundColor',
                    type: PropertyTypeEnum.COLOR,
                    label: 'Cor de fundo',
                    description: 'Cor do cabeçalho',
                    defaultValue: '#ffffff'
                }
            ],
            defaultProperties: {
                logoSrc: '',
                brandName: '',
                backgroundColor: '#ffffff'
            }
        });

        this.register({
            type: 'intro-title',
            name: 'Título de Introdução',
            description: 'Título principal da tela de introdução',
            category: BlockCategoryEnum.INTRO,
            properties: [
                {
                    key: 'text',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Texto do título',
                    description: 'Título principal',
                    defaultValue: 'Bem-vindo!',
                    required: true
                },
                {
                    key: 'level',
                    type: PropertyTypeEnum.NUMBER,
                    label: 'Nível (H1-H6)',
                    description: 'Hierarquia semântica',
                    defaultValue: 1,
                    validation: { min: 1, max: 6 }
                }
            ],
            defaultProperties: {
                text: 'Bem-vindo!',
                level: 1
            }
        });

        this.register({
            type: 'intro-subtitle',
            name: 'Subtítulo de Introdução',
            description: 'Subtítulo ou tagline da introdução',
            category: BlockCategoryEnum.INTRO,
            properties: [
                {
                    key: 'text',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Texto do subtítulo',
                    description: 'Subtítulo ou tagline',
                    defaultValue: 'Descubra seu perfil',
                    required: true
                }
            ],
            defaultProperties: {
                text: 'Descubra seu perfil'
            }
        });

        this.register({
            type: 'intro-description',
            name: 'Descrição de Introdução',
            description: 'Texto descritivo da introdução',
            category: BlockCategoryEnum.INTRO,
            properties: [
                {
                    key: 'text',
                    type: PropertyTypeEnum.TEXTAREA,
                    label: 'Texto descritivo',
                    description: 'Descrição detalhada do quiz',
                    defaultValue: 'Responda algumas perguntas e descubra seu resultado personalizado.',
                    required: true
                }
            ],
            defaultProperties: {
                text: 'Responda algumas perguntas e descubra seu resultado personalizado.'
            }
        });

        this.register({
            type: 'intro-image',
            name: 'Imagem de Introdução',
            description: 'Imagem hero ou ilustração da introdução',
            category: BlockCategoryEnum.INTRO,
            properties: [
                {
                    key: 'src',
                    type: PropertyTypeEnum.URL,
                    label: 'URL da imagem',
                    description: 'Imagem principal',
                    defaultValue: '',
                    required: true
                },
                {
                    key: 'alt',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Texto alternativo',
                    description: 'Descrição da imagem',
                    defaultValue: ''
                },
                {
                    key: 'aspectRatio',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Proporção',
                    description: 'Aspect ratio (16:9, 4:3, etc)',
                    defaultValue: '16:9'
                }
            ],
            defaultProperties: {
                src: '',
                alt: '',
                aspectRatio: '16:9'
            }
        });

        this.register({
            type: 'intro-form',
            name: 'Formulário de Introdução',
            description: 'Formulário de captura na introdução',
            category: BlockCategoryEnum.FORM,
            properties: [
                {
                    key: 'fields',
                    type: PropertyTypeEnum.ARRAY,
                    label: 'Campos',
                    description: 'Lista de campos do formulário',
                    defaultValue: [
                        { name: 'name', label: 'Nome', type: 'text', required: true },
                        { name: 'email', label: 'E-mail', type: 'email', required: true }
                    ]
                },
                {
                    key: 'submitText',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Texto do botão',
                    description: 'Label do botão de submit',
                    defaultValue: 'Começar'
                }
            ],
            defaultProperties: {
                fields: [
                    { name: 'name', label: 'Nome', type: 'text', required: true },
                    { name: 'email', label: 'E-mail', type: 'email', required: true }
                ],
                submitText: 'Começar'
            }
        });

        this.register({
            type: 'intro-button',
            name: 'Botão de Introdução',
            description: 'Botão CTA da tela de introdução',
            category: BlockCategoryEnum.INTRO,
            properties: [
                {
                    key: 'text',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Texto do botão',
                    description: 'Label do CTA',
                    defaultValue: 'Começar Quiz',
                    required: true
                },
                {
                    key: 'variant',
                    type: PropertyTypeEnum.SELECT,
                    label: 'Variante',
                    description: 'Estilo visual do botão',
                    defaultValue: 'primary',
                    validation: {
                        options: ['primary', 'secondary', 'outline', 'ghost']
                    }
                }
            ],
            defaultProperties: {
                text: 'Começar Quiz',
                variant: 'primary'
            }
        });

        this.register({
            type: 'quiz-intro-header',
            name: 'Header Completo de Intro',
            description: 'Cabeçalho completo com todos elementos da intro',
            category: BlockCategoryEnum.INTRO,
            properties: [
                {
                    key: 'logoSrc',
                    type: PropertyTypeEnum.URL,
                    label: 'Logo',
                    description: 'URL do logo',
                    defaultValue: ''
                },
                {
                    key: 'title',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Título',
                    description: 'Título principal',
                    defaultValue: 'Bem-vindo ao Quiz',
                    required: true
                },
                {
                    key: 'subtitle',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Subtítulo',
                    description: 'Subtítulo ou tagline',
                    defaultValue: ''
                },
                {
                    key: 'description',
                    type: PropertyTypeEnum.TEXTAREA,
                    label: 'Descrição',
                    description: 'Texto descritivo',
                    defaultValue: ''
                }
            ],
            defaultProperties: {
                logoSrc: '',
                title: 'Bem-vindo ao Quiz',
                subtitle: '',
                description: ''
            }
        });

        // ============================================================================
        // TRANSITION BLOCKS
        // ============================================================================
        this.register({
            type: 'transition-title',
            name: 'Título de Transição',
            description: 'Título exibido na tela de transição',
            category: BlockCategoryEnum.TRANSITION,
            properties: [
                {
                    key: 'text',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Texto',
                    description: 'Título da transição',
                    defaultValue: 'Processando suas respostas...',
                    required: true
                }
            ],
            defaultProperties: {
                text: 'Processando suas respostas...'
            }
        });

        this.register({
            type: 'transition-text',
            name: 'Texto de Transição',
            description: 'Texto descritivo na transição',
            category: BlockCategoryEnum.TRANSITION,
            properties: [
                {
                    key: 'text',
                    type: PropertyTypeEnum.TEXTAREA,
                    label: 'Texto',
                    description: 'Mensagem de transição',
                    defaultValue: 'Aguarde um momento...',
                    required: true
                }
            ],
            defaultProperties: {
                text: 'Aguarde um momento...'
            }
        });

        this.register({
            type: 'transition-button',
            name: 'Botão de Transição',
            description: 'Botão para avançar da transição',
            category: BlockCategoryEnum.TRANSITION,
            properties: [
                {
                    key: 'text',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Texto',
                    description: 'Label do botão',
                    defaultValue: 'Ver Resultado',
                    required: true
                }
            ],
            defaultProperties: {
                text: 'Ver Resultado'
            }
        });

        this.register({
            type: 'transition-image',
            name: 'Imagem de Transição',
            description: 'Imagem/ilustração na transição',
            category: BlockCategoryEnum.TRANSITION,
            properties: [
                {
                    key: 'src',
                    type: PropertyTypeEnum.URL,
                    label: 'URL',
                    description: 'URL da imagem',
                    defaultValue: '',
                    required: true
                },
                {
                    key: 'alt',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Alt',
                    description: 'Texto alternativo',
                    defaultValue: ''
                }
            ],
            defaultProperties: {
                src: '',
                alt: ''
            }
        });

        // ============================================================================
        // RESULT BLOCKS
        // ============================================================================
        this.register({
            type: 'result-header',
            name: 'Cabeçalho de Resultado',
            description: 'Cabeçalho da página de resultado',
            category: BlockCategoryEnum.RESULT,
            properties: [
                {
                    key: 'text',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Texto',
                    description: 'Texto do cabeçalho',
                    defaultValue: 'Seu Resultado',
                    required: true
                }
            ],
            defaultProperties: {
                text: 'Seu Resultado'
            }
        });

        this.register({
            type: 'result-title',
            name: 'Título do Resultado',
            description: 'Título principal do resultado',
            category: BlockCategoryEnum.RESULT,
            properties: [
                {
                    key: 'text',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Texto',
                    description: 'Título do resultado',
                    defaultValue: 'Você é: [PERFIL]',
                    required: true
                }
            ],
            defaultProperties: {
                text: 'Você é: [PERFIL]'
            }
        });

        this.register({
            type: 'result-description',
            name: 'Descrição do Resultado',
            description: 'Descrição detalhada do resultado',
            category: BlockCategoryEnum.RESULT,
            properties: [
                {
                    key: 'text',
                    type: PropertyTypeEnum.TEXTAREA,
                    label: 'Texto',
                    description: 'Descrição do resultado',
                    defaultValue: '',
                    required: true
                }
            ],
            defaultProperties: {
                text: ''
            }
        });

        this.register({
            type: 'result-image',
            name: 'Imagem do Resultado',
            description: 'Imagem representativa do resultado',
            category: BlockCategoryEnum.RESULT,
            properties: [
                {
                    key: 'src',
                    type: PropertyTypeEnum.URL,
                    label: 'URL',
                    description: 'URL da imagem',
                    defaultValue: '',
                    required: true
                },
                {
                    key: 'alt',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Alt',
                    description: 'Texto alternativo',
                    defaultValue: ''
                }
            ],
            defaultProperties: {
                src: '',
                alt: ''
            }
        });

        this.register({
            type: 'result-display',
            name: 'Display de Resultado',
            description: 'Bloco completo de exibição do resultado',
            category: BlockCategoryEnum.RESULT,
            properties: [
                {
                    key: 'showImage',
                    type: PropertyTypeEnum.BOOLEAN,
                    label: 'Mostrar imagem',
                    description: 'Exibir imagem do resultado',
                    defaultValue: true
                },
                {
                    key: 'showScore',
                    type: PropertyTypeEnum.BOOLEAN,
                    label: 'Mostrar pontuação',
                    description: 'Exibir pontos/score',
                    defaultValue: false
                }
            ],
            defaultProperties: {
                showImage: true,
                showScore: false
            }
        });

        this.register({
            type: 'result-guide-image',
            name: 'Imagem Guia do Resultado',
            description: 'Imagem de guia/referência do resultado',
            category: BlockCategoryEnum.RESULT,
            properties: [
                {
                    key: 'src',
                    type: PropertyTypeEnum.URL,
                    label: 'URL',
                    description: 'URL da imagem guia',
                    defaultValue: '',
                    required: true
                },
                {
                    key: 'alt',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Alt',
                    description: 'Texto alternativo',
                    defaultValue: 'Guia'
                }
            ],
            defaultProperties: {
                src: '',
                alt: 'Guia'
            }
        });

        // ============================================================================
        // OFFER BLOCKS
        // ============================================================================
        this.register({
            type: 'offer-hero',
            name: 'Hero de Oferta',
            description: 'Seção hero da página de oferta',
            category: BlockCategoryEnum.OFFER,
            properties: [
                {
                    key: 'title',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Título',
                    description: 'Título principal',
                    defaultValue: 'Oferta Especial',
                    required: true
                },
                {
                    key: 'subtitle',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Subtítulo',
                    description: 'Subtítulo da oferta',
                    defaultValue: ''
                },
                {
                    key: 'backgroundImage',
                    type: PropertyTypeEnum.URL,
                    label: 'Imagem de fundo',
                    description: 'URL da imagem de fundo',
                    defaultValue: ''
                }
            ],
            defaultProperties: {
                title: 'Oferta Especial',
                subtitle: '',
                backgroundImage: ''
            }
        });

        this.register({
            type: 'quiz-offer-hero',
            name: 'Hero de Oferta do Quiz',
            description: 'Hero de oferta específico do quiz',
            category: BlockCategoryEnum.OFFER,
            properties: [
                {
                    key: 'title',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Título',
                    description: 'Título principal',
                    defaultValue: 'Oferta Personalizada',
                    required: true
                },
                {
                    key: 'description',
                    type: PropertyTypeEnum.TEXTAREA,
                    label: 'Descrição',
                    description: 'Texto descritivo',
                    defaultValue: ''
                }
            ],
            defaultProperties: {
                title: 'Oferta Personalizada',
                description: ''
            }
        });

        this.register({
            type: 'offer-card',
            name: 'Card de Oferta',
            description: 'Card individual de produto/oferta',
            category: BlockCategoryEnum.OFFER,
            properties: [
                {
                    key: 'title',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Título',
                    description: 'Nome do produto',
                    defaultValue: 'Produto',
                    required: true
                },
                {
                    key: 'price',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Preço',
                    description: 'Preço exibido',
                    defaultValue: 'R$ 99,00'
                },
                {
                    key: 'image',
                    type: PropertyTypeEnum.URL,
                    label: 'Imagem',
                    description: 'Imagem do produto',
                    defaultValue: ''
                }
            ],
            defaultProperties: {
                title: 'Produto',
                price: 'R$ 99,00',
                image: ''
            }
        });

        this.register({
            type: 'benefits-list',
            name: 'Lista de Benefícios',
            description: 'Lista de benefícios/features',
            category: BlockCategoryEnum.OFFER,
            properties: [
                {
                    key: 'title',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Título',
                    description: 'Título da seção',
                    defaultValue: 'Benefícios'
                },
                {
                    key: 'items',
                    type: PropertyTypeEnum.ARRAY,
                    label: 'Itens',
                    description: 'Lista de benefícios',
                    defaultValue: []
                }
            ],
            defaultProperties: {
                title: 'Benefícios',
                items: []
            }
        });

        this.register({
            type: 'testimonials',
            name: 'Depoimentos',
            description: 'Seção de depoimentos/provas sociais',
            category: BlockCategoryEnum.OFFER,
            properties: [
                {
                    key: 'title',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Título',
                    description: 'Título da seção',
                    defaultValue: 'O que dizem nossos clientes'
                },
                {
                    key: 'testimonials',
                    type: PropertyTypeEnum.ARRAY,
                    label: 'Depoimentos',
                    description: 'Lista de depoimentos',
                    defaultValue: []
                }
            ],
            defaultProperties: {
                title: 'O que dizem nossos clientes',
                testimonials: []
            }
        });

        this.register({
            type: 'pricing',
            name: 'Preço',
            description: 'Bloco de pricing/valor',
            category: BlockCategoryEnum.OFFER,
            properties: [
                {
                    key: 'price',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Preço',
                    description: 'Preço principal',
                    defaultValue: 'R$ 99,00',
                    required: true
                },
                {
                    key: 'oldPrice',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Preço antigo',
                    description: 'Preço anterior (riscado)',
                    defaultValue: ''
                },
                {
                    key: 'discount',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Desconto',
                    description: 'Percentual ou valor de desconto',
                    defaultValue: ''
                }
            ],
            defaultProperties: {
                price: 'R$ 99,00',
                oldPrice: '',
                discount: ''
            }
        });

        this.register({
            type: 'guarantee',
            name: 'Garantia',
            description: 'Bloco de garantia/segurança',
            category: BlockCategoryEnum.OFFER,
            properties: [
                {
                    key: 'title',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Título',
                    description: 'Título da garantia',
                    defaultValue: 'Garantia de 30 dias',
                    required: true
                },
                {
                    key: 'description',
                    type: PropertyTypeEnum.TEXTAREA,
                    label: 'Descrição',
                    description: 'Detalhes da garantia',
                    defaultValue: 'Devolução do dinheiro sem perguntas'
                },
                {
                    key: 'icon',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Ícone',
                    description: 'Nome do ícone (shield, check, etc)',
                    defaultValue: 'shield'
                }
            ],
            defaultProperties: {
                title: 'Garantia de 30 dias',
                description: 'Devolução do dinheiro sem perguntas',
                icon: 'shield'
            }
        });

        this.register({
            type: 'urgency-timer',
            name: 'Timer de Urgência',
            description: 'Contador regressivo de urgência',
            category: BlockCategoryEnum.OFFER,
            properties: [
                {
                    key: 'text',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Texto',
                    description: 'Texto acima do timer',
                    defaultValue: 'Oferta expira em:'
                },
                {
                    key: 'duration',
                    type: PropertyTypeEnum.NUMBER,
                    label: 'Duração (minutos)',
                    description: 'Tempo do contador em minutos',
                    defaultValue: 15
                }
            ],
            defaultProperties: {
                text: 'Oferta expira em:',
                duration: 15
            }
        });

        this.register({
            type: 'value-anchoring',
            name: 'Ancoragem de Valor',
            description: 'Bloco de ancoragem/percepção de valor',
            category: BlockCategoryEnum.OFFER,
            properties: [
                {
                    key: 'totalValue',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Valor total',
                    description: 'Valor somado dos componentes',
                    defaultValue: 'R$ 999,00'
                },
                {
                    key: 'items',
                    type: PropertyTypeEnum.ARRAY,
                    label: 'Itens',
                    description: 'Lista de itens com valores',
                    defaultValue: []
                }
            ],
            defaultProperties: {
                totalValue: 'R$ 999,00',
                items: []
            }
        });

        this.register({
            type: 'secure-purchase',
            name: 'Compra Segura',
            description: 'Selos e garantias de segurança',
            category: BlockCategoryEnum.OFFER,
            properties: [
                {
                    key: 'showSSL',
                    type: PropertyTypeEnum.BOOLEAN,
                    label: 'Mostrar selo SSL',
                    description: 'Exibir selo de segurança',
                    defaultValue: true
                },
                {
                    key: 'showPaymentMethods',
                    type: PropertyTypeEnum.BOOLEAN,
                    label: 'Mostrar métodos de pagamento',
                    description: 'Exibir bandeiras de cartão',
                    defaultValue: true
                }
            ],
            defaultProperties: {
                showSSL: true,
                showPaymentMethods: true
            }
        });

        this.register({
            type: 'cta-button',
            name: 'Botão CTA',
            description: 'Botão de call-to-action',
            category: BlockCategoryEnum.OFFER,
            properties: [
                {
                    key: 'text',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Texto',
                    description: 'Label do botão',
                    defaultValue: 'Comprar Agora',
                    required: true
                },
                {
                    key: 'url',
                    type: PropertyTypeEnum.URL,
                    label: 'URL',
                    description: 'Link de destino',
                    defaultValue: ''
                },
                {
                    key: 'variant',
                    type: PropertyTypeEnum.SELECT,
                    label: 'Variante',
                    description: 'Estilo do botão',
                    defaultValue: 'primary',
                    validation: {
                        options: ['primary', 'secondary', 'success', 'danger']
                    }
                }
            ],
            defaultProperties: {
                text: 'Comprar Agora',
                url: '',
                variant: 'primary'
            }
        });

        // ============================================================================
        // LAYOUT BLOCKS
        // ============================================================================
        this.register({
            type: 'container',
            name: 'Container',
            description: 'Container para agrupar blocos',
            category: BlockCategoryEnum.LAYOUT,
            properties: [
                {
                    key: 'maxWidth',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Largura máxima',
                    description: 'Max-width CSS',
                    defaultValue: '1200px'
                },
                {
                    key: 'padding',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Padding',
                    description: 'Padding interno',
                    defaultValue: '1rem'
                }
            ],
            defaultProperties: {
                maxWidth: '1200px',
                padding: '1rem'
            }
        });

        this.register({
            type: 'spacer',
            name: 'Espaçador',
            description: 'Espaço vertical entre blocos',
            category: BlockCategoryEnum.LAYOUT,
            properties: [
                {
                    key: 'height',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Altura',
                    description: 'Altura do espaço (px, rem, etc)',
                    defaultValue: '2rem'
                }
            ],
            defaultProperties: {
                height: '2rem'
            }
        });

        this.register({
            type: 'divider',
            name: 'Divisor',
            description: 'Linha divisória horizontal',
            category: BlockCategoryEnum.LAYOUT,
            properties: [
                {
                    key: 'style',
                    type: PropertyTypeEnum.SELECT,
                    label: 'Estilo',
                    description: 'Estilo da linha',
                    defaultValue: 'solid',
                    validation: {
                        options: ['solid', 'dashed', 'dotted']
                    }
                },
                {
                    key: 'color',
                    type: PropertyTypeEnum.COLOR,
                    label: 'Cor',
                    description: 'Cor da linha',
                    defaultValue: '#e5e7eb'
                }
            ],
            defaultProperties: {
                style: 'solid',
                color: '#e5e7eb'
            }
        });

        this.register({
            type: 'footer-copyright',
            name: 'Copyright do Rodapé',
            description: 'Texto de copyright no rodapé',
            category: BlockCategoryEnum.LAYOUT,
            properties: [
                {
                    key: 'text',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Texto',
                    description: 'Texto do copyright',
                    defaultValue: '© 2024 Todos os direitos reservados'
                }
            ],
            defaultProperties: {
                text: '© 2024 Todos os direitos reservados'
            }
        });

        // ============================================================================
        // GENERIC CONTENT BLOCKS (já existentes, mantidos para referência)
        // ============================================================================
        this.register({
            type: 'text-inline',
            name: 'Texto Inline',
            description: 'Texto inline (span)',
            category: BlockCategoryEnum.CONTENT,
            properties: [
                {
                    key: 'content',
                    type: PropertyTypeEnum.TEXT,
                    label: 'Conteúdo',
                    description: 'Texto inline',
                    defaultValue: 'texto',
                    required: true
                }
            ],
            defaultProperties: {
                content: 'texto'
            }
        });

        // Aliases comuns
        this.addAlias('headline', 'heading');
        this.addAlias('title', 'heading');
        this.addAlias('img', 'image');
        this.addAlias('btn', 'button');
        this.addAlias('cta', 'button');
        this.addAlias('progress', 'question-progress');
        this.addAlias('nav', 'question-navigation');
        this.addAlias('navigation', 'question-navigation');
    }

    /**
     * Registra uma nova definição de bloco
     */
    register(definition: BlockDefinition): void {
        this.definitions.set(definition.type, definition);
        this.categoriesCache.clear(); // Invalida cache de categorias
        
        appLogger.debug(`Block registered: ${definition.type}`, { data: [definition] });
    }

    /**
     * Adiciona um alias para um tipo de bloco
     */
    addAlias(alias: string, targetType: string): void {
        this.aliases.set(alias, targetType);
        appLogger.debug(`Alias registered: ${alias} -> ${targetType}`);
    }

    /**
     * Obtém definição de um bloco por tipo
     */
    getDefinition(type: string): BlockDefinition | undefined {
        // Tenta buscar diretamente
        const direct = this.definitions.get(type);
        if (direct) return direct;

        // Tenta resolver via alias
        const aliasTarget = this.aliases.get(type);
        if (aliasTarget) {
            return this.definitions.get(aliasTarget);
        }

        return undefined;
    }

    /**
     * Obtém todas as definições de uma categoria
     */
    getByCategory(category: string): BlockDefinition[] {
        // Verifica cache primeiro
        if (this.categoriesCache.has(category)) {
            return this.categoriesCache.get(category)!;
        }

        // Filtra por categoria
        const blocks = Array.from(this.definitions.values())
            .filter(def => def.category === category);

        // Armazena no cache
        this.categoriesCache.set(category, blocks);

        return blocks;
    }

    /**
     * Obtém todos os tipos registrados
     */
    getAllTypes(): string[] {
        return Array.from(this.definitions.keys());
    }

    /**
     * Resolve tipo oficial a partir de alias
     */
    resolveType(type: string): string {
        // Se existe definição direta, retorna o próprio tipo
        if (this.definitions.has(type)) {
            return type;
        }

        // Tenta resolver via alias
        const aliasTarget = this.aliases.get(type);
        if (aliasTarget) {
            return aliasTarget;
        }

        // Retorna o tipo original se não encontrar
        return type;
    }

    /**
     * Verifica se um tipo está registrado
     */
    hasType(type: string): boolean {
        return this.definitions.has(type) || this.aliases.has(type);
    }

    /**
     * Obtém todas as definições
     */
    getAllDefinitions(): BlockDefinition[] {
        return Array.from(this.definitions.values());
    }

    /**
     * Limpa todas as definições (útil para testes)
     */
    clear(): void {
        this.definitions.clear();
        this.aliases.clear();
        this.categoriesCache.clear();
        appLogger.debug('BlockRegistry cleared');
    }

    /**
     * Obtém todos os aliases registrados
     */
    getAliases(): Map<string, string> {
        return new Map(this.aliases);
    }

    /**
     * Obtém estatísticas do registry
     */
    getStats() {
        return {
            totalDefinitions: this.definitions.size,
            totalAliases: this.aliases.size,
            categories: Array.from(
                new Set(
                    Array.from(this.definitions.values()).map(d => d.category)
                )
            ).length
        };
    }
}

/**
 * Instância singleton do registry
 */
export const BlockRegistry = new BlockRegistryClass();

/**
 * Export default para compatibilidade
 */
export default BlockRegistry;
