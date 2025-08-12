import { BlockDefinition } from '@/types/editor';
import { Grid, Type } from 'lucide-react';
import React from 'react';

// 🎯 Configurações avançadas para o painel de propriedades aprimorado
export const enhancedPropertyConfigurations = {
  // 📋 Configuração para options-grid com todas as categorias
  'options-grid': {
    type: 'options-grid',
    name: 'Grade de Opções',
    description: 'Grade de opções para quiz com múltipla seleção',
    category: 'quiz',
    icon: Grid,
    component: React.Fragment,
    label: 'Grade de Opções',
    defaultProps: {},
    properties: {
      // 📋 GERAL
      questionId: {
        type: 'string' as const,
        label: 'ID da Questão',
        description: 'Identificador único da questão',
        category: 'general' as const,
        required: true,
        default: '',
        placeholder: 'ex: q1, q2, etc.',
      },
      title: {
        type: 'string' as const,
        label: 'Título da Questão',
        description: 'Texto principal da questão',
        category: 'content' as const,
        default: '',
        placeholder: 'Digite o título da questão',
      },

      // 🎨 LAYOUT
      columns: {
        type: 'range' as const,
        label: 'Colunas',
        description: 'Número de colunas na grade',
        category: 'layout' as const,
        default: 2,
        min: 1,
        max: 4,
        step: 1,
      },
      gridGap: {
        type: 'range' as const,
        label: 'Espaçamento',
        description: 'Espaçamento entre os itens da grade',
        category: 'layout' as const,
        default: 16,
        min: 4,
        max: 32,
        step: 4,
      },
      responsiveColumns: {
        type: 'boolean' as const,
        label: 'Colunas Responsivas',
        description: 'Ajustar automaticamente o número de colunas em dispositivos móveis',
        category: 'layout' as const,
        default: true,
      },

      // 🖼️ ESTILIZAÇÃO E CONTROLES DE IMAGEM
      showImages: {
        type: 'boolean' as const,
        label: 'Exibir Imagens',
        description: 'Controla se as imagens das opções são exibidas',
        category: 'styling' as const,
        default: true,
      },
      imageSize: {
        type: 'select' as const,
        label: 'Tamanho das Imagens',
        description: 'Define o tamanho padrão das imagens',
        category: 'styling' as const,
        default: 'medium',
        options: [
          { value: 'small', label: 'Pequeno (64x64)' },
          { value: 'medium', label: 'Médio (96x80)' },
          { value: 'large', label: 'Grande (128x112)' },
          { value: 'custom', label: 'Personalizado' },
        ],
      },
      imageWidth: {
        type: 'number' as const,
        label: 'Largura da Imagem (px)',
        description: 'Largura personalizada em pixels (modo custom)',
        category: 'styling' as const,
        default: 150,
        min: 50,
        max: 400,
      },
      imageHeight: {
        type: 'number' as const,
        label: 'Altura da Imagem (px)',
        description: 'Altura personalizada em pixels (modo custom)',
        category: 'styling' as const,
        default: 120,
        min: 50,
        max: 300,
      },
      imagePosition: {
        type: 'select' as const,
        label: 'Posição da Imagem',
        description: 'Onde a imagem aparece no card',
        category: 'styling' as const,
        default: 'top',
        options: [
          { value: 'top', label: 'Acima do texto' },
          { value: 'bottom', label: 'Abaixo do texto' },
          { value: 'left', label: 'À esquerda do texto' },
          { value: 'right', label: 'À direita do texto' },
        ],
      },
      imageLayout: {
        type: 'select' as const,
        label: 'Layout do Card',
        description: 'Organização vertical ou horizontal',
        category: 'styling' as const,
        default: 'vertical',
        options: [
          { value: 'vertical', label: 'Vertical (imagem empilhada)' },
          { value: 'horizontal', label: 'Horizontal (imagem lateral)' },
        ],
      },
      backgroundColor: {
        type: 'color' as const,
        label: 'Cor de Fundo',
        description: 'Cor de fundo dos cards das opções',
        category: 'styling' as const,
        default: '#ffffff',
      },
      selectedColor: {
        type: 'color' as const,
        label: 'Cor de Seleção',
        description: 'Cor quando a opção está selecionada',
        category: 'styling' as const,
        default: '#B89B7A',
      },

      // ⚙️ COMPORTAMENTO
      multipleSelection: {
        type: 'boolean' as const,
        label: 'Múltipla Seleção',
        description: 'Permite selecionar múltiplas opções',
        category: 'behavior' as const,
        default: true,
      },
      maxSelections: {
        type: 'number' as const,
        label: 'Máximo de Seleções',
        description: 'Número máximo de opções selecionáveis',
        category: 'behavior' as const,
        default: 3,
        min: 1,
        max: 10,
      },
      autoAdvanceOnComplete: {
        type: 'boolean' as const,
        label: 'Avançar Automaticamente',
        description: 'Avança para próxima etapa quando completar seleção',
        category: 'behavior' as const,
        default: true,
      },

      // ✅ VALIDAÇÃO
      requiredSelections: {
        type: 'number' as const,
        label: 'Seleções Obrigatórias',
        description: 'Número de seleções necessárias para continuar',
        category: 'validation' as const,
        default: 3,
        min: 0,
        max: 10,
      },
      enableButtonOnlyWhenValid: {
        type: 'boolean' as const,
        label: 'Botão Apenas Quando Válido',
        description: 'Habilita botão de continuar apenas com seleção válida',
        category: 'validation' as const,
        default: true,
      },
      validationMessage: {
        type: 'string' as const,
        label: 'Mensagem de Validação',
        description: 'Texto exibido para instruir a seleção',
        category: 'validation' as const,
        default: 'Selecione até 3 opções',
        placeholder: 'ex: Selecione suas opções favoritas',
      },
    },
  },

  // 📝 Configuração para heading-inline
  'heading-inline': {
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
        type: 'string' as const,
        label: 'Texto do Título',
        description: 'Conteúdo do título',
        category: 'content' as const,
        required: true,
        default: '',
        placeholder: 'Digite o título',
      },
      level: {
        type: 'select' as const,
        label: 'Nível do Título',
        description: 'Hierarquia semântica do título',
        category: 'content' as const,
        default: 'h2',
        options: [
          { value: 'h1', label: 'H1 - Principal' },
          { value: 'h2', label: 'H2 - Seção' },
          { value: 'h3', label: 'H3 - Subseção' },
          { value: 'h4', label: 'H4 - Detalhes' },
        ],
      },

      // 🎨 ESTILIZAÇÃO
      fontSize: {
        type: 'select' as const,
        label: 'Tamanho da Fonte',
        description: 'Tamanho do texto do título',
        category: 'styling' as const,
        default: 'text-2xl',
        options: [
          { value: 'text-lg', label: 'Grande' },
          { value: 'text-xl', label: 'Extra Grande' },
          { value: 'text-2xl', label: '2X Grande' },
          { value: 'text-3xl', label: '3X Grande' },
          { value: 'text-4xl', label: '4X Grande' },
        ],
      },
      fontWeight: {
        type: 'select' as const,
        label: 'Peso da Fonte',
        description: 'Espessura do texto',
        category: 'styling' as const,
        default: 'font-bold',
        options: [
          { value: 'font-normal', label: 'Normal' },
          { value: 'font-medium', label: 'Médio' },
          { value: 'font-semibold', label: 'Semi-Negrito' },
          { value: 'font-bold', label: 'Negrito' },
        ],
      },
      color: {
        type: 'color' as const,
        label: 'Cor do Texto',
        description: 'Cor do título',
        category: 'styling' as const,
        default: '#1F2937',
      },

      // 📐 LAYOUT
      textAlign: {
        type: 'select' as const,
        label: 'Alinhamento',
        description: 'Alinhamento do texto',
        category: 'layout' as const,
        default: 'text-center',
        options: [
          { value: 'text-left', label: 'Esquerda' },
          { value: 'text-center', label: 'Centro' },
          { value: 'text-right', label: 'Direita' },
        ],
      },
      marginBottom: {
        type: 'range' as const,
        label: 'Margem Inferior',
        description: 'Espaçamento abaixo do título',
        category: 'layout' as const,
        default: 8,
        min: 0,
        max: 32,
        step: 2,
      },
    },
  },
};

// 🎯 Função para obter configuração aprimorada de um tipo de bloco
export const getEnhancedBlockDefinition = (blockType: string): BlockDefinition | null => {
  const config =
    enhancedPropertyConfigurations[blockType as keyof typeof enhancedPropertyConfigurations];
  return config ? (config as BlockDefinition) : null;
};

export default enhancedPropertyConfigurations;
