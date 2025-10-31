/**
 * Enhanced Block Registry - Wrapper sobre UnifiedBlockRegistry
 * 
 * ⚠️ OTIMIZADO: Removidos 20+ imports estáticos duplicados
 * Agora delega para UnifiedBlockRegistry para eliminar duplicação de código.
 * 
 * Mantém apenas:
 * - 5 blocos críticos (text, image, button, options-grid, form-input)
 * - Componentes legados únicos (IntroStep, QuestionStep, etc.)
 */
import { type ComponentType } from 'react';
import { appLogger } from '@/utils/logger';
import { UnifiedBlockRegistry } from '@/registry/UnifiedBlockRegistry';

// ⚡ APENAS 5 BLOCOS CRÍTICOS - Imports estáticos necessários
import ButtonInlineBlock from '@/components/editor/blocks/ButtonInlineBlock';
import FormInputBlock from '@/components/editor/blocks/FormInputBlock';
import ImageInlineBlock from '@/components/editor/blocks/ImageInlineBlock';
import OptionsGridBlock from '@/components/editor/blocks/OptionsGridBlock';
import TextInlineBlock from '@/components/editor/blocks/TextInlineBlock';

// 🗃️ COMPONENTES LEGADOS ÚNICOS - Não estão no UnifiedBlockRegistry
// Mantidos para compatibilidade retroativa com QuizAppConnected
import IntroStep from '@/components/quiz/IntroStep';
import QuestionStep from '@/components/quiz/QuestionStep';
import StrategicQuestionStep from '@/components/quiz/StrategicQuestionStep';
import TransitionStep from '@/components/quiz/TransitionStep';
import ResultStep from '@/components/quiz/ResultStep';

// 🔄 SINGLETON DO UNIFIED REGISTRY
const _unifiedRegistry = UnifiedBlockRegistry.getInstance();

// 🎯 REGISTRY OTIMIZADO - Delega para UnifiedBlockRegistry
// Mantém apenas componentes únicos não disponíveis no UnifiedBlockRegistry
const ENHANCED_ONLY_COMPONENTS: Record<string, ComponentType<any>> = {
    // 🗃️ COMPONENTES LEGADOS ÚNICOS (não estão no UnifiedBlockRegistry)
    'intro-step': IntroStep,
    'question-step': QuestionStep,
    'strategic-question-step': StrategicQuestionStep,
    'transition-step': TransitionStep,
    'result-step': ResultStep,

    // Aliases legados
    'intro-step-legacy': IntroStep,
    'question-step-legacy': QuestionStep,
    'strategic-question-legacy': StrategicQuestionStep,
    'transition-step-legacy': TransitionStep,
    'result-step-legacy': ResultStep,
};

// 🔄 PROXY REGISTRY - Delega para UnifiedBlockRegistry com fallback local
export const ENHANCED_BLOCK_REGISTRY = new Proxy(ENHANCED_ONLY_COMPONENTS, {
    get(target, prop: string) {
        // 1️⃣ Verificar se existe nos componentes únicos locais
        if (prop in target) {
            return target[prop];
        }

        // 2️⃣ Delegar para UnifiedBlockRegistry
        const unifiedComponent = _unifiedRegistry.getComponent(prop);
        if (unifiedComponent) {
            return unifiedComponent;
        }

        // 3️⃣ Fallback para TextInlineBlock
        appLogger.warn(`⚠️ Componente "${prop}" não encontrado. Usando fallback TextInlineBlock.`);
        return TextInlineBlock;
    },

    has(target, prop: string) {
        return prop in target || _unifiedRegistry.getComponent(prop as string) !== null;
    },

    ownKeys(target) {
        const unifiedKeys = _unifiedRegistry.getAllTypes();
        return [...Object.keys(target), ...unifiedKeys];
    },
});

/**
 * Obtém o componente de bloco aprimorado com base no tipo
 * Inclui fallbacks inteligentes para tipos desconhecidos
 */
