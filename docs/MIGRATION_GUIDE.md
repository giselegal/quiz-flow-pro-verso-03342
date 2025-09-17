# 🔄 MIGRATION GUIDE - Guia de Migração

Guia completo para migrar código legacy para a nova arquitetura consolidada.

## 🎯 Visão Geral da Migração

A migração move código de uma arquitetura fragmentada para uma consolidada:

### 📊 Impacto da Migração
- **Services**: 97 → 15 (85% redução)
- **Hooks**: 151 → 25 (83% redução)  
- **Schemas**: 4 → 1 (75% redução)
- **Bundle**: 692KB → 150KB (78% redução)

## 🚀 Migração Automática (Recomendado)

### Setup Inicial

```bash
# 1. Configurar ambiente de migração
npm run setup:migration

# 2. Analisar projeto atual
npm run migrate:analyze

# 3. Preview das mudanças (dry-run)
npm run migrate:dry-run
```

### Migração Passo a Passo

```bash
# 1. Migração interativa (escolher arquivos)
npm run migrate:interactive

# 2. Migração completa
npm run migrate:run

# 3. Verificar status
npm run migrate:status

# 4. Validar integridade
npm run migrate:validate
```

### Rollback em Caso de Problemas

```bash
# Rollback de arquivo específico
npm run migrate:rollback --file src/components/Editor.tsx

# Listar backups disponíveis
npm run migrate:rollback --list-backups
```

## 🛠️ Migração Manual

### 1. Migração de Hooks

#### Antes (Multiple Hooks):
```typescript
// ❌ Fragmentado - Múltiplos hooks
import { useQuizState } from '@hooks/useQuizState';
import { useQuizActions } from '@hooks/useQuizActions';
import { useQuizValidation } from '@hooks/useQuizValidation';
import { useQuizLoading } from '@hooks/useQuizLoading';
import { useQuizErrors } from '@hooks/useQuizErrors';

function QuizEditor() {
  const quiz = useQuizState();
  const { addQuestion, removeQuestion, updateQuestion } = useQuizActions();
  const { validateQuiz, validateQuestion } = useQuizValidation();
  const { isLoading, setLoading } = useQuizLoading();
  const { error, setError } = useQuizErrors();
  
  // Código complexo para coordenar múltiplos hooks...
}
```

#### Depois (Unified Hook):
```typescript
// ✅ Consolidado - Hook unificado
import { useUnifiedEditor } from '@consolidated/hooks/useUnifiedEditor';

function QuizEditor() {
  const { state, actions, validation } = useUnifiedEditor();
  
  // Estado unificado
  const { quiz, isLoading, error } = state;
  
  // Ações organizadas
  const { addQuestion, removeQuestion, updateQuestion } = actions;
  
  // Validação integrada
  const { validateQuiz, validateQuestion } = validation;
  
  // Código mais simples e organizado...
}
```

### 2. Migração de Services

#### Antes (Multiple Services):
```typescript
// ❌ Fragmentado - Múltiplos services
import { QuizService } from '@services/QuizService';
import { QuestionService } from '@services/QuestionService';
import { ValidationService } from '@services/ValidationService';
import { StorageService } from '@services/StorageService';
import { StateService } from '@services/StateService';

class QuizManager {
  private quizService = new QuizService();
  private questionService = new QuestionService();
  private validationService = new ValidationService();
  private storageService = new StorageService();
  private stateService = new StateService();
  
  async createQuiz(data: QuizData) {
    const quiz = await this.quizService.create(data);
    await this.validationService.validate(quiz);
    await this.storageService.save(quiz);
    this.stateService.updateState(quiz);
    return quiz;
  }
}
```

#### Depois (Unified Service):
```typescript
// ✅ Consolidado - Service unificado
import { UnifiedEditorService } from '@consolidated/services/UnifiedEditorService';

class QuizManager {
  private editorService = new UnifiedEditorService();
  
  async createQuiz(data: QuizData) {
    // Tudo integrado em um service
    const quiz = await this.editorService.createQuiz(data);
    return quiz;
  }
}
```

### 3. Migração de Schemas

