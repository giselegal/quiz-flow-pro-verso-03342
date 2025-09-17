# 📚 API DOCUMENTATION - Consolidated Architecture

Documentação completa das APIs da arquitetura consolidada.

## 🏗️ Master Schema API

### MasterSchema

Schema único que consolida todas as validações do sistema.

```typescript
import { MasterSchema, type Quiz, type Question, type QuizSettings } from '@consolidated/schemas/masterSchema';
```

#### MasterSchema.Quiz

**Valida estrutura completa de quiz**

```typescript
interface Quiz {
  id: string;                    // Identificador único
  title: string;                 // Título do quiz (min: 1 char)
  description?: string;          // Descrição opcional
  questions: Question[];         // Array de perguntas (min: 1)
  settings: QuizSettings;        // Configurações do quiz
  createdAt: string;            // ISO timestamp
  updatedAt: string;            // ISO timestamp
}

// Uso
const result = MasterSchema.Quiz.safeParse(quizData);
if (result.success) {
  console.log('Quiz válido:', result.data);
} else {
  console.error('Erros:', result.error.issues);
}
```

#### MasterSchema.Question

**Valida estrutura de pergunta**

```typescript
interface Question {
  id: string;                           // Identificador único
  type: 'multiple-choice' | 'true-false'; // Tipo da pergunta
  text: string;                         // Texto da pergunta (min: 1 char)
  options: Option[];                    // Array de opções (min: 2)
  explanation?: string;                 // Explicação opcional
  difficulty?: 'easy' | 'medium' | 'hard'; // Dificuldade
}

interface Option {
  id: string;                    // Identificador único
  text: string;                 // Texto da opção
  isCorrect: boolean;           // Se é a resposta correta
}
```

#### MasterSchema.QuizSettings

**Valida configurações do quiz**

```typescript
interface QuizSettings {
  timeLimit: number;            // Tempo em segundos (min: 1)
  allowBacktrack: boolean;      // Permitir voltar questões
  shuffleQuestions: boolean;    // Embaralhar perguntas
  shuffleOptions?: boolean;     // Embaralhar opções
  showResults?: boolean;        // Mostrar resultados
  passingScore?: number;        // Pontuação mínima (0-100)
}
```

## 🎣 Hooks API

### useUnifiedEditor

**Hook principal para edição de quizzes**

```typescript
import { useUnifiedEditor } from '@consolidated/hooks/useUnifiedEditor';

interface UseUnifiedEditorReturn {
  state: {
    quiz: Quiz;                    // Quiz atual
    currentQuestionIndex: number;  // Índice da pergunta atual
    isLoading: boolean;           // Estado de loading
    error: string | null;        // Erro atual
    hasUnsavedChanges: boolean;  // Mudanças não salvas
    history: Quiz[];             // Histórico para undo/redo
  };
  
  actions: {
    // Quiz operations
    setQuiz: (quiz: Quiz) => void;
    updateQuiz: (updates: Partial<Quiz>) => void;
    resetEditor: () => void;
    
    // Question operations  
    addQuestion: (question: Question) => void;
    removeQuestion: (questionId: string) => void;
    updateQuestion: (questionId: string, updates: Partial<Question>) => void;
    moveQuestion: (fromIndex: number, toIndex: number) => void;
    
    // Navigation
    setCurrentQuestion: (index: number) => void;
    nextQuestion: () => void;
    previousQuestion: () => void;
    
    // Persistence
    saveQuiz: () => Promise<void>;
    loadQuiz: (quizId: string) => Promise<void>;
    
    // History
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
  };
  
  validation: {
    validateQuiz: (quiz?: Quiz) => ValidationResult;
    validateQuestion: (question: Question) => ValidationResult;
    getValidationErrors: () => ValidationError[];
    isValid: boolean;
  };
}
```

**Exemplo de uso completo:**

