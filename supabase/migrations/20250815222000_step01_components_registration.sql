-- =====================================================================================
-- REGISTRO COMPLETO DOS COMPONENTES DA ETAPA 1 COM PROPRIEDADES ESPECÍFICAS
-- Sistema de IDs semânticos e integração Supabase para coleta de leads
-- =====================================================================================

-- Inserir componentes específicos da Etapa 1 que estão faltando
INSERT INTO component_types (type_key, display_name, description, category, component_path, default_properties, validation_schema, is_system, is_active)
VALUES 
  -- Componentes específicos da Etapa 1
  ('form-input', 'Campo de Input', 'Campo de entrada de dados com validação', 'form', '@/components/editor/blocks/FormInputBlock', '{
    "label": "Campo de Input",
    "placeholder": "Digite aqui...",
    "inputType": "text",
    "required": false,
    "fullWidth": true,
    "name": "input",
    "backgroundColor": "#FFFFFF",
    "borderColor": "#B89B7A",
    "textColor": "#432818",
    "labelColor": "#432818",
    "fontSize": "16",
    "fontFamily": "inherit",
    "fontWeight": "400",
    "borderRadius": "8",
    "marginTop": 8,
    "marginBottom": 8,
    "marginLeft": 0,
    "marginRight": 0
  }', '{"type": "object"}', true, true),
  
  ('decorative-bar', 'Barra Decorativa', 'Barra decorativa com gradiente', 'design', '@/components/editor/blocks/DecorativeBarInlineBlock', '{
    "height": 4,
    "backgroundColor": "#B89B7A",
    "gradientFrom": "#B89B7A",
    "gradientTo": "#D4C2A8",
    "borderRadius": "2",
    "marginTop": 8,
    "marginBottom": 8,
    "width": "100%",
    "opacity": 1
  }', '{"type": "object"}', true, true),
  
  ('legal-notice', 'Aviso Legal', 'Componente para avisos legais e políticas', 'content', '@/components/editor/blocks/LegalNoticeInlineBlock', '{
    "content": "© 2025 - Todos os direitos reservados",
    "fontSize": "text-xs",
    "textAlign": "text-center",
    "color": "#9CA3AF",
    "showPrivacyLink": true,
    "showTermsLink": true,
    "linkColor": "#B89B7A",
    "marginTop": 24,
    "marginBottom": 8
  }', '{"type": "object"}', true, true),
  
  ('accessibility-skip-link', 'Link de Acessibilidade', 'Link para pular conteúdo (acessibilidade)', 'accessibility', '@/components/blocks/inline/AccessibilitySkipLinkBlock', '{
    "target": "#main",
    "text": "Pular para o conteúdo principal",
    "className": "sr-only focus:not-sr-only"
  }', '{"type": "object"}', true, true),
  
  ('image-inline', 'Imagem Inline', 'Componente de imagem inline editável', 'media', '@/components/editor/blocks/ImageInlineBlock', '{
    "src": "",
    "alt": "Imagem",
    "width": "auto",
    "height": "auto",
    "aspectRatio": "auto",
    "className": "mx-auto",
    "priority": false,
    "loading": "lazy",
    "borderRadius": "8",
    "marginTop": 8,
    "marginBottom": 8
  }', '{"type": "object"}', true, true)

ON CONFLICT (type_key) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  component_path = EXCLUDED.component_path,
  default_properties = EXCLUDED.default_properties,
  validation_schema = EXCLUDED.validation_schema,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- =====================================================================================
-- TABELA ESPECÍFICA PARA COLETA DE LEADS DA ETAPA 1
-- =====================================================================================

-- Tabela para usuarios/leads coletados na Etapa 1
CREATE TABLE IF NOT EXISTS quiz_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  name TEXT,
  email TEXT,
  phone TEXT,
  
  -- Dados contextuais
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  
  -- Rastreamento
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_step INTEGER DEFAULT 1,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  conversion_status TEXT DEFAULT 'lead' CHECK (conversion_status IN ('lead', 'qualified', 'customer')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para respostas específicas das etapas
CREATE TABLE IF NOT EXISTS quiz_step_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  step_number INTEGER NOT NULL,
  
  -- Dados da resposta
  response_data JSONB NOT NULL,
  response_time_ms INTEGER,
  
  -- Metadados
  component_id TEXT,
  component_type TEXT,
  
  responded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign key para quiz_users
  FOREIGN KEY (session_id) REFERENCES quiz_users(session_id) ON DELETE CASCADE
);

