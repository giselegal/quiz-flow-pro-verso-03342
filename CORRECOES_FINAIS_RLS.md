# ✅ Correções Finais Aplicadas - Migration RLS

## 🔧 Correções Realizadas

### 1️⃣ **Problema:** Coluna `user_id` não existe em `quiz_sessions`
```diff
- USING (auth.uid()::text = user_id OR user_id IS NULL)
+ USING (EXISTS (SELECT 1 FROM funnels WHERE funnels.id = quiz_sessions.funnel_id AND funnels.user_id = auth.uid()::text))
```

### 2️⃣ **Problema:** Coluna `status` não existe em `funnels`
```diff
- AND funnels.status IN ('published', 'active')
+ AND funnels.is_published = true
```

## 📊 Estrutura Real das Tabelas

### `funnels` table:
```sql
CREATE TABLE funnels (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text,
    settings jsonb,
    is_published boolean DEFAULT false,  -- ✅ Usa is_published (boolean)
    user_id text,
    version integer DEFAULT 1,
    created_at timestamptz,
    updated_at timestamptz
);
```

### `quiz_sessions` table:
```sql
CREATE TABLE quiz_sessions (
    id text PRIMARY KEY,
    funnel_id text REFERENCES funnels(id),
    quiz_user_id text REFERENCES quiz_users(id),  -- ✅ Usa quiz_user_id, não user_id
    status text DEFAULT 'active',
    current_step integer DEFAULT 0,
    ...
);
```

## ✅ Políticas Corrigidas

### SELECT Policy
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
**Lógica:** Owners podem ver sessões dos seus funis

### INSERT Policy
```sql
CREATE POLICY "quiz_sessions_insert_policy" ON quiz_sessions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM funnels
      WHERE funnels.id = quiz_sessions.funnel_id
      AND funnels.is_published = true
    )
  );
```
**Lógica:** Qualquer um pode criar sessões em funis publicados

### UPDATE Policy
```sql
CREATE POLICY "quiz_sessions_update_policy" ON quiz_sessions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM funnels
      WHERE funnels.id = quiz_sessions.funnel_id
      AND funnels.user_id = auth.uid()::text
    )
  );
```
**Lógica:** Owners podem atualizar sessões dos seus funis

### DELETE Policy
```sql
CREATE POLICY "quiz_sessions_delete_policy" ON quiz_sessions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM funnels
      WHERE funnels.id = quiz_sessions.funnel_id
      AND funnels.user_id = auth.uid()::text
    )
  );
```
**Lógica:** Owners podem deletar sessões dos seus funis

## 🚀 Pronto para Aplicação

**Arquivo:** `supabase/migrations/20251110_auth_hardening_rls.sql`  
**Status:** ✅ Todas as correções aplicadas  
**Linhas:** 484  

## ▶️ Aplicar no Supabase Dashboard

1. Acesse: https://pwtjuuhchtbzttrzoutw.supabase.co
2. SQL Editor → New Query
3. Cole o conteúdo completo do arquivo
4. Execute com **Run** ou `Ctrl+Enter`

## 📋 Validação Pós-Aplicação

Após aplicar a migration, execute:
```bash
node scripts/validate-security.mjs
```

Espera-se 100% de sucesso após aplicar ambas as migrations.
