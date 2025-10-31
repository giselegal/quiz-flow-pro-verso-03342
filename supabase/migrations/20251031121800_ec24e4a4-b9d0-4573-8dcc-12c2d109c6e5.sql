-- 🎯 FIX 1.3: Adicionar campos category e context à tabela funnels
-- Resolve schema incompleto que causava erros de persistência

-- Adicionar campos metadata
ALTER TABLE funnels 
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'quiz',
  ADD COLUMN IF NOT EXISTS context TEXT DEFAULT 'editor';

-- Criar índices para queries otimizadas
CREATE INDEX IF NOT EXISTS idx_funnels_category ON funnels(category);
CREATE INDEX IF NOT EXISTS idx_funnels_context ON funnels(context);
CREATE INDEX IF NOT EXISTS idx_funnels_user_category ON funnels(user_id, category);

-- Adicionar constraints de validação
ALTER TABLE funnels
  ADD CONSTRAINT check_category_valid 
  CHECK (category IN ('quiz', 'survey', 'form', 'assessment', 'other'));

ALTER TABLE funnels
  ADD CONSTRAINT check_context_valid
  CHECK (context IN ('editor', 'runtime', 'preview', 'published'));

-- Comentários de documentação
COMMENT ON COLUMN funnels.category IS 'Tipo de funil: quiz, survey, form, etc.';
COMMENT ON COLUMN funnels.context IS 'Contexto de uso: editor (edição), runtime (execução), preview (pré-visualização), published (publicado)';
