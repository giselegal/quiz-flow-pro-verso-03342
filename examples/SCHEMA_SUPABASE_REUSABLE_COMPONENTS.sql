-- ============================================================================
-- SCHEMA SUPABASE PARA COMPONENTES REUTILIZÁVEIS
-- Integração com o sistema do /editor-fixed
-- ============================================================================

-- 📦 TABELA: TIPOS DE COMPONENTES (TEMPLATES/MOLDES)
CREATE TABLE IF NOT EXISTS component_types (
  -- IDs e Identificação
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type_key TEXT UNIQUE NOT NULL, -- Ex: "gisele-header", "style-question"
  display_name TEXT NOT NULL, -- Ex: "Header Gisele Galvão"
  description TEXT,
  
  -- Categorização
  category TEXT NOT NULL, -- Ex: "headers", "buttons", "questions", "grids"
  subcategory TEXT, -- Ex: "brand", "interactive", "display"
  
  -- Configuração Visual
  icon TEXT, -- Nome do ícone Lucide
  preview_image_url TEXT,
  
  -- Propriedades e Validação
  default_properties JSONB NOT NULL DEFAULT '{}',
  validation_schema JSONB NOT NULL DEFAULT '{}',
  custom_styling JSONB DEFAULT '{}',
  
  -- Configuração Técnica
  component_path TEXT NOT NULL, -- Caminho do componente React
  is_system BOOLEAN DEFAULT false, -- Componente do sistema vs. personalizado
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  -- Estatísticas de Uso
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ
);

-- 🧩 TABELA: INSTÂNCIAS DE COMPONENTES (PEÇAS USADAS NO QUIZ)
CREATE TABLE IF NOT EXISTS component_instances (
  -- IDs e Referências
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_key TEXT NOT NULL, -- Ex: "header-step06-001"
  component_type_key TEXT NOT NULL REFERENCES component_types(type_key),
  
  -- Localização no Quiz
  quiz_id TEXT NOT NULL, -- ID do quiz/projeto
  step_number INTEGER NOT NULL, -- Etapa do quiz (1-21)
  order_index INTEGER NOT NULL DEFAULT 1, -- Ordem na etapa
  
  -- Configuração da Instância
  properties JSONB NOT NULL DEFAULT '{}', -- Propriedades específicas
  custom_styling JSONB DEFAULT '{}', -- CSS/Tailwind customizado
  
  -- Estados e Controle
  is_active BOOLEAN DEFAULT true,
  is_locked BOOLEAN DEFAULT false, -- Impede edição
  is_template BOOLEAN DEFAULT false, -- Pode ser usado como template
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  -- Índices compostos para performance
  UNIQUE(quiz_id, step_number, instance_key)
);

-- 📊 VIEW: COMPONENTES COMPLETOS POR ETAPA
CREATE OR REPLACE VIEW step_components AS
SELECT 
  ci.id,
  ci.instance_key,
  ci.quiz_id,
  ci.step_number,
  ci.order_index,
  ci.properties,
  ci.custom_styling,
  ci.is_active,
  ci.is_locked,
  
  -- Dados do tipo de componente
  ct.type_key as component_type,
  ct.display_name,
  ct.category,
  ct.subcategory,
  ct.icon,
  ct.component_path,
  ct.default_properties,
  ct.validation_schema,
  
  -- Metadados
  ci.created_at,
  ci.updated_at
FROM component_instances ci
JOIN component_types ct ON ci.component_type_key = ct.type_key
WHERE ci.is_active = true
ORDER BY ci.quiz_id, ci.step_number, ci.order_index;

-- 🎯 TABELA: TEMPLATES DE QUIZ (CONJUNTOS DE COMPONENTES)
CREATE TABLE IF NOT EXISTS quiz_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT UNIQUE NOT NULL, -- Ex: "estilo-gisele-galvao"
  display_name TEXT NOT NULL, -- Ex: "Quiz de Estilo - Gisele Galvão"
  description TEXT,
  
  -- Configuração do Template
  steps_count INTEGER NOT NULL DEFAULT 10,
  category TEXT, -- Ex: "fashion", "personality", "business"
  
  -- Estrutura do Template (JSON com configuração de cada step)
  template_structure JSONB NOT NULL DEFAULT '{}',
  
  -- Metadados
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  -- Estatísticas
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ
);

-- ⚡ ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_component_instances_quiz_step 
ON component_instances(quiz_id, step_number);

CREATE INDEX IF NOT EXISTS idx_component_instances_type 
ON component_instances(component_type_key);

CREATE INDEX IF NOT EXISTS idx_component_types_category 
ON component_types(category, is_active);

CREATE INDEX IF NOT EXISTS idx_step_components_lookup 
ON component_instances(quiz_id, step_number, order_index) 
WHERE is_active = true;

-- 🔧 TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_component_types_updated_at 
BEFORE UPDATE ON component_types 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_component_instances_updated_at 
BEFORE UPDATE ON component_instances 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 📈 TRIGGER PARA ESTATÍSTICAS DE USO
CREATE OR REPLACE FUNCTION update_component_usage_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar estatísticas do tipo de componente
  UPDATE component_types 
  SET 
    usage_count = usage_count + 1,
    last_used_at = NOW()
  WHERE type_key = NEW.component_type_key;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usage_stats_trigger 
AFTER INSERT ON component_instances 
FOR EACH ROW EXECUTE FUNCTION update_component_usage_stats();

-- ============================================================================
-- DADOS INICIAIS - COMPONENTES DO EDITOR EXISTENTE
-- ============================================================================

-- 🎯 INSERIR TIPOS DE COMPONENTES DO ENHANCED_BLOCK_REGISTRY
INSERT INTO component_types (type_key, display_name, description, category, component_path, default_properties, validation_schema) VALUES

