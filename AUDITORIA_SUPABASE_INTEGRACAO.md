# 🔍 Auditoria de Integração Supabase

**Data:** 2025-12-03  
**Autor:** GitHub Copilot Coding Agent  
**Escopo:** Verificação de alinhamento entre tabelas do Supabase, tipos TypeScript e serviços de integração

---

## 📋 Sumário Executivo

Esta auditoria analisa a consistência entre:
1. **Migrações SQL** (supabase/migrations/)
2. **Tipos TypeScript** (src/integrations/supabase/types.ts)
3. **Tipos compartilhados** (shared/types/supabase.ts)
4. **Serviços de integração** (services/)

---

## 🗄️ Tabelas Definidas nas Migrações

### Tabelas Principais (001_complete_schema.sql)
| Tabela | Status | Observações |
|--------|--------|-------------|
| `funnels` | ✅ OK | id TEXT PRIMARY KEY |
| `quiz_users` | ✅ OK | Usuários de quiz |
| `quiz_sessions` | ✅ OK | Sessões de quiz |
| `quiz_results` | ✅ OK | Resultados de quiz |
| `quiz_step_responses` | ✅ OK | Respostas por step |
| `quiz_conversions` | ⚠️ Definida em migration mas não em types.ts | Conversões |
| `active_sessions` | ✅ OK | Sessões do sistema |
| `admin_goals` | ✅ OK | Metas do admin |
| `ai_optimization_recommendations` | ✅ OK | Recomendações IA |
| `optimization_results` | ✅ OK | Resultados otimização |
| `backup_jobs` | ✅ OK | Jobs de backup |
| `rate_limits` | ✅ OK | Limites de taxa |

### Tabelas Adicionais (outras migrações)
| Tabela | Migration | Status |
|--------|-----------|--------|
| `quiz_drafts` | 20251128_fix_drafts_integration.sql | ✅ OK - Usado para drafts de edição |
| `quiz_production` | 20251128_fix_drafts_integration.sql | ✅ OK - Quizzes publicados |
| `quiz_events` | 20251203_rls_audit_consolidation.sql | ✅ OK - Eventos de analytics |
| `quiz_definitions` | 20251203_rls_audit_consolidation.sql | ✅ OK - Definições de quiz |
| `outcomes` | 20251203_rls_audit_consolidation.sql | ✅ OK - Resultados possíveis |
| `component_types` | 006_component_configurations.sql | ✅ OK - Tipos de componentes |
| `component_presets` | 006_component_configurations.sql | ✅ OK - Presets de componentes |
| `component_instances` | 006_component_configurations.sql | ✅ OK - Instâncias de componentes |
| `calculation_audit` | 20251203_rls_audit_consolidation.sql | ✅ OK - Auditoria de cálculos |
| `user_results` | 20251203_rls_audit_consolidation.sql | ✅ OK - Resultados de usuários |
| `templates` | 20251125_create_templates_table.sql | ⚠️ Não está em types.ts |
| `quiz_analytics` | 001_complete_schema.sql (parcial) | ✅ OK - Analytics de quiz |
| `profiles` | 20251009121000_create_profiles.sql | ⚠️ Referenciado em shared/types/supabase.ts mas não em src/integrations |

---

## 📁 Análise dos Arquivos de Tipos

### 1. `src/integrations/supabase/types.ts`
**Tabelas definidas (16 tabelas):**
- ✅ calculation_audit
- ✅ component_instances
- ✅ component_presets
- ✅ component_types
- ✅ funnels
- ✅ outcomes
- ✅ quiz_analytics
- ✅ quiz_definitions
- ✅ quiz_drafts
- ✅ quiz_events
- ✅ quiz_production
- ✅ quiz_results
- ✅ quiz_sessions
- ✅ quiz_step_responses
- ✅ quiz_users
- ✅ user_results

**Funções RPC definidas:**
- ✅ batch_sync_components_for_step
- ✅ batch_update_components
- ✅ duplicate_quiz_template
- ✅ publish_quiz_draft

### 2. `src/services/integrations/supabase/types.ts`
**Re-exportação de:** `src/integrations/supabase/types.ts`
- Mesmo conteúdo (16 tabelas)

### 3. `src/services/integrations/supabase/types_updated.ts`
**Arquivo mais completo (23 tabelas):**
- ✅ Inclui todas as 16 tabelas do arquivo principal
- ✅ **quiz_conversions** (ausente no arquivo principal!)
- ✅ active_sessions
- ✅ admin_goals  
- ✅ ai_optimization_recommendations
- ✅ backup_jobs
- ✅ optimization_results
- ✅ rate_limits

**⚠️ Este arquivo não está sendo usado pelo projeto!**

### 4. `shared/types/supabase.ts`
**Tabelas definidas:**
- ✅ quiz_drafts (estrutura diferente!)
- ✅ quiz_production (estrutura diferente!)
- ✅ profiles
- ✅ quizzes
- ✅ questions
- ✅ quiz_attempts
- ✅ question_responses
- ✅ quiz_templates
- ✅ quiz_categories
- ✅ quiz_tags
- ✅ quiz_analytics (estrutura diferente!)
- ✅ quiz_feedback