-- =====================================================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================================================

-- Índices para quiz_users
CREATE INDEX IF NOT EXISTS idx_quiz_users_session_id ON quiz_users(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_users_email ON quiz_users(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_quiz_users_created_at ON quiz_users(created_at);
CREATE INDEX IF NOT EXISTS idx_quiz_users_active ON quiz_users(is_active) WHERE is_active = true;

-- Índices para quiz_step_responses
CREATE INDEX IF NOT EXISTS idx_quiz_step_responses_session_id ON quiz_step_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_step_responses_step ON quiz_step_responses(step_number);
CREATE INDEX IF NOT EXISTS idx_quiz_step_responses_component ON quiz_step_responses(component_type);

-- =====================================================================================
-- POLÍTICAS RLS (Row Level Security)
-- =====================================================================================

-- Habilitar RLS
ALTER TABLE quiz_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_step_responses ENABLE ROW LEVEL SECURITY;

-- Políticas para quiz_users (acesso público para inserção, autenticado para leitura)
DROP POLICY IF EXISTS "Allow public insert quiz_users" ON quiz_users;
CREATE POLICY "Allow public insert quiz_users" ON quiz_users FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read quiz_users" ON quiz_users;
CREATE POLICY "Allow authenticated read quiz_users" ON quiz_users FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated update quiz_users" ON quiz_users;
CREATE POLICY "Allow authenticated update quiz_users" ON quiz_users FOR UPDATE TO authenticated USING (true);

-- Políticas para quiz_step_responses (acesso público para inserção, autenticado para leitura)
DROP POLICY IF EXISTS "Allow public insert quiz_step_responses" ON quiz_step_responses;
CREATE POLICY "Allow public insert quiz_step_responses" ON quiz_step_responses FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read quiz_step_responses" ON quiz_step_responses;
CREATE POLICY "Allow authenticated read quiz_step_responses" ON quiz_step_responses FOR SELECT TO authenticated USING (true);

-- =====================================================================================
-- FUNCTIONS PARA AUTOMAÇÃO
-- =====================================================================================

-- Função para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para quiz_users
DROP TRIGGER IF EXISTS update_quiz_users_updated_at ON quiz_users;
CREATE TRIGGER update_quiz_users_updated_at
    BEFORE UPDATE ON quiz_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================================
-- INSERÇÃO DE INSTÂNCIAS DE COMPONENTES DA ETAPA 1
-- =====================================================================================

-- Função para criar instâncias dos componentes da Etapa 1
CREATE OR REPLACE FUNCTION create_step01_component_instances(p_quiz_id UUID)
RETURNS void AS $$
BEGIN
  -- Inserir instâncias dos componentes da Etapa 1
  INSERT INTO component_instances (instance_key, component_type_key, quiz_id, step_number, order_index, properties)
  VALUES 
    ('step01-skip-link', 'accessibility-skip-link', p_quiz_id, 1, 1, '{
      "target": "#quiz-form",
      "text": "Pular para o formulário",
      "className": "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white text-[#432818] px-4 py-2 rounded-md shadow-md"
    }'),
    
    ('step01-header', 'quiz-intro-header', p_quiz_id, 1, 2, '{
      "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
      "logoAlt": "Logo Gisele Galvão",
      "logoWidth": 120,
      "logoHeight": 50,
      "showProgress": false,
      "showBackButton": false,
      "containerWidth": "full",
      "spacing": "small"
    }'),
    
    ('step01-main-title', 'text-inline', p_quiz_id, 1, 3, '{
      "content": "Chega de um guarda-roupa lotado e da sensação de que nada combina com Você.",
      "fontSize": "text-2xl sm:text-3xl md:text-4xl",
      "fontWeight": "font-bold",
      "textAlign": "text-center",
      "color": "#432818",
      "fontFamily": "Playfair Display, serif",
      "containerWidth": "full",
      "spacing": "small"
    }'),
    
    ('step01-hero-image', 'image-inline', p_quiz_id, 1, 4, '{
      "src": "https://res.cloudinary.com/der8kogzu/image/upload/f_avif,q_85,w_400,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.avif",
      "alt": "Descubra seu estilo predominante e transforme seu guarda-roupa",
      "width": 400,
      "height": 300,
      "aspectRatio": "4/3",
      "className": "mx-auto rounded-lg shadow-sm",
      "containerWidth": "full",
      "spacing": "small",
      "priority": true,
      "loading": "eager"
    }'),
    
    ('step01-description', 'text-inline', p_quiz_id, 1, 5, '{
      "content": "Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.",
      "fontSize": "text-sm sm:text-base",
      "textAlign": "text-center",
      "color": "#6B7280",
      "marginTop": 16,
      "marginBottom": 24,
      "containerWidth": "full",
      "spacing": "small"
    }'),
    
    ('step01-lead-form', 'lead-form', p_quiz_id, 1, 6, '{
      "showNameField": true,
      "showEmailField": false,
      "showPhoneField": false,
      "nameLabel": "NOME",
      "namePlaceholder": "Digite seu nome",
      "submitText": "Quero Descobrir meu Estilo Agora!",
      "loadingText": "Digite seu nome para continuar",
      "successText": "Perfeito! Vamos descobrir seu estilo!",
      "requiredFields": "name",
      "backgroundColor": "#FFFFFF",
      "borderColor": "#B89B7A",
      "textColor": "#432818",
      "primaryColor": "#B89B7A",
      "marginTop": 32,
      "marginBottom": 8,
      "fieldSpacing": 6
    }'),
    
    ('step01-privacy-text', 'text-inline', p_quiz_id, 1, 7, '{
      "content": "Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa política de privacidade",
      "fontSize": "text-xs",
      "textAlign": "text-center",
      "color": "#9CA3AF",
      "marginTop": 8,
      "containerWidth": "full",
      "spacing": "small"
    }'),
    
    ('step01-footer', 'legal-notice', p_quiz_id, 1, 8, '{
      "content": "© 2025 Gisele Galvão - Todos os direitos reservados",
      "fontSize": "text-xs",
      "textAlign": "text-center",
      "color": "#9CA3AF",
      "marginTop": 32,
      "containerWidth": "full",
      "spacing": "small"
    }')
    
  ON CONFLICT (quiz_id, instance_key) DO UPDATE SET
    properties = EXCLUDED.properties,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- =====================================================================================
-- VIEWS PARA FACILITAR CONSULTAS
-- =====================================================================================

-- View para componentes da Etapa 1
CREATE OR REPLACE VIEW step01_components AS
SELECT 
  ci.id,
  ci.instance_key,
  ci.quiz_id,
  ci.step_number,
  ci.order_index,
  ct.type_key as component_type,
  ct.display_name,
  ct.category,
  ci.properties,
  ci.is_active,
  ci.created_at,
  ci.updated_at
FROM component_instances ci
JOIN component_types ct ON ci.component_type_key = ct.type_key
WHERE ci.step_number = 1
ORDER BY ci.order_index;

-- View para leads coletados com suas respostas
CREATE OR REPLACE VIEW quiz_leads_with_responses AS
SELECT 
  qu.id as user_id,
  qu.session_id,
  qu.name,
  qu.email,
  qu.phone,
  qu.started_at,
  qu.completed_at,
  qu.last_step,
  qu.conversion_status,
  COUNT(qsr.id) as total_responses,
  MAX(qsr.responded_at) as last_response_at,
  ARRAY_AGG(DISTINCT qsr.step_number ORDER BY qsr.step_number) as completed_steps
FROM quiz_users qu
LEFT JOIN quiz_step_responses qsr ON qu.session_id = qsr.session_id
GROUP BY qu.id, qu.session_id, qu.name, qu.email, qu.phone, qu.started_at, qu.completed_at, qu.last_step, qu.conversion_status
ORDER BY qu.created_at DESC;