-- 📝 Text and Content
('text-inline', 'Texto Inline', 'Componente de texto editável inline', 'content', '/components/editor/blocks/TextInlineBlock', 
 '{"content": "Texto exemplo", "fontSize": "text-lg", "color": "#432818"}',
 '{"content": {"type": "string", "required": true}, "fontSize": {"type": "string"}, "color": {"type": "string"}}'),

('heading-inline', 'Título Inline', 'Componente de título editável', 'content', '/components/editor/blocks/HeadingInlineBlock',
 '{"content": "Título", "level": "h2", "fontSize": "text-2xl", "fontWeight": "font-bold"}',
 '{"content": {"type": "string", "required": true}, "level": {"type": "string", "enum": ["h1", "h2", "h3", "h4"]}}'),

('image-display-inline', 'Imagem Display', 'Componente de exibição de imagem', 'media', '/components/editor/blocks/ImageDisplayInlineBlock',
 '{"src": "", "alt": "Imagem", "width": 400, "height": 300}',
 '{"src": {"type": "string", "required": true}, "alt": {"type": "string"}}'),

-- 🎯 Quiz Components
('quiz-intro-header', 'Header do Quiz', 'Cabeçalho com logo e progresso', 'headers', '/components/editor/blocks/QuizIntroHeaderBlock',
 '{"logoUrl": "", "logoWidth": 120, "progressValue": 0, "showBackButton": false}',
 '{"logoUrl": {"type": "string", "required": true}}'),

('form-input', 'Campo de Formulário', 'Input para coleta de dados', 'forms', '/components/editor/blocks/FormInputBlock',
 '{"label": "Campo", "placeholder": "Digite aqui...", "required": false, "inputType": "text"}',
 '{"label": {"type": "string", "required": true}, "inputType": {"type": "string", "enum": ["text", "email", "number"]}}'),

('options-grid', 'Grade de Opções', 'Grade de opções para quiz', 'interactive', '/components/editor/blocks/OptionsGridBlock',
 '{"options": [], "columns": 2, "showImages": true, "multipleSelection": false}',
 '{"options": {"type": "array", "required": true}, "columns": {"type": "number", "min": 1, "max": 4}}'),

('button-inline', 'Botão', 'Botão de ação', 'interactive', '/components/blocks/inline/ButtonInlineFixed',
 '{"text": "Clique aqui", "variant": "primary", "backgroundColor": "#B89B7A", "textColor": "#ffffff"}',
 '{"text": {"type": "string", "required": true}}'),

-- 🎨 Visual Components
('decorative-bar-inline', 'Barra Decorativa', 'Barra visual decorativa', 'visual', '/components/blocks/inline/DecorativeBarInline',
 '{"width": "100%", "height": 4, "color": "#B89B7A", "borderRadius": 3}',
 '{"width": {"type": "string"}, "height": {"type": "number"}, "color": {"type": "string"}}'),

('legal-notice-inline', 'Aviso Legal', 'Componente de aviso legal e copyright', 'legal', '/components/blocks/inline/LegalNoticeInline',
 '{"privacyText": "Política de privacidade", "copyrightText": "© 2025 Todos os direitos reservados"}',
 '{"privacyText": {"type": "string"}, "copyrightText": {"type": "string"}}')

ON CONFLICT (type_key) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  default_properties = EXCLUDED.default_properties,
  updated_at = NOW();

-- ============================================================================
-- EXEMPLOS DE USO - COMPONENTES DA MARCA GISELE GALVÃO
-- ============================================================================

-- 🎨 COMPONENTES CUSTOMIZADOS DA MARCA
INSERT INTO component_types (type_key, display_name, description, category, component_path, default_properties) VALUES

('gisele-header', 'Header Gisele Galvão', 'Header personalizado da marca', 'headers', '/components/editor/blocks/QuizIntroHeaderBlock',
 '{"logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp", "logoWidth": 120, "logoHeight": 120, "backgroundColor": "transparent", "showBackButton": true}'),

('gisele-button', 'Botão Gisele Galvão', 'Botão com estilo da marca', 'interactive', '/components/blocks/inline/ButtonInlineFixed',
 '{"backgroundColor": "#B89B7A", "textColor": "#ffffff", "borderRadius": "rounded-full", "fontFamily": "Playfair Display, serif", "fontWeight": "font-bold", "boxShadow": "shadow-xl"}'),

('style-question', 'Pergunta de Estilo', 'Pergunta formatada para quiz de estilo', 'content', '/components/editor/blocks/TextInlineBlock',
 '{"fontSize": "text-2xl", "fontWeight": "font-bold", "color": "#432818", "textAlign": "text-center", "fontFamily": "Playfair Display, serif", "marginBottom": 24}'),

('style-options-grid', 'Opções de Estilo', 'Grade otimizada para escolhas de estilo', 'interactive', '/components/editor/blocks/OptionsGridBlock',
 '{"columns": 2, "showImages": true, "multipleSelection": true, "maxSelections": 3, "gridGap": 16, "responsiveColumns": true, "autoAdvanceOnComplete": false}')

ON CONFLICT (type_key) DO UPDATE SET
  default_properties = EXCLUDED.default_properties,
  updated_at = NOW();

-- 📊 COMENTÁRIOS PARA DOCUMENTAÇÃO
COMMENT ON TABLE component_types IS 'Tipos/templates de componentes reutilizáveis do sistema';
COMMENT ON TABLE component_instances IS 'Instâncias específicas de componentes em quizzes';
COMMENT ON VIEW step_components IS 'View combinada de instâncias com dados dos tipos';
COMMENT ON TABLE quiz_templates IS 'Templates completos de quizzes com conjuntos de componentes';