#### Antes (Multiple Schemas):
```typescript
// ❌ Fragmentado - Múltiplos schemas
import { QuizSchema } from '@schemas/QuizSchema';
import { QuestionSchema } from '@schemas/QuestionSchema';
import { OptionsSchema } from '@schemas/OptionsSchema';
import { SettingsSchema } from '@schemas/SettingsSchema';

// Validações espalhadas
const quizResult = QuizSchema.safeParse(quiz);
const questionResult = QuestionSchema.safeParse(question);
const optionsResult = OptionsSchema.safeParse(options);
const settingsResult = SettingsSchema.safeParse(settings);
```

#### Depois (Master Schema):
```typescript
// ✅ Consolidado - Master Schema
import { MasterSchema } from '@consolidated/schemas/masterSchema';

// Validação centralizada
const quizResult = MasterSchema.Quiz.safeParse(quiz);
const questionResult = MasterSchema.Question.safeParse(question);
const optionsResult = MasterSchema.Options.safeParse(options);
const settingsResult = MasterSchema.QuizSettings.safeParse(settings);
```

### 4. Migração de Estado Global

#### Antes (Zustand Fragmentado):
```typescript
// ❌ Fragmentado - Múltiplas stores
import { useQuizStore } from '@store/quizStore';
import { useUserStore } from '@store/userStore';
import { useUIStore } from '@store/uiStore';
import { useSettingsStore } from '@store/settingsStore';

function Component() {
  const quiz = useQuizStore(state => state.quiz);
  const user = useUserStore(state => state.user);
  const isLoading = useUIStore(state => state.isLoading);
  const settings = useSettingsStore(state => state.settings);
  
  // Coordenação manual entre stores...
}
```

#### Depois (Global State Unificado):
```typescript
// ✅ Consolidado - Estado global unificado
import { useGlobalState } from '@consolidated/hooks/useGlobalState';

function Component() {
  const { state } = useGlobalState();
  const { quiz, user, isLoading, settings } = state;
  
  // Estado centralizado e coordenado automaticamente...
}
```

## 📋 Checklist de Migração

### Pré-Migração
- [ ] Backup do projeto atual
- [ ] Executar todos os testes existentes
- [ ] Documentar configurações customizadas
- [ ] Verificar dependências específicas

### Durante a Migração
- [ ] Migrar por partes (não tudo de uma vez)
- [ ] Executar testes após cada migração parcial
- [ ] Verificar imports e paths
- [ ] Validar funcionamento em ambiente de desenvolvimento

### Pós-Migração
- [ ] Executar suite completa de testes
- [ ] Verificar performance (bundle size)
- [ ] Testar todas as funcionalidades principais
- [ ] Atualizar documentação interna

## 🔍 Mapeamento de Migração Detalhado

### Hooks Legacy → Consolidated

| Hook Legacy | Hook Consolidado | Migração |
|-------------|------------------|----------|
| `useQuizState` | `useUnifiedEditor.state` | Automática |
| `useQuizActions` | `useUnifiedEditor.actions` | Automática |
| `useQuizValidation` | `useUnifiedEditor.validation` | Automática |
| `useAppState` | `useGlobalState.state` | Automática |
| `useAppActions` | `useGlobalState.actions` | Automática |
| `useNavigation` | `useNavigation` | Direct |
| `useFormValidation` | `useUnifiedValidation` | Automática |

### Services Legacy → Consolidated

| Service Legacy | Service Consolidado | Migração |
|----------------|---------------------|----------|
| `QuizService` | `UnifiedEditorService` | Automática |
| `QuestionService` | `UnifiedEditorService` | Automática |
| `ValidationService` | `UnifiedValidationService` | Automática |
| `StateService` | `GlobalStateService` | Automática |
| `StorageService` | `GlobalStateService` | Automática |
| `NavigationService` | `NavigationService` | Direct |
| `LoadingService` | `MasterLoadingService` | Automática |

## 🚨 Problemas Comuns e Soluções

### Problema: Imports Quebrados

```bash
# Erro comum
Module not found: Can't resolve '@hooks/useQuizState'
```

**Solução:**
```typescript
// ❌ Import legacy
import { useQuizState } from '@hooks/useQuizState';

// ✅ Import consolidado
import { useUnifiedEditor } from '@consolidated/hooks/useUnifiedEditor';
const { state } = useUnifiedEditor();
const quiz = state.quiz; // Equivalente ao useQuizState()
```

