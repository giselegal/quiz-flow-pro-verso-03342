// @ts-nocheck - Legacy property schema types, to be migrated
import { BlockDefinition } from '@/types/editor';
import { Grid, Type } from 'lucide-react';
import React from 'react';

// 🎯 Exemplo de Block Definition com propriedades categorizadas para quiz
export const enhancedOptionsGridBlockDefinition: BlockDefinition = {
  type: 'options-grid',
  name: 'Grade de Opções',
  description: 'Grade de opções para quiz com múltipla seleção',
  category: 'quiz',
  icon: Grid,
  component: React.Fragment,
  label: 'Grade de Opções',
  defaultProps: {},
  properties: {
    // 📋 PROPRIEDADES GERAIS
    questionId: {
      type: 'string',
      label: 'ID da Questão',
      description: 'Identificador único da questão',
      category: 'general',
      required: true,
      default: '',
      placeholder: 'ex: q1, q2, etc.',
    },
    title: {
      type: 'string',
      label: 'Título da Questão',
      description: 'Texto principal da questão',
      category: 'content',
      default: '',
      placeholder: 'Digite o título da questão',
    },

    // 🎨 PROPRIEDADES DE LAYOUT
    columns: {
      type: 'range',
      label: 'Colunas',
      description: 'Número de colunas na grade',
      category: 'layout',
      default: 2,
      min: 1,
      max: 4,
      step: 1,
    },
    gridGap: {
      type: 'range',
      label: 'Espaçamento',
      description: 'Espaçamento entre os itens da grade',
      category: 'layout',
      default: 16,
      min: 4,
      max: 32,
      step: 4,
    },
    responsiveColumns: {
      type: 'boolean',
      label: 'Colunas Responsivas',
      description: 'Ajustar automaticamente o número de colunas em dispositivos móveis',
      category: 'layout',
      default: true,
    },

    // 🖼️ PROPRIEDADES VISUAIS
    showImages: {
      type: 'boolean',
      label: 'Mostrar Imagens',
      description: 'Exibir imagens nas opções',
      category: 'styling',
      default: true,
    },
    imageSize: {
      type: 'select',
      label: 'Tamanho da Imagem',
      description: 'Tamanho das imagens das opções',
      category: 'styling',
      default: 'medium',
      options: [
        { value: 'small', label: 'Pequeno' },
        { value: 'medium', label: 'Médio' },
        { value: 'large', label: 'Grande' },
      ],
    },
    borderRadius: {
      type: 'range',
      label: 'Raio da Borda',
      description: 'Arredondamento das bordas dos cards',
      category: 'styling',
      default: 8,
      min: 0,
      max: 24,
      step: 2,
    },

    // ⚙️ PROPRIEDADES DE COMPORTAMENTO
    multipleSelection: {
      type: 'boolean',
      label: 'Múltipla Seleção',
      description: 'Permite selecionar múltiplas opções',
      category: 'behavior',
      default: true,
    },
    maxSelections: {
      type: 'number',
      label: 'Máximo de Seleções',
      description: 'Número máximo de opções selecionáveis',
      category: 'behavior',
      default: 3,
      min: 1,
      max: 10,
    },
    minSelections: {
      type: 'number',
      label: 'Mínimo de Seleções',
      description: 'Número mínimo de opções que devem ser selecionadas',
      category: 'behavior',
      default: 1,
      min: 0,
      max: 5,
    },
    autoAdvanceOnComplete: {
      type: 'boolean',
      label: 'Avançar Automaticamente',
      description: 'Avança para próxima etapa quando completar seleção',
      category: 'behavior',
      default: true,
    },
    autoAdvanceDelay: {
      type: 'range',
      label: 'Delay do Auto-Avanço',
      description: 'Tempo em milissegundos antes de avançar automaticamente',
      category: 'behavior',
      default: 800,
      min: 200,
      max: 3000,
      step: 100,
    },

    // ✅ PROPRIEDADES DE VALIDAÇÃO
    requiredSelections: {
      type: 'number',
      label: 'Seleções Obrigatórias',
      description: 'Número de seleções necessárias para continuar',
      category: 'validation',
      default: 3,
      min: 0,
      max: 10,
    },
    enableButtonOnlyWhenValid: {
      type: 'boolean',
      label: 'Botão Apenas Quando Válido',
      description: 'Habilita botão de continuar apenas com seleção válida',
      category: 'validation',
      default: true,
    },
    showValidationFeedback: {
      type: 'boolean',
      label: 'Mostrar Feedback de Validação',
      description: 'Exibe mensagens de validação para o usuário',
      category: 'validation',
      default: true,
    },
    validationMessage: {
      type: 'string',
      label: 'Mensagem de Validação',
      description: 'Texto exibido para instruir a seleção',
      category: 'validation',
      default: 'Selecione até 3 opções',
      placeholder: 'ex: Selecione suas opções favoritas',
    },

    // 🎨 PROPRIEDADES DE CORES
    backgroundColor: {
      type: 'color',
      label: 'Cor de Fundo',
      description: 'Cor de fundo dos cards das opções',
      category: 'styling',
      default: '#ffffff',
    },
    selectedColor: {
      type: 'color',
      label: 'Cor de Seleção',
      description: 'Cor quando a opção está selecionada',
      category: 'styling',
      default: '#B89B7A',
    },
    borderColor: {
      type: 'color',
      label: 'Cor da Borda',
      description: 'Cor das bordas dos cards',
      category: 'styling',
      default: '#E5E7EB',
    },
    textColor: {
      type: 'color',
      label: 'Cor do Texto',
      description: 'Cor do texto nas opções',
      category: 'styling',
      default: '#374151',
    },

    // 🔧 PROPRIEDADES AVANÇADAS
    enableHoverEffects: {
      type: 'boolean',
      label: 'Efeitos de Hover',
      description: 'Ativa efeitos visuais ao passar o mouse',
      category: 'advanced',
      default: true,
    },
    animationDuration: {
      type: 'range',
      label: 'Duração da Animação',
      description: 'Duração das animações em milissegundos',
      category: 'advanced',
      default: 200,
      min: 100,
      max: 1000,
      step: 50,
    },
    customCSS: {
      type: 'textarea',
      label: 'CSS Personalizado',
      description: 'Classes CSS adicionais para personalização avançada',
      category: 'advanced',
      default: '',
      placeholder: 'ex: shadow-lg border-2',
      rows: 3,
    },
  },
};

