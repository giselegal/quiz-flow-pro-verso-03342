# 🏗️ ARQUITETURA DE FUNIS V4.1 - CORREÇÃO DOS 5 GARGALOS

## �� Resumo Executivo

Esta arquitetura resolve os **5 gargalos críticos** identificados no `/editor`:

1. ✅ **Multi-funnel real** - Editor não é mais hard-coded
2. ✅ **Persistência fechada** - Draft → Save → Reopen funciona
3. ✅ **Contratos alinhados** - Testes, services e editor falam a mesma língua
4. ✅ **Funil como entidade** - Não é mais "apenas JSON"
5. ⏳ **Painel de propriedades** - (melhoria contínua)

---

## 🎯 Conceito: Funil como Entidade de Negócio

### Antes (problema)
```typescript
// Editor carregava sempre o mesmo JSON
const quiz = await fetch('/templates/quiz21-v4.json');

// Salvava, mas nunca reabria
await persistence.saveQuiz(quiz); // quizId não era passado

// Impossível ter múltiplos funis
```

### Depois (solução)
```typescript
// Funil é entidade com identidade
interface Funnel {
  id: string;         // quiz21StepsComplete, clienteX-quiz21, etc.
  templateId: string; // template base usado
  draftId?: string;   // row no Supabase
  quiz: QuizSchema;   // dados reais
  version: number;    // controle de versão
}

// Carrega do Supabase OU template base
const result = await funnelService.loadFunnel({ funnelId: 'clienteX-quiz21' });

// Salva com ID real
await funnelService.saveFunnel(quiz, funnelId, draftId);

// Duplica funil independente
await funnelService.duplicateFunnel('quiz21', 'clienteY-quiz21');
```

---

## 🏗️ Arquitetura em 3 Camadas

```
┌─────────────────────────────────────────────────────────────┐
│                      EDITOR PAGE                            │
│  /editor?funnel=quiz21StepsComplete&draftId=abc123         │
│                                                             │
│  - Parseia URL com parseFunnelFromURL()                    │
│  - Carrega funnel com funnelService.loadFunnel()           │
│  - Passa quizId para ModernQuizEditor                      │
│  - Salva com funnelService.saveFunnel()                    │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                   FUNNEL SERVICE                            │
│  Orchestrator principal                                     │
│                                                             │
│  loadFunnel(identifier)                                     │
│    1. Resolve path com FunnelResolver                      │
│    2. Verifica draft no Supabase                           │
│    3. Se existe → carrega draft                            │
│    4. Se não → carrega template base                       │
│    5. Retorna Funnel entity                                │
│                                                             │
│  saveFunnel(quiz, funnelId, draftId?)                      │
│    1. Se draftId → UPDATE com optimistic lock              │
│    2. Se não → INSERT novo draft                           │
│    3. Retorna novo draftId                                 │
│                                                             │
│  duplicateFunnel(source, newId)                            │
│    1. Carrega source                                       │
│    2. Clona JSON                                           │
│    3. Salva como novo draft                                │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                  FUNNEL RESOLVER                            │
│  Mapeia IDs → paths                                         │
│                                                             │
│  FUNNEL_TEMPLATE_MAP:                                      │
│    'quiz21StepsComplete' → '/templates/quiz21-v4-saas.json'│
│    'quiz21-complete'     → '/templates/quiz21-complete.json'│
│    'clienteX-quiz21'     → '/templates/funnels/...json'    │
│                                                             │
│  resolveFunnel(identifier) → ResolvedFunnel                │
│    - Strategy: draft | template | default                  │
│    - isDraft: boolean                                      │
│    - templatePath: string                                  │
│    - templateVersion: string                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Estrutura de Arquivos

```
src/
├── services/funnel/
│   ├── FunnelService.ts       # Orchestrator principal
│   ├── FunnelResolver.ts      # Mapeamento de IDs
│   └── index.ts               # Exports centralizados
│
├── config/
│   └── template-paths.ts      # Paths de templates
│
├── pages/editor/
│   └── EditorPage.tsx         # Usa FunnelService
│
└── components/editor/
    └── ModernQuizEditor/      # Recebe quizId agora
        └── hooks/
            └── usePersistence.ts # Usa quizId para UPDATE