export const getEnhancedBlockComponent = (type: string) => {
    // 🔒 Validação robusta para evitar React error #185 (element type invalid)
    const isValidReactComponent = (value: any) =>
        typeof value === 'function' || (typeof value === 'object' && value !== null && '$$typeof' in value);

    appLogger.debug(`🔍 getEnhancedBlockComponent chamado para tipo: "${type}"`);

    // 🧪 TESTE: Verificar se o registry está populado
    const registryKeys = Object.keys(ENHANCED_BLOCK_REGISTRY);
    appLogger.debug(`📊 Registry tem ${registryKeys.length} chaves:`, registryKeys.slice(0, 10));

    // 🧪 TESTE CRÍTICO: Verificar se a chave específica existe
    const hasExactKey = Object.prototype.hasOwnProperty.call(ENHANCED_BLOCK_REGISTRY, type);
    appLogger.debug(`🔑 Registry.hasOwnProperty("${type}"):`, hasExactKey);

    if (hasExactKey) {
        const component = ENHANCED_BLOCK_REGISTRY[type];
        appLogger.debug(`🎯 Componente encontrado para "${type}":`, {
            exists: !!component,
            type: typeof component,
            name: (component as any)?.name || (component as any)?.displayName || 'Sem nome',
        });
        if (isValidReactComponent(component)) {
            return component;
        }
        appLogger.error(`❌ Componente inválido registrado para "${type}". Aplicando fallback TextInlineBlock.`);
        return TextInlineBlock;
    }

    if (!type) {
        appLogger.warn('getEnhancedBlockComponent: tipo não fornecido, usando fallback');
        return TextInlineBlock;
    }

    appLogger.debug(`🔎 Verificando tipo exato no registry: "${type}"`);

    // Verificar se o tipo existe diretamente no registro
    if (ENHANCED_BLOCK_REGISTRY[type]) {
        appLogger.debug(`✅ Tipo exato encontrado no registry: "${type}"`);
        const comp = ENHANCED_BLOCK_REGISTRY[type];
        return isValidReactComponent(comp) ? comp : TextInlineBlock;
    }    // Verificar se há um alias exato para o tipo
    const normalizedType = type.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (ENHANCED_BLOCK_REGISTRY[normalizedType]) {
        appLogger.debug(`🎨 Alias: ${type} → ${normalizedType}`);
        const comp = ENHANCED_BLOCK_REGISTRY[normalizedType];
        return isValidReactComponent(comp) ? comp : TextInlineBlock;
    }

    // Verificar se há um fallback baseado em prefixo
    const prefix = type.split('-')[0];
    const fallbackKey = `${prefix}-*`;
    if (ENHANCED_BLOCK_REGISTRY[fallbackKey]) {
        const comp = ENHANCED_BLOCK_REGISTRY[fallbackKey];
        appLogger.debug(`🎨 Fallback: ${type} → ${fallbackKey} (${(comp as any).name || 'component'})`);
        return isValidReactComponent(comp) ? comp : TextInlineBlock;
    }

    // Verificar se há um fallback baseado em sufixo
    const suffix = type.split('-').pop();
    const suffixFallbackKey = `*-${suffix}`;
    if (ENHANCED_BLOCK_REGISTRY[suffixFallbackKey]) {
        appLogger.debug(`🎨 Fallback: ${type} → ${suffixFallbackKey}`);
        const comp = ENHANCED_BLOCK_REGISTRY[suffixFallbackKey];
        return isValidReactComponent(comp) ? comp : TextInlineBlock;
    }

    // Verificar se é um tipo de quiz
    if (type.includes('quiz')) {
        appLogger.debug(`🎨 Fallback: ${type} → quiz-* (TextInlineBlock)`);
        return TextInlineBlock;
    }

    // Verificar se é um tipo de texto
    if (type.includes('text') || type.includes('paragraph') || type.includes('heading')) {
        appLogger.debug(`🎨 Fallback: ${type} → text (TextInlineBlock)`);
        return TextInlineBlock;
    }

    // Verificar se é um tipo de botão
    if (type.includes('button') || type.includes('cta')) {
        appLogger.debug(`🎨 Fallback: ${type} → button (ButtonInlineBlock)`);
        return ButtonInlineBlock;
    }

    // Verificar se é um tipo de imagem
    if (type.includes('image') || type.includes('img') || type.includes('photo')) {
        appLogger.debug(`🎨 Fallback: ${type} → image (ImageInlineBlock)`);
        return ImageInlineBlock;
    }

    // Fallback final para tipos desconhecidos
    appLogger.debug(`🎨 Fallback: ${type} → style-card-inline (StyleCardInlineBlock)`);
    const finalComp = ENHANCED_BLOCK_REGISTRY['style-card-inline'];
    return isValidReactComponent(finalComp) ? finalComp : TextInlineBlock;
};

