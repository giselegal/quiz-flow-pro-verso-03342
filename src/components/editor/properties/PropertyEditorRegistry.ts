import { PropertyEditorRegistry } from './interfaces/PropertyEditor';

/**
 * Configuração completa dos editores de propriedades
 * Baseado na análise dos templates existentes
 */
export const PROPERTY_EDITOR_REGISTRY: PropertyEditorRegistry = {
  header: {
    priority: 19,
    properties: [
      {
        name: 'title',
        type: 'text',
        label: 'Título',
        required: true,
        placeholder: 'Digite o título principal...',
      },
      {
        name: 'subtitle',
        type: 'text',
        label: 'Subtítulo',
        required: false,
        placeholder: 'Digite o subtítulo (opcional)...',
      },
      {
        name: 'type',
        type: 'select',
        label: 'Tipo de Header',
        required: true,
        options: ['default', 'hero', 'section'],
      },
    ],
    editorComponent: 'HeaderPropertyEditor',
    category: 'content',
  },

  question: {
    priority: 18,
    properties: [
      {
        name: 'text',
        type: 'textarea',
        label: 'Texto da Pergunta',
        required: true,
        placeholder: 'Digite sua pergunta aqui...',
      },
      {
        name: 'type',
        type: 'select',
        label: 'Tipo de Input',
        required: true,
        options: ['single', 'multiple', 'text', 'scale'],
      },
      {
        name: 'required',
        type: 'boolean',
        label: 'Campo Obrigatório',
        required: false,
      },
      {
        name: 'questionType',
        type: 'select',
        label: 'Formato da Pergunta',
        required: false,
        options: ['choice', 'input', 'scale', 'rating'],
      },
    ],
    editorComponent: 'QuestionPropertyEditor',
    category: 'form',
  },

  options: {
    priority: 16,
    properties: [
      {
        name: 'items',
        type: 'array',
        label: 'Lista de Opções',
        required: true,
        itemType: 'option',
      },
      {
        name: 'type',
        type: 'select',
        label: 'Estilo das Opções',
        required: true,
        options: ['radio', 'checkbox', 'buttons', 'cards'],
      },
      {
        name: 'allowMultiple',
        type: 'boolean',
        label: 'Permitir Múltiplas Seleções',
        required: false,
      },
      {
        name: 'maxSelections',
        type: 'number',
        label: 'Máximo de Seleções',
        required: false,
        min: 1,
        max: 10,
        step: 1,
      },
    ],
    editorComponent: 'OptionsPropertyEditor',
    category: 'form',
  },

  text: {
    priority: 7,
    properties: [
      {
        name: 'content',
        type: 'textarea',
        label: 'Conteúdo do Texto',
        required: true,
        placeholder: 'Digite o conteúdo...',
      },
      {
        name: 'type',
        type: 'select',
        label: 'Tipo de Texto',
        required: true,
        options: ['paragraph', 'heading', 'caption', 'highlight'],
      },
      {
        name: 'alignment',
        type: 'select',
        label: 'Alinhamento',
        required: false,
        options: ['left', 'center', 'right', 'justify'],
      },
      {
        name: 'size',
        type: 'select',
        label: 'Tamanho',
        required: false,
        options: ['small', 'medium', 'large', 'xl'],
      },
    ],
    editorComponent: 'TextPropertyEditor',
    category: 'content',
  },

  button: {
    priority: 6,
    properties: [
      {
        name: 'text',
        type: 'text',
        label: 'Texto do Botão',
        required: true,
        placeholder: 'Ex: Continuar, Enviar, Próximo...',
      },
      {
        name: 'type',
        type: 'select',
        label: 'Tipo HTML',
        required: true,
        options: ['button', 'submit', 'reset'],
      },
      {
        name: 'action',
        type: 'select',
        label: 'Ação do Botão',
        required: true,
        options: ['next', 'submit', 'custom', 'back', 'save'],
      },
      {
        name: 'variant',
        type: 'select',
        label: 'Estilo Visual',
        required: false,
        options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
      },
    ],
    editorComponent: 'ButtonPropertyEditor',
    category: 'interaction',
  },

  navigation: {
    priority: 2,
    properties: [
      {
        name: 'type',
        type: 'select',
        label: 'Tipo de Navegação',
        required: true,
        options: ['progress', 'steps', 'breadcrumb', 'pagination'],
      },
      {
        name: 'showProgress',
        type: 'boolean',
        label: 'Mostrar Progresso',
        required: false,
      },
      {
        name: 'allowBack',
        type: 'boolean',
        label: 'Permitir Voltar',
        required: false,
      },
    ],
    editorComponent: 'NavigationPropertyEditor',
    category: 'navigation',
  },
};

/**
 * Função utilitária para obter configuração de um tipo de bloco
 */
export const getBlockEditorConfig = (blockType: string) => {
  return PROPERTY_EDITOR_REGISTRY[blockType] || null;
};

/**
 * Função utilitária para obter todos os tipos de bloco ordenados por prioridade
 */
export const getBlockTypesByPriority = () => {
  return Object.entries(PROPERTY_EDITOR_REGISTRY)
    .sort(([, a], [, b]) => b.priority - a.priority)
    .map(([type]) => type);
};

/**
 * Função utilitária para obter tipos de bloco por categoria
 */
export const getBlockTypesByCategory = (category: string) => {
  return Object.entries(PROPERTY_EDITOR_REGISTRY)
    .filter(([, config]) => config.category === category)
    .map(([type]) => type);
};
