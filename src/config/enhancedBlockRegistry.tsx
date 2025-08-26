import { BlockDefinition } from '@/types/editor';
import { FormInput, Heading, Image, LayoutTemplate, Minus, MousePointer, Type } from 'lucide-react';
import React from 'react';

// === COMPONENTES BÁSICOS FUNCIONAIS ===
import ButtonInlineFixed from '../components/blocks/inline/ButtonInlineFixed';
import HeadingBlock from '../components/blocks/inline/HeadingBlock';
import OptionsGridInlineBlock from '../components/blocks/inline/OptionsGridInlineBlock';
import TextInline from '../components/blocks/inline/TextInline';
import ImageDisplayInlineBlockClean from '../components/blocks/inline/ImageDisplayInlineBlock.clean';

// === CRIAÇÃO DE COMPONENTES PLACEHOLDER (OS ARQUIVOS NÃO EXISTIAM) ===
// Estes componentes são criados aqui para evitar erros de importação.

const PlaceholderBlock: React.FC<{ type: string; props: any }> = ({ type, props }) => {
  return React.createElement(
    'div',
    {
      style: {
        padding: '12px',
        margin: '8px 0',
        border: '2px dashed #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#f9fafb',
        color: '#6b7280',
      },
    },
    [
      React.createElement(
        'p',
        {
          key: 'title',
          style: { fontWeight: 'bold', fontSize: '14px' },
        },
        ['Componente Placeholder: ', React.createElement('code', { key: 'type' }, type)]
      ),
      React.createElement(
        'pre',
        {
          key: 'props',
          style: { fontSize: '10px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' },
        },
        JSON.stringify(props, null, 2)
      ),
    ]
  );
};

const DecorativeBarInlineBlock: React.FC<any> = () =>
  React.createElement('hr', { style: { border: '2px solid #ccc', margin: '16px 0' } });
