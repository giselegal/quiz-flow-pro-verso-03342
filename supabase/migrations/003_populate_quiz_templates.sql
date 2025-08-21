-- Migration para popular quiz_templates com dados reais
-- Inserir templates compatíveis com a estrutura da tabela existente

-- Inserir template principal do Quiz 21 Etapas
INSERT INTO quiz_templates (
  id,
  name,
  description,
  category,
  template_data,
  tags,
  is_public,
  usage_count,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
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
  2500,
  NOW(),
  NOW()
);

-- Inserir template de Quiz Básico
INSERT INTO quiz_templates (
  id,
  name,
  description,
  category,
  template_data,
  tags,
  is_public,
  usage_count,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
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
  1250,
  NOW(),
  NOW()
);

-- Inserir template de Funil de Captação
INSERT INTO quiz_templates (
  id,
  name,
  description,
  category,
  template_data,
  tags,
  is_public,
  usage_count,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
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
  800,
  NOW(),
  NOW()
);

-- Inserir template de Landing Page
INSERT INTO quiz_templates (
  id,
  name,
  description,
  category,
  template_data,
  tags,
  is_public,
  usage_count,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
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
  600,
  NOW(),
  NOW()
);

-- Inserir template de Pesquisa NPS
INSERT INTO quiz_templates (
  id,
  name,
  description,
  category,
  template_data,
  tags,
  is_public,
  usage_count,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
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
  400,
  NOW(),
  NOW()
);

-- Criar função para incrementar uso do template
CREATE OR REPLACE FUNCTION increment_template_usage(template_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE quiz_templates 
  SET usage_count = usage_count + 1,
      updated_at = NOW()
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql;

-- Criar função para buscar templates
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

-- Criar função para buscar template por ID
CREATE OR REPLACE FUNCTION get_quiz_template_by_id(template_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  category TEXT,
  template_data JSONB,
  thumbnail_url TEXT,
  is_official BOOLEAN,
  usage_count INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT t.id, t.name, t.description, t.category, t.template_data, 
         t.thumbnail_url, t.is_official, t.usage_count, t.created_at, t.updated_at
  FROM quiz_templates t
  WHERE t.id = template_id;
END;
$$ LANGUAGE plpgsql;

-- Criar função para buscar templates por categoria
CREATE OR REPLACE FUNCTION get_quiz_templates_by_category(template_category TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  category TEXT,
  template_data JSONB,
  thumbnail_url TEXT,
  is_official BOOLEAN,
  usage_count INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT t.id, t.name, t.description, t.category, t.template_data, 
         t.thumbnail_url, t.is_official, t.usage_count, t.created_at, t.updated_at
  FROM quiz_templates t
  WHERE t.category = template_category
  ORDER BY t.usage_count DESC, t.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Criar função para buscar templates
CREATE OR REPLACE FUNCTION search_quiz_templates(search_term TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  category TEXT,
  template_data JSONB,
  thumbnail_url TEXT,
  is_official BOOLEAN,
  usage_count INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT t.id, t.name, t.description, t.category, t.template_data, 
         t.thumbnail_url, t.is_official, t.usage_count, t.created_at, t.updated_at
  FROM quiz_templates t
  WHERE t.name ILIKE '%' || search_term || '%' 
     OR t.description ILIKE '%' || search_term || '%'
  ORDER BY t.usage_count DESC, t.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Criar função para criar template
CREATE OR REPLACE FUNCTION create_quiz_template(
  template_name TEXT,
  template_description TEXT DEFAULT '',
  template_category TEXT DEFAULT 'quiz',
  template_data JSONB DEFAULT '{}'::jsonb,
  thumbnail_url TEXT DEFAULT ''
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  category TEXT,
  template_data JSONB,
  thumbnail_url TEXT,
  is_official BOOLEAN,
  usage_count INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
DECLARE
  new_template_id UUID;
BEGIN
  new_template_id := gen_random_uuid();
  
  INSERT INTO quiz_templates (
    id, name, description, category, template_data, thumbnail_url, is_official, usage_count
  ) VALUES (
    new_template_id, template_name, template_description, template_category, 
    template_data, thumbnail_url, false, 0
  );
  
  RETURN QUERY
  SELECT t.id, t.name, t.description, t.category, t.template_data, 
         t.thumbnail_url, t.is_official, t.usage_count, t.created_at, t.updated_at
  FROM quiz_templates t
  WHERE t.id = new_template_id;
END;
$$ LANGUAGE plpgsql;
