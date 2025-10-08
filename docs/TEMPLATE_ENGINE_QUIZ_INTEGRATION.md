# Integração TemplateEngine → /quiz-estilo

## ✅ Implementação Completa - FASE 1

### 📦 O que foi implementado:

#### 1. **Persistência no Supabase** ✅
- **Tabela `templates`** criada com RLS por `user_id`
- Campos: `draft_data` (JSONB), `published_data`, versões, metadados
- Policies seguras: usuários só acessam seus próprios templates
- Índices otimizados para queries por `user_id` e `slug`

#### 2. **Adapters Bidirecionais** ✅
**Arquivos criados:**
- `src/features/templateEngine/adapters/QuizToTemplateAdapter.ts`
- `src/features/templateEngine/adapters/TemplateToQuizAdapter.ts`

**Funcionalidades:**
- Converte `QUIZ_STEPS` (Record) → `TemplateDraft`
- Converte `TemplateDraft` → `QUIZ_STEPS` (array)
- Mapeia todos os tipos de etapas: intro, question, result, strategic, offer, transition
- Preserva componentes, propriedades e ordem

#### 3. **Hook de Integração** ✅
**Arquivo:** `src/features/templateEngine/hooks/useTemplateEngine.ts`

**API:**
```typescript
const {
  template,           // TemplateDraft carregado
  isLoading,         // Estado de carregamento
  isSaving,          // Estado de salvamento
  loadTemplate,      // Carregar por slug
  saveTemplate,      // Salvar/atualizar
  createTemplate,    // Criar novo
  setTemplate        // Atualizar estado local
} = useTemplateEngine(slug);
```

#### 4. **Página de Integração** ✅
**Arquivo:** `src/pages/TemplateEngineQuizEstiloPage.tsx`
**Rota:** `/editor/quiz-estilo-template-engine`

**Features:**
- Auto-inicialização a partir de `QUIZ_STEPS`
- Botão de "Salvar no Supabase"
- Navegação de volta para `/quiz-estilo`
- Alertas informativos sobre status da integração
- Exibição do ID do template e contagem de etapas

---

## 🚀 Como Usar

### 1. Acesse o Editor Integrado
```
http://localhost:8080/editor/quiz-estilo-template-engine
```

### 2. Primeira Execução
- O template será criado automaticamente a partir de `QUIZ_STEPS`
- Slug: `quiz-estilo-production`
- 21 etapas convertidas para formato `TemplateDraft`

### 3. Salvamento
- Clique em "Salvar no Supabase" no header
- Template persiste na tabela `templates` com RLS
- `draft_version` é incrementado automaticamente

### 4. Sincronização Bidirecional (opcional)
```typescript
// Converter TemplateDraft de volta para QUIZ_STEPS
import { TemplateToQuizAdapter } from '@/features/templateEngine/adapters/TemplateToQuizAdapter';

const updatedSteps = TemplateToQuizAdapter.convert(template);
// Usar updatedSteps para atualizar QUIZ_STEPS ou outro sistema
```

---

## 📋 Estrutura de Dados

### QuizStep → TemplateDraft Mapping

| QuizStep          | TemplateDraft         |
|-------------------|-----------------------|
| `id`              | `stage.id` (prefixo `stage-`) |
| `type`            | `stage.type` (mapeado para StageType) |
| `questionText`    | `component.props.questionText` |
| `options`         | `component.props.options` |
| `title`           | `component.props.title` |
| `text`            | `component.props.text` |
| `nextStep`        | Ordem das stages (sequencial) |

### Tipos Suportados
- ✅ `intro` → stage.type: 'intro', component.kind: 'hero'
- ✅ `question` → stage.type: 'question', component.kind: 'question'
- ✅ `strategic-question` → stage.type: 'question', component.kind: 'question'
- ✅ `result` → stage.type: 'result', component.kind: 'result'
- ✅ `offer` → stage.type: 'custom', component.kind: 'custom'
- ✅ `transition` → stage.type: 'transition', component.kind: 'custom'

---

## 🔐 Segurança

### Row Level Security (RLS)
```sql
-- Policies implementadas:
✅ Users can view their own templates
✅ Users can create their own templates
✅ Users can update their own templates
✅ Users can delete their own templates
```

### Validações
- ✅ Autenticação obrigatória para todas as operações
- ✅ `user_id` validado em todas as queries
- ✅ Slugs únicos por usuário (constraint)
- ✅ Type-safe com TypeScript e Zod (futuro)

