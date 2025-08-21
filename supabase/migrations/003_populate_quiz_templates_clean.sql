-- Migration para popular quiz_templates com dados reais
-- Inserir templates compatíveis com a estrutura da tabela existente

-- Inserir template principal do Quiz 21 Etapas
INSERT INTO quiz_templates (
  name,
  description,
  category,
  template_data,
  tags,
  is_public,
  usage_count
) VALUES (
  'Quiz Profissional 21 Etapas',
  'Sistema completo de descoberta de estilo pessoal com 21 etapas estruturadas, incluindo questões de personalidade, análise de estilo e ofertas estratégicas.',
  'quiz',
  '{
    "version": "2.0.0", 
    "type": "21-steps-quiz", 
    "description": "Template completo com 21 etapas", 
    "hasIntro": true, 
    "hasQuestions": true, 
    "hasResult": true, 
    "hasOffer": true,
    "componentsCount": 21,
    "thumbnail_url": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911666/C%C3%B3pia_de_Template_Dossi%C3%AA_Completo_2024_15_-_Copia_ssrhu3.webp"
  }'::jsonb,
  ARRAY['quiz', 'personalidade', 'estilo', '21-etapas'],
  true,
  2500
);

-- Inserir template de Quiz Básico
INSERT INTO quiz_templates (
  name,
  description,
  category,
  template_data,
  tags,
  is_public,
  usage_count
) VALUES (
  'Quiz de Personalidade Básico',
  'Template simples para descoberta de perfil pessoal com questões essenciais e resultado direto.',
  'quiz',
  '{
    "version": "1.0.0", 
    "type": "basic-quiz", 
    "description": "Template básico com 5-8 etapas", 
    "hasIntro": true, 
    "hasQuestions": true, 
    "hasResult": true, 
    "hasOffer": false,
    "componentsCount": 8,
    "thumbnail_url": "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Quiz+Básico"
  }'::jsonb,
  ARRAY['quiz', 'básico', 'personalidade'],
  true,
  1250
);

-- Inserir template de Funil de Captação
INSERT INTO quiz_templates (
  name,
  description,
  category,
  template_data,
  tags,
  is_public,
  usage_count
) VALUES (
  'Funil de Captação de Leads',
  'Template otimizado para captação de leads qualificados com estratégias de conversão comprovadas.',
  'funnel',
  '{
    "version": "1.0.0", 
    "type": "lead-funnel", 
    "description": "Funil com captação e nurturing", 
    "hasLanding": true, 
    "hasForm": true, 
    "hasEmail": true, 
    "hasOffer": true,
    "componentsCount": 12,
    "thumbnail_url": "https://via.placeholder.com/300x200/10B981/FFFFFF?text=Funil+Leads"
  }'::jsonb,
  ARRAY['funil', 'leads', 'captação'],
  true,
  800
);

-- Inserir template de Landing Page
INSERT INTO quiz_templates (
  name,
  description,
  category,
  template_data,
  tags,
  is_public,
  usage_count
) VALUES (
  'Landing Page Conversão',
  'Template clean e otimizado para apresentação de produtos com foco em conversão.',
  'landing',
  '{
    "version": "1.0.0", 
    "type": "conversion-landing", 
    "description": "Landing page otimizada", 
    "hasHero": true, 
    "hasBenefits": true, 
    "hasTestimonials": true, 
    "hasCTA": true,
    "componentsCount": 6,
    "thumbnail_url": "https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Landing+Page"
  }'::jsonb,
  ARRAY['landing', 'conversão', 'vendas'],
  true,
  600
);

-- Inserir template de Pesquisa NPS
INSERT INTO quiz_templates (
  name,
  description,
  category,
  template_data,
  tags,
  is_public,
  usage_count
) VALUES (
  'Pesquisa NPS e Satisfação',
  'Template para coleta de feedback e medição de satisfação com Net Promoter Score integrado.',
  'survey',
  '{
    "version": "1.0.0", 
    "type": "nps-survey", 
    "description": "Pesquisa NPS com análise", 
    "hasIntro": true, 
    "hasRating": true, 
    "hasComments": true, 
    "hasResults": true,
    "componentsCount": 5,
    "thumbnail_url": "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=NPS+Survey"
  }'::jsonb,
  ARRAY['nps', 'pesquisa', 'satisfação'],
  true,
  400
);

-- Função para incrementar contador de uso
CREATE OR REPLACE FUNCTION increment_template_usage(template_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE quiz_templates 
  SET usage_count = usage_count + 1,
      updated_at = NOW()
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql;

-- Função para buscar templates
CREATE OR REPLACE FUNCTION get_quiz_templates()
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  category TEXT,
  template_data JSONB,
  tags TEXT[],
  is_public BOOLEAN,
  usage_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    t.description,
    t.category,
    t.template_data,
    t.tags,
    t.is_public,
    t.usage_count,
    t.created_at,
    t.updated_at
  FROM quiz_templates t
  WHERE t.is_public = true
  ORDER BY t.usage_count DESC, t.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Função para buscar templates por categoria
CREATE OR REPLACE FUNCTION get_quiz_templates_by_category(template_category TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  category TEXT,
  template_data JSONB,
  tags TEXT[],
  is_public BOOLEAN,
  usage_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    t.description,
    t.category,
    t.template_data,
    t.tags,
    t.is_public,
    t.usage_count,
    t.created_at,
    t.updated_at
  FROM quiz_templates t
  WHERE t.category = template_category 
    AND t.is_public = true
  ORDER BY t.usage_count DESC, t.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Função para buscar templates
CREATE OR REPLACE FUNCTION search_quiz_templates(search_term TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  category TEXT,
  template_data JSONB,
  tags TEXT[],
  is_public BOOLEAN,
  usage_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    t.description,
    t.category,
    t.template_data,
    t.tags,
    t.is_public,
    t.usage_count,
    t.created_at,
    t.updated_at
  FROM quiz_templates t
  WHERE t.is_public = true
    AND (
      t.name ILIKE '%' || search_term || '%' 
      OR t.description ILIKE '%' || search_term || '%'
      OR search_term = ANY(t.tags)
    )
  ORDER BY t.usage_count DESC, t.created_at DESC;
END;
$$ LANGUAGE plpgsql;