```

---

## 🔄 Fluxo Completo de Edição

### 1️⃣ Abrir Funnel

```typescript
// URL: /editor?funnel=quiz21StepsComplete

// EditorPage.tsx
const searchParams = new URLSearchParams(window.location.search);
const identifier = parseFunnelFromURL(searchParams);
// → { funnelId: 'quiz21StepsComplete', draftId: undefined }

const result = await funnelService.loadFunnel(identifier);
// → FunnelService verifica Supabase:
//   - SELECT * FROM quiz_drafts WHERE funnel_id = 'quiz21StepsComplete'
//   - Se não existe → fetch('/templates/quiz21-v4-saas.json')
//   - Retorna: { funnel, resolved, source: 'template' }

setQuiz(result.funnel.quiz);
setQuizId(result.funnel.draftId); // undefined (ainda não salvou)
```

### 2️⃣ Editar Funnel

```typescript
// ModernQuizEditor
<ModernQuizEditor
  initialQuiz={quiz}
  quizId={quizId} // undefined na primeira vez
  onSave={handleSave}
/>

// Usuário edita blocos, steps, etc.
// Mudanças ficam no quizStore (Zustand)
```

### 3️⃣ Salvar Funnel

```typescript
// EditorPage.tsx - handleSave()
const handleSave = async (savedQuiz: QuizSchema) => {
  const result = await funnelService.saveFunnel(
    savedQuiz,
    funnelId,      // 'quiz21StepsComplete'
    quizId         // undefined (primeira vez)
  );

  // FunnelService faz INSERT:
  // INSERT INTO quiz_drafts (funnel_id, quiz_data, version)
  // VALUES ('quiz21StepsComplete', {...}, 1)
  // RETURNING id → 'abc-123'

  setQuizId(result.draftId); // 'abc-123'
  // ✅ Agora o editor tem o draftId
};
```

### 4️⃣ Reabrir Funnel (mesmo draft)

```typescript
// URL: /editor?funnel=quiz21StepsComplete

// FunnelService.loadFunnel()
// → SELECT * FROM quiz_drafts WHERE funnel_id = 'quiz21StepsComplete'
// → Encontra draft 'abc-123'
// → Retorna: { funnel.draftId: 'abc-123', source: 'supabase' }

setQuiz(result.funnel.quiz);
setQuizId('abc-123'); // ✅ Tem draftId agora

// Próximo save fará UPDATE:
await funnelService.saveFunnel(quiz, funnelId, 'abc-123');
// → UPDATE quiz_drafts SET ... WHERE id = 'abc-123' AND version = 1
```

### 5️⃣ Duplicar Funnel

```typescript
// Criar cópia independente
const newFunnel = await funnelService.duplicateFunnel(
  'quiz21StepsComplete',
  'clienteX-quiz21'
);

// → 1. Carrega 'quiz21StepsComplete' (draft ou template)
// → 2. Clona JSON: { ...quiz, metadata: { id: 'clienteX-quiz21' } }
// → 3. INSERT novo draft com funnel_id = 'clienteX-quiz21'
// → 4. Retorna novo Funnel

// Agora existem 2 funis independentes:
// - quiz21StepsComplete (draft 'abc-123')
// - clienteX-quiz21 (draft 'def-456')
```

---

## 🗺️ Mapeamento de Funil → Template

### FUNNEL_TEMPLATE_MAP (FunnelResolver.ts)

```typescript
export const FUNNEL_TEMPLATE_MAP: Record<string, string> = {
  // V4.1 SaaS (default)
  'quiz21StepsComplete': '/templates/quiz21-v4-saas.json',
  'quiz21-v4-saas': '/templates/quiz21-v4-saas.json',
  'quiz21-v4': '/templates/quiz21-v4-saas.json', // Redirect
  
  // Legacy
  'quiz21-complete': '/templates/quiz21-complete.json',
  
  // Novos funis (adicionar aqui)
  'clienteX-quiz21': '/templates/funnels/clienteX/master.json',
  'quiz-style-moderne': '/templates/funnels/moderne/master.json',
};
```

### Como adicionar novo funil

```typescript
// 1. Adicionar ao mapa
FUNNEL_TEMPLATE_MAP['meu-funil'] = '/templates/funnels/meu-funil.json';

