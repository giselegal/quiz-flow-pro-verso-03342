# Correção de Migrations - 28 Nov 2025

## ❌ Problema Identificado

```
ERRO: 42703: a coluna "user_id" não existe
CONTEXTO: Instrução SQL "CREATE POLICY ... quiz_sessions ... user_id"
```

## 🔍 Análise

A tabela `quiz_sessions` não possui coluna `user_id`. Estrutura real:

```sql
CREATE TABLE quiz_sessions (
    id text PRIMARY KEY,
    funnel_id text NOT NULL REFERENCES funnels(id),
    quiz_user_id text NOT NULL REFERENCES quiz_users(id),  -- ← Usa quiz_user_id
    status text DEFAULT 'active',
    current_step integer DEFAULT 0,
    ...
);
```

## ✅ Correção Aplicada

### Antes (Incorreto)
```sql
CREATE POLICY "quiz_sessions_select_policy" ON quiz_sessions
  FOR SELECT
  USING (auth.uid()::text = user_id OR user_id IS NULL);
```

### Depois (Correto)
```sql
CREATE POLICY "quiz_sessions_select_policy" ON quiz_sessions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM funnels
      WHERE funnels.id = quiz_sessions.funnel_id
      AND funnels.user_id = auth.uid()::text
    )
  );
```

## 📝 Todas as Políticas Corrigidas

### 1. SELECT Policy
- **Antes:** Verificava `user_id` diretamente (coluna inexistente)
- **Depois:** Verifica ownership via `funnels.user_id`
- **Lógica:** Users podem ver sessões dos funis que possuem

### 2. INSERT Policy
- **Antes:** Permitia qualquer inserção (`WITH CHECK (true)`)
- **Depois:** Valida que o funnel está publicado
- **Lógica:** Qualquer um pode criar sessão em funnel público

### 3. UPDATE Policy
- **Antes:** Verificava `user_id` inexistente
- **Depois:** Verifica ownership via `funnels.user_id`
- **Lógica:** Owners podem atualizar sessões dos seus funis

### 4. DELETE Policy
- **Antes:** Verificava `user_id` inexistente
- **Depois:** Verifica ownership via `funnels.user_id`
- **Lógica:** Owners podem deletar sessões dos seus funis

## 🎯 Arquivo Corrigido

- **Arquivo:** `supabase/migrations/20251110_auth_hardening_rls.sql`
- **Linhas alteradas:** 189-225 (SECTION 5)
- **Status:** ✅ Pronto para aplicação

## ▶️ Próximo Passo

Execute novamente a migration no Supabase Dashboard:

```sql
-- Cole o conteúdo atualizado do arquivo:
supabase/migrations/20251110_auth_hardening_rls.sql
```

Ou via linha de comando:
```bash
cat supabase/migrations/20251110_auth_hardening_rls.sql
```