---

## ⚠️ Inconsistências Identificadas

### 1. **CRÍTICO: Tipos Duplicados com Estruturas Diferentes**

#### quiz_drafts
| Campo | src/integrations/supabase/types.ts | shared/types/supabase.ts |
|-------|-----------------------------------|--------------------------|
| id | ✅ string | ✅ string |
| name | ✅ string | ✅ string |
| slug | ✅ string | ✅ string |
| content | ✅ Json | ❌ Não existe (usa `steps`) |
| steps | ❌ Não existe | ✅ any (JSONB) |
| funnel_id | ✅ string | ❌ Não existe |
| metadata | ✅ Json | ❌ Não existe |
| status | ✅ string | ❌ Não existe |
| last_validated_at | ✅ string | ❌ Não existe |

**Recomendação:** Unificar as definições. A versão em `src/integrations/supabase/types.ts` parece mais completa e alinhada com as migrações recentes.

#### quiz_production
| Campo | src/integrations/supabase/types.ts | shared/types/supabase.ts |
|-------|-----------------------------------|--------------------------|
| id | ✅ string | ❌ Não existe |
| name | ✅ string | ❌ Não existe |
| content | ✅ Json | ❌ Não existe (usa `steps`) |
| funnel_id | ✅ string | ✅ string (como slug) |
| user_id | ✅ string | ❌ Não existe |
| is_template | ✅ boolean | ❌ Não existe |

#### quiz_analytics
| Campo | src/integrations/supabase/types.ts | shared/types/supabase.ts |
|-------|-----------------------------------|--------------------------|
| metric_name | ✅ string | ❌ Não existe (usa `event_type`) |
| metric_value | ✅ number | ❌ Não existe |
| metric_data | ✅ Json | ❌ Não existe |
| event_type | ❌ Não existe | ✅ enum string |
| event_data | ❌ Não existe | ✅ Record<string, any> |

### 2. **AVISO: Tabela quiz_conversions - Tipos Desatualizados**
- **Status:** 
  - ✅ Definida na migration `001_complete_schema.sql`
  - ✅ Definida em `types_updated.ts` (versão mais completa)
  - ❌ **NÃO está** no arquivo principal `types.ts` (usado pelos serviços)
  - ⚠️ Definição parcial em `unified-schema.ts` (tipos fallback)
- **Impacto:** Código em `quizSupabaseService.ts` linha 420-445 retorna mock porque tabela não é reconhecida
- **Serviço afetado:** `recordConversion()` em quizSupabaseService.ts
- **Solução:** Usar `types_updated.ts` como base ou migrar definição para `types.ts`

```typescript
// Código atual (linhas 420-430 - retornando MOCK)
async recordConversion(conversionData: {...}): Promise<string> {
    try {
      // NOTA: Tabela quiz_conversions não existe no schema atual
      // TODO: Criar migration ou usar tabela alternativa
      appLogger.warn('recordConversion: Tabela quiz_conversions não implementada no schema');
      return `mock-conversion-${Date.now()}`;
```

**Campos disponíveis em `types_updated.ts`:**
- id, session_id, conversion_type, conversion_value
- currency, product_id, product_name
- affiliate_id, commission_rate, conversion_data, converted_at

### 3. **AVISO: Tabela templates**
- **Status:** Definida em migrations mas **NÃO está** em `types.ts`
- **Migration:** `20251125_create_templates_table.sql`
- **Campos:** id, name, slug, description, category, blocks, steps, settings, version, status, user_id, funnel_id

### 4. **AVISO: Tipo de ID Inconsistente na Tabela funnels**
| Arquivo | Tipo de ID |
|---------|-----------|
| Migration (001) | `text PRIMARY KEY` |
| src/integrations/types.ts | `string` ✅ |
| database/enhanced_schema.sql | `UUID PRIMARY KEY` ❌ |

### 5. **INFO: Tabelas Extras em shared/types/supabase.ts**
Tabelas que existem apenas em `shared/types/supabase.ts` mas não nas migrações atuais:
- `quizzes` - Pode ser legado
- `questions` - Pode ser legado
- `quiz_attempts` - Pode ser legado
- `question_responses` - Pode ser legado
- `quiz_templates` - Pode ser legado
- `quiz_categories` - Pode ser legado
- `quiz_tags` - Pode ser legado
- `quiz_feedback` - Pode ser legado

---

## 🔐 Políticas RLS (Row Level Security)

### Verificação de Políticas
A migration `20251203_rls_audit_consolidation.sql` consolidou as políticas RLS:

| Tabela | RLS Enabled | Políticas |
|--------|-------------|-----------|
| quiz_drafts | ✅ | owner_select, owner_insert, owner_update, owner_delete |
| quiz_production | ✅ | owner_*, public_read (published) |
| quiz_events | ✅ | insert_all, select_service |
| quiz_definitions | ✅ | authenticated_all |
| outcomes | ✅ | authenticated_all, public_read |
| component_types | ✅ | read_all, write_authenticated |
| component_presets | ✅ | read_all, owner_write |
| calculation_audit | ✅ | service_only |
| user_results | ✅ | owner_read, insert_all |

