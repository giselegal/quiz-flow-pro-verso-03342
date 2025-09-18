/**
 * 🎭 COMPREHENSIVE MOCKS - TESTING SYSTEM
 * 
 * FASE 6: Mocks avançados para todos os sistemas consolidados:
 * ✅ Services mocking com state consistency
 * ✅ Hooks mocking com React patterns
 * ✅ Schema mocking com validation
 * ✅ External APIs e dependencies
 * ✅ File system e browser APIs
 */

import { vi, beforeEach } from 'vitest';
import type { Quiz, Question, QuizSettings } from '../consolidated/schemas/masterSchema';

// === ZUSTAND STORE MOCKS ===

// Mock do Zustand para testes isolados
vi.mock('zustand', () => ({
    create: vi.fn((createFn) => {
        let state = createFn(() => { }, () => { }, { setState: vi.fn(), getState: vi.fn() });

        return {
            getState: () => state,
            setState: (partial: any) => {
                state = typeof partial === 'function' ? partial(state) : { ...state, ...partial };
            },
            subscribe: vi.fn(),
            destroy: vi.fn()
        };
    })
}));

// === SERVICES MOCKS ===

// Mock do UnifiedEditorService
export const mockUnifiedEditorService = {
    createQuiz: vi.fn(async (data: Partial<Quiz>): Promise<Quiz> => ({
        id: `quiz-${Date.now()}`,
        title: data.title || 'Mock Quiz',
        description: data.description || 'Mock description',
        questions: data.questions || [],
        settings: data.settings || {
            timeLimit: 300,
            allowBacktrack: true,
            shuffleQuestions: false
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    })),

    updateQuiz: vi.fn(async (id: string, updates: Partial<Quiz>): Promise<Quiz> => ({
        id,
        title: updates.title || 'Updated Quiz',
        description: updates.description || 'Updated description',
        questions: updates.questions || [],
        settings: updates.settings || {
            timeLimit: 300,
            allowBacktrack: true,
            shuffleQuestions: false
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: new Date().toISOString()
    })),

    addQuestion: vi.fn(async (quizId: string, question: Question): Promise<Quiz> => {
        const mockQuiz = await mockUnifiedEditorService.createQuiz({});
        return {
            ...mockQuiz,
            id: quizId,
            questions: [question]
        };
    }),

    removeQuestion: vi.fn(async (quizId: string, questionId: string): Promise<Quiz> => {
        const mockQuiz = await mockUnifiedEditorService.createQuiz({});
        return {
            ...mockQuiz,
            id: quizId,
            questions: []
        };
    })
};

// Mock do GlobalStateService
export const mockGlobalStateService = {
    getInstance: vi.fn(() => ({
        getState: vi.fn(() => ({
            currentQuiz: null,
            isLoading: false,
            error: null,
            user: null,
            settings: {}
        })),

        setState: vi.fn((key: string, value: any) => {
            console.log(`GlobalState.setState called: ${key}`, value);
        }),

        subscribe: vi.fn(),
        unsubscribe: vi.fn(),

        reset: vi.fn(() => {
            console.log('GlobalState.reset called');
        })
    }))
};

// === HOOKS MOCKS ===

// Mock do useUnifiedEditor
export const mockUseUnifiedEditor = {
    state: {
        quiz: {
            id: 'mock-quiz',
            title: 'Mock Quiz',
            description: 'Quiz for testing',
            questions: [],
            settings: {
                timeLimit: 300,
                allowBacktrack: true,
                shuffleQuestions: false
            },
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
        },
        currentQuestionIndex: 0,
        isLoading: false,
        error: null,
        hasUnsavedChanges: false
    },

    actions: {
        setQuiz: vi.fn(),
        updateQuiz: vi.fn(),
        addQuestion: vi.fn(),
        removeQuestion: vi.fn(),
        updateQuestion: vi.fn(),
        setCurrentQuestion: vi.fn(),
        saveQuiz: vi.fn(),
        loadQuiz: vi.fn(),
        resetEditor: vi.fn()
    }
};

// Mock do useGlobalState
export const mockUseGlobalState = vi.fn(() => ({
    state: {
        currentQuiz: null,
        isLoading: false,
        error: null,
        user: { id: 'test-user', name: 'Test User' },
        settings: {}
    },

    actions: {
        setCurrentQuiz: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        setUser: vi.fn(),
        updateSettings: vi.fn(),
        reset: vi.fn()
    }
}));

// === OPTIMIZATION MOCKS ===

// Mock do BundleOptimizer
export const mockBundleOptimizer = {
    analyzeChunks: vi.fn(async (dir: string) => ({
        vendors: ['react', 'react-dom'],
        common: ['utils', 'constants'],
        features: ['editor', 'quiz-player'],
        estimated_size: {
            vendors: '150KB',
            common: '50KB',
            features: '100KB'
        }
    })),

    optimizeBuild: vi.fn(async () => ({
        originalSize: '692KB',
        optimizedSize: '150KB',
        reduction: '78%',
        chunksCreated: 5
    })),

    preloadCritical: vi.fn(),
    lazyLoadFeatures: vi.fn()
};

// === MIGRATION MOCKS ===

// Mock do MigrationSystem
export const mockMigrationSystem = {
    analyzeProject: vi.fn(async (dir: string) => [
        {
            filePath: '/mock/file1.ts',
            type: 'service',
            estimatedComplexity: 'low',
            applicableRules: ['consolidate-services'],
            dependencies: []
        }
    ]),

    migrateProject: vi.fn(async (options: any) => ({
        migratedFiles: 5,
        failedFiles: 0,
        skippedFiles: 2,
        totalTime: 1500,
        results: [
            {
                filePath: '/mock/file1.ts',
                success: true,
                changes: ['Consolidated service imports'],
                errors: []
            }
        ],
        estimatedSavings: {
            lines: 150,
            kb: 50,
            files: 3
        }
    })),

    rollback: vi.fn(async (filePath: string) => true),

    validateMigration: vi.fn(async () => ({
        isValid: true,
        issues: [],
        recommendations: []
    }))
};

// === FILE SYSTEM MOCKS ===

// Mock do fs/promises para testes de migração
vi.mock('fs/promises', () => ({
    readdir: vi.fn(async () => ['file1.ts', 'file2.ts']),
    readFile: vi.fn(async (path: string) => {
        if (path.includes('package.json')) {
            return JSON.stringify({
                name: 'test-project',
                version: '1.0.0',
                scripts: {},
                dependencies: {}
            });
        }
        return 'mock file content';
    }),
    writeFile: vi.fn(async () => undefined),
    mkdir: vi.fn(async () => undefined),
    access: vi.fn(async () => undefined),
    stat: vi.fn(async () => ({
        isDirectory: () => false,
        isFile: () => true,
        size: 1024
    }))
}));

// === NETWORK MOCKS ===

// Mock do fetch para APIs externas
global.fetch = vi.fn() as any;

export const mockFetch = (responseData: any, options: { status?: number; ok?: boolean } = {}) => {
    (global.fetch as any).mockResolvedValue({
        ok: options.ok ?? true,
        status: options.status ?? 200,
        json: () => Promise.resolve(responseData),
        text: () => Promise.resolve(typeof responseData === 'string' ? responseData : JSON.stringify(responseData))
    });
};

// === TIMER MOCKS ===

// Mock de timers para testes de performance
export const mockTimers = () => {
    vi.useFakeTimers();
    return {
        advanceTime: (ms: number) => vi.advanceTimersByTime(ms),
        runAllTimers: () => vi.runAllTimers(),
        restore: () => vi.useRealTimers()
    };
};

// === SETUP DE MOCKS ===

beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Configure default mocks
    mockFetch({ success: true });

    // Reset Zustand stores
    mockGlobalStateService.getInstance().getState.mockReturnValue({
        currentQuiz: null,
        isLoading: false,
        error: null,
        user: null,
        settings: {}
    });

    // Reset hooks state
    mockUseUnifiedEditor.state.quiz.questions = [];
    mockUseUnifiedEditor.state.currentQuestionIndex = 0;
    mockUseUnifiedEditor.state.isLoading = false;
    mockUseUnifiedEditor.state.error = null;
});