### Problema: Estado Perdido

```bash
# Estado não sincroniza entre componentes
```

**Solução:**
```typescript
// ❌ Múltiplas fontes de verdade
const quiz1 = useQuizState();
const quiz2 = useAppState().quiz;

// ✅ Fonte única de verdade
const { state } = useGlobalState();
const quiz = state.currentQuiz;
```

### Problema: Validação Inconsistente

```typescript
// ❌ Schemas diferentes
const quizValid = QuizSchema.safeParse(quiz);
const questionValid = QuestionSchema.safeParse(question);

// ✅ Schema consistente
const quizValid = MasterSchema.Quiz.safeParse(quiz);
const questionValid = MasterSchema.Question.safeParse(question);
```

### Problema: Performance Degradada

**Sintomas:**
- Bundle maior após migração
- Loading mais lento
- Memory leaks

**Diagnóstico:**
```bash
# Analisar bundle
npm run analyze:bundle

# Testes de performance
npm run test:performance

# Verificar lazy loading
npm run debug:lazy-loading
```

**Soluções:**
```typescript
// 1. Usar lazy loading
const LazyComponent = LazyLoadingSystem.withLazyLoading(
  () => import('./Component')
);

// 2. Code splitting manual
const { BundleOptimizer } = await import('@optimization/BundleOptimizer');

// 3. Tree shaking
import { specificFunction } from '@consolidated/services/UnifiedEditorService';
```

## 📊 Validação da Migração

### Scripts de Validação

```bash
# 1. Verificar imports
npm run validate:imports

# 2. Executar todos os testes
npm run test:comprehensive

# 3. Análise de bundle
npm run analyze:bundle

# 4. Performance benchmarks
npm run benchmark:performance

# 5. Validação completa
npm run migrate:validate
```

### Métricas Esperadas

```javascript
const expectedMetrics = {
  bundleSize: { max: '200KB', target: '150KB' },
  testCoverage: { min: '90%', target: '95%' },
  buildTime: { max: '60s', target: '30s' },
  loadTime: { max: '2s', target: '0.8s' },
  memoryUsage: { max: '100MB', target: '50MB' }
};
```

## 🔄 Rollback Strategy

### Quando Fazer Rollback

- Testes críticos falhando
- Performance significativamente degradada  
- Funcionalidades core quebradas
- Problemas de build que impedem deploy

### Como Fazer Rollback

```bash
# 1. Rollback completo (último backup)
git checkout backup-pre-migration
npm install
npm run build

# 2. Rollback seletivo (arquivo específico)
npm run migrate:rollback --file src/components/Editor.tsx

# 3. Rollback de service específico
npm run migrate:rollback --pattern "src/services/Quiz*"
```

### Rollback Emergencial

```bash
# Script de emergência (volta ao último estado estável)
./scripts/emergency-rollback.sh

# Restaura do backup automático
./scripts/restore-backup.sh --date 2024-01-15
```

## 🎯 Migração Gradual (Recomendado)

### Fase 1: Schemas (Baixo Risco)
```bash
npm run migrate:run --type schemas
npm run test:schemas
```

### Fase 2: Services (Risco Médio)  
```bash
npm run migrate:run --type services
npm run test:services
```

### Fase 3: Hooks (Risco Alto)
```bash
npm run migrate:run --type hooks
npm run test:hooks
```

### Fase 4: Componentes (Risco Crítico)
```bash
npm run migrate:run --type components
npm run test:e2e
```

## 🏁 Finalização

### Cleanup Pós-Migração

```bash
# Remove arquivos legacy não utilizados
npm run cleanup:legacy

# Atualiza imports automáticamente  
npm run update:imports

# Regenera índices
npm run generate:exports
```

### Documentação Final

- [ ] Atualizar README.md
- [ ] Documentar breaking changes
- [ ] Criar guia de migração interno
- [ ] Treinar equipe na nova arquitetura

---

🎉 **Parabéns! Migração concluída com sucesso!**

📚 Próximos passos:
- [API Documentation](./API_DOCS.md)
- [Performance Guide](./PERFORMANCE_GUIDE.md)  
- [Best Practices](./BEST_PRACTICES.md)