/**
 * Lista de componentes disponíveis para a sidebar do editor
 * Organizada por categorias - APENAS COMPONENTES 100% EDITÁVEIS
 * Versão otimizada sem duplicações
 */
export const AVAILABLE_COMPONENTS = [
    // ============================================================================
    // 🧩 COMPONENTES MODULARES DO QUIZ (100% Editáveis)
    // ============================================================================
    {
        type: 'quiz-logo',
        label: 'Logo do Quiz',
        category: 'quiz',
        description: 'Logo com dimensões e estilos editáveis',
    },
    {
        type: 'quiz-progress-bar',
        label: 'Barra de Progresso',
        category: 'quiz',
        description: 'Indicador visual de progresso com estilos customizáveis',
    },
    {
        type: 'quiz-back-button',
        label: 'Botão Voltar',
        category: 'quiz',
        description: 'Navegação para etapa anterior',
    },
    {
        type: 'quiz-question-header',
        label: 'Cabeçalho de Pergunta',
        category: 'quiz',
        description: 'Título da pergunta com número do step',
    },
    {
        type: 'quiz-transition-loader',
        label: 'Loader de Transição',
        category: 'quiz',
        description: 'Animação de loading entre steps',
    },
    // Removidos da coluna para evitar duplicação com versões mais completas atômicas/sections
    // { type: 'quiz-result-header', label: 'Cabeçalho de Resultado', category: 'quiz', description: 'Exibição do resultado do quiz' },
    // { type: 'quiz-offer-hero', label: 'Hero de Oferta', category: 'quiz', description: 'Seção hero para página de oferta' },
    {
        type: 'image-display-inline',
        label: 'Imagem Display',
        category: 'content',
        description: 'Imagem com controles completos de tamanho e estilo',
    },

    // ============================================================================
    // 🏗️ COMPONENTES ESTRUTURAIS (Layout & Containers)
    // ============================================================================
    { type: 'container', label: 'Container', category: 'layout', description: 'Container flexível com padding e estilos personalizáveis' },
    { type: 'section', label: 'Seção', category: 'layout', description: 'Seção para agrupar conteúdo' },

    // ============================================================================
    // 📝 COMPONENTES DE CONTEÚDO (Text & Media)
    // ============================================================================
    { type: 'heading', label: 'Título (H1-H6)', category: 'content', description: 'Títulos com níveis hierárquicos editáveis' },
    { type: 'text-inline', label: 'Texto', category: 'content', description: 'Parágrafo de texto com formatação completa' },
    { type: 'image-inline', label: 'Imagem', category: 'content', description: 'Imagem com URL, alt, dimensões e estilos' },
    // ❌ REMOVED: duplicate 'image-display-inline' (already defined in quiz section above)

    // ============================================================================
    // 🎨 COMPONENTES VISUAIS (Decoração)
    // ============================================================================
    { type: 'decorative-bar', label: 'Barra Decorativa', category: 'visual', description: 'Linha decorativa horizontal' },
    { type: 'gradient-animation', label: 'Gradiente Animado', category: 'visual', description: 'Fundo com gradiente animado' },

    // ============================================================================
    // 🎯 COMPONENTES DE QUIZ (Interação)
    // ============================================================================
    { type: 'quiz-intro-header', label: 'Header do Quiz', category: 'quiz', description: 'Cabeçalho com logo e título do quiz' },
    // Novos blocos atômicos de Pergunta (Steps 02–11)
    { type: 'question-progress', label: 'Pergunta: Progresso', category: 'quiz', description: 'Indicador de progresso da pergunta' },
    { type: 'question-number', label: 'Pergunta: Número', category: 'quiz', description: 'Exibe o número da pergunta atual' },
    { type: 'question-text', label: 'Pergunta: Texto', category: 'quiz', description: 'Texto principal da pergunta' },
    { type: 'question-instructions', label: 'Pergunta: Instruções', category: 'quiz', description: 'Instruções adicionais para a pergunta' },
    { type: 'question-navigation', label: 'Pergunta: Navegação', category: 'quiz', description: 'Botões de Anterior/Próximo/Confirmar' },
    { type: 'options-grid', label: 'Grid de Opções', category: 'quiz', description: 'Grade de opções selecionáveis com imagens' },
    { type: 'question-hero', label: 'Hero de Pergunta', category: 'quiz', description: 'Seção hero para perguntas do quiz' },
    { type: 'strategic-question', label: 'Pergunta Estratégica', category: 'quiz', description: 'Pergunta com design especial' },
    { type: 'transition-hero', label: 'Hero de Transição', category: 'quiz', description: 'Tela de transição entre etapas' },
    // Removidos em favor de variantes mais completas já presentes (quiz-progress-bar e quiz-transition-loader)
    // { type: 'progress-bar', label: 'Barra de Progresso', category: 'quiz', description: 'Indicador visual de progresso' },
    // { type: 'loading-animation', label: 'Animação de Loading', category: 'quiz', description: 'Loader animado' },

    // ============================================================================
    // 📋 COMPONENTES DE FORMULÁRIO (Input & Forms)
    // ============================================================================
    { type: 'form-input', label: 'Campo de Texto', category: 'forms', description: 'Input de texto com label e validação' },
    { type: 'lead-form', label: 'Formulário de Lead', category: 'forms', description: 'Formulário completo de captura' },
    { type: 'connected-lead-form', label: 'Formulário Conectado', category: 'forms', description: 'Formulário com integração de dados' },

    // ============================================================================
    // 🔘 COMPONENTES DE AÇÃO (Buttons & CTAs)
    // ============================================================================
    { type: 'button-inline', label: 'Botão', category: 'action', description: 'Botão com texto, cores e ação personalizáveis' },
    { type: 'legal-notice', label: 'Aviso Legal', category: 'action', description: 'Texto legal com checkbox' },

    // ============================================================================
    // � COMPONENTES DE TRANSIÇÃO (Steps 12 & 19) - Blocos Atômicos
    // ============================================================================
    { type: 'transition-title', label: 'Transição: Título', category: 'transition', description: 'Título da tela de transição' },
    { type: 'transition-loader', label: 'Transição: Loader', category: 'transition', description: 'Animação de loading personalizada' },
    { type: 'transition-text', label: 'Transição: Texto', category: 'transition', description: 'Texto explicativo da transição' },
    { type: 'transition-progress', label: 'Transição: Progresso', category: 'transition', description: 'Barra de progresso da análise' },
    { type: 'transition-message', label: 'Transição: Mensagem', category: 'transition', description: 'Mensagem contextual com ícone' },

    // ============================================================================
    // �📊 COMPONENTES DE RESULTADO (Step 20)
    // ============================================================================
    { type: 'result-card', label: 'Card de Resultado', category: 'result', description: 'Card com resultado do quiz' },
    { type: 'result-header-inline', label: 'Header de Resultado', category: 'result', description: 'Cabeçalho da página de resultado' },
    { type: 'style-card-inline', label: 'Card de Estilo', category: 'result', description: 'Card individual de estilo' },
    { type: 'style-cards-grid', label: 'Grid de Estilos', category: 'result', description: 'Grade de cards de estilo' },

    // 🎨 Step 20 - Blocos Atômicos
    { type: 'result-header', label: 'Resultado: Cabeçalho', category: 'result', description: 'Cabeçalho da página de resultado' },
    { type: 'result-congrats', label: 'Resultado: Congratulações', category: 'result', description: 'Mensagem de parabéns com emoji' },
    { type: 'result-main', label: 'Resultado: Estilo Principal', category: 'result', description: 'Card do estilo principal identificado' },
    { type: 'result-progress-bars', label: 'Resultado: Barras de Compatibilidade', category: 'result', description: 'Barras de progresso dos estilos' },
    { type: 'result-style', label: 'Resultado: Card de Estilo', category: 'result', description: 'Card de estilo com barra de progresso' },
    { type: 'result-image', label: 'Resultado: Imagem', category: 'result', description: 'Imagem ilustrativa do resultado' },
    { type: 'result-description', label: 'Resultado: Descrição', category: 'result', description: 'Texto descritivo do estilo' },
    { type: 'result-characteristics', label: 'Resultado: Características', category: 'result', description: 'Lista de características do estilo' },
    // Removido em favor de primário/secundário mais explícitos
    // { type: 'result-cta', label: 'Resultado: Call to Action', category: 'result', description: 'Botão de ação principal' },
    { type: 'result-cta-primary', label: 'Resultado: CTA Principal', category: 'result', description: 'Botão de ação principal destacado' },
    { type: 'result-cta-secondary', label: 'Resultado: CTA Secundário', category: 'result', description: 'Botão de ação secundário' },
    { type: 'result-secondary-styles', label: 'Resultado: Estilos Secundários', category: 'result', description: 'Lista de estilos compatíveis' },
    { type: 'result-share', label: 'Resultado: Compartilhar', category: 'result', description: 'Botões de compartilhamento social' },

    // 🆕 Step 20 - Módulos Especializados
    { type: 'step20-result-header', label: 'Step20: Header', category: 'result', description: 'Header modular do resultado' },
    { type: 'step20-style-reveal', label: 'Step20: Revelação de Estilo', category: 'result', description: 'Animação de revelação' },
    { type: 'step20-user-greeting', label: 'Step20: Saudação', category: 'result', description: 'Saudação personalizada' },
    { type: 'step20-compatibility', label: 'Step20: Compatibilidade', category: 'result', description: 'Análise de compatibilidade' },
    { type: 'step20-secondary-styles', label: 'Step20: Estilos Secundários', category: 'result', description: 'Grid de estilos secundários' },
    { type: 'step20-personalized-offer', label: 'Step20: Oferta Personalizada', category: 'result', description: 'CTA com oferta baseada no resultado' },
    { type: 'step20-complete-template', label: 'Step20: Template Completo', category: 'result', description: 'Template completo da Step 20' },

    // ============================================================================
    // 💰 COMPONENTES DE OFERTA/VENDAS (Step 21)
    // ============================================================================
    { type: 'offer-hero', label: 'Hero de Oferta', category: 'offer', description: 'Seção hero da página de oferta' },
    { type: 'pricing', label: 'Tabela de Preços', category: 'offer', description: 'Seção de preços com desconto e parcelamento' },
    { type: 'sales-hero', label: 'Sales Hero', category: 'offer', description: 'Hero de vendas com proposta de valor' },
    { type: 'urgency-timer-inline', label: 'Timer de Urgência', category: 'offer', description: 'Contador regressivo' },
    { type: 'before-after-inline', label: 'Antes e Depois', category: 'offer', description: 'Comparação antes/depois' },
    { type: 'value-anchoring', label: 'Ancoragem de Valor', category: 'offer', description: 'Comparação de valores' },
    { type: 'bonus', label: 'Seção de Bônus', category: 'offer', description: 'Lista de bônus inclusos' },
    { type: 'testimonials', label: 'Grade de Depoimentos', category: 'offer', description: 'Grid de depoimentos' },
    { type: 'testimonial-card-inline', label: 'Depoimento Individual', category: 'offer', description: 'Card único de depoimento' },
    { type: 'testimonials-carousel-inline', label: 'Carrossel de Depoimentos', category: 'offer', description: 'Slider de depoimentos' },
    { type: 'guarantee', label: 'Garantia', category: 'offer', description: 'Seção de garantia' },
    { type: 'secure-purchase', label: 'Compra Segura', category: 'offer', description: 'Selos de segurança' },
    { type: 'benefits', label: 'Lista de Benefícios', category: 'offer', description: 'Lista de benefícios do produto' },
    { type: 'mentor-section-inline', label: 'Seção da Mentora', category: 'offer', description: 'Apresentação da mentora/autoridade' },

    // ============================================================================
    // 🧭 COMPONENTES DE NAVEGAÇÃO
    // ============================================================================
    { type: 'quiz-navigation', label: 'Navegação do Quiz', category: 'navigation', description: 'Barra de navegação premium' },

    // ============================================================================
    // 🤖 COMPONENTES DE IA
    // ============================================================================
    { type: 'fashion-ai-generator', label: 'Gerador de IA Fashion', category: 'ai', description: 'Geração de estilos com IA' },

    // ============================================================================
    // 🔧 COMPONENTES AVANÇADOS (Templates & Wrappers)
    // ============================================================================
    { type: 'connected-template-wrapper', label: 'Template Wrapper', category: 'advanced', description: 'Wrapper conectado para templates' },
];

