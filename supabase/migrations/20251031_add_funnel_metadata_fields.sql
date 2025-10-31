/**
 * 🗄️ MIGRATION: Add Metadata Fields to Funnels Table
 * 
 * Fase 1.4 - Schema do Banco de Dados
 * 
 * Adiciona campos ausentes identificados no audit:
 * - category: Categorização do funil (quiz, lead-magnet, webinar, etc.)
 * - context: Contexto de uso (editor, viewer, public)
 * 
 * Data: 2025-10-31
 * Author: Fase 1 Audit Fixes
 */

-- ============================================================================
-- 1. Adicionar colunas se não existirem
-- ============================================================================

-- Adicionar campo 'category' (categoria do funil)
ALTER TABLE funnels 
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'quiz';

-- Adicionar campo 'context' (contexto de uso)
ALTER TABLE funnels 
  ADD COLUMN IF NOT EXISTS context TEXT DEFAULT 'editor';

-- ============================================================================
-- 2. Adicionar comentários para documentação
-- ============================================================================

COMMENT ON COLUMN funnels.category IS 
  'Categoria do funil: quiz, lead-magnet, webinar, outros';

COMMENT ON COLUMN funnels.context IS 
  'Contexto de uso: editor (modo edição), viewer (modo visualização), public (público)';

-- ============================================================================
-- 3. Criar índices para melhor performance
-- ============================================================================

-- Índice para busca por categoria
CREATE INDEX IF NOT EXISTS idx_funnels_category 
  ON funnels(category);

-- Índice para busca por contexto
CREATE INDEX IF NOT EXISTS idx_funnels_context 
  ON funnels(context);

-- Índice composto para queries filtradas por ambos
CREATE INDEX IF NOT EXISTS idx_funnels_category_context 
  ON funnels(category, context);

-- ============================================================================
-- 4. Atualizar registros existentes (se necessário)
-- ============================================================================

-- Atualizar funnels sem categoria para 'quiz' (valor padrão mais comum)
UPDATE funnels 
SET category = 'quiz' 
WHERE category IS NULL;

-- Atualizar funnels sem contexto para 'editor' (valor padrão)
UPDATE funnels 
SET context = 'editor' 
WHERE context IS NULL;

-- ============================================================================
-- 5. Adicionar constraint CHECK para validação
-- ============================================================================

-- Garantir que category tenha valores válidos
ALTER TABLE funnels
  ADD CONSTRAINT funnels_category_check 
  CHECK (category IN ('quiz', 'lead-magnet', 'webinar', 'outros', 'workshop', 'curso'));

-- Garantir que context tenha valores válidos
ALTER TABLE funnels
  ADD CONSTRAINT funnels_context_check 
  CHECK (context IN ('editor', 'viewer', 'public'));

-- ============================================================================
-- 6. Garantir que novos registros sempre tenham valores
-- ============================================================================

-- Tornar category NOT NULL (após setar valores default)
ALTER TABLE funnels 
  ALTER COLUMN category SET NOT NULL;

-- Tornar context NOT NULL (após setar valores default)
ALTER TABLE funnels 
  ALTER COLUMN context SET NOT NULL;

-- ============================================================================
-- ROLLBACK (caso necessário)
-- ============================================================================

-- Para reverter esta migration:
-- 
-- DROP INDEX IF EXISTS idx_funnels_category_context;
-- DROP INDEX IF EXISTS idx_funnels_context;
-- DROP INDEX IF EXISTS idx_funnels_category;
-- ALTER TABLE funnels DROP CONSTRAINT IF EXISTS funnels_context_check;
-- ALTER TABLE funnels DROP CONSTRAINT IF EXISTS funnels_category_check;
-- ALTER TABLE funnels DROP COLUMN IF EXISTS context;
-- ALTER TABLE funnels DROP COLUMN IF EXISTS category;