```typescript
function QuizEditor() {
  const { state, actions, validation } = useUnifiedEditor();
  
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type: 'multiple-choice',
      text: '',
      options: [
        { id: 'opt1', text: '', isCorrect: false },
        { id: 'opt2', text: '', isCorrect: false }
      ]
    };
    
    actions.addQuestion(newQuestion);
  };
  
  const handleSave = async () => {
    if (!validation.isValid) {
      alert('Quiz has validation errors');
      return;
    }
    
    try {
      await actions.saveQuiz();
      alert('Quiz saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
    }
  };
  
  return (
    <div>
      <h1>{state.quiz.title}</h1>
      
      {/* Question List */}
      {state.quiz.questions.map((question, index) => (
        <QuestionEditor
          key={question.id}
          question={question}
          isActive={index === state.currentQuestionIndex}
          onUpdate={(updates) => actions.updateQuestion(question.id, updates)}
          onRemove={() => actions.removeQuestion(question.id)}
        />
      ))}
      
      {/* Actions */}
      <button onClick={handleAddQuestion}>Add Question</button>
      <button onClick={handleSave} disabled={state.isLoading}>
        {state.isLoading ? 'Saving...' : 'Save Quiz'}
      </button>
      
      {/* Validation Errors */}
      {!validation.isValid && (
        <div className="errors">
          {validation.getValidationErrors().map(error => (
            <div key={error.path} className="error">
              {error.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### useGlobalState

**Hook para estado global da aplicação**

```typescript
import { useGlobalState } from '@consolidated/hooks/useGlobalState';

interface UseGlobalStateReturn {
  state: {
    // Quiz state
    currentQuiz: Quiz | null;
    quizList: Quiz[];
    
    // User state
    user: User | null;
    isAuthenticated: boolean;
    
    // UI state
    isLoading: boolean;
    error: string | null;
    theme: 'light' | 'dark';
    
    // Settings
    settings: AppSettings;
    
    // Navigation
    currentRoute: string;
    routeHistory: string[];
  };
  
  actions: {
    // Quiz actions
    setCurrentQuiz: (quiz: Quiz | null) => void;
    addToQuizList: (quiz: Quiz) => void;
    removeFromQuizList: (quizId: string) => void;
    updateQuizInList: (quizId: string, updates: Partial<Quiz>) => void;
    
    // User actions
    setUser: (user: User | null) => void;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    
    // UI actions
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setTheme: (theme: 'light' | 'dark') => void;
    
    // Settings actions
    updateSettings: (settings: Partial<AppSettings>) => void;
    resetSettings: () => void;
    
    // Navigation actions
    navigate: (route: string) => void;
    goBack: () => void;
    goForward: () => void;
    
    // General
    reset: () => void;
  };
}
```

### useNavigation

**Hook para navegação entre páginas/etapas**

```typescript
import { useNavigation } from '@consolidated/hooks/useNavigation';

interface UseNavigationReturn {
  state: {
    currentStep: number;
    totalSteps: number;
    currentRoute: string;
    canGoBack: boolean;
    canGoForward: boolean;
    history: string[];
  };
  
  actions: {
    goToStep: (step: number) => void;
    nextStep: () => void;
    previousStep: () => void;
    goToRoute: (route: string) => void;
    goBack: () => void;
    goForward: () => void;
    reset: () => void;
  };
}
```

### useUnifiedValidation

**Hook para validação consolidada**

```typescript
import { useUnifiedValidation } from '@consolidated/hooks/useUnifiedValidation';

interface UseUnifiedValidationReturn {
  // Validation functions
  validateQuiz: (quiz: Quiz) => ValidationResult;
  validateQuestion: (question: Question) => ValidationResult;
  validateQuizSettings: (settings: QuizSettings) => ValidationResult;
  
  // Batch validation
  validateAll: (data: { quiz?: Quiz; questions?: Question[] }) => ValidationResult[];
  
  // Error handling
  getErrors: () => ValidationError[];
  hasErrors: boolean;
  clearErrors: () => void;
  
  // Real-time validation
  enableRealTimeValidation: () => void;
  disableRealTimeValidation: () => void;
  isRealTimeEnabled: boolean;
}
```

## 🔧 Services API

### UnifiedEditorService

**Service principal para operações de edição**

```typescript
import { UnifiedEditorService } from '@consolidated/services/UnifiedEditorService';

class UnifiedEditorService {
  // Quiz CRUD
  async createQuiz(data: Partial<Quiz>): Promise<Quiz>;
  async updateQuiz(id: string, updates: Partial<Quiz>): Promise<Quiz>;
  async deleteQuiz(id: string): Promise<void>;
  async getQuiz(id: string): Promise<Quiz>;
  async listQuizzes(options?: ListOptions): Promise<Quiz[]>;
  
