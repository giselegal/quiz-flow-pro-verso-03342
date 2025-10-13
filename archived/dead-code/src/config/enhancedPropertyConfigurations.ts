// @ts-nocheck - Legacy property schema types, to be migrated
import { BlockDefinition } from '@/types/editor';
import { Grid, Type } from 'lucide-react';
import React from 'react';

// 🎯 Configurações avançadas para o painel de propriedades aprimorado
export const enhancedPropertyConfigurations = {
  // 📋 Configuração COMPLETA para options-grid com TODAS as propriedades do backend
  'options-grid': {
    type: 'options-grid',
    name: 'Grade de Opções',
    description: 'Grade de opções para quiz com múltipla seleção e configuração completa',
    category: 'quiz',
    icon: Grid,
    component: React.Fragment,
    label: 'Grade de Opções',
    defaultProps: {},
    properties: {
      // 📝 CONTEÚDO
      question: {
        type: 'textarea' as const,
        label: 'Título/Questão Principal',
        description: 'Pergunta ou título principal exibido acima das opções',
        category: 'content' as const,
        default: '',
        placeholder: 'Ex: Qual seu estilo favorito?',
        rows: 2,
      },
      questionId: {
        type: 'string' as const,
        label: 'ID da Questão',
        description: 'Identificador único da questão para tracking',
        category: 'content' as const,
        required: true,
        default: 'question-1',
        placeholder: 'Ex: q1, question-style, etc.',
      },
      showQuestionTitle: {
        type: 'boolean' as const,
        label: 'Exibir Título',
        description: 'Controla se o título da questão é exibido',
        category: 'content' as const,
        default: true,
      },
      
      // 📊 OPÇÕES DO QUIZ (Editor de Array Avançado)
      options: {
        type: 'options-array' as const,
        label: 'Opções da Questão',
        description: 'Configure as opções disponíveis para seleção',
        category: 'content' as const,
        default: [
          {
            id: 'option-1',
            text: 'Conforto, leveza e praticidade no vestir',
            imageUrl: 'https://via.placeholder.com/200x200/E5DDD5/8B7355?text=Opção+1',
            value: 'comfortable',
            category: 'Natural',
            points: 1,
          },
          {
            id: 'option-2', 
            text: 'Elegância clássica com toque moderno',
            imageUrl: 'https://via.placeholder.com/200x200/E5DDD5/8B7355?text=Opção+2',
            value: 'elegant',
            category: 'Clássico',
            points: 2,
          },
        ],
        itemSchema: {
          id: { type: 'string', label: 'ID', required: true },
          text: { type: 'textarea', label: 'Texto da Opção', required: true, rows: 2 },
          imageUrl: { type: 'image', label: 'Imagem' },
          value: { type: 'string', label: 'Valor' },
          category: { type: 'string', label: 'Categoria/Estilo' },
          points: { type: 'number', label: 'Pontuação', min: 0, max: 10, default: 1 },
        },
      },

      // 🎛️ TIPO DE CONTEÚDO
      contentType: {
        type: 'select' as const,
        label: 'Tipo de Conteúdo',
        description: 'Define se exibe texto, imagem ou ambos',
        category: 'layout' as const,
        default: 'text-and-image',
        options: [
          { value: 'text-and-image', label: 'Texto e Imagem' },
          { value: 'text-only', label: 'Apenas Texto' },
          { value: 'image-only', label: 'Apenas Imagem' },
        ],
      },

      // 📐 LAYOUT DA GRADE
      columns: {
        type: 'select' as const,
        label: 'Número de Colunas',
        description: 'Quantas colunas a grade deve ter',
        category: 'layout' as const,
        default: 2,
        options: [
          { value: 1, label: '1 Coluna' },
          { value: 2, label: '2 Colunas' },
        ],
      },
      gridGap: {
        type: 'range' as const,
        label: 'Espaçamento da Grade',
        description: 'Espaçamento entre as opções em pixels',
        category: 'layout' as const,
        default: 16,
        min: 4,
        max: 48,
        step: 4,
        unit: 'px',
      },
      responsiveColumns: {
        type: 'boolean' as const,
        label: 'Responsivo em Mobile',
        description: 'Força 1 coluna em dispositivos móveis',
        category: 'layout' as const,
        default: true,
      },
      layout: {
        type: 'select' as const,
        label: 'Disposição Geral',
        description: 'Layout grid ou lista',
        category: 'layout' as const,
        default: 'grid',
        options: [
          { value: 'grid', label: 'Grade (Grid)' },
          { value: 'list', label: 'Lista Vertical' },
        ],
      },

      // 🖼️ CONFIGURAÇÕES DE IMAGEM
      showImages: {
        type: 'boolean' as const,
        label: 'Exibir Imagens',
        description: 'Controla se as imagens das opções são exibidas',
        category: 'images' as const,
        default: true,
      },
      imageSize: {
        type: 'select' as const,
        label: 'Tamanho das Imagens',
        description: 'Tamanho pré-definido ou personalizado',
        category: 'images' as const,
        default: 'medium',
        options: [
          { value: 'small', label: 'Pequeno (96x96)' },
          { value: 'medium', label: 'Médio (128x128)' },
          { value: 'large', label: 'Grande (256x256)' },
          { value: 'custom', label: 'Personalizado' },
        ],
      },
      imageWidth: {
        type: 'range' as const,
        label: 'Largura da Imagem',
        description: 'Largura personalizada em pixels (modo personalizado)',
        category: 'images' as const,
        default: 200,
        min: 50,
        max: 400,
        step: 10,
        unit: 'px',
        conditional: { imageSize: 'custom' },
      },
      imageHeight: {
        type: 'range' as const,
        label: 'Altura da Imagem',
        description: 'Altura personalizada em pixels (modo personalizado)',
        category: 'images' as const,
        default: 200,
        min: 50,
        max: 400,
        step: 10,
        unit: 'px',
        conditional: { imageSize: 'custom' },
      },
      imagePosition: {
        type: 'radio' as const,
        label: 'Posição da Imagem',
        description: 'Onde a imagem aparece em relação ao texto',
        category: 'images' as const,
        default: 'top',
        options: [
          { value: 'top', label: 'Acima', icon: '⬆️' },
          { value: 'bottom', label: 'Abaixo', icon: '⬇️' },
          { value: 'left', label: 'Esquerda', icon: '⬅️' },
          { value: 'right', label: 'Direita', icon: '➡️' },
        ],
      },
      imageLayout: {
        type: 'radio' as const,
        label: 'Orientação do Card',
        description: 'Como organizar imagem e texto',
        category: 'images' as const,
        default: 'vertical',
        options: [
          { value: 'vertical', label: 'Vertical', icon: '⬆️⬇️' },
          { value: 'horizontal', label: 'Horizontal', icon: '⬅️➡️' },
        ],
      },

      // 🎨 ESTILIZAÇÃO VISUAL
      backgroundColor: {
        type: 'color' as const,
        label: 'Cor de Fundo dos Cards',
        description: 'Cor de fundo padrão das opções',
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
      hoverColor: {
        type: 'color' as const,
        label: 'Cor de Hover',
        description: 'Cor quando o mouse está sobre a opção',
        category: 'styling' as const,
        default: '#D4C2A8',
      },
      selectionStyle: {
        type: 'select' as const,
        label: 'Estilo de Seleção',
        description: 'Como destacar opções selecionadas',
        category: 'styling' as const,
        default: 'border',
        options: [
          { value: 'border', label: 'Borda Colorida' },
          { value: 'background', label: 'Fundo Colorido' },
          { value: 'shadow', label: 'Sombra Colorida' },
        ],
      },
      borderRadius: {
        type: 'range' as const,
        label: 'Arredondamento',
        description: 'Bordas arredondadas dos cards',
        category: 'styling' as const,
        default: 8,
        min: 0,
        max: 24,
        step: 2,
        unit: 'px',
      },
      padding: {
        type: 'range' as const,
        label: 'Espaçamento Interno',
        description: 'Espaço interno dos cards',
        category: 'styling' as const,
        default: 16,
        min: 8,
        max: 32,
        step: 4,
        unit: 'px',
      },

      // 📏 CONTROLE DE ESCALA
      componentScale: {
        type: 'range' as const,
        label: 'Escala do Componente',
        description: 'Controle deslizante para redimensionar todo o componente',
        category: 'sizing' as const,
        default: 100,
        min: 50,
        max: 150,
        step: 5,
        unit: '%',
      },

      // ⚙️ COMPORTAMENTO DE SELEÇÃO
      multipleSelection: {
        type: 'boolean' as const,
        label: 'Múltipla Seleção',
        description: 'Permite selecionar várias opções',
        category: 'behavior' as const,
        default: true,
      },
      maxSelections: {
        type: 'range' as const,
        label: 'Máximo de Seleções',
        description: 'Número máximo de opções selecionáveis',
        category: 'behavior' as const,
        default: 3,
        min: 1,
        max: 10,
        step: 1,
        conditional: { multipleSelection: true },
      },
      minSelections: {
        type: 'range' as const,
        label: 'Mínimo de Seleções',
        description: 'Número mínimo de seleções obrigatórias',
        category: 'behavior' as const,
        default: 1,
        min: 0,
        max: 10,
        step: 1,
      },
      requiredSelections: {
        type: 'range' as const,
        label: 'Seleções Obrigatórias',
        description: 'Quantas seleções são necessárias para continuar',
        category: 'behavior' as const,
        default: 3,
        min: 1,
        max: 10,
        step: 1,
      },
      allowDeselection: {
        type: 'boolean' as const,
        label: 'Permitir Desmarcar',
        description: 'Usuário pode desmarcar opções selecionadas',
        category: 'behavior' as const,
        default: true,
      },
      showSelectionCount: {
        type: 'boolean' as const,
        label: 'Mostrar Contador',
        description: 'Exibe quantas opções foram selecionadas',
        category: 'behavior' as const,
        default: true,
      },

      // 🚀 AUTO-AVANÇO
      autoAdvanceOnComplete: {
        type: 'boolean' as const,
        label: 'Auto-Avanço Ativo',
        description: 'Avança automaticamente quando completar seleção mínima',
        category: 'navigation' as const,
        default: true,
      },
      autoAdvanceDelay: {
        type: 'range' as const,
        label: 'Delay do Auto-Avanço',
        description: 'Tempo em milissegundos antes de avançar',
        category: 'navigation' as const,
        default: 1500,
        min: 500,
        max: 5000,
        step: 250,
        unit: 'ms',
        conditional: { autoAdvanceOnComplete: true },
      },

      // 🔘 CONFIGURAÇÃO DE BOTÕES
      showNavigationButtons: {
        type: 'boolean' as const,
        label: 'Exibir Botões de Navegação',
        description: 'Mostra botões Anterior/Próximo',
        category: 'buttons' as const,
        default: true,
      },
      nextButtonText: {
        type: 'string' as const,
        label: 'Texto do Botão Próximo',
        description: 'Texto personalizado para o botão de avançar',
        category: 'buttons' as const,
        default: 'Continuar',
        placeholder: 'Ex: Próximo, Avançar, Continuar',
        conditional: { showNavigationButtons: true },
      },
      nextButtonUrl: {
        type: 'string' as const,
        label: 'URL do Botão Próximo',
        description: 'Link customizado para o botão (opcional)',
        category: 'buttons' as const,
        default: '',
        placeholder: 'Ex: https://exemplo.com/proximo',
        conditional: { showNavigationButtons: true },
      },
      buttonActiveWhenValid: {
        type: 'boolean' as const,
        label: 'Botão Ativo Apenas Quando Válido',
        description: 'Botão só fica ativo com seleção válida',
        category: 'buttons' as const,
        default: true,
        conditional: { showNavigationButtons: true },
      },
      previousButtonText: {
        type: 'string' as const,
        label: 'Texto do Botão Anterior',
        description: 'Texto personalizado para o botão voltar',
        category: 'buttons' as const,
        default: 'Voltar',
        placeholder: 'Ex: Anterior, Voltar',
        conditional: { showNavigationButtons: true },
      },

      // ✅ VALIDAÇÃO E FEEDBACK
      enableValidation: {
        type: 'boolean' as const,
        label: 'Ativar Validação',
        description: 'Mostra mensagens de validação',
        category: 'validation' as const,
        default: true,
      },
      validationMessage: {
        type: 'string' as const,
        label: 'Mensagem de Instrução',
        description: 'Texto que orienta o usuário',
        category: 'validation' as const,
        default: 'Selecione até 3 opções que mais combinam com você',
        placeholder: 'Ex: Escolha suas opções favoritas',
        conditional: { enableValidation: true },
      },
      errorMessage: {
        type: 'string' as const,
        label: 'Mensagem de Erro',
        description: 'Texto exibido quando validação falha',
        category: 'validation' as const,
        default: 'Por favor, selecione pelo menos {min} opção(ões)',
        placeholder: 'Ex: Selecione pelo menos uma opção',
        conditional: { enableValidation: true },
      },
      showValidationFeedback: {
        type: 'boolean' as const,
        label: 'Mostrar Feedback Visual',
        description: 'Exibe indicadores visuais de validação',
        category: 'validation' as const,
        default: true,
        conditional: { enableValidation: true },
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