// === MOCK PROVIDERS ===

// Mock setup para módulos específicos
vi.mock('../consolidated/services/UnifiedEditorService', () => ({
    UnifiedEditorService: class MockUnifiedEditorService {
        createQuiz = mockUnifiedEditorService.createQuiz;
        updateQuiz = mockUnifiedEditorService.updateQuiz;
        addQuestion = mockUnifiedEditorService.addQuestion;
        removeQuestion = mockUnifiedEditorService.removeQuestion;
    }
}));

vi.mock('../consolidated/services/GlobalStateService', () => ({
    GlobalStateService: {
        getInstance: mockGlobalStateService.getInstance
    }
}));

vi.mock('../consolidated/hooks/useUnifiedEditor', () => ({
    useUnifiedEditor: () => mockUseUnifiedEditor
}));

vi.mock('../consolidated/hooks/useGlobalState', () => ({
    useGlobalState: mockUseGlobalState
}));

vi.mock('../optimization/BundleOptimizer', () => ({
    BundleOptimizer: class MockBundleOptimizer {
        analyzeChunks = mockBundleOptimizer.analyzeChunks;
        optimizeBuild = mockBundleOptimizer.optimizeBuild;
        preloadCritical = mockBundleOptimizer.preloadCritical;
        lazyLoadFeatures = mockBundleOptimizer.lazyLoadFeatures;
    }
}));

vi.mock('../migration/MigrationSystem', () => ({
    MigrationSystem: class MockMigrationSystem {
        analyzeProject = mockMigrationSystem.analyzeProject;
        migrateProject = mockMigrationSystem.migrateProject;
        rollback = mockMigrationSystem.rollback;
        validateMigration = mockMigrationSystem.validateMigration;
    }
}));

// === FACTORY FUNCTIONS ===

export const createMockQuiz = (overrides: Partial<Quiz> = {}): Quiz => ({
    id: `quiz-${Date.now()}`,
    title: 'Mock Quiz',
    description: 'Quiz created for testing',
    questions: [],
    settings: {
        timeLimit: 300,
        allowBacktrack: true,
        shuffleQuestions: false
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
});

export const createMockQuestion = (overrides: Partial<Question> = {}): Question => ({
    id: `question-${Date.now()}`,
    type: 'multiple-choice',
    text: 'Mock question?',
    options: [
        { id: 'opt1', text: 'Option 1', isCorrect: true },
        { id: 'opt2', text: 'Option 2', isCorrect: false }
    ],
    ...overrides
});

export const createMockQuizSettings = (overrides: Partial<QuizSettings> = {}): QuizSettings => ({
    timeLimit: 300,
    allowBacktrack: true,
    shuffleQuestions: false,
    ...overrides
});

// === EXPORT PARA TESTES ===

export {
    mockUnifiedEditorService,
    mockGlobalStateService,
    mockUseUnifiedEditor,
    mockUseGlobalState,
    mockBundleOptimizer,
    mockMigrationSystem,
    mockFetch,
    mockTimers
};