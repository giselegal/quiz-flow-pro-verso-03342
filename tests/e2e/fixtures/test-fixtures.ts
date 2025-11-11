/**
 * 🎭 FIXTURES E DADOS DE TESTE
 * 
 * Sistema de fixtures para dados de teste reutilizáveis,
 * mocks e configurações padronizadas.
 */

// Dados de quiz de exemplo
export const QUIZ_FIXTURES = {
  BASIC_QUIZ: {
    id: 'test-quiz-001',
    title: 'Quiz de Estilo - Teste',
    description: 'Quiz para testar funcionalidades básicas',
    questions: [
      {
        id: 'q1',
        text: 'Qual é o seu estilo preferido?',
        type: 'multiple-choice',
        options: [
          { id: 'a1', text: 'Moderno', value: 'modern' },
          { id: 'a2', text: 'Clássico', value: 'classic' },
          { id: 'a3', text: 'Minimalista', value: 'minimal' },
        ],
      },
      {
        id: 'q2',
        text: 'Que cores você prefere?',
        type: 'multiple-choice',
        options: [
          { id: 'b1', text: 'Cores quentes', value: 'warm' },
          { id: 'b2', text: 'Cores frias', value: 'cool' },
          { id: 'b3', text: 'Cores neutras', value: 'neutral' },
        ],
      },
    ],
  },
  
  COMPLEX_QUIZ: {
    id: 'test-quiz-002',
    title: 'Quiz Completo - Teste E2E',
    description: 'Quiz complexo com múltiplos tipos de pergunta',
    questions: [
      {
        id: 'complex-q1',
        text: 'Como você descreveria seu estilo pessoal?',
        type: 'multiple-choice',
        options: [
          { id: 'opt1', text: 'Aventureiro e dinâmico', value: 'adventurous' },
          { id: 'opt2', text: 'Elegante e sofisticado', value: 'elegant' },
          { id: 'opt3', text: 'Casual e confortável', value: 'casual' },
          { id: 'opt4', text: 'Criativo e único', value: 'creative' },
        ],
      },
      {
        id: 'complex-q2',
        text: 'Qual ambiente você prefere?',
        type: 'single-select',
        options: [
          { id: 'env1', text: 'Urbano e movimentado', value: 'urban' },
          { id: 'env2', text: 'Natural e tranquilo', value: 'nature' },
          { id: 'env3', text: 'Histórico e cultural', value: 'historic' },
        ],
      },
      {
        id: 'complex-q3',
        text: 'Em uma escala de 1 a 10, quão importante é o design para você?',
        type: 'scale',
        min: 1,
        max: 10,
        step: 1,
      },
    ],
  },
} as const;

// Templates de editor para teste
export const TEMPLATE_FIXTURES = {
  SIMPLE_TEMPLATE: {
    id: 'template-001',
    name: 'Template Simples',
    category: 'basic',
    components: [
      {
        id: 'header-1',
        type: 'header',
        content: 'Título do Template',
        style: { fontSize: '24px', color: '#333' },
      },
      {
        id: 'text-1',
        type: 'text',
        content: 'Este é um texto de exemplo para teste.',
        style: { fontSize: '16px', color: '#666' },
      },
      {
        id: 'button-1',
        type: 'button',
        content: 'Clique Aqui',
        style: { backgroundColor: '#007bff', color: 'white' },
      },
    ],
  },
  
  RICH_TEMPLATE: {
    id: 'template-002',
    name: 'Template Rico',
    category: 'advanced',
    components: [
      {
        id: 'hero-section',
        type: 'hero',
        content: {
          title: 'Bem-vindo ao Quiz Flow',
          subtitle: 'Crie quizzes incríveis com nosso editor',
          image: '/api/placeholder/800/400',
        },
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '60px 20px',
        },
      },
      {
        id: 'feature-grid',
        type: 'grid',
        content: {
          columns: 3,
          items: [
            { icon: '🎨', title: 'Design', text: 'Interface intuitiva' },
            { icon: '⚡', title: 'Performance', text: 'Carregamento rápido' },
            { icon: '📱', title: 'Responsivo', text: 'Funciona em todos os dispositivos' },
          ],
        },
      },
    ],
  },
} as const;

// Dados de usuário para teste
export const USER_FIXTURES = {
  ADMIN_USER: {
    id: 'admin-001',
    email: 'admin@test.com',
    name: 'Admin Teste',
    role: 'admin',
    permissions: ['read', 'write', 'delete', 'admin'],
  },
  
  REGULAR_USER: {
    id: 'user-001',
    email: 'user@test.com',
    name: 'Usuário Teste',
    role: 'user',
    permissions: ['read', 'write'],
  },
  
  GUEST_USER: {
    id: 'guest-001',
    email: 'guest@test.com',
    name: 'Convidado Teste',
    role: 'guest',
    permissions: ['read'],
  },
} as const;

