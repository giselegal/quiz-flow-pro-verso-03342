// 🤖 SCHEMAS GERADOS AUTOMATICAMENTE
// Data: 2025-10-13T13:33:26.519Z
// Total: 52 schemas

export const GENERATED_SCHEMAS = {
  'container': {
    label: 'Container',
    fields: [
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'padding', label: 'Espaçamento Interno', type: 'text', group: 'layout', defaultValue: '1rem' },
    { key: 'maxWidth', label: 'Largura Máxima', type: 'text', group: 'layout', defaultValue: '1200px' },
    { key: 'borderRadius', label: 'Borda Arredondada', type: 'text', group: 'style', defaultValue: '0px' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'section': {
    label: 'Section',
    fields: [
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'padding', label: 'Espaçamento Interno', type: 'text', group: 'layout', defaultValue: '1rem' },
    { key: 'maxWidth', label: 'Largura Máxima', type: 'text', group: 'layout', defaultValue: '1200px' },
    { key: 'borderRadius', label: 'Borda Arredondada', type: 'text', group: 'style', defaultValue: '0px' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'box': {
    label: 'Box',
    fields: [
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'padding', label: 'Espaçamento Interno', type: 'text', group: 'layout', defaultValue: '1rem' },
    { key: 'maxWidth', label: 'Largura Máxima', type: 'text', group: 'layout', defaultValue: '1200px' },
    { key: 'borderRadius', label: 'Borda Arredondada', type: 'text', group: 'style', defaultValue: '0px' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'legal-notice': {
    label: 'Legal Notice',
    fields: [
    { key: 'content', label: 'Conteúdo', type: 'textarea', group: 'content', required: true },
    { key: 'fontSize', label: 'Tamanho da Fonte', type: 'text', group: 'style', defaultValue: '1rem' },
    { key: 'fontWeight', label: 'Peso da Fonte', type: 'select', group: 'style', options: [{label: 'Normal', value: 'normal'}, {label: 'Negrito', value: 'bold'}], defaultValue: 'normal' },
    { key: 'color', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'textAlign', label: 'Alinhamento', type: 'select', group: 'style', options: [{label: 'Esquerda', value: 'left'}, {label: 'Centro', value: 'center'}, {label: 'Direita', value: 'right'}], defaultValue: 'left' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'legal-notice-inline': {
    label: 'Legal Notice Inline',
    fields: [
    { key: 'content', label: 'Conteúdo', type: 'textarea', group: 'content', required: true },
    { key: 'fontSize', label: 'Tamanho da Fonte', type: 'text', group: 'style', defaultValue: '1rem' },
    { key: 'fontWeight', label: 'Peso da Fonte', type: 'select', group: 'style', options: [{label: 'Normal', value: 'normal'}, {label: 'Negrito', value: 'bold'}], defaultValue: 'normal' },
    { key: 'color', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'textAlign', label: 'Alinhamento', type: 'select', group: 'style', options: [{label: 'Esquerda', value: 'left'}, {label: 'Centro', value: 'center'}, {label: 'Direita', value: 'right'}], defaultValue: 'left' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'headline-inline': {
    label: 'Headline Inline',
    fields: [
    { key: 'content', label: 'Conteúdo', type: 'textarea', group: 'content', required: true },
    { key: 'fontSize', label: 'Tamanho da Fonte', type: 'text', group: 'style', defaultValue: '1rem' },
    { key: 'fontWeight', label: 'Peso da Fonte', type: 'select', group: 'style', options: [{label: 'Normal', value: 'normal'}, {label: 'Negrito', value: 'bold'}], defaultValue: 'normal' },
    { key: 'color', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'textAlign', label: 'Alinhamento', type: 'select', group: 'style', options: [{label: 'Esquerda', value: 'left'}, {label: 'Centro', value: 'center'}, {label: 'Direita', value: 'right'}], defaultValue: 'left' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'button-inline-fixed': {
    label: 'Button Inline Fixed',
    fields: [
    { key: 'text', label: 'Texto do Botão', type: 'text', group: 'content', required: true, defaultValue: 'Clique aqui' },
    { key: 'url', label: 'URL de Destino', type: 'text', group: 'content', defaultValue: '#' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#3b82f6' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'borderRadius', label: 'Borda Arredondada', type: 'text', group: 'style', defaultValue: '0.5rem' },
    { key: 'padding', label: 'Espaçamento Interno', type: 'text', group: 'style', defaultValue: '0.75rem 1.5rem' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'cta-inline': {
    label: 'Cta Inline',
    fields: [
    { key: 'text', label: 'Texto do Botão', type: 'text', group: 'content', required: true, defaultValue: 'Clique aqui' },
    { key: 'url', label: 'URL de Destino', type: 'text', group: 'content', defaultValue: '#' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#3b82f6' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'borderRadius', label: 'Borda Arredondada', type: 'text', group: 'style', defaultValue: '0.5rem' },
    { key: 'padding', label: 'Espaçamento Interno', type: 'text', group: 'style', defaultValue: '0.75rem 1.5rem' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-offer-cta-inline': {
    label: 'Quiz Offer Cta Inline',
    fields: [
    { key: 'text', label: 'Texto do Botão', type: 'text', group: 'content', required: true, defaultValue: 'Clique aqui' },
    { key: 'url', label: 'URL de Destino', type: 'text', group: 'content', defaultValue: '#' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#3b82f6' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'borderRadius', label: 'Borda Arredondada', type: 'text', group: 'style', defaultValue: '0.5rem' },
    { key: 'padding', label: 'Espaçamento Interno', type: 'text', group: 'style', defaultValue: '0.75rem 1.5rem' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-navigation': {
    label: 'Quiz Navigation',
    fields: [
    { key: 'showProgressBar', label: 'Mostrar Barra de Progresso', type: 'boolean', group: 'content', defaultValue: true },
    { key: 'showStepNumber', label: 'Mostrar Número do Step', type: 'boolean', group: 'content', defaultValue: true },
    { key: 'backButtonText', label: 'Texto Botão Voltar', type: 'text', group: 'content', defaultValue: 'Voltar' },
    { key: 'nextButtonText', label: 'Texto Botão Avançar', type: 'text', group: 'content', defaultValue: 'Próximo' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'progress-bar': {
    label: 'Progress Bar',
    fields: [
    { key: 'value', label: 'Valor (%)', type: 'range', group: 'content', min: 0, max: 100, defaultValue: 0 },
    { key: 'showLabel', label: 'Mostrar Rótulo', type: 'boolean', group: 'content', defaultValue: true },
    { key: 'color', label: 'Cor da Barra', type: 'color', group: 'style', defaultValue: '#3b82f6' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#e5e7eb' },
    { key: 'height', label: 'Altura', type: 'text', group: 'style', defaultValue: '8px' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'progress-inline': {
    label: 'Progress Inline',
    fields: [
    { key: 'value', label: 'Valor (%)', type: 'range', group: 'content', min: 0, max: 100, defaultValue: 0 },
    { key: 'showLabel', label: 'Mostrar Rótulo', type: 'boolean', group: 'content', defaultValue: true },
    { key: 'color', label: 'Cor da Barra', type: 'color', group: 'style', defaultValue: '#3b82f6' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#e5e7eb' },
    { key: 'height', label: 'Altura', type: 'text', group: 'style', defaultValue: '8px' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'loader-inline': {
    label: 'Loader Inline',
    fields: [
    { key: 'value', label: 'Valor (%)', type: 'range', group: 'content', min: 0, max: 100, defaultValue: 0 },
    { key: 'showLabel', label: 'Mostrar Rótulo', type: 'boolean', group: 'content', defaultValue: true },
    { key: 'color', label: 'Cor da Barra', type: 'color', group: 'style', defaultValue: '#3b82f6' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#e5e7eb' },
    { key: 'height', label: 'Altura', type: 'text', group: 'style', defaultValue: '8px' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'loading-animation': {
    label: 'Loading Animation',
    fields: [
    { key: 'value', label: 'Valor (%)', type: 'range', group: 'content', min: 0, max: 100, defaultValue: 0 },
    { key: 'showLabel', label: 'Mostrar Rótulo', type: 'boolean', group: 'content', defaultValue: true },
    { key: 'color', label: 'Cor da Barra', type: 'color', group: 'style', defaultValue: '#3b82f6' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#e5e7eb' },
    { key: 'height', label: 'Altura', type: 'text', group: 'style', defaultValue: '8px' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'decorative-bar': {
    label: 'Decorative Bar',
    fields: [
    { key: 'color', label: 'Cor', type: 'color', group: 'style', defaultValue: '#3b82f6' },
    { key: 'height', label: 'Altura', type: 'text', group: 'style', defaultValue: '4px' },
    { key: 'width', label: 'Largura', type: 'text', group: 'style', defaultValue: '100%' },
    { key: 'opacity', label: 'Opacidade', type: 'range', group: 'style', min: 0, max: 100, defaultValue: 100 },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'guarantee-badge': {
    label: 'Guarantee Badge',
    fields: [
    { key: 'color', label: 'Cor', type: 'color', group: 'style', defaultValue: '#3b82f6' },
    { key: 'height', label: 'Altura', type: 'text', group: 'style', defaultValue: '4px' },
    { key: 'width', label: 'Largura', type: 'text', group: 'style', defaultValue: '100%' },
    { key: 'opacity', label: 'Opacidade', type: 'range', group: 'style', min: 0, max: 100, defaultValue: 100 },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'gradient-animation': {
    label: 'Gradient Animation',
    fields: [
    { key: 'color', label: 'Cor', type: 'color', group: 'style', defaultValue: '#3b82f6' },
    { key: 'height', label: 'Altura', type: 'text', group: 'style', defaultValue: '4px' },
    { key: 'width', label: 'Largura', type: 'text', group: 'style', defaultValue: '100%' },
    { key: 'opacity', label: 'Opacidade', type: 'range', group: 'style', min: 0, max: 100, defaultValue: 100 },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-advanced-question': {
    label: 'Quiz Advanced Question',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-button': {
    label: 'Quiz Button',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-form': {
    label: 'Quiz Form',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-image': {
    label: 'Quiz Image',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-intro': {
    label: 'Quiz Intro',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-options-inline': {
    label: 'Quiz Options Inline',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-personal-info-inline': {
    label: 'Quiz Personal Info Inline',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-processing': {
    label: 'Quiz Processing',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-progress': {
    label: 'Quiz Progress',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-question-inline': {
    label: 'Quiz Question Inline',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-result-header': {
    label: 'Quiz Result Header',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-result-secondary': {
    label: 'Quiz Result Secondary',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-result-style': {
    label: 'Quiz Result Style',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-results': {
    label: 'Quiz Results',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-start-page-inline': {
    label: 'Quiz Start Page Inline',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-style-question': {
    label: 'Quiz Style Question',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-text': {
    label: 'Quiz Text',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-transition': {
    label: 'Quiz Transition',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'modular-result-header': {
    label: 'Modular Result Header',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'result-card': {
    label: 'Result Card',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'style-results': {
    label: 'Style Results',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'options-grid-inline': {
    label: 'Options Grid Inline',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'benefits-list': {
    label: 'Benefits List',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'bonus-inline': {
    label: 'Bonus Inline',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'personalized-hook-inline': {
    label: 'Personalized Hook Inline',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'final-value-proposition-inline': {
    label: 'Final Value Proposition Inline',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'testimonials-grid': {
    label: 'Testimonials Grid',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'step20-compatibility': {
    label: 'Step20 Compatibility',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'step20-complete-template': {
    label: 'Step20 Complete Template',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'step20-personalized-offer': {
    label: 'Step20 Personalized Offer',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'step20-result-header': {
    label: 'Step20 Result Header',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'step20-secondary-styles': {
    label: 'Step20 Secondary Styles',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'step20-style-reveal': {
    label: 'Step20 Style Reveal',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'step20-user-greeting': {
    label: 'Step20 User Greeting',
    fields: [
    { key: 'title', label: 'Título', type: 'text', group: 'content' },
    { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content' },
    { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
    { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
    { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'fashion-ai-generator': {
    label: 'Fashion Ai Generator',
    fields: [
    { key: 'apiKey', label: 'Chave da API', type: 'text', group: 'config' },
    { key: 'model', label: 'Modelo', type: 'text', group: 'config', defaultValue: 'gpt-4' },
    { key: 'prompt', label: 'Prompt', type: 'textarea', group: 'content' },
    { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  }
};