// 2. Criar template base
public/templates/funnels/meu-funil.json

// 3. Usar no editor
/editor?funnel=meu-funil

// 4. Sistema:
//    - Verifica draft no Supabase
//    - Se não existe → carrega template base
//    - Usuário edita → salva como draft
//    - Próxima vez → carrega draft
```

---

## 🔍 Resolução de Estratégia

### ResolvedFunnel

```typescript
interface ResolvedFunnel {
  funnelId: string;        // ID final do funil
  templatePath: string;    // Path do template base
  templateVersion: string; // 'v4.1-saas', 'v4.0', etc.
  isDraft: boolean;        // Carregou de draft?
  draftId?: string;        // ID do draft (se existe)
  strategy: 'draft' | 'template' | 'default'; // Estratégia usada
}
```

### Estratégias de resolução

```typescript
// 1. DRAFT (prioridade máxima)
/editor?funnel=quiz21&draftId=abc-123
→ Carrega draft 'abc-123' diretamente

// 2. TEMPLATE ID
/editor?funnel=quiz21&template=quiz21-v4-saas
→ Força carregamento do template, ignora draft

// 3. FUNNEL ID
/editor?funnel=quiz21
→ Verifica draft com funnel_id = 'quiz21'
→ Se existe → carrega draft
→ Se não → carrega template base

// 4. RESOURCE ID (legacy)
/editor?resource=quiz21
→ Compatibilidade com URLs antigas

// 5. DEFAULT
/editor
→ Carrega 'quiz21StepsComplete' template base
```

---

## 💾 Persistência no Supabase

### Tabela: quiz_drafts

```sql
CREATE TABLE quiz_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  funnel_id TEXT NOT NULL,           -- Business ID
  template_id TEXT,                  -- Template base usado
  quiz_data JSONB NOT NULL,          -- QuizSchema completo
  version INTEGER NOT NULL DEFAULT 1, -- Optimistic lock
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Índices
  INDEX idx_funnel_id (funnel_id),
  INDEX idx_user_id (user_id)
);
```

### Operações

```typescript
// INSERT (primeira vez)
await funnelService.saveFunnel(quiz, 'quiz21', undefined);
// → INSERT INTO quiz_drafts (funnel_id, quiz_data, version, user_id)

// UPDATE (com optimistic lock)
await funnelService.saveFunnel(quiz, 'quiz21', 'abc-123');
// → UPDATE quiz_drafts SET quiz_data = ..., version = version + 1
//   WHERE id = 'abc-123' AND version = 1
// Se version mudou → erro de concorrência

// DELETE
await funnelService.deleteFunnel('abc-123');
// → DELETE FROM quiz_drafts WHERE id = 'abc-123'

// LIST
const funnels = await funnelService.listFunnels(userId);
// → SELECT * FROM quiz_drafts WHERE user_id = ...
```

---

## 🧪 Testabilidade

### Testes E2E

```typescript
// tests/e2e/funnel-editing.spec.ts
test('Deve criar, salvar e reabrir funnel', async ({ page }) => {
  // 1. Abrir editor
  await page.goto('/editor?funnel=test-funnel');
  
  // 2. Editar algo
  await page.click('[data-testid="add-block"]');
  await page.fill('[data-testid="block-text"]', 'Novo texto');
  
  // 3. Salvar
  await page.click('[data-testid="save-button"]');
  await page.waitForSelector('[data-testid="save-success"]');
  
  // 4. Recarregar página
  await page.reload();
  
  // 5. Verificar que draft foi carregado
  const text = await page.textContent('[data-testid="block-text"]');
  expect(text).toBe('Novo texto');
});

