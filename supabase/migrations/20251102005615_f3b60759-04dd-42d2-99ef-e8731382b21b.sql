-- ============================================
-- FASE 1: FUNDAÇÃO - Tabelas de Persistência
-- ============================================

-- Criar tabela quiz_drafts (rascunhos em edição)
CREATE TABLE IF NOT EXISTS public.quiz_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  funnel_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  
  -- JSON estruturado do quiz (validado por Zod)
  content JSONB NOT NULL DEFAULT '{"steps": [], "metadata": {}}'::jsonb,
  
  -- Metadados
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Status do draft
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'validating', 'ready')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_validated_at TIMESTAMP WITH TIME ZONE,
  
  -- Índices para busca
  UNIQUE(user_id, funnel_id)
);

-- Criar tabela quiz_production (versões publicadas)
CREATE TABLE IF NOT EXISTS public.quiz_production (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  draft_id UUID REFERENCES public.quiz_drafts(id) ON DELETE SET NULL,
  funnel_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  version INTEGER NOT NULL DEFAULT 1,
  
  -- JSON estruturado do quiz (apenas válido entra aqui)
  content JSONB NOT NULL,
  
  -- Metadados
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Status
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'archived', 'deprecated')),
  is_template BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Índices
  UNIQUE(funnel_id, version)
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_quiz_drafts_user_id ON public.quiz_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_drafts_funnel_id ON public.quiz_drafts(funnel_id);
CREATE INDEX IF NOT EXISTS idx_quiz_drafts_status ON public.quiz_drafts(status);
CREATE INDEX IF NOT EXISTS idx_quiz_drafts_updated_at ON public.quiz_drafts(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_quiz_production_user_id ON public.quiz_production(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_production_funnel_id ON public.quiz_production(funnel_id);
CREATE INDEX IF NOT EXISTS idx_quiz_production_slug ON public.quiz_production(slug);
CREATE INDEX IF NOT EXISTS idx_quiz_production_is_template ON public.quiz_production(is_template) WHERE is_template = true;
CREATE INDEX IF NOT EXISTS idx_quiz_production_published_at ON public.quiz_production(published_at DESC);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_quiz_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_quiz_drafts_updated_at
  BEFORE UPDATE ON public.quiz_drafts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_quiz_updated_at();

CREATE TRIGGER update_quiz_production_updated_at
  BEFORE UPDATE ON public.quiz_production
  FOR EACH ROW
  EXECUTE FUNCTION public.update_quiz_updated_at();

-- ============================================
-- RLS POLICIES
-- ============================================

-- Habilitar RLS
ALTER TABLE public.quiz_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_production ENABLE ROW LEVEL SECURITY;

-- Policies para quiz_drafts (apenas owner)
CREATE POLICY "Users can view their own drafts"
  ON public.quiz_drafts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own drafts"
  ON public.quiz_drafts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drafts"
  ON public.quiz_drafts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drafts"
  ON public.quiz_drafts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policies para quiz_production
CREATE POLICY "Templates are publicly readable"
  ON public.quiz_production
  FOR SELECT
  USING (is_template = true OR auth.uid() = user_id);

CREATE POLICY "Users can publish their own quizzes"
  ON public.quiz_production
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own published quizzes"
  ON public.quiz_production
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can archive their own quizzes"
  ON public.quiz_production
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNÇÕES HELPER
-- ============================================

-- Função para duplicar template
CREATE OR REPLACE FUNCTION public.duplicate_quiz_template(
  template_slug TEXT,
  new_name TEXT,
  new_funnel_id TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  template_content JSONB;
  new_draft_id UUID;
BEGIN
  -- Buscar template
  SELECT content INTO template_content
  FROM public.quiz_production
  WHERE slug = template_slug AND is_template = true
  LIMIT 1;

  IF template_content IS NULL THEN
    RAISE EXCEPTION 'Template não encontrado: %', template_slug;
  END IF;

  -- Criar novo draft
  INSERT INTO public.quiz_drafts (user_id, funnel_id, name, slug, content, status)
  VALUES (
    auth.uid(),
    new_funnel_id,
    new_name,
    new_funnel_id,
    template_content,
    'draft'
  )
  RETURNING id INTO new_draft_id;

  RETURN new_draft_id;
END;
$$;

-- Função para publicar draft
CREATE OR REPLACE FUNCTION public.publish_quiz_draft(draft_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  draft_record RECORD;
  new_version INTEGER;
  production_id UUID;
BEGIN
  -- Buscar draft
  SELECT * INTO draft_record
  FROM public.quiz_drafts
  WHERE id = draft_id AND user_id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Draft não encontrado ou não pertence ao usuário';
  END IF;

  -- Calcular próxima versão
  SELECT COALESCE(MAX(version), 0) + 1 INTO new_version
  FROM public.quiz_production
  WHERE funnel_id = draft_record.funnel_id;

  -- Criar registro em produção
  INSERT INTO public.quiz_production (
    user_id, draft_id, funnel_id, name, slug, version, content, metadata, status
  )
  VALUES (
    draft_record.user_id,
    draft_id,
    draft_record.funnel_id,
    draft_record.name,
    draft_record.slug,
    new_version,
    draft_record.content,
    draft_record.metadata,
    'published'
  )
  RETURNING id INTO production_id;

  RETURN production_id;
END;
$$;