const FormInputBlock: React.FC<any> = props =>
  React.createElement('input', {
    placeholder: props.placeholder || 'Campo de formulário',
    style: { padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' },
  });
const FormContainerBlock: React.FC<{ children?: React.ReactNode }> = ({ children }) =>
  React.createElement(
    'div',
    { style: { padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' } },
    children
  );
const TextInlineBlock: React.FC<{ content?: string }> = ({ content }) =>
  React.createElement(TextInline, { content: content || 'Texto' });
const HeadingInlineBlock: React.FC<any> = props => React.createElement(HeadingBlock, props);

/**
 * Registry de Blocos - Versão Corrigida e Unificada
 * Define um nome "canônico" para cada componente.
 */
export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  // Componentes básicos
  text: TextInline,
  heading: HeadingBlock,
  image: ImageDisplayInlineBlockClean,
  button: ButtonInlineFixed,

  // 🎯 UNIFIED HEADER SYSTEM - Consolidated All Headers
  'header': React.lazy(() => import('../components/blocks/unified/UnifiedHeaderBlock')),
  'unified-header': React.lazy(() => import('../components/blocks/unified/UnifiedHeaderBlock')),
  
  // Quiz Headers - All variants unified
  'quiz-intro': React.lazy(() => import('../components/blocks/unified/UnifiedHeaderBlock')),
  'quiz-intro-header': React.lazy(() => import('../components/blocks/unified/UnifiedHeaderBlock')),
  'quiz-result-header': React.lazy(() => import('../components/blocks/unified/UnifiedHeaderBlock')),
  'offer-header': React.lazy(() => import('../components/blocks/unified/UnifiedHeaderBlock')),
  'vertical-canvas-header': React.lazy(() => import('../components/blocks/unified/UnifiedHeaderBlock')),
  
  // Form and Layout Components
  'decorative-bar': DecorativeBarInlineBlock,
  'form-container': FormContainerBlock,
  'form-input': FormInputBlock,

  // Quiz e interação  
  'options-grid': OptionsGridInlineBlock, // ✅ Componente faltante adicionado
  'options-grid-inline': OptionsGridInlineBlock,

  // Variações e componentes avançados
  'text-advanced': TextInlineBlock,
  'heading-advanced': HeadingInlineBlock,
};

// Mapeamento de aliases e nomes antigos para os nomes canônicos do registry
const BLOCK_ALIASES: Record<string, string> = {
  'text-inline': 'text',
  'heading-inline': 'heading-advanced',
  'image-display-inline': 'image',
  'button-inline': 'button',
  'decorative-bar-inline': 'decorative-bar',
  'options-grid-inline': 'options-grid', // ✅ Alias para options-grid
  form: 'form-input',

  // 🎯 UNIFIED HEADER ALIASES - All headers point to unified component
  'quiz-intro-optimized': 'quiz-intro',
  'step01-intro': 'quiz-intro',
  'quiz-intro-complete': 'quiz-intro',
  'header-block': 'header',
  'result-header': 'quiz-result-header',
  'offer-hero': 'offer-header',
  'canvas-header': 'vertical-canvas-header',
  'intro-header': 'quiz-intro-header',
  
  // Aliases do template JSON em português
  'cabeçalho-introdução-do-questionário': 'quiz-intro-header',
  'texto-embutido': 'text',
  'imagem-em-linha': 'image',
  'formulário-de-chumbo': 'form-container',
};

/**
 * Obtém um componente pelo seu tipo, usando o registry e os aliases.
 */
// Função getBlockComponent - exportada corretamente para compatibilidade com importações
export function getBlockComponent(type: string): React.ComponentType<any> {
  if (!type) {
    console.warn('getBlockComponent: Tipo de bloco não fornecido. Usando placeholder.');
    return props => React.createElement(PlaceholderBlock, { type: 'undefined', props });
  }

  // 1. Tenta encontrar o tipo diretamente no registry
  let component = ENHANCED_BLOCK_REGISTRY[type];
  if (component) {
    // ✅ Removido log excessivo para melhorar performance
    return component;
  }

  // 2. Se não encontrar, tenta usar um alias
  const alias = BLOCK_ALIASES[type];
  if (alias) {
    component = ENHANCED_BLOCK_REGISTRY[alias];
    if (component) {
      // ✅ Log apenas quando usa alias para debug específico
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 Mapeado via alias: "${type}" → "${alias}"`);
      }
      return component;
    }
  }

  // 3. Se nada foi encontrado, retorna placeholder com log de warning apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.warn(`❗️ Componente para o tipo "${type}" não foi encontrado. Renderizando placeholder.`);
  }
  return props => React.createElement(PlaceholderBlock, { type, props });
}

/**
 * Gera definições de blocos para a barra lateral do editor.
 * Atualizado para incluir os novos componentes.
 */
export function generateBlockDefinitions(): BlockDefinition[] {
  return [
    {
      type: 'text',
      name: 'Texto Simples',
      label: 'Texto',
      category: 'Conteúdo',
      description: 'Adicionar texto formatado',
      icon: Type,
      component: ENHANCED_BLOCK_REGISTRY['text'],
      defaultProps: { content: 'Digite seu texto aqui...' },
      properties: {},
    },
    {
      type: 'heading',
      name: 'Título',
      label: 'Título',
      category: 'Conteúdo',
      description: 'Adicionar título',
      icon: Heading,
      component: ENHANCED_BLOCK_REGISTRY['heading'],
      defaultProps: { text: 'Seu título aqui', level: 'h2' },
      properties: {},
    },
    {
      type: 'image',
      name: 'Imagem',
      label: 'Imagem',
      category: 'Mídia',
      description: 'Exibir imagem',
      icon: Image,
      component: ENHANCED_BLOCK_REGISTRY['image'],
      defaultProps: { src: '', alt: 'Imagem' },
      properties: {},
    },
    {
      type: 'button',
      name: 'Botão',
      label: 'Botão',
      category: 'Interativo',
      description: 'Botão clicável',
      icon: MousePointer,
      component: ENHANCED_BLOCK_REGISTRY['button'],
      defaultProps: { text: 'Clique aqui', variant: 'primary' },
      properties: {},
    },
    {
      type: 'form-container',
      name: 'Container de Formulário',
      label: 'Container Form',
      category: 'Formulário',
      description: 'Container para formulários',
      icon: LayoutTemplate,
      component: ENHANCED_BLOCK_REGISTRY['form-container'],
      defaultProps: {},
      properties: {},
    },
    {
      type: 'form-input',
      name: 'Campo de Texto',
      label: 'Input',
      category: 'Formulário',
      description: 'Campo de entrada de texto',
      icon: FormInput,
      component: ENHANCED_BLOCK_REGISTRY['form-input'],
      defaultProps: { placeholder: 'Digite aqui' },
      properties: {},
    },
    {
      type: 'decorative-bar',
      name: 'Barra Decorativa',
      label: 'Barra',
      category: 'Visual',
      description: 'Barra decorativa colorida',
      icon: Minus,
      component: ENHANCED_BLOCK_REGISTRY['decorative-bar'],
      defaultProps: {},
      properties: {},
    },
  ];
}

export const getAvailableBlockTypes = (): string[] => Object.keys(ENHANCED_BLOCK_REGISTRY);
export const blockTypeExists = (type: string): boolean =>
  type in ENHANCED_BLOCK_REGISTRY || type in BLOCK_ALIASES;
export default ENHANCED_BLOCK_REGISTRY;
