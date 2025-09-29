/**
 * 🎯 CONFIGURAÇÃO DE ROTAS - SISTEMA DE EDIÇÃO QUIZ-ESTILO
 * 
 * Este arquivo documenta todas as rotas disponíveis para o sistema de edição
 * do quiz-estilo e suas funcionalidades.
 */

export interface RouteConfig {
  path: string;
  name: string;
  description: string;
  component: string;
  props?: Record<string, any>;
  protected?: boolean;
  testId?: string;
}

export const QUIZ_ESTILO_ROUTES: Record<string, RouteConfig> = {
  // 🎯 ROTA PRINCIPAL DO QUIZ
  quizEstilo: {
    path: '/quiz-estilo',
    name: 'Quiz Estilo Pessoal',
    description: 'Página principal do quiz de estilo pessoal',
    component: 'QuizEstiloPessoalPage',
    testId: 'quiz-estilo-page'
  },

  // 🎯 EDITOR DO QUIZ ESTILO
  quizEstiloEditor: {
    path: '/editor/quiz-estilo',
    name: 'Editor Quiz Estilo',
    description: 'Editor visual para o quiz de estilo pessoal',
    component: 'QuizEstiloPessoalPage',
    props: {
      funnelId: 'quiz-estilo-21-steps',
      editMode: true
    },
    testId: 'quiz-estilo-editor-page'
  },

  // 🎯 EDITOR GENÉRICO COM FUNNEL ID
  editorWithFunnel: {
    path: '/editor/:funnelId',
    name: 'Editor com Funnel ID',
    description: 'Editor genérico com suporte a funnelId dinâmico',
    component: 'ModernUnifiedEditor',
    testId: 'modern-unified-editor-funnel-page'
  },

  // 🎯 EDITOR PRINCIPAL
  editor: {
    path: '/editor',
    name: 'Editor Principal',
    description: 'Editor visual principal',
    component: 'ModernUnifiedEditor',
    testId: 'modern-unified-editor-page'
  },

  // 🎯 QUIZ DINÂMICO
  quizDynamic: {
    path: '/quiz/:funnelId',
    name: 'Quiz Dinâmico',
    description: 'Quiz com suporte a diferentes templates',
    component: 'QuizEstiloPessoalPage',
    testId: 'quiz-dynamic-page'
  }
};

export const NAVIGATION_LINKS = [
  {
    label: 'Quiz Estilo',
    path: '/quiz-estilo',
    description: 'Fazer o quiz de estilo pessoal'
  },
  {
    label: 'Editor Quiz',
    path: '/editor/quiz-estilo',
    description: 'Editar o quiz de estilo pessoal'
  },
  {
    label: 'Editor Principal',
    path: '/editor',
    description: 'Editor visual principal'
  },
  {
    label: 'Templates',
    path: '/templates',
    description: 'Gerenciar templates'
  }
];

export const EDITOR_FEATURES = {
  quizEstiloEditor: [
    'Edição visual de etapas',
    'Preview em tempo real',
    'Sistema de validação',
    'Auto-save',
    'Gerenciamento de templates',
    'Backup automático',
    'Métricas de performance'
  ],
  
  navigation: [
    'Navegação entre etapas',
    'Drag & drop de etapas',
    'Duplicação de etapas',
    'Reordenação de etapas',
    'Exclusão de etapas'
  ],
  
  content: [
    'Edição de títulos',
    'Edição de perguntas',
    'Configuração de opções',
    'Personalização de estilos',
    'Configurações de comportamento'
  ],
  
  preview: [
    'Preview em tempo real',
    'Teste de responsividade',
    'Simulação de usuário',
    'Validação de fluxo',
    'Métricas de performance'
  ]
};

export const USAGE_EXAMPLES = {
  accessEditor: {
    description: 'Como acessar o editor do quiz-estilo',
    steps: [
      '1. Navegue para /editor/quiz-estilo',
      '2. O sistema carregará automaticamente o modo de edição',
      '3. Use a interface visual para editar etapas',
      '4. Preview as mudanças em tempo real',
      '5. Salve as alterações'
    ]
  },
  
  editSteps: {
    description: 'Como editar etapas do quiz',
    steps: [
      '1. Selecione uma etapa na sidebar',
      '2. Edite o conteúdo na aba "Conteúdo"',
      '3. Configure opções na aba "Configurações"',
      '4. Personalize estilos na aba "Estilos"',
      '5. Visualize o preview na aba "Preview"'
    ]
  },
  
  manageTemplates: {
    description: 'Como gerenciar templates',
    steps: [
      '1. Acesse o gerenciador de templates',
      '2. Crie novos templates ou importe existentes',
      '3. Configure templates personalizados',
      '4. Exporte templates para compartilhamento',
      '5. Use templates em diferentes funis'
    ]
  }
};

export default {
  routes: QUIZ_ESTILO_ROUTES,
  navigation: NAVIGATION_LINKS,
  features: EDITOR_FEATURES,
  examples: USAGE_EXAMPLES
};
