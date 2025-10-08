-- Criar tabela templates para persistência do Template Engine
CREATE TABLE public.templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  description text,
  schema_version text NOT NULL DEFAULT '1.0.0',
  
  -- Draft data (JSON completo do TemplateDraft)
  draft_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  draft_version integer NOT NULL DEFAULT 1,
  
  -- Published snapshot (opcional)
  published_data jsonb,
  published_version integer,
  published_at timestamptz,
  
  -- Metadata
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  -- Constraints
  UNIQUE(user_id, slug)
);

-- Enable RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Policies: Users can manage their own templates
CREATE POLICY "Users can view their own templates"
  ON public.templates
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own templates"
  ON public.templates
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
  ON public.templates
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
  ON public.templates
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX idx_templates_user_slug ON public.templates(user_id, slug);
CREATE INDEX idx_templates_updated ON public.templates(updated_at DESC);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON public.templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();