/**
 * Normaliza as propriedades de um bloco para garantir consistência
 * Retorna o bloco completo com propriedades normalizadas
 */
export const normalizeBlockProperties = (block: any) => {
    appLogger.debug('🔧 normalizeBlockProperties chamado para bloco:', {
        blockId: block?.id,
        originalType: block?.type,
        hasType: !!block?.type,
        blockKeys: Object.keys(block || {}),
        fullBlock: block,
    });

    if (!block) return { type: undefined, properties: {} };

    // Garantir que properties existe
    const properties = block.properties || {};

    // Normalizar propriedades comuns
    const baseNormalized = {
        ...properties,
        // Garantir que backgroundColor seja uma string válida
        backgroundColor: properties.backgroundColor || '',
        // Garantir que textAlign seja uma string válida
        textAlign: properties.textAlign || 'left',
        // Garantir que padding seja um número ou string válida
        padding: properties.padding || 0,
        // Garantir que margin seja um número ou string válida
        margin: properties.margin || 0,
        // Garantir que borderRadius seja um número ou string válida
        borderRadius: properties.borderRadius || 0,
        // Garantir que boxShadow seja uma string válida
        boxShadow: properties.boxShadow || 'none',
    };

    let normalizedProperties;

    // Normalizar propriedades específicas por tipo de bloco
    switch (block.type) {
        case 'text':
        case 'text-inline':
            normalizedProperties = {
                ...baseNormalized,
                content: block.content || properties.content || '',
                fontSize: properties.fontSize || 16,
                fontWeight: properties.fontWeight || 'normal',
                color: properties.color || '#000000',
            };
            break;
        case 'image':
        case 'image-inline':
            normalizedProperties = {
                ...baseNormalized,
                src: properties.src || '',
                alt: properties.alt || '',
                width: properties.width || 'auto',
                height: properties.height || 'auto',
            };
            break;
        case 'button':
        case 'button-inline':
            normalizedProperties = {
                ...baseNormalized,
                text: properties.text || 'Botão',
                url: properties.url || '#',
                color: properties.color || '#ffffff',
                backgroundColor: properties.backgroundColor || '#3b82f6',
            };
            break;
        default:
            normalizedProperties = baseNormalized;
            break;
    }

    // Retornar o bloco completo com propriedades normalizadas e preservar todos os campos originais
    return {
        ...block,
        type: block.type,  // Garantir que o tipo seja preservado
        properties: normalizedProperties,
    };
};

