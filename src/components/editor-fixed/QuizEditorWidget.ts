// =============================================================================
// INTEGRAÇÃO SIMPLES DO QUIZ EDITOR NO EDITOR-FIXED
// Quiz Quest Challenge Verse - Integração Básica
// =============================================================================

/**
 * INSTRUÇÕES DE USO:
 *
 * 1. Para usar o Quiz Editor integrado:
 *    import { IntegratedQuizEditor } from '@/components/editor/quiz-specific/IntegratedQuizEditor';
 *
 * 2. Para usar via editor-fixed:
 *    import { QuizEditorWidget } from '@/components/editor-fixed/QuizEditorWidget';
 *
 * 3. Componente funcional completo já está em:
 *    /src/components/editor/quiz-specific/IntegratedQuizEditor.tsx
 */

// =============================================================================
// WIDGET PARA INTEGRAÇÃO NO EDITOR-FIXED
// =============================================================================

export const QUIZ_EDITOR_CONFIG = {
  name: 'Quiz Editor Integration',
  version: '1.0.0',
  location: {
    main: '/src/components/editor/quiz-specific/IntegratedQuizEditor.tsx',
    hook: '/src/hooks/useSupabaseQuizEditor.ts',
    types: '/src/types/quiz.ts',
  },
  features: [
    'Editor completo de quiz com 100% funcionalidade',
    'Integração com Supabase (URL Lovable configurada)',
    'Backup automático com localStorage',
    'Interface responsiva com tabs (Editor/Gerenciar/Configurações)',
    'CRUD completo (Create, Read, Update, Delete)',
    'Teste de conectividade automático',
  ],
  integration: {
    status: 'READY',
    components: {
      main: 'IntegratedQuizEditor',
      hook: 'useSupabaseQuizEditor',
      examples: 'QuizEditorExamples',
    },
  },
} as const;

// =============================================================================
// FUNÇÃO HELPER PARA CARREGAR O EDITOR
// =============================================================================

export const loadQuizEditor = async () => {
  try {
    // Importação dinâmica do componente principal
    const { IntegratedQuizEditor } = await import('../editor/quiz-specific/IntegratedQuizEditor');
    const { useSupabaseQuizEditor } = await import('@/hooks/useSupabaseQuizEditor');

    return {
      Component: IntegratedQuizEditor,
      Hook: useSupabaseQuizEditor,
      status: 'loaded',
    };
  } catch (error) {
    console.error('Erro ao carregar Quiz Editor:', error);
    return {
      Component: null,
      Hook: null,
      status: 'error',
      error,
    };
  }
};

// =============================================================================
// INTEGRAÇÃO NO BLOCO REGISTRY
// =============================================================================

export const QUIZ_EDITOR_BLOCK = {
  id: 'quiz-editor-integrated',
  type: 'quiz-editor',
  name: 'Quiz Editor',
  category: 'Interactive',
  subcategory: 'Quiz & Forms',
  description: 'Editor completo de quiz com integração Supabase',
  icon: 'BookOpen',
  component: 'IntegratedQuizEditor',
  path: '/src/components/editor/quiz-specific/IntegratedQuizEditor',

  // Configurações padrão
  defaultProps: {
    initialTab: 'editor',
    showHeader: true,
    showStats: true,
  },

  // Propriedades editáveis
  editableProps: {
    initialTab: {
      type: 'select',
      options: ['editor', 'manage', 'settings'],
      default: 'editor',
    },
    showHeader: {
      type: 'boolean',
      default: true,
    },
    showStats: {
      type: 'boolean',
      default: true,
    },
  },

  // Estilos padrão
  styles: {
    width: '100%',
    minHeight: '600px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
  },

  // Validação
  validate: (props: any) => {
    return {
      isValid: true,
      errors: [],
    };
  },
} as const;

// =============================================================================
// DOCUMENTAÇÃO DE USO
// =============================================================================

export const QUIZ_EDITOR_DOCS = {
  title: 'Quiz Editor Integration - Editor Fixed',

  quickStart: `
    // 1. Importar o componente principal
    import { IntegratedQuizEditor } from '@/components/editor/quiz-specific/IntegratedQuizEditor';
    
    // 2. Usar no seu componente
    function MyPage() {
      return (
        <div>
          <h1>Meu Quiz Editor</h1>
          <IntegratedQuizEditor />
        </div>
      );
    }
  `,

  examples: {
    basic: `
      // Uso básico
      <IntegratedQuizEditor />
    `,

    withProps: `
      // Com propriedades personalizadas
      <IntegratedQuizEditor 
        initialTab="manage"
        showHeader={false}
      />
    `,

    withHook: `
      // Usando o hook diretamente
      import { useSupabaseQuizEditor } from '@/hooks/useSupabaseQuizEditor';
      
      function CustomQuizEditor() {
        const { saveQuiz, loadAllQuizzes, isLoading } = useSupabaseQuizEditor();
        
        // Sua lógica personalizada aqui
        return <div>Custom Quiz Editor</div>;
      }
    `,
  },

  features: QUIZ_EDITOR_CONFIG.features,

  troubleshooting: {
    'Não aparece o editor': 'Verifique se o import está correto e se não há erros no console',
    'Erro de conexão':
      'Verifique se as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão configuradas',
    'Dados não salvam': 'Sistema usa localStorage como backup se Supabase não estiver disponível',
  },
};

// =============================================================================
// EXPORT DEFAULT
// =============================================================================

export default {
  config: QUIZ_EDITOR_CONFIG,
  loadEditor: loadQuizEditor,
  block: QUIZ_EDITOR_BLOCK,
  docs: QUIZ_EDITOR_DOCS,
};
