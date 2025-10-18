# 🎯 SERVICES - Camada de Lógica de Negócio

## Visão Geral

Services implementados com integração real ao Supabase, substituindo stubs e localhost por lógica de produção.

## Arquitetura

```
UI Components
    ↓
Hooks Consolidados
    ↓
Services (quizService, funnelService, templateService)
    ↓
Supabase Client
    ↓
Database
```

## Services Principais

### 1. QuizService (`src/services/quizService.ts`)

**Responsabilidade:** Gerenciar operações de quiz com persistência real

**Métodos:**

#### `saveParticipant(data)`
Salva participante do quiz em `quiz_users` e cria sessão em `quiz_sessions`

```typescript
const participant = await quizService.saveParticipant({
  name: 'João Silva',
  email: 'joao@example.com',
  sessionId: 'session-123',
  funnelId: 'funnel-xyz',
  metadata: { utm_source: 'google' }
});
```

#### `saveAnswers(sessionId, answers)`
Salva respostas do quiz em `quiz_step_responses`

```typescript
const responses = await quizService.saveAnswers('session-123', [
  {
    stepId: 'step-1',
    questionId: 'q1',
    questionText: 'Qual seu estilo?',
    answerValue: 'modern',
    answerText: 'Moderno',
    scoreEarned: 10,
    respondedAt: new Date()
  }
]);
```

#### `calculateResults(answers)`
Calcula pontuações por estilo baseado nas respostas

```typescript
const styleScores = quizService.calculateResults(answers);
// { modern: 45, classic: 30, minimalist: 25 }
```

#### `saveResults(sessionId, styleScores, resultData)`
Salva resultado final em `quiz_results` e atualiza sessão

```typescript
const result = await quizService.saveResults('session-123', styleScores, {
  title: 'Seu Estilo: Moderno',
  description: 'Você prefere designs contemporâneos',
  recommendation: 'Explore nossa coleção moderna',
  nextSteps: { redirect: '/products/modern' }
});
```

#### `getSession(sessionId)`
Busca sessão completa com respostas e resultado

```typescript
const { session, answers, result } = await quizService.getSession('session-123');
```

#### `getFunnelSessions(funnelId)`
Analytics: busca todas as sessões de um funnel

```typescript
const sessions = await quizService.getFunnelSessions('funnel-xyz');
```

---

### 2. FunnelService (`src/services/funnelService.refactored.ts`)

**Responsabilidade:** CRUD completo de funnels com Supabase

**Métodos:**

#### `createFunnel(input)`
Cria novo funnel na tabela `funnels`

```typescript
const funnel = await funnelService.createFunnel({
  name: 'Quiz de Estilo',
  description: 'Descubra seu estilo ideal',
  type: 'quiz',
  userId: 'user-123',
  config: { theme: 'modern' },
  metadata: { version: '1.0' }
});
```

#### `getFunnelById(id)`
Busca funnel por ID

```typescript
const funnel = await funnelService.getFunnelById('funnel-xyz');
```

#### `getFunnelWithPages(id)`
Busca funnel completo com todas as páginas/steps

```typescript
const { funnel, pages } = await funnelService.getFunnelWithPages('funnel-xyz');
// pages é um array de EditorStep[]
```

#### `updateFunnel(id, updates)`
Atualiza funnel existente

```typescript
const updated = await funnelService.updateFunnel('funnel-xyz', {
  name: 'Novo Nome',
  status: 'published',
  config: { theme: 'dark' }
});
```

#### `updatePageBlocks(funnelId, steps)`
Atualiza blocos de todas as páginas do funnel

```typescript
await funnelService.updatePageBlocks('funnel-xyz', steps);
```

#### `publishFunnel(id)`
Publica funnel (muda status para 'published')

```typescript
const published = await funnelService.publishFunnel('funnel-xyz');
```

#### `deleteFunnel(id)`
Soft delete (marca como inativo)

```typescript
await funnelService.deleteFunnel('funnel-xyz');
```

#### `duplicateFunnel(id, newName)`
Duplica funnel existente

```typescript
const clone = await funnelService.duplicateFunnel('funnel-xyz', 'Quiz de Estilo (Cópia)');
```

#### `saveFunnel(id, steps, metadata)`
Helper para criar ou atualizar funnel completo

```typescript
const saved = await funnelService.saveFunnel(
  'funnel-xyz', // null para criar novo
  steps,
  {
    name: 'Quiz Atualizado',
    description: 'Versão atualizada',
    userId: 'user-123'
  }
);
```

