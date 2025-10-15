-- Criar tabela FUNNELS (CRÍTICA)
CREATE TABLE IF NOT EXISTS public.funnels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'quiz' CHECK (type IN ('quiz', 'survey', 'form')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  config JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_funnels_user_id ON public.funnels(user_id);
CREATE INDEX IF NOT EXISTS idx_funnels_status ON public.funnels(status);
CREATE INDEX IF NOT EXISTS idx_funnels_type ON public.funnels(type);

-- RLS
ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;

-- Políticas (acesso público para leitura, proprietário para modificação)
CREATE POLICY "Public can read active funnels" 
  ON public.funnels FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Users can manage their funnels" 
  ON public.funnels FOR ALL 
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

-- Trigger para updated_at
CREATE TRIGGER update_funnels_updated_at
  BEFORE UPDATE ON public.funnels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();