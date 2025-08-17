import { EditorValidations } from '../hooks/useEditorFieldValidation';

// Validações para cada tipo de bloco nos templates
export const templateValidations: Record<string, EditorValidations> = {
  // Blocos de Texto
  'text-block': {
    content: [
      { type: 'required', properties: {} },
      { type: 'minLength', properties: { min: 10 } }
    ],
    fontSize: [
      {
        type: 'pattern',
        properties: {
          regex: '^\\d+(px|rem|em)$',
          message: 'Formato inválido. Use px, rem ou em'
        }
      }
    ]
  },

  // Blocos de Perguntas
  'question-block': {
    question: [
      { type: 'required', properties: {} },
      { type: 'minLength', properties: { min: 15 } }
    ],
    options: [
      {
        type: 'custom',
        properties: {
          validator: (value: unknown) => 
            Array.isArray(value) && value.length >= 2,
          message: 'Adicione pelo menos 2 opções'
        }
      }
    ]
  },

  // Blocos de Imagem
  'image-block': {
    src: [
      { type: 'required', properties: {} },
      {
        type: 'pattern',
        properties: {
          regex: '^https?://.+\\.(jpg|jpeg|png|gif|webp)$',
          message: 'URL de imagem inválida'
        }
      }
    ],
    alt: [
      { type: 'required', properties: {} },
      { type: 'minLength', properties: { min: 5 } }
    ]
  },

  // Blocos de Vídeo
  'video-block': {
    url: [
      { type: 'required', properties: {} },
      {
        type: 'pattern',
        properties: {
          regex: '^(https?://)?(www\\.)?(youtube\\.com|youtu\\.be)/.+',
          message: 'URL do YouTube inválida'
        }
      }
    ],
    autoplay: [
      {
        type: 'custom',
        properties: {
          validator: (value: unknown) => typeof value === 'boolean',
          message: 'Valor inválido para autoplay'
        }
      }
    ]
  },

  // Blocos de Formulário
  'form-block': {
    fields: [
      {
        type: 'custom',
        properties: {
          validator: (value: unknown) => 
            Array.isArray(value) && value.length > 0,
          message: 'Adicione pelo menos 1 campo'
        }
      }
    ],
    submitButtonText: [
      { type: 'required', properties: {} }
    ]
  },

  // Blocos de Botão
  'button-block': {
    text: [
      { type: 'required', properties: {} },
      { type: 'maxLength', properties: { max: 30 } }
    ],
    action: [
      { type: 'required', properties: {} }
    ]
  },

  // Blocos de Grade
  'grid-block': {
    columns: [
      {
        type: 'custom',
        properties: {
          validator: (value: unknown) => 
            typeof value === 'number' && value >= 1 && value <= 4,
          message: 'Número de colunas deve ser entre 1 e 4'
        }
      }
    ],
    gap: [
      {
        type: 'pattern',
        properties: {
          regex: '^\\d+(px|rem)$',
          message: 'Formato inválido para espaçamento'
        }
      }
    ]
  },

  // Blocos de Quiz
  'quiz-block': {
    title: [
      { type: 'required', properties: {} }
    ],
    questions: [
      {
        type: 'custom',
        properties: {
          validator: (value: unknown) => 
            Array.isArray(value) && value.length >= 1,
          message: 'Adicione pelo menos 1 pergunta'
        }
      }
    ],
    timeLimit: [
      {
        type: 'custom',
        properties: {
          validator: (value: unknown) => 
            typeof value === 'number' && value >= 30 && value <= 3600,
          message: 'Tempo deve ser entre 30s e 3600s'
        }
      }
    ]
  },

  // Blocos de Progresso
  'progress-block': {
    currentStep: [
      {
        type: 'custom',
        properties: {
          validator: (value: unknown) => 
            typeof value === 'number' && value >= 1,
          message: 'Etapa atual inválida'
        }
      }
    ],
    totalSteps: [
      {
        type: 'custom',
        properties: {
          validator: (value: unknown) => 
            typeof value === 'number' && value >= 1,
          message: 'Total de etapas inválido'
        }
      }
    ]
  }
};