// Respostas de API mockadas
export const API_FIXTURES = {
  QUIZ_LIST_RESPONSE: {
    success: true,
    data: [
      {
        id: 'quiz-001',
        title: 'Quiz de Personalidade',
        description: 'Descubra seu tipo de personalidade',
        questionCount: 10,
        completions: 1250,
        createdAt: '2024-01-15T10:30:00Z',
        status: 'published',
      },
      {
        id: 'quiz-002',
        title: 'Quiz de Conhecimentos Gerais',
        description: 'Teste seus conhecimentos',
        questionCount: 15,
        completions: 850,
        createdAt: '2024-01-10T14:20:00Z',
        status: 'draft',
      },
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 2,
      totalPages: 1,
    },
  },
  
  QUIZ_ANALYTICS_RESPONSE: {
    success: true,
    data: {
      totalViews: 5420,
      totalCompletions: 3250,
      completionRate: 59.96,
      averageTime: 245, // segundos
      topPerformers: [
        { question: 'Pergunta 1', correctRate: 85.2 },
        { question: 'Pergunta 3', correctRate: 78.9 },
        { question: 'Pergunta 5', correctRate: 72.1 },
      ],
      demographics: {
        ageGroups: [
          { range: '18-25', percentage: 35.2 },
          { range: '26-35', percentage: 28.7 },
          { range: '36-45', percentage: 20.1 },
          { range: '46+', percentage: 16.0 },
        ],
        locations: [
          { country: 'Brasil', percentage: 45.8 },
          { country: 'Portugal', percentage: 25.3 },
          { country: 'Angola', percentage: 12.1 },
          { country: 'Outros', percentage: 16.8 },
        ],
      },
    },
  },
  
  ERROR_RESPONSES: {
    NOT_FOUND: {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Recurso não encontrado',
        details: 'O quiz solicitado não existe ou foi removido',
      },
    },
    
    VALIDATION_ERROR: {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Dados inválidos',
        details: {
          title: 'Título é obrigatório',
          questions: 'Deve ter pelo menos uma pergunta',
        },
      },
    },
    
    SERVER_ERROR: {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Erro interno do servidor',
        details: 'Tente novamente mais tarde',
      },
    },
  },
} as const;

// Configurações de viewport para testes responsivos
export const VIEWPORT_FIXTURES = {
  MOBILE_PORTRAIT: { width: 375, height: 667, name: 'iPhone SE' },
  MOBILE_LANDSCAPE: { width: 667, height: 375, name: 'iPhone SE Landscape' },
  
  TABLET_PORTRAIT: { width: 768, height: 1024, name: 'iPad Portrait' },
  TABLET_LANDSCAPE: { width: 1024, height: 768, name: 'iPad Landscape' },
  
  DESKTOP_SMALL: { width: 1366, height: 768, name: 'Desktop Small' },
  DESKTOP_MEDIUM: { width: 1920, height: 1080, name: 'Desktop Medium' },
  DESKTOP_LARGE: { width: 2560, height: 1440, name: 'Desktop Large' },
  
  ULTRA_WIDE: { width: 3440, height: 1440, name: 'Ultra Wide' },
} as const;

// Dados de performance para comparação
export const PERFORMANCE_FIXTURES = {
  GOOD_METRICS: {
    firstContentfulPaint: 1200, // ms
    largestContentfulPaint: 2500,
    firstInputDelay: 100,
    cumulativeLayoutShift: 0.1,
    totalBlockingTime: 200,
  },
  
  ACCEPTABLE_METRICS: {
    firstContentfulPaint: 2000,
    largestContentfulPaint: 4000,
    firstInputDelay: 200,
    cumulativeLayoutShift: 0.15,
    totalBlockingTime: 400,
  },
  
  POOR_METRICS: {
    firstContentfulPaint: 3500,
    largestContentfulPaint: 6000,
    firstInputDelay: 400,
    cumulativeLayoutShift: 0.25,
    totalBlockingTime: 800,
  },
} as const;