  // Question operations
  async addQuestion(quizId: string, question: Question): Promise<Quiz>;
  async updateQuestion(quizId: string, questionId: string, updates: Partial<Question>): Promise<Quiz>;
  async removeQuestion(quizId: string, questionId: string): Promise<Quiz>;
  async reorderQuestions(quizId: string, questionIds: string[]): Promise<Quiz>;
  
  // Validation
  validateQuiz(quiz: Quiz): ValidationResult;
  validateQuestion(question: Question): ValidationResult;
  
  // Import/Export
  async exportQuiz(quizId: string, format: 'json' | 'pdf' | 'docx'): Promise<Blob>;
  async importQuiz(file: File): Promise<Quiz>;
  
  // Templates
  async createFromTemplate(templateId: string, customization?: any): Promise<Quiz>;
  async saveAsTemplate(quizId: string, templateData: TemplateData): Promise<Template>;
}
```

### GlobalStateService

**Service para gerenciamento de estado global**

```typescript
import { GlobalStateService } from '@consolidated/services/GlobalStateService';

class GlobalStateService {
  // Singleton pattern
  static getInstance(): GlobalStateService;
  
  // State management
  getState(): GlobalState;
  setState<K extends keyof GlobalState>(key: K, value: GlobalState[K]): void;
  updateState(updates: Partial<GlobalState>): void;
  
  // Subscriptions
  subscribe(callback: (state: GlobalState) => void): () => void;
  unsubscribe(callback: (state: GlobalState) => void): void;
  
  // Persistence
  async saveState(): Promise<void>;
  async loadState(): Promise<void>;
  clearPersistedState(): void;
  
  // Reset
  reset(): void;
  resetPartial(keys: Array<keyof GlobalState>): void;
}
```

### UnifiedValidationService

**Service para todas as validações**

```typescript
import { UnifiedValidationService } from '@consolidated/services/UnifiedValidationService';

class UnifiedValidationService {
  // Schema validation
  validateWithSchema<T>(data: unknown, schema: ZodSchema<T>): ValidationResult<T>;
  
  // Business validation
  validateQuizForPublishing(quiz: Quiz): ValidationResult;
  validateQuizForTaking(quiz: Quiz): ValidationResult;
  
  // Custom validation
  addCustomValidator(name: string, validator: ValidatorFunction): void;
  removeCustomValidator(name: string): void;
  
  // Batch validation
  validateMultiple(items: Array<{ data: unknown; schema: ZodSchema }>): ValidationResult[];
  
  // Error formatting
  formatErrors(errors: ValidationError[]): FormattedError[];
  groupErrorsByField(errors: ValidationError[]): GroupedErrors;
}
```

## 🚀 Optimization API

### BundleOptimizer

**Sistema de otimização de bundle**

```typescript
import { BundleOptimizer } from '@optimization/BundleOptimizer';

class BundleOptimizer {
  // Analysis
  async analyzeChunks(sourceDir: string): Promise<ChunkAnalysis>;
  async analyzeDependencies(entryPoint: string): Promise<DependencyGraph>;
  
  // Code splitting
  createLazyImport<T>(importFn: () => Promise<T>): LazyImport<T>;
  preloadModule(modulePath: string): Promise<void>;
  
  // Bundle optimization
  async optimizeBuild(config: OptimizationConfig): Promise<BuildResult>;
  
  // Performance monitoring
  measureLoadTime(moduleName: string): Promise<PerformanceMetrics>;
  getOptimizationReport(): OptimizationReport;
}
```

### LazyLoadingSystem

**Sistema de lazy loading para componentes**

```typescript
import { LazyLoadingSystem } from '@optimization/LazyLoadingSystem';

class LazyLoadingSystem {
  // Component lazy loading
  static withLazyLoading<T>(
    importFn: () => Promise<{ default: T }>,
    options?: LazyLoadOptions
  ): React.ComponentType<any>;
  
  // Preloading strategies
  static preloadOnIdle(importFn: () => Promise<any>): void;
  static preloadOnHover(importFn: () => Promise<any>): void;
  static preloadOnRoute(importFn: () => Promise<any>, route: string): void;
  