test('Deve duplicar funnel', async ({ page }) => {
  // 1. Abrir funnel original
  await page.goto('/editor?funnel=quiz21');
  
  // 2. Duplicar
  await page.click('[data-testid="duplicate-button"]');
  await page.fill('[data-testid="new-funnel-id"]', 'quiz21-copia');
  await page.click('[data-testid="confirm-duplicate"]');
  
  // 3. Verificar redirecionamento
  expect(page.url()).toContain('funnel=quiz21-copia');
  
  // 4. Editar cópia
  await page.fill('[data-testid="block-text"]', 'Editado na cópia');
  await page.click('[data-testid="save-button"]');
  
  // 5. Voltar para original
  await page.goto('/editor?funnel=quiz21');
  
  // 6. Verificar que original não mudou
  const text = await page.textContent('[data-testid="block-text"]');
  expect(text).not.toBe('Editado na cópia');
});
```

---

## 📊 Comparação: Antes vs Depois

### Antes (Gargalos)

| Aspecto | Problema |
|---------|----------|
| **Carregamento** | Hard-coded em `/templates/quiz21-v4.json` |
| **Multi-funnel** | Impossível abrir funis diferentes |
| **Persistência** | Salvava mas nunca reabria (quizId não passado) |
| **Duplicação** | Manual, via clonagem de arquivo |
| **Contratos** | Testes usavam `quiz21-complete.json`, editor usava `quiz21-v4.json` |
| **Entidade** | Funil era "só JSON", sem identidade |

### Depois (Soluções)

| Aspecto | Solução |
|---------|---------|
| **Carregamento** | `FunnelResolver` mapeia ID → path dinamicamente |
| **Multi-funnel** | `FUNNEL_TEMPLATE_MAP` suporta N funis |
| **Persistência** | `FunnelService` verifica draft → carrega → salva → reabre |
| **Duplicação** | `duplicateFunnel()` cria cópia independente no Supabase |
| **Contratos** | Todos usam `quiz21-v4-saas.json` via `TEMPLATE_PATHS` |
| **Entidade** | `Funnel` interface com id, templateId, draftId, version |

---

## 🚀 Próximos Passos

### ✅ Implementado

- [x] FunnelResolver (mapeia IDs)
- [x] FunnelService (orchestrator)
- [x] EditorPage integrado
- [x] Persistência fechada (draft → save → reopen)
- [x] Multi-funnel support
- [x] Duplicação de funis

### ⏳ Próximos

1. **Atualizar testes E2E**
   - `resource-id-json-loading.spec.ts`
   - Adicionar `funnel-editing.spec.ts`
   - Testar duplicação

2. **UI para gerenciar funis**
   - Lista de funis do usuário
   - Botão "Duplicar"
   - Botão "Deletar"
   - Seletor de template base

3. **Painel de Propriedades completo**
   - Mapear todos os tipos de bloco
   - Padronizar content vs properties
   - Schema-driven editing

4. **Otimizações**
   - Cache de templates
   - Lazy loading de drafts
   - Diff visualization (versões)

---

## 📚 Documentação Relacionada

- `INTEGRACAO_V4_SAAS_COMPLETA.md` - Integração v4.1-saas
- `VERIFICACAO_INTEGRACAO_V4_SAAS.md` - Checklist de verificação
- `IMPLEMENTACAO_V4_SAAS_COMPLETA.md` - Implementação técnica
- `GUIA_RAPIDO_V4_SAAS.md` - Guia rápido

---

**Status**: ✅ **GARGALOS #1-#4 RESOLVIDOS**  
**Data**: 2025-12-01  
**Versão**: v4.1.0-saas  
**Arquitetura**: Multi-Funnel + Persistência Fechada
