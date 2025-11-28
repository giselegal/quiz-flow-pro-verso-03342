# Supabase: Tipos e Auditoria RLS

**Last Updated:** November 28, 2025  
**Status:** Active  
**Coverage:** RLS enabled on all sensitive tables

---

## 📊 Type Sources Overview

### Primary Type File (Canonical)
```
shared/types/supabase.ts
```

### Additional Type Files
| File | Status | Notes |
|------|--------|-------|
| `src/services/integrations/supabase/types.ts` | Active | Service-specific types |
| `src/services/integrations/supabase/types_updated.ts` | ⚠️ Obsolete | Migrate to primary |
| `supabase/functions/_shared/types.ts` | Active | Edge Functions (Deno) |

---

## 🔧 Variáveis Necessárias

- `SUPABASE_DB_URL`: URL Postgres (recomendado para gerar tipos e rodar auditoria RLS)
- Alternativa para gerar tipos via CLI:
  - `VITE_SUPABASE_PROJECT_ID`
  - `SUPABASE_ACCESS_TOKEN`

Defina localmente:

```bash
export SUPABASE_DB_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

Ou via projeto/token:

```bash
export VITE_SUPABASE_PROJECT_ID="xxxx"
export SUPABASE_ACCESS_TOKEN="sbpat_xxx"
```

## 📝 Comandos

### Gerar Tipos

```bash
npm run supabase:gen:types
```

### Rodar Auditoria RLS

Requer `psql` e `SUPABASE_DB_URL`:

```bash
npm run audit:rls
```

Relatório será salvo em `reports/rls-audit-YYYY-MM-DD.log`.

### Gerar Relatório de Migração JSON

```bash
npm run audit:migration-status
```

---

## 🔒 RLS Policy Coverage

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `funnels` | ✅ | ✅ | ✅ | ✅ |
| `quiz_production` | ✅ | ✅ | ✅ | ✅ |
| `component_instances` | ✅ | ✅ | ✅ | ✅ |
| `templates` | ✅ | ✅ | ✅ | ✅ |
| `drafts` | ✅ | ✅ | ✅ | ✅ |

### RLS Migrations
| Migration | Description |
|-----------|-------------|
| `20251009120000_rls_hardening.sql` | Initial RLS setup |
| `20251110_auth_hardening_rls.sql` | Comprehensive RLS policies |
| `20251123_critical_rls_policies.sql` | Additional coverage |
| `20251128_security_enhancements.sql` | Security improvements |

---

## 🔍 O que a Auditoria RLS Verifica

1. ✅ RLS habilitado em todas as tabelas públicas
2. ✅ Políticas existem para tabelas sensíveis
3. ✅ Cobertura CRUD por tabela
4. ⚠️ Tabelas sem RLS são sinalizadas

---

## 🚀 CI Integration

Workflow `validate-json-and-rls.yml`:

- `validate-json-v4`: sempre roda e falha PRs se JSON V4 inválidos
- `audit-json-inventory`: inventário completo de JSONs
- `migration-status`: relatório de migração V3→V4
- `audit-rls`: roda apenas se `SUPABASE_DB_URL` estiver configurado

### Configuração no GitHub
1. Vá em Repository Settings → Secrets and variables → Actions
2. Adicione `SUPABASE_DB_URL` com a connection string

### Schedule
- Diariamente às 6 AM UTC
- Em todo push para `main`
- Em todo PR para `main`

---

## ✅ Best Practices

### 1. Sempre Use o Cliente Padrão
```typescript
// ✅ Correto
import { supabase } from '@/integrations/supabase/client';

// ❌ Evite criar clientes customizados
// import { createClient } from '@supabase/supabase-js';
```

### 2. Verifique RLS Antes do Deploy
```bash
npm run audit:rls
```

### 3. Regenere Tipos Após Mudanças no Schema
```bash
npm run supabase:gen:types
```

---

## 📚 Documentação Relacionada

- [SECURITY.md](../SECURITY.md) - Status geral de segurança
- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [JSON Template Migration Guide](./JSON_TEMPLATE_MIGRATION_GUIDE.md)

---

_Este guia é mantido como parte da infraestrutura de segurança do Quiz Flow Pro._