// 🏗️ Exemplo de Block Definition para componentes de texto
export const enhancedHeadingInlineBlockDefinition: BlockDefinition = {
  type: 'heading-inline',
  name: 'Título',
  description: 'Título configurável com múltiplos estilos',
  category: 'text',
  icon: Type,
  component: React.Fragment,
  label: 'Título',
  defaultProps: {},
  properties: {
    // 📝 CONTEÚDO
    content: {
      type: 'string',
      label: 'Texto do Título',
      description: 'Conteúdo do título',
      category: 'content',
      required: true,
      default: '',
      placeholder: 'Digite o título',
    },
    level: {
      type: 'select',
      label: 'Nível do Título',
      description: 'Hierarquia semântica do título',
      category: 'content',
      default: 'h2',
      options: [
        { value: 'h1', label: 'H1 - Principal' },
        { value: 'h2', label: 'H2 - Seção' },
        { value: 'h3', label: 'H3 - Subseção' },
        { value: 'h4', label: 'H4 - Detalhes' },
        { value: 'h5', label: 'H5 - Menor' },
        { value: 'h6', label: 'H6 - Mínimo' },
      ],
    },

    // 🎨 ESTILIZAÇÃO
    fontSize: {
      type: 'select',
      label: 'Tamanho da Fonte',
      description: 'Tamanho do texto do título',
      category: 'styling',
      default: 'text-2xl',
      options: [
        { value: 'text-sm', label: 'Pequeno' },
        { value: 'text-base', label: 'Normal' },
        { value: 'text-lg', label: 'Grande' },
        { value: 'text-xl', label: 'Extra Grande' },
        { value: 'text-2xl', label: '2X Grande' },
        { value: 'text-3xl', label: '3X Grande' },
        { value: 'text-4xl', label: '4X Grande' },
      ],
    },
    fontWeight: {
      type: 'select',
      label: 'Peso da Fonte',
      description: 'Espessura do texto',
      category: 'styling',
      default: 'font-bold',
      options: [
        { value: 'font-light', label: 'Leve' },
        { value: 'font-normal', label: 'Normal' },
        { value: 'font-medium', label: 'Médio' },
        { value: 'font-semibold', label: 'Semi-Negrito' },
        { value: 'font-bold', label: 'Negrito' },
        { value: 'font-extrabold', label: 'Extra Negrito' },
      ],
    },
    textAlign: {
      type: 'select',
      label: 'Alinhamento',
      description: 'Alinhamento do texto',
      category: 'layout',
      default: 'text-center',
      options: [
        { value: 'text-left', label: 'Esquerda' },
        { value: 'text-center', label: 'Centro' },
        { value: 'text-right', label: 'Direita' },
      ],
    },
    color: {
      type: 'color',
      label: 'Cor do Texto',
      description: 'Cor do título',
      category: 'styling',
      default: '#1F2937',
    },

    // 📐 LAYOUT
    marginBottom: {
      type: 'range',
      label: 'Margem Inferior',
      description: 'Espaçamento abaixo do título',
      category: 'layout',
      default: 8,
      min: 0,
      max: 32,
      step: 2,
    },
    marginTop: {
      type: 'range',
      label: 'Margem Superior',
      description: 'Espaçamento acima do título',
      category: 'layout',
      default: 0,
      min: 0,
      max: 32,
      step: 2,
    },
  },
};