/**
 * Obtém estatísticas do registro de blocos
 */
export const getRegistryStats = () => {
    const totalComponents = Object.keys(ENHANCED_BLOCK_REGISTRY).length;
    const staticComponents = Object.values(ENHANCED_BLOCK_REGISTRY).filter(
        (comp) => typeof comp === 'function' && !(comp as any).$$typeof,
    ).length;
    const lazyComponents = totalComponents - staticComponents;

    const categoryCounts = AVAILABLE_COMPONENTS.reduce((acc, comp) => {
        const category = comp.category || 'uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const wildcardPatterns = Object.keys(ENHANCED_BLOCK_REGISTRY).filter((key) => key.includes('*'));

    return {
        totalComponents,
        staticComponents,
        lazyComponents,
        categoryCounts,
        wildcardPatterns,
        availableComponentsCount: AVAILABLE_COMPONENTS.length,
    };
};

// ============================================================================
// 🗃️ COMPONENTES LEGADOS (DEPRECATED)
// ⚠️ Mantidos apenas para compatibilidade retroativa
// 🚨 NÃO USAR EM NOVOS TEMPLATES - Usar atomic blocks modulares
// 🗑️ REMOÇÃO PLANEJADA: v2.0
// ============================================================================

/**
 * @deprecated Usar atomic blocks modulares:
 * - intro-* blocks (intro-header, intro-text, intro-button)
 * - Template: @/templates/step-01.json
 */
export const LEGACY_INTRO_STEP = IntroStep;

/**
 * @deprecated Usar atomic blocks modulares:
 * - question-* blocks (question-title, question-text, options-grid)
 * - Template: @/templates/step-02.json
 */
export const LEGACY_QUESTION_STEP = QuestionStep;

/**
 * @deprecated Usar atomic blocks modulares:
 * - strategic-question-* blocks
 * - Template: @/templates/step-strategic.json
 */
export const LEGACY_STRATEGIC_QUESTION_STEP = StrategicQuestionStep;

/**
 * @deprecated Usar atomic blocks modulares:
 * - transition-title, transition-loader, transition-text, transition-progress, transition-message
 * - Template: @/templates/step-12.json, @/templates/step-19.json
 * - Hook: useTransition (@/hooks/useTransition.ts)
 * - Docs: ANALISE_ACOPLAMENTO_STEPS_12_19_20.md
 */
export const LEGACY_TRANSITION_STEP = TransitionStep;

/**
 * @deprecated Usar atomic blocks modulares:
 * - result-main, result-style, result-cta-primary, result-cta-secondary
 * - result-social-proof, result-offer, result-guarantee, result-image
 * - Template: @/templates/step-20.json
 * - Hook: useResultCalculations (@/hooks/useResultCalculations.ts)
 * - Context: ResultContext (@/contexts/ResultContext.tsx)
 * - Docs: ANALISE_ACOPLAMENTO_STEPS_12_19_20.md, LOGICA_CALCULOS_RESULTADOS.md
 */
export const LEGACY_RESULT_STEP = ResultStep;

/**
 * Registry aliases para componentes legados (compatibilidade retroativa)
 * ⚠️ Apenas para templates antigos - novos templates devem usar atomic blocks
 */
export const LEGACY_REGISTRY: Record<string, ComponentType<any>> = {
    'intro-step': LEGACY_INTRO_STEP,
    'intro-step-legacy': LEGACY_INTRO_STEP,
    'question-step': LEGACY_QUESTION_STEP,
    'question-step-legacy': LEGACY_QUESTION_STEP,
    'strategic-question-step': LEGACY_STRATEGIC_QUESTION_STEP,
    'strategic-question-legacy': LEGACY_STRATEGIC_QUESTION_STEP,
    'transition-step': LEGACY_TRANSITION_STEP,
    'transition-step-legacy': LEGACY_TRANSITION_STEP,
    'result-step': LEGACY_RESULT_STEP,
    'result-step-legacy': LEGACY_RESULT_STEP,
};

// Merge legacy registry com main registry para compatibilidade
Object.assign(ENHANCED_BLOCK_REGISTRY, LEGACY_REGISTRY);

export default ENHANCED_BLOCK_REGISTRY;