---

### 3. TemplateService (`src/services/templateService.refactored.ts`)

**Responsabilidade:** Gerenciar templates de quiz/funnel

**Métodos:**

#### `getTemplate(templateId)`
Busca template completo (com cache)

```typescript
const template = await templateService.getTemplate('quiz-21-steps');
```

#### `getStep(templateId, stepNumber)`
Busca step específico de um template

```typescript
const step = await templateService.getStep('quiz-21-steps', 1);
```

#### `cloneTemplate(template, newName)`
Clona template para edição

```typescript
const clone = templateService.cloneTemplate(template, 'Meu Quiz Personalizado');
```

#### `validateTemplate(template)`
Valida integridade do template

```typescript
const { isValid, errors } = templateService.validateTemplate(template);
if (!isValid) {
  console.error('Template inválido:', errors);
}
```

#### `listTemplates()`
Lista todos os templates disponíveis

```typescript
const templates = await templateService.listTemplates();
```

#### `createCustomTemplate(data)`
Cria template customizado

```typescript
const custom = templateService.createCustomTemplate({
  name: 'Meu Template',
  description: 'Template personalizado',
  category: 'quiz',
  steps: mySteps
});
```

#### `clearCache()`
Limpa cache de templates

```typescript
templateService.clearCache();
```

---

## Integração com Stores

Services são consumidos pelos hooks consolidados:

```typescript
// Hook consolidado usando service
import { useEditorConsolidated } from '@/hooks/useEditorConsolidated';
import { funnelService } from '@/services/funnelService.refactored';

export function useEditorConsolidated() {
  const store = useEditorStore();
  
  const save = async () => {
    store.setSaving(true);
    
    try {
      await funnelService.saveFunnel(
        store.funnelId,
        store.steps,
        {
          name: store.funnelName,
          description: store.funnelDescription
        }
      );
      
      store.markClean();
    } finally {
      store.setSaving(false);
    }
  };
  
  return { save, /* ... */ };
}
```

---

## Tratamento de Erros

Todos os services implementam tratamento de erros consistente:

```typescript
try {
  const result = await quizService.saveParticipant(data);
  return result;
} catch (error) {
  console.error('Error saving participant:', error);
  throw new Error('Failed to save participant');
}
```

**UI deve sempre tratar erros:**

```typescript
try {
  await quizService.saveParticipant(data);
  showSuccess('Participante salvo!');
} catch (error) {
  showError('Erro ao salvar', error.message);
}
```

---

## Type Safety

Todos os services têm 100% type coverage:

```typescript
// ✅ BOM - Type safety completo
const participant: QuizParticipant = await quizService.saveParticipant(data);

// ✅ BOM - Interfaces exportadas
import type { QuizParticipant, StyleScores } from '@/services/quizService';

// ✅ BOM - Validação em tempo de compilação
const funnel: Funnel = await funnelService.createFunnel({
  name: 'Quiz', // TypeScript valida campos obrigatórios
  // @ts-expect-error - campo inválido
  invalidField: 'value'
});
```

---

## Testing

Services são testáveis isoladamente:

```typescript
// Mock Supabase para testes
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: mockData,
            error: null
          }))
        }))
      }))
    }))
  }
}));

// Testar service
test('saveParticipant should save to database', async () => {
  const result = await quizService.saveParticipant(mockData);
  expect(result).toBeDefined();
  expect(supabase.from).toHaveBeenCalledWith('quiz_users');
});
```

---

## Performance

### Cache (TemplateService)
Templates são cacheados por 5 minutos para evitar buscas repetidas.

### Batch Operations
QuizService salva respostas em batch para reduzir chamadas à API.

### Optimistic Updates
Stores podem aplicar mudanças localmente enquanto services sincronizam.

---

## Migração de Código Legacy

### Antes (localhost):
```typescript
await fetch('http://localhost:3001/api/funnels', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

### Depois (Supabase):
```typescript
await funnelService.createFunnel(data);
```

---

## Próximos Passos

- [ ] Implementar testes unitários para todos os services
- [ ] Adicionar retry logic para operações críticas
- [ ] Implementar queue para operações em background
- [ ] Adicionar telemetria e logging estruturado
- [ ] Migrar templates para tabela no Supabase

---

## Referências

- [Supabase Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- ARCHITECTURE.md (arquitetura geral)
- STORES.md (integração com stores)
