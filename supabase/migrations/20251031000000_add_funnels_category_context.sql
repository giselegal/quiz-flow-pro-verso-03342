-- ============================================================================
-- 🎯 FIX 1.4: ADICIONAR CAMPOS CATEGORY E CONTEXT NA TABELA FUNNELS
-- ============================================================================
-- 
-- Problema identificado na auditoria:
-- - Tabela 'funnels' está sem os campos 'category' e 'context'
-- - Código espera esses campos mas eles não existem no schema
-- - Resultado: Erros ao criar/atualizar funnels
-- 
-- Solução:
-- 1. Adicionar campos com valores padrão
-- 2. Criar índices para melhor performance
-- 3. Validação de valores permitidos via CHECK constraint
-- 
-- Execução: Via Supabase SQL Editor
-- ============================================================================

-- 1. Adicionar campo 'category' (quiz, lead-magnet, webinar, etc)
ALTER TABLE funnels 
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'quiz' NOT NULL;

-- 2. Adicionar campo 'context' (editor, dashboard, public, etc)
ALTER TABLE funnels 
  ADD COLUMN IF NOT EXISTS context TEXT DEFAULT 'editor' NOT NULL;

-- 3. Adicionar constraint de validação para category
ALTER TABLE funnels 
  ADD CONSTRAINT funnels_category_check 
  CHECK (category IN ('quiz', 'lead-magnet', 'webinar', 'sales', 'outros'));

-- 4. Adicionar constraint de validação para context
ALTER TABLE funnels 
  ADD CONSTRAINT funnels_context_check 
  CHECK (context IN ('editor', 'dashboard', 'public', 'admin'));

-- 5. Criar índice para category (melhora queries por categoria)
CREATE INDEX IF NOT EXISTS idx_funnels_category 
  ON funnels(category);

-- 6. Criar índice para context (melhora queries por contexto)
CREATE INDEX IF NOT EXISTS idx_funnels_context 
  ON funnels(context);

-- 7. Criar índice composto para queries comuns (category + context)
CREATE INDEX IF NOT EXISTS idx_funnels_category_context 
  ON funnels(category, context);

-- 8. Atualizar funnels existentes com valores padrão (se necessário)
UPDATE funnels 
SET 
  category = COALESCE(category, 'quiz'),
  context = COALESCE(context, 'editor')
WHERE 
  category IS NULL 
  OR context IS NULL;

-- ============================================================================
-- VERIFICAÇÃO
-- ============================================================================

-- Verificar estrutura da tabela
SELECT 
  column_name, 
  data_type, 
  column_default, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'funnels'
  AND column_name IN ('category', 'context')
ORDER BY ordinal_position;

-- Verificar índices criados
SELECT 
  indexname, 
  indexdef
FROM pg_indexes
WHERE tablename = 'funnels'
  AND indexname LIKE 'idx_funnels_%'
ORDER BY indexname;

-- Verificar constraints
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'funnels'::regclass
  AND conname LIKE '%category%' OR conname LIKE '%context%';

-- ============================================================================
-- ROLLBACK (se necessário)
-- ============================================================================

-- ATENÇÃO: Executar apenas se precisar reverter as alterações

-- DROP INDEX IF EXISTS idx_funnels_category_context;
-- DROP INDEX IF EXISTS idx_funnels_context;
-- DROP INDEX IF EXISTS idx_funnels_category;
-- ALTER TABLE funnels DROP CONSTRAINT IF EXISTS funnels_context_check;
-- ALTER TABLE funnels DROP CONSTRAINT IF EXISTS funnels_category_check;
-- ALTER TABLE funnels DROP COLUMN IF EXISTS context;
-- ALTER TABLE funnels DROP COLUMN IF EXISTS category;
