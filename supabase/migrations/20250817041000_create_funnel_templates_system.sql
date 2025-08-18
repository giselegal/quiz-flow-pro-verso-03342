-- Create funnel_templates table for template management
-- This table stores reusable funnel templates organized by categories

CREATE TABLE IF NOT EXISTS funnel_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'custom',
  theme TEXT DEFAULT 'default',
  
  -- Template metadata
  step_count INTEGER DEFAULT 1,
  is_official BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  
  -- Template data
  template_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  components JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Ownership and permissions
  created_by UUID REFERENCES auth.users(id),
  is_public BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_funnel_templates_category ON funnel_templates(category);
CREATE INDEX idx_funnel_templates_official ON funnel_templates(is_official) WHERE is_official = true;
CREATE INDEX idx_funnel_templates_public ON funnel_templates(is_public) WHERE is_public = true;
CREATE INDEX idx_funnel_templates_usage ON funnel_templates(usage_count DESC);
CREATE INDEX idx_funnel_templates_created_by ON funnel_templates(created_by);
CREATE INDEX idx_funnel_templates_tags ON funnel_templates USING GIN(tags);

-- Enable RLS
ALTER TABLE funnel_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view public templates" 
ON funnel_templates FOR SELECT 
USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can view official templates" 
ON funnel_templates FOR SELECT 
USING (is_official = true);

CREATE POLICY "Users can create their own templates" 
ON funnel_templates FOR INSERT 
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own templates" 
ON funnel_templates FOR UPDATE 
USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own templates" 
ON funnel_templates FOR DELETE 
USING (created_by = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_funnel_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_funnel_templates_updated_at_trigger
  BEFORE UPDATE ON funnel_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_funnel_templates_updated_at();

-- Create function to increment usage count
CREATE OR REPLACE FUNCTION increment_template_usage(template_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE funnel_templates 
  SET usage_count = usage_count + 1,
      updated_at = NOW()
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql;

-- Insert default official templates
INSERT INTO funnel_templates (
  name, description, category, theme, step_count, is_official, is_public, tags, template_data, components
) VALUES 
(
  'Quiz de Estilo Completo (21 Etapas)',
  'Funil completo para descoberta de estilo pessoal com todas as 21 etapas incluindo coleta de leads, questionário detalhado e resultado personalizado',
  'quiz-style',
  'modern-chic',
  21,
  true,
  true,
  ARRAY['estilo', 'moda', 'personalidade', 'completo', 'quiz'],
  '{
    "version": "2.0",
    "templateId": "style-quiz-21-steps",
    "settings": {
      "theme": "modern-chic",
      "primaryColor": "#B89B7A",
      "secondaryColor": "#6B4F43",
      "backgroundColor": "#FAF9F7"
    }
  }'::jsonb,
  '[]'::jsonb
),
(
  'Captura de Lead Simples',
  'Funil básico com 5 etapas para captura eficiente de leads com formulário otimizado e baixa taxa de abandono',
  'lead-generation',
  'business-clean',
  5,
  true,
  true,
  ARRAY['leads', 'simples', 'conversão', 'formulário'],
  '{
    "version": "2.0",
    "templateId": "lead-capture-simple",
    "settings": {
      "theme": "business-clean",
      "primaryColor": "#2196F3",
      "secondaryColor": "#1976D2",
      "backgroundColor": "#FFFFFF"
    }
  }'::jsonb,
  '[]'::jsonb
),
(
  'Avaliação de Personalidade',
  'Teste psicológico com 15 etapas para análise comportamental baseado em metodologias científicas',
  'personality-test',
  'wellness-soft',
  15,
  true,
  true,
  ARRAY['personalidade', 'psicologia', 'comportamento', 'análise'],
  '{
    "version": "2.0",
    "templateId": "personality-assessment",
    "settings": {
      "theme": "wellness-soft",
      "primaryColor": "#9C27B0",
      "secondaryColor": "#7B1FA2",
      "backgroundColor": "#F3E5F5"
    }
  }'::jsonb,
  '[]'::jsonb
),
(
  'Recomendador de Produto',
  'Guia inteligente para recomendação personalizada de produtos baseado nas preferências do usuário',
  'product-recommendation',
  'tech-modern',
  12,
  true,
  true,
  ARRAY['produto', 'recomendação', 'vendas', 'personalização'],
  '{
    "version": "2.0",
    "templateId": "product-matcher",
    "settings": {
      "theme": "tech-modern",
      "primaryColor": "#4CAF50",
      "secondaryColor": "#388E3C",
      "backgroundColor": "#F1F8E9"
    }
  }'::jsonb,
  '[]'::jsonb
),
(
  'Avaliação de Habilidades',
  'Teste de competências profissionais com certificação para desenvolvimento de carreira',
  'assessment',
  'corporate-blue',
  18,
  true,
  true,
  ARRAY['habilidades', 'profissional', 'certificação', 'carreira'],
  '{
    "version": "2.0",
    "templateId": "skill-assessment",
    "settings": {
      "theme": "corporate-blue",
      "primaryColor": "#FF9800",
      "secondaryColor": "#F57C00",
      "backgroundColor": "#FFF3E0"
    }
  }'::jsonb,
  '[]'::jsonb
),
(
  'Funil de Vendas Premium',
  'Funil de alta conversão para produtos premium com estratégias psicológicas de vendas',
  'offer-funnel',
  'luxury-gold',
  9,
  true,
  true,
  ARRAY['vendas', 'premium', 'alta-conversão', 'luxo'],
  '{
    "version": "2.0",
    "templateId": "sales-funnel-premium",
    "settings": {
      "theme": "luxury-gold",
      "primaryColor": "#F44336",
      "secondaryColor": "#D32F2F",
      "backgroundColor": "#FFEBEE"
    }
  }'::jsonb,
  '[]'::jsonb
);

-- Create view for template statistics
CREATE OR REPLACE VIEW template_statistics AS
SELECT 
  category,
  COUNT(*) as total_templates,
  COUNT(*) FILTER (WHERE is_official = true) as official_templates,
  COUNT(*) FILTER (WHERE is_public = true) as public_templates,
  SUM(usage_count) as total_usage,
  AVG(usage_count) as avg_usage_per_template,
  MAX(usage_count) as max_usage
FROM funnel_templates
GROUP BY category;

-- Add comments for documentation
COMMENT ON TABLE funnel_templates IS 'Stores reusable funnel templates organized by categories with metadata and components';
COMMENT ON COLUMN funnel_templates.category IS 'Template category (quiz-style, lead-generation, personality-test, product-recommendation, assessment, offer-funnel)';
COMMENT ON COLUMN funnel_templates.theme IS 'Visual theme identifier for styling';
COMMENT ON COLUMN funnel_templates.template_data IS 'Template configuration and settings as JSON';
COMMENT ON COLUMN funnel_templates.components IS 'Template components and blocks as JSON array';
COMMENT ON COLUMN funnel_templates.usage_count IS 'Number of times this template has been used to create funnels';