// Strings e textos para validação
export const TEXT_FIXTURES = {
  COMMON_TEXTS: {
    WELCOME: ['Bem-vindo', 'Welcome', 'Bienvenido'],
    LOADING: ['Carregando', 'Loading', 'Cargando', 'A carregar'],
    ERROR: ['Erro', 'Error', 'Erro:', 'Falha'],
    SUCCESS: ['Sucesso', 'Success', 'Completado', 'Concluído'],
    NEXT: ['Próximo', 'Next', 'Siguiente', 'Avançar'],
    PREVIOUS: ['Anterior', 'Previous', 'Voltar', 'Anterior'],
    SUBMIT: ['Enviar', 'Submit', 'Submeter', 'Confirmar'],
    CANCEL: ['Cancelar', 'Cancel', 'Cancelar'],
  },
  
  QUIZ_TEXTS: {
    START_QUIZ: ['Iniciar Quiz', 'Começar', 'Start Quiz'],
    QUESTION_OF: ['Pergunta', 'Question', 'de', 'of'],
    COMPLETED: ['Completado', 'Finalizado', 'Completed', 'Finished'],
    RESULTS: ['Resultados', 'Results', 'Resultado'],
    RESTART: ['Reiniciar', 'Restart', 'Começar Novamente'],
  },
  
  EDITOR_TEXTS: {
    SAVE: ['Salvar', 'Save', 'Guardar'],
    PREVIEW: ['Visualizar', 'Preview', 'Pré-visualizar'],
    PUBLISH: ['Publicar', 'Publish', 'Lançar'],
    DRAFT: ['Rascunho', 'Draft', 'Esboço'],
    TEMPLATE: ['Template', 'Modelo', 'Gabarito'],
  },
} as const;

// Configurações de teste por ambiente
export const ENVIRONMENT_FIXTURES = {
  DEVELOPMENT: {
    baseUrl: 'http://localhost:8080',
    apiUrl: 'http://localhost:8080/api',
    timeout: 30000,
    retries: 2,
    slowMo: 0,
    headless: false,
  },
  
  STAGING: {
    baseUrl: 'https://staging.quizflow.com',
    apiUrl: 'https://staging-api.quizflow.com',
    timeout: 45000,
    retries: 3,
    slowMo: 100,
    headless: true,
  },
  
  PRODUCTION: {
    baseUrl: 'https://quizflow.com',
    apiUrl: 'https://api.quizflow.com',
    timeout: 60000,
    retries: 1,
    slowMo: 0,
    headless: true,
  },
} as const;

// Padrões de localStorage para diferentes estados
export const LOCALSTORAGE_FIXTURES = {
  EMPTY_STATE: {},
  
  USER_SESSION: {
    'user-session': JSON.stringify({
      id: 'user-123',
      token: 'mock-jwt-token',
      expiresAt: Date.now() + 3600000, // 1 hora
    }),
    'user-preferences': JSON.stringify({
      theme: 'light',
      language: 'pt-BR',
      notifications: true,
    }),
  },
  
  QUIZ_PROGRESS: {
    'quiz-progress-001': JSON.stringify({
      quizId: 'quiz-001',
      currentQuestion: 3,
      answers: { q1: 'a1', q2: 'b2' },
      startTime: Date.now() - 120000, // 2 minutos atrás
    }),
  },
  
  EDITOR_STATE: {
    'editor-draft': JSON.stringify({
      templateId: 'template-001',
      components: [
        { id: 'comp-1', type: 'header', content: 'Título editado' },
      ],
      lastSaved: Date.now() - 30000, // 30 segundos atrás
    }),
    'editor-settings': JSON.stringify({
      gridSnap: true,
      showRulers: false,
      autoSave: true,
    }),
  },
} as const;

// Helpers para criar fixtures dinâmicas
export function createQuizFixture(overrides: Partial<typeof QUIZ_FIXTURES.BASIC_QUIZ> = {}) {
  return {
    ...QUIZ_FIXTURES.BASIC_QUIZ,
    ...overrides,
    id: overrides.id || `quiz-${Date.now()}`,
  };
}

export function createUserFixture(overrides: Partial<typeof USER_FIXTURES.REGULAR_USER> = {}) {
  return {
    ...USER_FIXTURES.REGULAR_USER,
    ...overrides,
    id: overrides.id || `user-${Date.now()}`,
  };
}

export function createApiResponse<T>(data: T, overrides: { success?: boolean; error?: any } = {}) {
  return {
    success: overrides.success ?? true,
    data: overrides.success !== false ? data : undefined,
    error: overrides.error || undefined,
    timestamp: new Date().toISOString(),
  };
}

// Validadores de fixtures
export function validateQuizFixture(quiz: any): boolean {
  return !!(
    quiz.id &&
    quiz.title &&
    quiz.questions &&
    Array.isArray(quiz.questions) &&
    quiz.questions.length > 0
  );
}

export function validateUserFixture(user: any): boolean {
  return !!(
    user.id &&
    user.email &&
    user.name &&
    user.role &&
    user.permissions &&
    Array.isArray(user.permissions)
  );
}