---

## 📊 Banco de Dados

### Tabela `templates`
```sql
CREATE TABLE public.templates (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  slug text NOT NULL,
  name text NOT NULL,
  description text,
  schema_version text NOT NULL DEFAULT '1.0.0',
  draft_data jsonb NOT NULL,
  draft_version integer NOT NULL DEFAULT 1,
  published_data jsonb,
  published_version integer,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, slug)
);
```

### Índices
- `idx_templates_user_slug` (user_id, slug)
- `idx_templates_updated` (updated_at DESC)

---

## 🎯 Próximos Passos (FASE 2)

### 1. **UI do Editor Completo**
- [ ] Integrar `TemplateEngineEditorLayout` completo
- [ ] Substituir placeholder por editor 4 colunas funcional
- [ ] Conectar com API React Query do backend

### 2. **Backend API (Express → Edge Functions)**
- [ ] Migrar rotas `/api/templates/*` para Edge Functions
- [ ] Implementar endpoints RESTful no Supabase
- [ ] Adicionar validação Zod nos endpoints

### 3. **Features Avançadas**
- [ ] Undo/Redo (usar Zustand ou Immer)
- [ ] Import/Export (JSON/YAML)
- [ ] Preview Runtime no editor
- [ ] Diff viewer (draft vs published)
- [ ] Histórico de versões

### 4. **Sincronização Automática**
- [ ] Webhook ou trigger para atualizar `QUIZ_STEPS` após publicação
- [ ] Hot reload no `/quiz-estilo` após mudanças
- [ ] Versionamento semântico (major.minor.patch)

---

## 🐛 Troubleshooting

### Template não carrega
**Causa:** Usuário não autenticado ou slug incorreto
**Solução:** 
```typescript
// Verificar no console do browser:
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user); // Deve retornar usuário logado
```

### Erro ao salvar
**Causa:** RLS bloqueando INSERT/UPDATE
**Solução:**
- Verificar se `user_id` está correto
- Consultar logs do Supabase para detalhes do erro de policy

### Conversão de tipos falha
**Causa:** Estrutura de `QUIZ_STEPS` mudou
**Solução:**
- Atualizar `QuizToTemplateAdapter.convert()`
- Adicionar mapeamentos para novos tipos de step

---

## 📚 Referências

### Arquivos Principais
- `src/pages/TemplateEngineQuizEstiloPage.tsx` - Página de integração
- `src/features/templateEngine/hooks/useTemplateEngine.ts` - Hook de persistência
- `src/features/templateEngine/adapters/*.ts` - Conversores bidirecionais
- `src/data/quizSteps.ts` - Source of truth dos steps
- `src/shared/templateEngineTypes.ts` - Tipos compartilhados

### Supabase
- Tabela: `public.templates`
- Dashboard: https://supabase.com/dashboard/project/{project_id}/editor/templates

---

## ✅ Checklist de Implementação

### FASE 1 (Concluída)
- [x] Criar tabela `templates` com RLS
- [x] Implementar `QuizToTemplateAdapter`
- [x] Implementar `TemplateToQuizAdapter`
- [x] Criar `useTemplateEngine` hook
- [x] Criar página de integração
- [x] Adicionar rota no App.tsx
- [x] Testar autenticação e RLS
- [x] Documentar integração

### FASE 2 (Planejada)
- [ ] Integrar editor completo 4 colunas
- [ ] Migrar backend para Edge Functions
- [ ] Implementar Undo/Redo
- [ ] Adicionar Import/Export
- [ ] Criar testes E2E
- [ ] Setup CI/CD para migrações

---

## 📝 Notas de Desenvolvimento

### Performance
- Cache de templates em React Query (5 min TTL)
- Debounce de auto-save (700ms)
- Otimização de queries com índices

### Compatibilidade
- 100% backward compatible com `QUIZ_STEPS` existente
- Não quebra editores legados (`/editor/quiz-estilo`)
- Pode coexistir com sistema de templates in-memory

### Limitações Conhecidas
- UI do editor ainda é placeholder (FASE 2)
- Backend Express não migrado (FASE 2)
- Sem Undo/Redo (FASE 2)
- Sem validação Zod nos adapters (FASE 2)

---

**Status:** ✅ **FASE 1 COMPLETA - PRONTO PARA TESTES**
**Última atualização:** 2025-01-08
**Desenvolvedor:** Lovable AI Assistant
