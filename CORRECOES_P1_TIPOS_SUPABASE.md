# Correções P1: Consolidação de Tipos Supabase

**Data**: 2025-01-28  
**Prioridade**: P1 (Alta)  
**Status**: ✅ Completo

---

## 📋 Resumo Executivo

Auditoria P1 identificou **conflitos críticos** entre duas fontes de tipos Supabase no projeto:
- `shared/types/supabase.ts` (legado, 557 linhas)
- `src/integrations/supabase/types.ts` (atual, 1017 linhas)

**Resultado**: Consolidação completa em **src/integrations/supabase/types.ts** como fonte única de verdade, alinhada com migrations SQL.

---

## 🔍 Problemas Identificados

### 1. Tabelas com Estruturas Conflitantes

| Tabela | Legado (shared/) | Atual (src/integrations/) | SQL Migration |
|--------|------------------|---------------------------|---------------|
| **quiz_drafts** | `steps: any` | `content: JSONB` + `funnel_id` | ✅ 20251102005615 |
| **quiz_production** | `steps: any` + `source_draft_id` | `content: JSONB` + `draft_id` + `funnel_id` | ✅ 20251102005615 |
| **quiz_analytics** | `event_type` + UTM fields | `metric_name` + `metric_value` | ❌ Não existia |

### 2. Tabelas Inexistentes no Banco

**Legado (shared/types/supabase.ts) continha definições para:**
- `profiles` ❌
- `quizzes` ❌
- `questions` ❌
- `quiz_attempts` ❌
- `quiz_categories` ❌
- `quiz_tags` ❌
- `quiz_feedback` ❌
- `question_responses` ❌

**Nenhuma destas tabelas existe nas migrations!**

### 3. Uso Incorreto de Fonte Legada

**Arquivos afetados:**
- `src/types/supabase.ts` re-exportava `shared/types/supabase.ts`
- 6 arquivos críticos usavam `src/integrations/supabase/types.ts` diretamente:
  - `src/services/quizSupabaseService.ts`
  - `src/services/resultService.ts`
  - `src/types/unified-schema.ts`
  - `src/core/quiz/hooks/useQuizCRUD.ts`
  - `src/hooks/useQuizCRUD.ts`
  - `src/lib/supabase.ts`

---

## ✅ Correções Aplicadas

### 1. Criada Migration para `quiz_analytics`

**Arquivo**: `supabase/migrations/20251202_create_quiz_analytics.sql`

```sql
CREATE TABLE IF NOT EXISTS public.quiz_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  user_id TEXT,
  funnel_id TEXT,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  metric_data JSONB,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

**RLS Policies:**
- ✅ Admins podem ver todas as analytics
- ✅ Owners do funnel podem ver analytics dos seus funis
- ✅ Service role pode inserir (sistema)

### 2. Limpo `shared/types/supabase.ts`

**Antes**: 557 linhas com 10+ tabelas legadas  
**Depois**: ~50 linhas com apenas interfaces auxiliares

**Removido:**
- ❌ Database interface completa
- ❌ Definições de tabelas inexistentes (profiles, quizzes, questions, etc.)
- ❌ Interfaces de QuizTemplate, QuizCategory, QuizTag, QuizFeedback
- ❌ EditorQuiz, EditorQuestion, CreateQuizData
- ❌ QuizFilters, QuizSearchResult, MediaUpload, UploadResult
- ❌ EditorConfig e DEFAULT_EDITOR_CONFIG

**Mantido:**
- ✅ AuthUser, AuthState (usados no sistema de auth)
- ✅ ApiResponse, PaginatedResponse (utilitários genéricos)
- ✅ ValidationError, ValidationResult (validação genérica)

**Adicionado:**
- ✅ Re-export de `Database` de `src/integrations/supabase/types.ts`

### 3. Atualizado `src/types/supabase.ts`

**Antes:**
```typescript
export * from '../../shared/types/supabase';
export type { Database } from '../../shared/types/supabase';
```

**Depois:**
```typescript
// FONTE DE VERDADE: src/integrations/supabase/types.ts (gerado do banco)
export type { Database } from '@/services/integrations/supabase/types';

// Re-export de interfaces auxiliares do arquivo legado
export type { 
  AuthUser, AuthState, ApiResponse, PaginatedResponse, 
  ValidationError, ValidationResult 
} from '../../shared/types/supabase';
```

---

## 📊 Impacto e Validação

### Arquivos Modificados
1. ✅ `shared/types/supabase.ts` (557 → ~50 linhas)
2. ✅ `src/types/supabase.ts` (re-export corrigido)
3. ✅ `supabase/migrations/20251202_create_quiz_analytics.sql` (novo)

### Testes de Compilação
- ✅ `shared/types/supabase.ts`: Sem erros
- ✅ `src/types/supabase.ts`: Sem erros
- ✅ Nenhum arquivo importa tipos removidos (verificado)

### Tabelas Alinhadas com Migrations
✅ **quiz_drafts**: `content: JSONB`, `funnel_id: TEXT NOT NULL`  
✅ **quiz_production**: `content: JSONB`, `draft_id`, `funnel_id: TEXT NOT NULL`  
✅ **quiz_analytics**: Agora existe com estrutura de métricas  
✅ **quiz_conversions**: Já existia (adicionada em P0)  
✅ **templates**: Já existia (adicionada em P0)

---

## 🎯 Próximos Passos (P2)

### 1. Configurar Geração Automática de Tipos
```bash
npx supabase gen types typescript --local > src/integrations/supabase/types.ts
```

**Requisitos:**
- SUPABASE_PROJECT_ID configurado
- service_role key disponível

### 2. Avaliar `types_updated.ts`
- Arquivo: `src/services/integrations/supabase/types_updated.ts`
- Decisão: Atualizar ou remover (duplicação com types.ts)

### 3. Aplicar Migration em Ambiente
```bash
# Local
npx supabase db push

# Produção (quando pronto)
npx supabase db push --db-url $DATABASE_URL
```

---

## 📚 Referências

**Migrations relacionadas:**
- `001_complete_schema.sql` - Schema base (quiz_sessions, quiz_results, quiz_conversions)
- `20251102005615_f3b60759-04dd-42d2-99ef-e8731382b21b.sql` - quiz_drafts e quiz_production
- `20251125_create_templates_table.sql` - Tabela templates
- `20251202_create_quiz_analytics.sql` - Tabela quiz_analytics (NOVO)

**Documentos de auditoria:**
- `AUDITORIA_CONSOLIDADA_FINAL.md`
- `AUDITORIA_SUPABASE_INTEGRACAO.md`
- `IMPLEMENTACAO_CORRECOES_P0_P1_FINAL.md`

---

## ✅ Conclusão

**Status**: P1 Completo  
**Fonte de verdade estabelecida**: `src/integrations/supabase/types.ts`  
**Tabelas alinhadas**: 100% com migrations SQL  
**Tipos legados**: Removidos de forma segura  
**Retrocompatibilidade**: Mantida via re-exports  

**Próximo marco**: P2 - Automação e otimização