  // Cache management
  static clearCache(): void;
  static getCacheStats(): CacheStats;
}
```

## 🧪 Testing API

### ComprehensiveTestSystem

**Sistema completo de testes**

```typescript
import { ComprehensiveTestRunner } from '@testing/ComprehensiveTestSystem';

class ComprehensiveTestRunner {
  async runAllTests(): Promise<TestReport>;
  async runTestSuite(suiteName: string): Promise<TestResult>;
  
  // Performance testing
  measurePerformance<T>(fn: () => T, name?: string): Promise<{ result: T; duration: number }>;
  
  // Memory testing
  measureMemory<T>(fn: () => T): Promise<{ result: T; memoryDelta: MemoryUsage }>;
}

// Test utilities
export function createMockQuiz(overrides?: Partial<Quiz>): Quiz;
export function createMockQuestion(overrides?: Partial<Question>): Question;
export function expectPerformant(actualTime: number, maxTime: number, operation: string): void;
```

## 🔄 Migration API

### MigrationSystem

**Sistema de migração automática**

```typescript
import { MigrationSystem } from '@migration/MigrationSystem';

class MigrationSystem {
  // Analysis
  async analyzeProject(sourceDir: string): Promise<MigrationTarget[]>;
  async estimateComplexity(filePath: string): Promise<ComplexityEstimate>;
  
  // Migration
  async migrateProject(options: MigrationOptions): Promise<MigrationReport>;
  async migrateFile(filePath: string, rules: MigrationRule[]): Promise<MigrationResult>;
  
  // Validation
  async validateMigration(targetDir: string): Promise<ValidationReport>;
  
  // Rollback
  async rollback(filePath: string): Promise<boolean>;
  async createBackup(sourceDir: string): Promise<string>;
}
```

## 📊 Types Reference

### Core Types

```typescript
// Quiz related
interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  settings: QuizSettings;
  createdAt: string;
  updatedAt: string;
}

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: Option[];
  explanation?: string;
  difficulty?: Difficulty;
}

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizSettings {
  timeLimit: number;
  allowBacktrack: boolean;
  shuffleQuestions: boolean;
  shuffleOptions?: boolean;
  showResults?: boolean;
  passingScore?: number;
}

// Validation
interface ValidationResult<T = any> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

interface ValidationError {
  path: string[];
  message: string;
  code: string;
}

// State
interface GlobalState {
  currentQuiz: Quiz | null;
  quizList: Quiz[];
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  theme: Theme;
  settings: AppSettings;
  currentRoute: string;
  routeHistory: string[];
}
```

### Utility Types

```typescript
// Performance
interface PerformanceMetrics {
  duration: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage?: NodeJS.CpuUsage;
}

// Testing
interface TestReport {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  successRate: number;
  totalDuration: number;
  results: TestResult[];
}

// Migration
interface MigrationTarget {
  filePath: string;
  type: FileType;
  estimatedComplexity: ComplexityLevel;
  applicableRules: string[];
  dependencies: string[];
}
```

## 🔍 Error Handling

### Common Error Types

```typescript
// Validation Errors
class ValidationError extends Error {
  constructor(
    public field: string,
    public value: any,
    public constraint: string
  );
}

// Service Errors
class ServiceError extends Error {
  constructor(
    public service: string,
    public operation: string,
    public originalError?: Error
  );
}

// Migration Errors  
class MigrationError extends Error {
  constructor(
    public filePath: string,
    public rule: string,
    public originalError?: Error
  );
}
```

### Error Handling Patterns

```typescript
// Service error handling
try {
  const quiz = await editorService.createQuiz(data);
} catch (error) {
  if (error instanceof ValidationError) {
    handleValidationError(error);
  } else if (error instanceof ServiceError) {
    handleServiceError(error);
  } else {
    handleUnknownError(error);
  }
}

// Hook error handling
const { state, actions } = useUnifiedEditor();

useEffect(() => {
  if (state.error) {
    console.error('Editor error:', state.error);
    // Handle error appropriately
  }
}, [state.error]);
```

---

🎯 **Esta API consolida toda funcionalidade em interfaces simples e consistentes!**

📚 Veja também:
- [Consolidated Architecture Guide](./CONSOLIDATED_ARCHITECTURE_GUIDE.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Performance Guide](./PERFORMANCE_GUIDE.md)