### ⚠️ Políticas Permissivas (Development Mode)
Em `001_complete_schema.sql`, algumas tabelas têm políticas muito permissivas:
```sql
-- NOTA: Para desenvolvimento, vamos permitir tudo.
CREATE POLICY "Enable read access for all users" ON public.funnels FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.funnels FOR INSERT WITH CHECK (true);
```

**Recomendação:** Em produção, estas políticas devem ser mais restritivas.

---

## 📊 Serviços de Integração

### quizSupabaseService.ts
| Método | Tabela Usada | Status |
|--------|-------------|--------|
| createQuizUser | quiz_users | ✅ OK |
| getQuizUserBySessionId | quiz_users | ✅ OK |
| createQuizSession | quiz_sessions | ✅ OK |
| updateQuizSession | quiz_sessions | ✅ OK |
| getQuizSession | quiz_sessions | ✅ OK |
| saveQuizResponse | quiz_step_responses | ✅ OK |
| getQuizResponses | quiz_step_responses | ✅ OK |
| saveQuizResult | quiz_results | ✅ OK |
| getQuizResult | quiz_results | ✅ OK |
| trackEvent | quiz_analytics | ✅ OK |
| recordConversion | quiz_conversions | ⚠️ MOCK (tabela não em types) |
| getQuizAnalytics | quiz_sessions | ✅ OK |

### FunnelService.ts
| Método | Tabela Usada | Status |
|--------|-------------|--------|
| loadDraftFromSupabase | quiz_drafts | ✅ OK |
| saveFunnel | quiz_drafts | ✅ OK |
| deleteFunnel | quiz_drafts | ✅ OK |
| listFunnels | quiz_drafts | ✅ OK |

### FunnelDataService.ts
| Método | Tabela Usada | Status |
|--------|-------------|--------|
| listFunnels | funnels | ✅ OK |
| getFunnel | funnels | ✅ OK |
| createFunnel | funnels | ✅ OK |
| updateFunnel | funnels | ✅ OK |
| deleteFunnel | funnels | ✅ OK |
| duplicateFunnel | funnels | ✅ OK |

---

## 🔧 Recomendações de Correção

### Prioridade Alta (P0)

1. **Usar types_updated.ts como Fonte de Verdade**
   - **Arquivo:** `src/services/integrations/supabase/types_updated.ts`
   - **Ação:** Renomear para `types.ts` ou atualizar importações
   - **Benefício:** Inclui quiz_conversions e outras tabelas faltantes
   - **Comando sugerido:** 
   ```bash
   # Fazer backup e substituir
   mv src/services/integrations/supabase/types.ts src/services/integrations/supabase/types.backup.ts
   mv src/services/integrations/supabase/types_updated.ts src/services/integrations/supabase/types.ts
   ```

2. **Habilitar recordConversion no quizSupabaseService.ts**
   - Remover código mock e usar tipos de `types_updated.ts`
   - Linhas afetadas: 420-445

3. **Unificar Tipos de quiz_drafts**
   - Remover definição em `shared/types/supabase.ts`
   - Usar apenas `src/integrations/supabase/types.ts` como fonte de verdade
   - OU regenerar tipos usando `supabase gen types typescript`

### Prioridade Média (P1)

3. **Adicionar Tipo templates**
   - Adicionar definição da tabela templates em `src/integrations/supabase/types.ts`
   - Criar serviço de templates que use Supabase

4. **Revisar ID de funnels**
   - Decidir entre TEXT ou UUID para consistência
   - Atualizar `database/enhanced_schema.sql` para usar TEXT (alinhando com migration 001)

5. **Limpar Tipos Legados**
   - Avaliar se tabelas em `shared/types/supabase.ts` são necessárias
   - Se não, remover para evitar confusão

### Prioridade Baixa (P2)

6. **Gerar Tipos Automaticamente**
   - Usar `supabase gen types typescript` para manter tipos sincronizados
   - Configurar CI para verificar discrepâncias

7. **Documentar Schema**
   - Criar diagrama ER atualizado
   - Documentar relacionamentos entre tabelas

---

## 📝 Scripts de Correção Sugeridos

### Script 1: Verificar Tipos vs Migrations
```bash
npm run supabase:gen:types
```

### Script 2: Verificar RLS
```bash
npm run audit:rls
```

### Script 3: Verificar Funções RPC
```bash
npm run rpc:verify
```

---

## ✅ Conclusão

A integração entre Supabase e o projeto está **funcionalmente correta** para as operações principais (CRUD de funnels, quiz sessions, responses). No entanto, existem **inconsistências de tipos** que podem causar problemas de manutenção a longo prazo.

### Pontuação Geral
| Aspecto | Pontuação |
|---------|-----------|
| Funcionalidade | 8/10 |
| Consistência de Tipos | 6/10 |
| Segurança (RLS) | 9/10 |
| Documentação | 5/10 |
| Manutenibilidade | 6/10 |

### Próximos Passos
1. Executar correções P0 imediatamente
2. Planejar correções P1 para próxima sprint
3. Documentar P2 no backlog

---

*Relatório gerado automaticamente por auditoria de sistema*
