-- MIGRATION 005: Component System for Funnel Editor
-- Sistema de componentes reutilizáveis para o editor de funil

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Component types catalog
CREATE TABLE IF NOT EXISTS public.component_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type_key TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  icon TEXT,
  preview_image_url TEXT,
  default_properties JSONB NOT NULL DEFAULT '{}',
  validation_schema JSONB NOT NULL DEFAULT '{}',
  custom_styling JSONB DEFAULT '{}',
  component_path TEXT NOT NULL,
  is_system BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ
);

CREATE TRIGGER component_types_set_timestamp
  BEFORE UPDATE ON public.component_types
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

ALTER TABLE public.component_types ENABLE ROW LEVEL SECURITY;

-- RLS policies for component_types
CREATE POLICY "Authenticated users can select component types"
  ON public.component_types
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert component types"
  ON public.component_types
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update component types"
  ON public.component_types
  FOR UPDATE
  TO authenticated
  USING (true);

-- Component instances per funnel step
CREATE TABLE IF NOT EXISTS public.component_instances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_key TEXT NOT NULL,
  component_type_key TEXT NOT NULL REFERENCES public.component_types(type_key),
  
  funnel_id TEXT NOT NULL,
  stage_id TEXT,
  step_number INTEGER NOT NULL,
  
  order_index INTEGER NOT NULL DEFAULT 1,
  
  properties JSONB NOT NULL DEFAULT '{}',
  custom_styling JSONB DEFAULT '{}',
  
  is_active BOOLEAN DEFAULT true,
  is_locked BOOLEAN DEFAULT false,
  is_template BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID DEFAULT auth.uid(),
  
  CONSTRAINT uq_component_instance UNIQUE(funnel_id, step_number, instance_key)
);

CREATE TRIGGER component_instances_set_timestamp
  BEFORE UPDATE ON public.component_instances
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_component_instances_funnel_step_order
  ON public.component_instances (funnel_id, step_number, order_index);

CREATE INDEX IF NOT EXISTS idx_component_instances_funnel_stage
  ON public.component_instances (funnel_id, stage_id);

ALTER TABLE public.component_instances ENABLE ROW LEVEL SECURITY;

-- RLS policies for component_instances (simplified for now since funnels table doesn't exist with author_id)
CREATE POLICY "Authenticated users can view component instances"
  ON public.component_instances
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert component instances"
  ON public.component_instances
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update component instances"
  ON public.component_instances
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete component instances"
  ON public.component_instances
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default component types
INSERT INTO public.component_types (type_key, display_name, description, category, component_path, is_system, default_properties) VALUES
  ('text-inline', 'Texto Inline', 'Componente de texto simples', 'content', 'TextInlineBlock', true, '{"text": "Texto exemplo"}'),
  ('button', 'Botão', 'Botão de ação', 'interaction', 'ButtonBlock', true, '{"text": "Clique aqui", "variant": "primary"}'),
  ('options-grid', 'Grade de Opções', 'Grade de opções selecionáveis', 'form', 'OptionsGridBlock', true, '{"options": []}'),
  ('headline', 'Título', 'Título principal', 'content', 'HeadlineBlock', true, '{"title": "Título", "subtitle": ""}'),
  ('image', 'Imagem', 'Componente de imagem', 'media', 'ImageBlock', true, '{"imageUrl": "", "alt": ""}'),
  ('benefits', 'Lista de Benefícios', 'Lista de benefícios ou características', 'content', 'BenefitsBlock', true, '{"title": "Benefícios", "items": []}')
ON CONFLICT (type_key) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  updated_at = NOW();